import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  CheckCircle2,
  Circle,
  Calendar,
  Target,
  TrendingUp,
  Rocket,
  Clock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Users,
  Share2,
  BarChart3,
  Megaphone,
  Video,
  MessageSquare,
  Mail,
  Globe,
  Instagram,
  Youtube
} from 'lucide-react';

// TikTok icon component
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const GrowthPlanPage = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('growth_tasks');
    return saved ? JSON.parse(saved) : {};
  });
  const [expandedWeeks, setExpandedWeeks] = useState({ week1: true });

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('growth_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (taskId) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const toggleWeek = (week) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  const getCompletedCount = (taskIds) => {
    return taskIds.filter(id => tasks[id]).length;
  };

  const TaskItem = ({ id, children, link, icon: Icon }) => (
    <div 
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
        tasks[id] ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-100 hover:border-primary/30'
      }`}
      onClick={() => toggleTask(id)}
    >
      <div className="mt-0.5">
        {tasks[id] ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
          <span className={`text-sm ${tasks[id] ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
            {children}
          </span>
        </div>
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            Open <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );

  const WeekSection = ({ week, title, icon: Icon, color, children, taskIds }) => {
    const completed = getCompletedCount(taskIds);
    const total = taskIds.length;
    const progress = (completed / total) * 100;

    return (
      <div className="mb-6">
        <button
          onClick={() => toggleWeek(week)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 transition-all mb-3"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{completed}/{total} tasks completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${color} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {expandedWeeks[week] ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {expandedWeeks[week] && (
          <div className="space-y-2 pl-2">
            {children}
          </div>
        )}
      </div>
    );
  };

  const totalTasks = 30;
  const completedTasks = Object.values(tasks).filter(Boolean).length;
  const overallProgress = (completedTasks / totalTasks) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-bold text-lg text-foreground">Growth Plan</h1>
              <p className="text-xs text-muted-foreground">Your roadmap to success</p>
            </div>
          </div>
          <Badge className="gradient-primary text-white">
            {completedTasks}/{totalTasks} Done
          </Badge>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Your Progress</h2>
              <p className="text-muted-foreground text-sm">Keep going, you're doing great! 🚀</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{Math.round(overallProgress)}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </Card>

        {/* Daily Checklist */}
        <Card className="p-6 mb-8 border-2 border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Daily Checklist</h2>
            <Badge variant="secondary">Do Every Day</Badge>
          </div>
          <div className="grid gap-2">
            <TaskItem id="daily_1" icon={MessageSquare}>Reply to 5 comments on social media</TaskItem>
            <TaskItem id="daily_2" icon={Users}>Engage with 3 similar creators</TaskItem>
            <TaskItem id="daily_3" icon={Video}>Create 1 piece of content (TikTok/Reel)</TaskItem>
            <TaskItem id="daily_4" icon={Calendar}>Schedule posts for next day</TaskItem>
            <TaskItem id="daily_5" icon={BarChart3}>Check analytics & trending sounds</TaskItem>
          </div>
        </Card>

        {/* Week 1 */}
        <WeekSection 
          week="week1" 
          title="Week 1: Foundation" 
          icon={Rocket}
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
          taskIds={['w1_1', 'w1_2', 'w1_3', 'w1_4', 'w1_5', 'w1_6', 'w1_7', 'w1_8']}
        >
          <TaskItem id="w1_1" icon={Globe}>Deploy app & configure Cloudflare DNS</TaskItem>
          <TaskItem id="w1_2" icon={Globe} link="https://search.google.com/search-console">Set up Google Search Console</TaskItem>
          <TaskItem id="w1_3" icon={Globe}>Submit sitemap to Google</TaskItem>
          <TaskItem id="w1_4" icon={TikTokIcon} link="https://tiktok.com">Create TikTok account @judgygpt</TaskItem>
          <TaskItem id="w1_5" icon={Instagram} link="https://instagram.com">Create Instagram @judgygptonline</TaskItem>
          <TaskItem id="w1_6" icon={MessageSquare} link="https://twitter.com">Create Twitter/X @judgygpt</TaskItem>
          <TaskItem id="w1_7" icon={Youtube} link="https://youtube.com">Create YouTube channel</TaskItem>
          <TaskItem id="w1_8" icon={Video}>Post first TikTok video</TaskItem>
        </WeekSection>

        {/* Week 2 */}
        <WeekSection 
          week="week2" 
          title="Week 2: Content Launch" 
          icon={Video}
          color="bg-gradient-to-r from-pink-500 to-rose-500"
          taskIds={['w2_1', 'w2_2', 'w2_3', 'w2_4', 'w2_5', 'w2_6', 'w2_7']}
        >
          <TaskItem id="w2_1" icon={Video}>Post "JudgyGPT roasts my life choices"</TaskItem>
          <TaskItem id="w2_2" icon={Video}>Post "Asked AI for dating advice and got DESTROYED"</TaskItem>
          <TaskItem id="w2_3" icon={Video}>Post "JudgyGPT vs The Diplomat: Same question"</TaskItem>
          <TaskItem id="w2_4" icon={Video}>Post "Things JudgyGPT says that hit too hard"</TaskItem>
          <TaskItem id="w2_5" icon={Video}>Post "My AI therapist has no chill"</TaskItem>
          <TaskItem id="w2_6" icon={Video}>Post "JudgyGPT reads my situationship"</TaskItem>
          <TaskItem id="w2_7" icon={Video}>Post "The Diplomat gives marriage advice"</TaskItem>
        </WeekSection>

        {/* Week 3-4 */}
        <WeekSection 
          week="week3" 
          title="Week 3-4: Growth Tactics" 
          icon={TrendingUp}
          color="bg-gradient-to-r from-purple-500 to-violet-500"
          taskIds={['w3_1', 'w3_2', 'w3_3', 'w3_4', 'w3_5', 'w3_6', 'w3_7', 'w3_8', 'w3_9', 'w3_10']}
        >
          <TaskItem id="w3_1" icon={MessageSquare} link="https://reddit.com/r/ChatGPT">Post on r/ChatGPT</TaskItem>
          <TaskItem id="w3_2" icon={MessageSquare} link="https://reddit.com/r/SideProject">Post on r/SideProject</TaskItem>
          <TaskItem id="w3_3" icon={MessageSquare} link="https://reddit.com/r/InternetIsBeautiful">Post on r/InternetIsBeautiful</TaskItem>
          <TaskItem id="w3_4" icon={MessageSquare} link="https://reddit.com/r/Entrepreneur">Post on r/Entrepreneur</TaskItem>
          <TaskItem id="w3_5" icon={Rocket} link="https://producthunt.com">Create Product Hunt account</TaskItem>
          <TaskItem id="w3_6" icon={Rocket}>Prepare Product Hunt launch assets</TaskItem>
          <TaskItem id="w3_7" icon={Rocket}>Launch on Product Hunt (Tuesday)</TaskItem>
          <TaskItem id="w3_8" icon={MessageSquare} link="https://news.ycombinator.com">Post on Hacker News</TaskItem>
          <TaskItem id="w3_9" icon={Users}>DM 5 micro-influencers</TaskItem>
          <TaskItem id="w3_10" icon={Mail}>Set up email capture on landing page</TaskItem>
        </WeekSection>

        {/* Content Ideas */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">Viral Content Formulas</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">Formula 1: POV Videos</h4>
              <p className="text-sm text-amber-700">
                "POV: You ask JudgyGPT if you should [relatable situation]"<br/>
                → Show response → Your reaction
              </p>
            </div>
            <div className="p-4 bg-pink-50 rounded-xl border border-pink-200">
              <h4 className="font-semibold text-pink-800 mb-2">Formula 2: "This AI has NO chill"</h4>
              <p className="text-sm text-pink-700">
                Me: [innocent question]<br/>
                JudgyGPT: [savage response]<br/>
                Me: 👁️👄👁️
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Formula 3: JudgyGPT vs The Diplomat</h4>
              <p className="text-sm text-purple-700">
                Same question, two different responses.<br/>
                Show the contrast - sass vs wisdom!
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Quick Links</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors">
              <Globe className="w-6 h-6 mx-auto mb-1 text-blue-500" />
              <span className="text-xs text-gray-600">Search Console</span>
            </a>
            <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors">
              <BarChart3 className="w-6 h-6 mx-auto mb-1 text-amber-500" />
              <span className="text-xs text-gray-600">Analytics</span>
            </a>
            <a href="https://canva.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors">
              <Sparkles className="w-6 h-6 mx-auto mb-1 text-purple-500" />
              <span className="text-xs text-gray-600">Canva</span>
            </a>
            <a href="https://producthunt.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors">
              <Rocket className="w-6 h-6 mx-auto mb-1 text-orange-500" />
              <span className="text-xs text-gray-600">Product Hunt</span>
            </a>
          </div>
        </Card>

        {/* Motivation */}
        <div className="mt-8 text-center p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
          <p className="text-lg font-medium text-foreground mb-2">
            "Consistency beats perfection. Post daily, even if it's not perfect." 💅
          </p>
          <p className="text-sm text-muted-foreground">
            You've built something amazing. Now show the world!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrowthPlanPage;
