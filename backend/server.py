from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# LLM API Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    response: str
    message_id: str


# Chat history storage
chat_sessions = {}


def get_chat_instance(session_id: str) -> LlmChat:
    """Get or create a chat instance for a session"""
    if session_id not in chat_sessions:
        chat_sessions[session_id] = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message="""You are a helpful AI assistant that provides step-by-step guidance. 
            
When helping users, break down complex tasks into clear, manageable steps.
Be concise but thorough.
Use numbered lists when providing multi-step instructions.
Be friendly and encouraging.
If a task requires multiple steps, provide the first few steps and mention that there are more steps to follow.
When the user says "continue" or "please continue", provide the next set of steps.

Always maintain context from previous messages in the conversation."""
        ).with_model("openai", "gpt-4o")
    return chat_sessions[session_id]


# API Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.post("/chat", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """Send a message to the AI assistant and get a response"""
    try:
        chat = get_chat_instance(request.session_id)
        
        # Create user message
        user_message = UserMessage(text=request.message)
        
        # Get AI response
        response = await chat.send_message(user_message)
        
        # Store messages in database
        user_msg = ChatMessage(
            session_id=request.session_id,
            role="user",
            content=request.message
        )
        
        ai_msg = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=response
        )
        
        # Save to MongoDB
        user_doc = user_msg.model_dump()
        user_doc['timestamp'] = user_doc['timestamp'].isoformat()
        await db.chat_messages.insert_one(user_doc)
        
        ai_doc = ai_msg.model_dump()
        ai_doc['timestamp'] = ai_doc['timestamp'].isoformat()
        await db.chat_messages.insert_one(ai_doc)
        
        return ChatResponse(
            session_id=request.session_id,
            response=response,
            message_id=ai_msg.id
        )
        
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get AI response: {str(e)}")


@api_router.get("/chat/{session_id}/history", response_model=List[ChatMessage])
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    messages = await db.chat_messages.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("timestamp", 1).to_list(1000)
    
    for msg in messages:
        if isinstance(msg['timestamp'], str):
            msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
    
    return messages


@api_router.delete("/chat/{session_id}")
async def clear_chat_session(session_id: str):
    """Clear chat history for a session"""
    await db.chat_messages.delete_many({"session_id": session_id})
    
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    
    return {"message": "Chat session cleared"}


@api_router.post("/chat/new-session")
async def create_new_session():
    """Create a new chat session"""
    session_id = str(uuid.uuid4())
    return {"session_id": session_id}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
