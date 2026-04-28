import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, DollarSign, MessageSquare, Coins, ArrowLeft, Sun, Moon, 
  TrendingUp, Zap, Globe, Home, Code, Dumbbell, Loader2, Shield,
  BarChart3, UserPlus, CreditCard, Wand2, Copy, Check, Calendar,
  Sparkles, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EXPERT_COLORS = {
  judgy: '#FF2E4C', translator: '#3B82F6', realtor: '#10B981',
  coder: '#8B5CF6', social: '#F59E0B', fitness: '#EF4444', diplomat: '#9CA3AF'
};
const EXPERT_ICONS = { 
  judgy: Zap, translator: Globe, realtor: Home, 
  coder: Code, social: TrendingUp, fitness: Dumbbell 
};

const AdminDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [expertUsage, setExpertUsage] = useState(null);
  const [recentSignups, setRecentSignups] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [dailySignups, setDailySignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usageRes, signupsRes, txnsRes, dailyRes] = await Promise.all([
        axios.get(`${API}/admin/stats`),
        axios.get(`${API}/admin/expert-usage`),
        axios.get(`${API}/admin/recent-signups?limit=10`),
        axios.get(`${API}/admin/recent-transactions?limit=10`),
        axios.get(`${API}/admin/daily-signups?days=14`),
      ]);
      setStats(statsRes.data);
      setExpertUsage(usageRes.data.expert_usage || {});
      setRecentSignups(signupsRes.data);
      setRecentTransactions(txnsRes.data);
      setDailySignups(dailyRes.data);
    } catch (err) {
      setError(err.response?.status === 403 ? 'admin' : 'fetch');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF2E4C]" />
      </div>
    );
  }

  if (error === 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">This dashboard is restricted to administrators.</p>
          <Link to="/"><Button className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white">Go Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="admin-dashboard">
      {/* Header */}
      <header className="glass-header sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF2E4C] flex items-center justify-center rounded-sm">
                <span className="font-display font-bold text-lg text-white">J</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#FF2E4C]" />
              <h1 className="font-display font-bold text-lg text-foreground">Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground hover:bg-muted" data-testid="theme-toggle">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground text-sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Home
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted border border-border mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#FF2E4C] data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-1.5" /> Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-[#FF2E4C] data-[state=active]:text-white">
              <Wand2 className="w-4 h-4 mr-1.5" /> Content Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab 
              stats={stats} expertUsage={expertUsage} recentSignups={recentSignups}
              recentTransactions={recentTransactions} dailySignups={dailySignups}
              onRefresh={fetchDashboardData}
            />
          </TabsContent>
          <TabsContent value="content">
            <ContentGeneratorTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ==================== OVERVIEW TAB ====================
const OverviewTab = ({ stats, expertUsage, recentSignups, recentTransactions, dailySignups, onRefresh }) => {
  const maxUsage = Math.max(...Object.values(expertUsage || {}), 1);
  const maxDaily = Math.max(...(dailySignups || []).map(d => d.signups), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={onRefresh} className="text-muted-foreground hover:text-foreground" data-testid="refresh-btn">
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="stats-cards">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Users" value={stats?.users?.total || 0} sub={`+${stats?.users?.this_week || 0} this week`} color="#3B82F6" />
        <StatCard icon={<UserPlus className="w-5 h-5" />} label="Signups Today" value={stats?.users?.today || 0} sub={`${stats?.users?.this_month || 0} this month`} color="#10B981" />
        <StatCard icon={<DollarSign className="w-5 h-5" />} label="Total Revenue" value={`$${stats?.revenue?.total || 0}`} sub={`$${stats?.revenue?.this_month || 0} this month`} color="#F59E0B" />
        <StatCard icon={<MessageSquare className="w-5 h-5" />} label="Total Messages" value={stats?.engagement?.total_messages || 0} sub={`${stats?.engagement?.anonymous_sessions || 0} anon sessions`} color="#FF2E4C" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Expert Usage */}
        <Card className="bg-card border-border" data-testid="expert-usage-card">
          <CardHeader><CardTitle className="text-foreground flex items-center gap-2 text-base"><Zap className="w-4 h-4 text-[#FF2E4C]" /> Expert Usage</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(expertUsage || {}).sort((a, b) => b[1] - a[1]).map(([expert, count]) => {
                const Icon = EXPERT_ICONS[expert] || Zap;
                const color = EXPERT_COLORS[expert] || '#888';
                return (
                  <div key={expert} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground capitalize">{expert}</span>
                        <span className="text-xs text-muted-foreground">{count} msgs</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count / maxUsage) * 100}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(expertUsage || {}).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No usage data yet</p>}
            </div>
          </CardContent>
        </Card>

        {/* Signups Chart */}
        <Card className="bg-card border-border" data-testid="signups-chart-card">
          <CardHeader><CardTitle className="text-foreground flex items-center gap-2 text-base"><TrendingUp className="w-4 h-4 text-[#10B981]" /> Daily Signups (14 days)</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-40">
              {(dailySignups || []).map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted-foreground font-bold">{day.signups > 0 ? day.signups : ''}</span>
                  <div className="w-full rounded-t-sm" style={{ height: `${Math.max((day.signups / maxDaily) * 100, 4)}%`, backgroundColor: day.signups > 0 ? '#10B981' : 'hsl(var(--muted))', minHeight: '4px' }} />
                  <span className="text-[8px] text-muted-foreground leading-none">{day.date.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <Card className="bg-card border-border" data-testid="recent-signups-card">
          <CardHeader><CardTitle className="text-foreground flex items-center gap-2 text-base"><UserPlus className="w-4 h-4 text-[#3B82F6]" /> Recent Signups</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentSignups.map((u, i) => (
                <div key={u.id || i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-foreground">{(u.name || 'U')[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{u.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="flex items-center gap-1"><Coins className="w-3 h-3 text-[#FFB800]" /><span className="text-xs font-bold text-foreground">{u.tokens}</span></div>
                    <span className="text-[10px] text-muted-foreground">{u.auth_provider || 'email'}</span>
                  </div>
                </div>
              ))}
              {recentSignups.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No signups yet</p>}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-card border-border" data-testid="recent-transactions-card">
          <CardHeader><CardTitle className="text-foreground flex items-center gap-2 text-base"><CreditCard className="w-4 h-4 text-[#F59E0B]" /> Recent Transactions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTransactions.map((t, i) => (
                <div key={t.id || i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{t.user_email}</p>
                    <p className="text-xs text-muted-foreground">{t.metadata?.package_name || t.plan_id}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-bold text-foreground">${t.amount}</p>
                    <span className={cn("text-[10px] font-bold uppercase", t.payment_status === 'paid' ? 'text-green-500' : t.payment_status === 'pending' ? 'text-yellow-500' : 'text-muted-foreground')}>{t.payment_status}</span>
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No transactions yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ==================== CONTENT GENERATOR TAB ====================
const PLATFORMS = ['tiktok', 'instagram', 'twitter', 'linkedin', 'reddit'];
const CONTENT_TYPES = ['caption', 'hook', 'thread', 'bio'];
const TOPICS = [
  "Dating bio roast results", "Red flag detector results", "Who's right argument results",
  "AI fitness coaching demo", "AI code debugging demo", "AI language translation demo",
  "Real estate AI advice", "Social media growth tips", "Behind the scenes of the app",
  "User reactions compilation", "Before/after bio makeover", "Worst red flags found"
];

const ContentGeneratorTab = () => {
  const [platform, setPlatform] = useState('tiktok');
  const [contentType, setContentType] = useState('caption');
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState(null);
  const [calendarResult, setCalendarResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generatingCalendar, setGeneratingCalendar] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setResult(null);
    try {
      const response = await axios.post(`${API}/growth/generate-content`, {
        content_type: contentType,
        topic: topic.trim(),
        platform
      });
      setResult(response.data);
    } catch (error) {
      console.error('Generation failed:', error);
    }
    setGenerating(false);
  };

  const generateCalendar = async () => {
    setGeneratingCalendar(true);
    setCalendarResult(null);
    try {
      const response = await axios.post(`${API}/growth/generate-calendar`, { weeks: 1 });
      setCalendarResult(response.data);
    } catch (error) {
      console.error('Calendar generation failed:', error);
    }
    setGeneratingCalendar(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Content Generator */}
        <Card className="bg-card border-border" data-testid="content-generator-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <Wand2 className="w-4 h-4 text-[#FF2E4C]" /> Generate Post
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Platform */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Platform</label>
              <div className="flex flex-wrap gap-1.5">
                {PLATFORMS.map(p => (
                  <Button key={p} variant={platform === p ? 'default' : 'outline'} size="sm" onClick={() => setPlatform(p)} className={cn("capitalize text-xs", platform === p && "bg-[#FF2E4C] hover:bg-[#E01F3D]")}>
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            {/* Content Type */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Type</label>
              <div className="flex flex-wrap gap-1.5">
                {CONTENT_TYPES.map(t => (
                  <Button key={t} variant={contentType === t ? 'default' : 'outline'} size="sm" onClick={() => setContentType(t)} className={cn("capitalize text-xs", contentType === t && "bg-[#FF2E4C] hover:bg-[#E01F3D]")}>
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Topic</label>
              <Textarea
                value={topic} onChange={(e) => setTopic(e.target.value)}
                placeholder="What should the post be about?"
                className="bg-input border-border text-foreground text-sm resize-none"
                rows={2}
                data-testid="content-topic-input"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {TOPICS.slice(0, 6).map((t, i) => (
                  <button key={i} onClick={() => setTopic(t)} className="text-[10px] px-2 py-1 bg-muted border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-[#FF2E4C] transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={generateContent} disabled={generating || !topic.trim()} className="w-full bg-[#FF2E4C] hover:bg-[#E01F3D] text-white" data-testid="generate-content-btn">
              {generating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating...</> : <><Wand2 className="w-4 h-4 mr-2" />Generate Content</>}
            </Button>
          </CardContent>
        </Card>

        {/* Calendar Generator */}
        <Card className="bg-card border-border" data-testid="calendar-generator-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-[#F59E0B]" /> Weekly Content Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Generate a 7-day content calendar with specific post ideas for each day, optimized for different platforms.</p>
            
            <Button onClick={generateCalendar} disabled={generatingCalendar} className="w-full bg-[#FFB800] hover:bg-[#E5A600] text-black font-bold" data-testid="generate-calendar-btn">
              {generatingCalendar ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating calendar...</> : <><Calendar className="w-4 h-4 mr-2" />Generate 7-Day Calendar</>}
            </Button>

            {calendarResult?.schedule && (
              <div className="space-y-2 mt-4">
                {calendarResult.schedule.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg border border-border">
                    <div className="w-10 h-10 bg-[#FFB800]/10 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#FFB800]">{(item.day || '').slice(0, 3)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{item.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">{item.platform}</span>
                        <span className="text-[10px] text-muted-foreground">{item.time}</span>
                        {item.expert && <span className="text-[10px] text-muted-foreground">{item.expert}</span>}
                      </div>
                    </div>
                    <button onClick={() => copyToClipboard(item.content)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generated Content Result */}
      {result && (
        <Card className="bg-card border-border border-[#FF2E4C]/30" data-testid="generated-content-result">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center justify-between">
              <div className="flex items-center gap-2 text-base">
                <Sparkles className="w-4 h-4 text-[#FFB800]" /> Generated Content
              </div>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.content + '\n\n' + (result.hashtags || []).join(' '))} data-testid="copy-content-btn">
                {copied ? <><Check className="w-4 h-4 mr-1" />Copied!</> : <><Copy className="w-4 h-4 mr-1" />Copy All</>}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">{result.content}</p>
            </div>

            {result.hashtags?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Hashtags</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-[#FF2E4C]/10 text-[#FF2E4C] rounded-md font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {result.tips?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Pro Tips</p>
                <ul className="space-y-1">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Zap className="w-3 h-3 text-[#FFB800] mt-1 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.best_time && (
              <p className="text-xs text-muted-foreground">Best posting time: <span className="font-bold text-foreground">{result.best_time}</span></p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ==================== STAT CARD ====================
const StatCard = ({ icon, label, value, sub, color }) => (
  <Card className="bg-card border-border">
    <CardContent className="pt-5 pb-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${color}15` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>}
    </CardContent>
  </Card>
);

export default AdminDashboard;
