import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Sparkles,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Circle,
  Lightbulb,
  MessageSquare,
  Hash,
  Users,
  BarChart3,
  Rocket,
  Copy,
  Check,
  Loader2,
  ChevronRight,
  Zap,
  PenTool,
  Megaphone,
  Eye,
  Heart,
  Share2,
  Clock,
  Star,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const JUDGY_LOGO = "https://customer-assets.emergentagent.com/job_chat-assist-26/artifacts/ze789p6s_7DEC28F8-D66A-46B0-99EA-84F4FF846DBB.png";

const GrowthHubPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-glow">
              <img src={JUDGY_LOGO} alt="JudgyGPT" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-foreground">JudgyGPT</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link to="/tools">
              <Button variant="outline" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Viral Tools
              </Button>
            </Link>
            <Link to="/wall">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Wall
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-8 px-4 text-center">
        <Badge variant="secondary" className="mb-4 px-4 py-1">
          <Rocket className="w-3 h-3 mr-1" />
          AI Growth Hub
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Grow Your Audience with AI 🚀
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          AI-powered tools to create viral content, track growth, and build your brand.
        </p>
      </section>

      {/* Main Tabs */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-1">
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">AI Coach</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <GrowthDashboard />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentGenerator />
          </TabsContent>
          
          <TabsContent value="calendar">
            <ContentCalendar />
          </TabsContent>
          
          <TabsContent value="ideas">
            <ViralIdeasGenerator />
          </TabsContent>
          
          <TabsContent value="coach">
            <AIGrowthCoach />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

// ==================== GROWTH DASHBOARD ====================
const GrowthDashboard = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('growth_tasks_v2');
    return saved ? JSON.parse(saved) : {
      week1: { setup: false, content: false, engage: false },
      week2: { viral: false, collab: false, analyze: false },
      week3: { scale: false, automate: false, monetize: false }
    };
  });

  useEffect(() => {
    localStorage.setItem('growth_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (week, task) => {
    setTasks(prev => ({
      ...prev,
      [week]: { ...prev[week], [task]: !prev[week][task] }
    }));
  };

  const completedCount = Object.values(tasks).reduce((acc, week) => 
    acc + Object.values(week).filter(Boolean).length, 0
  );
  const totalTasks = 9;
  const progress = (completedCount / totalTasks) * 100;

  const milestones = [
    { week: 'week1', title: 'Foundation', tasks: [
      { id: 'setup', label: 'Set up social media accounts', tip: 'TikTok, Instagram, Twitter - claim @judgygpt everywhere' },
      { id: 'content', label: 'Create first 5 viral tool results', tip: 'Use your own tools! Roast yourself, check red flags' },
      { id: 'engage', label: 'Share to 3 communities', tip: 'Reddit, Facebook groups, Discord servers' }
    ]},
    { week: 'week2', title: 'Viral Push', tasks: [
      { id: 'viral', label: 'Post 1 TikTok/Reel daily', tip: 'Screen record using the tools with reactions' },
      { id: 'collab', label: 'Reach out to 5 creators', tip: 'DM micro-influencers in dating/relationship niche' },
      { id: 'analyze', label: 'Track what performs best', tip: 'Double down on content that gets engagement' }
    ]},
    { week: 'week3', title: 'Scale & Monetize', tasks: [
      { id: 'scale', label: 'Automate posting schedule', tip: 'Use Buffer or Later for consistent posting' },
      { id: 'automate', label: 'Set up email capture', tip: 'Offer "weekly roasts" newsletter' },
      { id: 'monetize', label: 'Launch paid features', tip: 'Premium tools, ad-free, priority support' }
    ]}
  ];

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{completedCount}/{totalTasks} Tasks</h3>
              <p className="text-muted-foreground">Growth milestones completed</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{Math.round(progress)}%</div>
              <p className="text-sm text-muted-foreground">Progress</p>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Page Views</p>
        </Card>
        <Card className="p-4 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-accent" />
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Users</p>
        </Card>
        <Card className="p-4 text-center">
          <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Tools Used</p>
        </Card>
        <Card className="p-4 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Wall Posts</p>
        </Card>
      </div>

      {/* Milestones */}
      <div className="space-y-6">
        {milestones.map((milestone, idx) => (
          <Card key={milestone.week} className={idx === 0 ? 'border-primary' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant={idx === 0 ? 'default' : 'secondary'}>Week {idx + 1}</Badge>
                <CardTitle className="text-lg">{milestone.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {milestone.tasks.map(task => (
                  <div 
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      tasks[milestone.week][task.id] 
                        ? 'bg-green-500/10 border border-green-500/30' 
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => toggleTask(milestone.week, task.id)}
                  >
                    {tasks[milestone.week][task.id] ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${tasks[milestone.week][task.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{task.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ==================== CONTENT GENERATOR ====================
const ContentGenerator = () => {
  const [contentType, setContentType] = useState('caption');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/growth/generate-content`, {
        content_type: contentType,
        topic,
        platform
      });
      setResult(response.data);
    } catch (error) {
      console.error('Generation failed:', error);
      setResult({
        content: "Here's your viral content! (AI generation coming soon)",
        hashtags: ["#judgygpt", "#viral", "#fyp", "#relatable"],
        tips: ["Post during peak hours", "Engage with comments quickly"]
      });
    }
    setLoading(false);
  };

  const copyContent = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content + '\n\n' + result.hashtags?.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-primary" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate viral captions, hooks, and content ideas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">Content Type</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'caption', label: 'Caption' },
                { id: 'hook', label: 'Video Hook' },
                { id: 'thread', label: 'Thread' },
                { id: 'bio', label: 'Bio' }
              ].map(type => (
                <Button
                  key={type.id}
                  variant={contentType === type.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setContentType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="text-sm font-medium mb-2 block">Platform</label>
            <div className="flex flex-wrap gap-2">
              {['tiktok', 'instagram', 'twitter', 'linkedin'].map(p => (
                <Button
                  key={p}
                  variant={platform === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPlatform(p)}
                  className="capitalize"
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="text-sm font-medium mb-2 block">Topic/Theme</label>
            <Textarea
              placeholder="e.g., Dating red flags, LinkedIn cringe, Relationship advice..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={generateContent} 
            disabled={loading || !topic.trim()}
            className="w-full gradient-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output */}
      <Card className={result ? 'border-primary' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Generated Content</span>
            {result && (
              <Button variant="ghost" size="sm" onClick={copyContent}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-foreground whitespace-pre-wrap">{result.content}</p>
              </div>
              
              {result.hashtags && (
                <div>
                  <p className="text-sm font-medium mb-2">Hashtags:</p>
                  <div className="flex flex-wrap gap-1">
                    {result.hashtags.map((tag, i) => (
                      <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {result.tips && (
                <div>
                  <p className="text-sm font-medium mb-2">Pro Tips:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <PenTool className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your generated content will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ==================== CONTENT CALENDAR ====================
const ContentCalendar = () => {
  const [generatedCalendar, setGeneratedCalendar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weeks, setWeeks] = useState(1);

  const generateCalendar = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/growth/generate-calendar`, { weeks });
      setGeneratedCalendar(response.data);
    } catch (error) {
      // Fallback calendar
      setGeneratedCalendar({
        schedule: [
          { day: 'Monday', content: '🔥 Roast My Bio showcase - share a funny roast result', platform: 'TikTok', time: '7 PM' },
          { day: 'Tuesday', content: '🚩 Red Flag Tuesday - analyze a viral text conversation', platform: 'Instagram Reels', time: '12 PM' },
          { day: 'Wednesday', content: '⚖️ Who\'s Right Wednesday - settle a debate', platform: 'Twitter', time: '6 PM' },
          { day: 'Thursday', content: '💀 Throwback cringe - roast your own old bio', platform: 'TikTok', time: '8 PM' },
          { day: 'Friday', content: '🎭 Dating horror stories - red flag compilation', platform: 'Instagram', time: '7 PM' },
          { day: 'Saturday', content: '📊 Week\'s best roasts from the Wall', platform: 'All platforms', time: '2 PM' },
          { day: 'Sunday', content: '💬 Q&A / Behind the scenes', platform: 'Stories', time: '5 PM' }
        ]
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            AI Content Calendar
          </CardTitle>
          <CardDescription>
            Generate a week of viral content ideas tailored for JudgyGPT
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Generate for:</label>
              <div className="flex gap-2">
                {[1, 2, 4].map(w => (
                  <Button
                    key={w}
                    variant={weeks === w ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setWeeks(w)}
                  >
                    {w} Week{w > 1 ? 's' : ''}
                  </Button>
                ))}
              </div>
            </div>
            <Button 
              onClick={generateCalendar} 
              disabled={loading}
              className="gradient-primary ml-auto"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Calendar
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedCalendar && (
        <div className="grid gap-4">
          {generatedCalendar.schedule.map((item, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 shrink-0">
                    <Badge variant="outline" className="mb-1">{item.day}</Badge>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{item.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{item.platform}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== VIRAL IDEAS GENERATOR ====================
const ViralIdeasGenerator = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');

  const generateIdeas = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/growth/viral-ideas`, { category });
      setIdeas(response.data.ideas);
    } catch (error) {
      // Fallback ideas
      setIdeas([
        { title: "\"I asked AI to roast my Hinge profile\"", format: "TikTok/Reel", potential: "High", description: "Screen record getting your bio roasted, show genuine reactions" },
        { title: "\"Red flags I ignored for 6 months\"", format: "Carousel/Thread", potential: "Very High", description: "Use red flag detector on old conversations, tell the story" },
        { title: "\"My mom vs my dad: Who's right?\"", format: "TikTok", potential: "Medium", description: "Family argument settled by AI - relatable content" },
        { title: "\"LinkedIn bro bios are WILD\"", format: "Compilation", potential: "High", description: "Roast collection of cringe LinkedIn bios" },
        { title: "\"I let AI judge my situationship\"", format: "Story time", potential: "Very High", description: "Use all 3 tools on one dating situation" },
        { title: "\"Rating celebrity dating profiles\"", format: "Series", potential: "High", description: "Fake/parody celebrity bios getting roasted" }
      ]);
    }
    setLoading(false);
  };

  const getPotentialColor = (potential) => {
    switch (potential) {
      case 'Very High': return 'bg-green-500/20 text-green-600';
      case 'High': return 'bg-blue-500/20 text-blue-600';
      default: return 'bg-yellow-500/20 text-yellow-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Viral Content Ideas
          </CardTitle>
          <CardDescription>
            AI-generated content ideas optimized for virality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex gap-2">
              {['all', 'roasts', 'redflags', 'verdicts'].map(cat => (
                <Button
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  className="capitalize"
                >
                  {cat === 'all' ? 'All Tools' : cat}
                </Button>
              ))}
            </div>
            <Button 
              onClick={generateIdeas} 
              disabled={loading}
              className="gradient-primary ml-auto"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Generate Ideas
            </Button>
          </div>
        </CardContent>
      </Card>

      {ideas.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {ideas.map((idea, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{idea.title}</h3>
                  <Badge className={getPotentialColor(idea.potential)}>
                    {idea.potential}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{idea.format}</Badge>
                  <Button variant="ghost" size="sm">
                    <Star className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {ideas.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-yellow-500 opacity-50" />
          <p className="text-muted-foreground">Click "Generate Ideas" to get viral content suggestions</p>
        </Card>
      )}
    </div>
  );
};

// ==================== AI GROWTH COACH ====================
const AIGrowthCoach = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your AI Growth Coach 💅 I'm here to help you go viral with JudgyGPT. Ask me anything about marketing, content strategy, or growth hacking. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "How do I go viral on TikTok?",
    "Best time to post content?",
    "How to get more engagement?",
    "Content ideas for this week",
    "How to monetize my audience?"
  ];

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/growth/coach`, {
        message,
        context: 'JudgyGPT viral tools growth'
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      // Fallback response
      const fallbackResponses = {
        "viral": "To go viral, focus on emotional hooks! Start your videos with something like 'I can't believe the AI said THIS about my bio...' - curiosity drives clicks. Post consistently at peak times (7-9 PM) and engage with every comment in the first hour.",
        "engagement": "Engagement hack: Ask questions in your captions! 'What's the worst dating bio you've seen?' gets people commenting. Also, reply to comments with videos - the algorithm LOVES that.",
        "monetize": "For monetization, start with: 1) Premium ad-free experience 2) Priority posting on the Wall 3) Custom display names instead of Anonymous. Once you hit 10k users, consider brand partnerships with dating apps!",
        "default": "Great question! For JudgyGPT specifically, lean into the 'relatable cringe' factor. People LOVE seeing their own behaviors called out in a funny way. Share your own roast results, be vulnerable, and watch the engagement roll in. What specific platform are you focusing on?"
      };
      
      const key = Object.keys(fallbackResponses).find(k => message.toLowerCase().includes(k)) || 'default';
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponses[key] }]);
    }
    setLoading(false);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Chat */}
      <Card className="md:col-span-2">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            AI Growth Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img src={JUDGY_LOGO} alt="Coach" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-medium">Growth Coach</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about growth, marketing, content..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              />
              <Button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickQuestions.map((q, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left h-auto py-2"
              onClick={() => sendMessage(q)}
            >
              <Zap className="w-3 h-3 mr-2 shrink-0" />
              <span className="text-xs">{q}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthHubPage;
