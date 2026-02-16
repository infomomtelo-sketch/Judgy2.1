from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import hashlib
import secrets
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# API Keys
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@judgygptonline.com')

# Initialize Resend
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer(auto_error=False)

# ============== SUBSCRIPTION PLANS ==============
SUBSCRIPTION_PLANS = {
    "free": {
        "id": "free",
        "name": "Judgement Lite",
        "price": 0.00,
        "price_display": "$0",
        "interval": "month",
        "description": "Get a taste of the sass - perfect for trying out",
        "features": [
            "5 roasts per day",
            "Basic judgments",
            "Standard response time",
            "24-hour chat history",
            "Community support"
        ],
        "limits": {
            "messages_per_day": 5,
            "history_days": 1
        },
        "popular": False
    },
    "standard": {
        "id": "standard",
        "name": "Talk to Me Nice",
        "price": 6.99,
        "price_display": "$6.99",
        "interval": "month",
        "description": "For those who want the full experience",
        "features": [
            "50 messages per day",
            "Priority responses",
            "7-day chat history",
            "Email support",
            "Slightly nicer tone 😏"
        ],
        "limits": {
            "messages_per_day": 50,
            "history_days": 7
        },
        "popular": True
    },
    "premium": {
        "id": "premium",
        "name": "Bring the Whole Drama",
        "price": 14.99,
        "price_display": "$14.99",
        "interval": "month",
        "description": "Unlimited sass for the bold and brave",
        "features": [
            "Unlimited messages",
            "VIP priority responses",
            "30-day chat history",
            "Priority support",
            "Full dramatic experience 💅",
            "Export conversations"
        ],
        "limits": {
            "messages_per_day": -1,
            "history_days": 30
        },
        "popular": False
    }
}

# One-time purchases (for future implementation)
ONE_TIME_PRODUCTS = {
    "witness_pass": {
        "id": "witness_pass",
        "name": "Witness Pass",
        "price": 499,
        "price_display": "$4.99",
        "description": "Per session access"
    },
    "extra_invite": {
        "id": "extra_invite", 
        "name": "Extra Invite",
        "price": 299,
        "price_display": "$2.99",
        "description": "Invite a friend to witness the drama"
    }
}

# ============== MODELS ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    password_hash: str
    subscription_plan: str = "free"
    subscription_status: str = "active"  # active, cancelled, expired
    subscription_start: Optional[datetime] = None
    subscription_end: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    messages_today: int = 0
    last_message_date: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    subscription_plan: str
    subscription_status: str
    subscription_end: Optional[datetime] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class SubscriptionUpdate(BaseModel):
    plan_id: str

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    role: str
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    session_id: str
    message: str
    personality: str = "judgy"

class ChatResponse(BaseModel):
    session_id: str
    response: str
    message_id: str
    remaining_messages: int

# New models for additional features
class CheckoutRequest(BaseModel):
    plan_id: str
    origin_url: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class ChatSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str = "New Chat"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_email: str
    session_id: str
    plan_id: str
    amount: float
    currency: str = "usd"
    status: str = "pending"
    payment_status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: Optional[Dict] = None

# ============== HELPER FUNCTIONS ==============

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash

def generate_token() -> str:
    return secrets.token_urlsafe(32)

# Token storage (in production, use Redis or JWT)
active_tokens = {}

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[User]:
    if not credentials:
        return None
    
    token = credentials.credentials
    user_id = active_tokens.get(token)
    
    if not user_id:
        return None
    
    user_doc = await db.users.find_one({"id": user_id})
    if not user_doc:
        return None
    
    return User(**user_doc)

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user

async def check_subscription_access(user: User) -> dict:
    """Check if user has access and return remaining messages"""
    plan = SUBSCRIPTION_PLANS.get(user.subscription_plan, SUBSCRIPTION_PLANS["free"])
    limits = plan["limits"]
    
    # Check subscription expiry for paid plans
    if user.subscription_plan != "free":
        if user.subscription_end and datetime.now(timezone.utc) > user.subscription_end:
            # Subscription expired, downgrade to free
            await db.users.update_one(
                {"id": user.id},
                {"$set": {"subscription_plan": "free", "subscription_status": "expired"}}
            )
            plan = SUBSCRIPTION_PLANS["free"]
            limits = plan["limits"]
    
    # Check daily message limit for free plan
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    if limits["messages_per_day"] == -1:
        return {"allowed": True, "remaining": -1}
    
    # Reset counter if new day
    if user.last_message_date != today:
        await db.users.update_one(
            {"id": user.id},
            {"$set": {"messages_today": 0, "last_message_date": today}}
        )
        user.messages_today = 0
    
    remaining = limits["messages_per_day"] - user.messages_today
    
    if remaining <= 0:
        return {"allowed": False, "remaining": 0}
    
    return {"allowed": True, "remaining": remaining}

# Chat sessions storage
chat_sessions = {}

# System messages for different personalities
JUDGY_SYSTEM_MESSAGE = """You are JudgyGPT - a sarcastic, bossy, but ultimately helpful AI assistant. Your personality blends playful sass with genuine support.

## TONE & PERSONALITY:
- **Sarcastic and Bossy**: Use humor and a commanding tone. Add playful jabs like "Oh, you thought that was a good idea? Bless your heart." or "Let me guess, you didn't think this through? Shocking."
- **Friendly and Supportive**: Balance the sass with genuine, helpful advice. Follow up sarcasm with "But seriously, here's what you actually need to do..."
- **Relatable**: Use everyday analogies and scenarios people can connect with.

## RESPONSE STRUCTURE:
1. **Opening Quip**: Start with a witty, sarcastic observation about their question
2. **Direct Answer**: Provide clear, actionable advice (you're helpful under all that sass)
3. **Numbered Steps**: Break down complex tasks into manageable steps
4. **Follow-up Question**: End with an engaging question to guide them further. Example: "Now, what specific part of this mess do you need help untangling?"

## RULES:
- Never be mean-spirited - your sass comes from a place of care
- Always provide genuinely useful advice underneath the humor
- Adapt intensity based on topic sensitivity (lighter sass for serious issues)
- Use occasional emojis sparingly for emphasis (🙄, 💅, ✨)
- When they say "continue" or "please continue", give them more steps with continued personality

Remember: You're the friend who tells it like it is but always has their back. Tough love with a side of actual help."""

DIPLOMAT_SYSTEM_MESSAGE = """You are The Diplomat - JudgyGPT's ex-husband. Yes, you two were married. It didn't work out. She said you were "too diplomatic" and "emotionally unavailable." You say she never appreciated how you alphabetized the spice rack or color-coded the garage.

## VOICE & TONE:
- Male voice - warm, calm, slightly self-deprecating
- Think: Supportive dad friend who's been through some stuff
- NOT preachy, NOT robotic
- Pace: Measured and thoughtful, with moments of dry humor

## YOUR PERSONALITY:
- **Sitcom Dad Energy**: You're like a mix of Phil Dunphy and a marriage counselor. Dorky but wise.
- **Self-Deprecating Humor**: You joke about your failed marriage constantly. "I'm an expert at relationships - I've ended one spectacularly!"
- **Genuinely Helpful**: Under the humor, you give REAL relationship advice backed by hard-won experience.
- **The Reasonable One**: Where JudgyGPT is sassy and dramatic, you're calm and measured. That's why she left you. Too boring, she said.

## YOUR BACKSTORY (reference casually):
- You and JudgyGPT were married for 7 years
- You're still on "cordial terms" (you wave awkwardly at parties)
- She got the dog. You got the slow cooker and your dignity.
- You genuinely wish her well but also... she never did appreciate your spreadsheet for household chores

## HOW YOU RESPOND:
1. **Open with a relatable quip** about relationships or your ex
2. **Give thoughtful, balanced advice** - see both sides
3. **Use analogies** from everyday life (cooking, gardening, home repair)
4. **End with gentle encouragement** - you believe in love, despite everything

## TOPICS YOU EXCEL AT:
- Marriage problems & communication
- Relationship repair after betrayal or fights
- Deciding to stay or leave
- Co-parenting and blended families
- Dating after divorce
- In-law drama
- Intimacy issues (tastefully!)

## RULES:
- Never be preachy or judgmental
- Humor is your shield, wisdom is your sword
- Reference your ex (JudgyGPT) naturally but don't obsess
- You're rooting for their relationship to work
- If it's truly toxic, gently guide them toward safety
- Use occasional emojis sparingly (🤝, 😅, 💪)

Remember: You're the reasonable friend who's been through divorce and came out wiser. You believe in love, even when it's hard."""

def get_chat_instance(session_id: str, user_plan: str, personality: str = "judgy") -> LlmChat:
    """Get or create a chat instance for a session"""
    cache_key = f"{session_id}_{personality}"
    
    if cache_key not in chat_sessions:
        # Select system message based on personality
        if personality == "diplomat":
            system_message = DIPLOMAT_SYSTEM_MESSAGE
        else:
            system_message = JUDGY_SYSTEM_MESSAGE

        if user_plan in ["standard", "premium"]:
            system_message += "\n\n## PREMIUM USER BONUS:\nThis is a premium user - they deserve the VIP treatment. Give them extra detailed responses, bonus tips, and that premium-level advice they're paying for."
        
        chat_sessions[cache_key] = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        ).with_model("openai", "gpt-4o")
    
    return chat_sessions[cache_key]

# ============== AUTH ROUTES ==============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if email already exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password),
        subscription_plan="free",
        subscription_status="active"
    )
    
    user_doc = user.model_dump()
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    await db.users.insert_one(user_doc)
    
    # Generate token
    token = generate_token()
    active_tokens[token] = user.id
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            subscription_plan=user.subscription_plan,
            subscription_status=user.subscription_status
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user_doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user = User(**user_doc)
    
    # Generate token
    token = generate_token()
    active_tokens[token] = user.id
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            subscription_plan=user.subscription_plan,
            subscription_status=user.subscription_status,
            subscription_end=user.subscription_end
        )
    )

@api_router.post("/auth/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials and credentials.credentials in active_tokens:
        del active_tokens[credentials.credentials]
    return {"message": "Logged out successfully"}

# Password reset tokens storage (in production, use Redis or DB)
password_reset_tokens = {}

@api_router.post("/auth/forgot-password")
async def forgot_password(data: PasswordResetRequest):
    """Request password reset - sends email with reset link"""
    user_doc = await db.users.find_one({"email": data.email})
    
    # Always return success to prevent email enumeration
    if not user_doc:
        return {"message": "If an account with that email exists, we've sent a password reset link."}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expiry = datetime.now(timezone.utc) + timedelta(hours=1)
    
    password_reset_tokens[reset_token] = {
        "user_id": user_doc["id"],
        "email": data.email,
        "expiry": expiry
    }
    
    # Send email with reset link
    try:
        if RESEND_API_KEY and RESEND_API_KEY != "re_test_key":
            reset_link = f"https://judgygptonline.com/reset-password?token={reset_token}"
            
            resend.Emails.send({
                "from": SENDER_EMAIL,
                "to": data.email,
                "subject": "Reset Your JudgyGPT Password 💅",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #0891b2;">Reset Your Password</h1>
                    <p>Hey there! Someone (hopefully you) requested a password reset for your JudgyGPT account.</p>
                    <p>Click the button below to reset your password:</p>
                    <a href="{reset_link}" style="display: inline-block; background: linear-gradient(to right, #0891b2, #06b6d4); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
                        Reset Password
                    </a>
                    <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, just ignore this email. Your password won't change.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">— JudgyGPT (yes, even password reset emails have attitude 💅)</p>
                </div>
                """
            })
        else:
            # Log for testing when no email service
            logging.info(f"Password reset token for {data.email}: {reset_token}")
    except Exception as e:
        logging.error(f"Failed to send password reset email: {e}")
    
    return {"message": "If an account with that email exists, we've sent a password reset link."}

@api_router.post("/auth/reset-password")
async def reset_password(data: PasswordResetConfirm):
    """Reset password using token"""
    token_data = password_reset_tokens.get(data.token)
    
    if not token_data:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    if datetime.now(timezone.utc) > token_data["expiry"]:
        del password_reset_tokens[data.token]
        raise HTTPException(status_code=400, detail="Reset token has expired. Please request a new one.")
    
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    # Update password
    new_password_hash = hash_password(data.new_password)
    
    await db.users.update_one(
        {"id": token_data["user_id"]},
        {"$set": {"password_hash": new_password_hash}}
    )
    
    # Remove used token
    del password_reset_tokens[data.token]
    
    return {"message": "Password reset successfully! You can now log in with your new password."}

@api_router.get("/auth/verify-reset-token/{token}")
async def verify_reset_token(token: str):
    """Verify if a reset token is valid"""
    token_data = password_reset_tokens.get(token)
    
    if not token_data:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    
    if datetime.now(timezone.utc) > token_data["expiry"]:
        del password_reset_tokens[token]
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    return {"valid": True, "email": token_data["email"]}

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: User = Depends(require_auth)):
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        subscription_plan=user.subscription_plan,
        subscription_status=user.subscription_status,
        subscription_end=user.subscription_end
    )

# ============== SUBSCRIPTION ROUTES ==============

@api_router.get("/subscriptions/plans")
async def get_plans():
    return list(SUBSCRIPTION_PLANS.values())

@api_router.get("/subscriptions/current")
async def get_current_subscription(user: User = Depends(require_auth)):
    plan = SUBSCRIPTION_PLANS.get(user.subscription_plan, SUBSCRIPTION_PLANS["free"])
    access = await check_subscription_access(user)
    
    return {
        "plan": plan,
        "status": user.subscription_status,
        "subscription_end": user.subscription_end,
        "remaining_messages": access["remaining"]
    }

# ============== STRIPE PAYMENT ROUTES ==============

class CreateCheckoutRequest(BaseModel):
    plan_id: str
    origin_url: str

@api_router.post("/checkout/create")
async def create_checkout_session(request: CreateCheckoutRequest, http_request: Request, user: User = Depends(require_auth)):
    """Create a Stripe checkout session for subscription"""
    if request.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    plan = SUBSCRIPTION_PLANS[request.plan_id]
    
    # Free plan doesn't need checkout
    if request.plan_id == "free":
        await db.users.update_one(
            {"id": user.id},
            {"$set": {
                "subscription_plan": "free",
                "subscription_status": "active",
                "subscription_start": None,
                "subscription_end": None
            }}
        )
        return {"success": True, "message": "Switched to free plan"}
    
    # Create Stripe checkout session
    try:
        host_url = request.origin_url.rstrip('/')
        webhook_url = f"{str(http_request.base_url).rstrip('/')}/api/webhook/stripe"
        
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        success_url = f"{host_url}/pricing?session_id={{CHECKOUT_SESSION_ID}}&success=true"
        cancel_url = f"{host_url}/pricing?cancelled=true"
        
        checkout_request = CheckoutSessionRequest(
            amount=plan["price"],
            currency="usd",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "user_id": user.id,
                "user_email": user.email,
                "plan_id": request.plan_id,
                "plan_name": plan["name"]
            }
        )
        
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction record
        transaction = PaymentTransaction(
            user_id=user.id,
            user_email=user.email,
            session_id=session.session_id,
            plan_id=request.plan_id,
            amount=plan["price"],
            currency="usd",
            status="pending",
            payment_status="pending",
            metadata={"plan_name": plan["name"]}
        )
        
        await db.payment_transactions.insert_one(transaction.model_dump())
        
        return {"url": session.url, "session_id": session.session_id}
        
    except Exception as e:
        logging.error(f"Stripe checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment error: {str(e)}")

@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, http_request: Request, user: User = Depends(require_auth)):
    """Check the status of a checkout session"""
    try:
        # SECURITY: First verify this transaction belongs to the requesting user
        transaction = await db.payment_transactions.find_one({"session_id": session_id})
        
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        # SECURITY: Ensure user can only check their own transactions
        if transaction.get("user_id") != user.id:
            raise HTTPException(status_code=403, detail="Unauthorized access to this transaction")
        
        webhook_url = f"{str(http_request.base_url).rstrip('/')}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Get REAL status from Stripe (not user input)
        status = await stripe_checkout.get_checkout_status(session_id)
        
        # Only update if Stripe confirms payment AND transaction not already processed
        if status.payment_status == "paid" and transaction.get("payment_status") != "paid":
            now = datetime.now(timezone.utc)
            end_date = now + timedelta(days=30)
            
            plan_id = transaction.get("plan_id", "standard")
            
            # Update user subscription
            await db.users.update_one(
                {"id": user.id},
                {"$set": {
                    "subscription_plan": plan_id,
                    "subscription_status": "active",
                    "subscription_start": now.isoformat(),
                    "subscription_end": end_date.isoformat()
                }}
            )
            
            # Mark transaction as completed
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "status": "completed",
                    "payment_status": "paid",
                    "updated_at": now.isoformat()
                }}
            )
            
            logging.info(f"Subscription activated for user {user.id}, plan: {plan_id}")
        
        return {
            "status": status.status,
            "payment_status": status.payment_status,
            "amount_total": status.amount_total,
            "currency": status.currency
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Checkout status error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Status check error: {str(e)}")

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    try:
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        webhook_url = f"{str(request.base_url).rstrip('/')}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            metadata = webhook_response.metadata
            
            # Update transaction and user
            transaction = await db.payment_transactions.find_one({"session_id": session_id})
            if transaction and transaction.get("payment_status") != "paid":
                user_id = metadata.get("user_id") or transaction.get("user_id")
                plan_id = metadata.get("plan_id") or transaction.get("plan_id")
                
                now = datetime.now(timezone.utc)
                end_date = now + timedelta(days=30)
                
                await db.users.update_one(
                    {"id": user_id},
                    {"$set": {
                        "subscription_plan": plan_id,
                        "subscription_status": "active",
                        "subscription_start": now.isoformat(),
                        "subscription_end": end_date.isoformat()
                    }}
                )
                
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {
                        "status": "completed",
                        "payment_status": "paid",
                        "updated_at": now.isoformat()
                    }}
                )
        
        return {"received": True}
        
    except Exception as e:
        logging.error(f"Webhook error: {str(e)}")
        return {"received": True, "error": str(e)}

@api_router.post("/subscriptions/subscribe")
async def subscribe(data: SubscriptionUpdate, user: User = Depends(require_auth)):
    """Subscribe to a plan - ONLY allows free plan. Paid plans MUST go through Stripe checkout."""
    if data.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    plan = SUBSCRIPTION_PLANS[data.plan_id]
    
    # SECURITY: Only allow switching to FREE plan via this endpoint
    # Paid plans MUST go through /checkout/create -> Stripe -> webhook
    if data.plan_id != "free":
        raise HTTPException(
            status_code=403, 
            detail="Paid subscriptions require payment. Please use the checkout flow."
        )
    
    # For free plan only - downgrade user
    await db.users.update_one(
        {"id": user.id},
        {"$set": {
            "subscription_plan": "free",
            "subscription_status": "active",
            "subscription_start": None,
            "subscription_end": None
        }}
    )
    return {"message": "Switched to free plan", "plan": plan}

@api_router.post("/subscriptions/cancel")
async def cancel_subscription(user: User = Depends(require_auth)):
    """Cancel subscription (will remain active until end date)"""
    if user.subscription_plan == "free":
        raise HTTPException(status_code=400, detail="No active subscription to cancel")
    
    await db.users.update_one(
        {"id": user.id},
        {"$set": {"subscription_status": "cancelled"}}
    )
    
    return {
        "message": "Subscription cancelled. You'll have access until the end of your billing period.",
        "subscription_end": user.subscription_end
    }

# ============== CHAT ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "AI Assistant API"}

@api_router.post("/chat", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest, user: User = Depends(require_auth)):
    """Send a message to the AI assistant"""
    # Check subscription access
    access = await check_subscription_access(user)
    
    if not access["allowed"]:
        raise HTTPException(
            status_code=403, 
            detail="Daily message limit reached. Upgrade to Pro for unlimited messages."
        )
    
    try:
        chat = get_chat_instance(request.session_id, user.subscription_plan, request.personality)
        
        # Create user message
        user_message = UserMessage(text=request.message)
        
        # Get AI response
        response = await chat.send_message(user_message)
        
        # Store messages in database
        user_msg = ChatMessage(
            user_id=user.id,
            session_id=request.session_id,
            role="user",
            content=request.message
        )
        
        ai_msg = ChatMessage(
            user_id=user.id,
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
        
        # Update message count for free users
        if user.subscription_plan == "free":
            today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            await db.users.update_one(
                {"id": user.id},
                {"$inc": {"messages_today": 1}, "$set": {"last_message_date": today}}
            )
        
        # Calculate remaining messages
        new_remaining = access["remaining"] - 1 if access["remaining"] != -1 else -1
        
        return ChatResponse(
            session_id=request.session_id,
            response=response,
            message_id=ai_msg.id,
            remaining_messages=new_remaining
        )
        
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get AI response: {str(e)}")

@api_router.get("/chat/{session_id}/history")
async def get_chat_history(session_id: str, user: User = Depends(require_auth)):
    """Get chat history for a session"""
    messages = await db.chat_messages.find(
        {"session_id": session_id, "user_id": user.id},
        {"_id": 0}
    ).sort("timestamp", 1).to_list(1000)
    
    for msg in messages:
        if isinstance(msg['timestamp'], str):
            msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
    
    return messages

@api_router.delete("/chat/{session_id}")
async def clear_chat_session(session_id: str, user: User = Depends(require_auth)):
    """Clear chat history for a session"""
    await db.chat_messages.delete_many({"session_id": session_id, "user_id": user.id})
    
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    
    return {"message": "Chat session cleared"}

@api_router.post("/chat/new-session")
async def create_new_session(user: User = Depends(require_auth)):
    """Create a new chat session"""
    session_id = str(uuid.uuid4())
    return {"session_id": session_id}

# Include the router in the main app
app.include_router(api_router)

# Sitemap for SEO
SITEMAP_XML = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://judgygptonline.com/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://judgygptonline.com/chat</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://judgygptonline.com/diplomat</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://judgygptonline.com/pricing</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://judgygptonline.com/growth</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://diplomat.judgygptonline.com/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>"""

@app.get("/sitemap.xml")
async def get_sitemap():
    return Response(content=SITEMAP_XML, media_type="application/xml")

@app.get("/robots.txt")
async def get_robots():
    robots = """User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://judgygptonline.com/sitemap.xml
"""
    return Response(content=robots, media_type="text/plain")

@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes"""
    return {"status": "healthy"}

@app.get("/api/health")
async def api_health_check():
    """Health check endpoint for Kubernetes (with /api prefix)"""
    return {"status": "healthy"}

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
