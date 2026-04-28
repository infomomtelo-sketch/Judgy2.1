import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, DollarSign, MessageSquare, Coins, ArrowLeft, Sun, Moon, 
  TrendingUp, Zap, Globe, Home, Code, Dumbbell, Loader2, Shield,
  BarChart3, UserPlus, CreditCard
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
      if (err.response?.status === 403) {
        setError('admin');
      } else {
        setError('fetch');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF2E4C] mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
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

  const maxUsage = Math.max(...Object.values(expertUsage || {}), 1);
  const maxDaily = Math.max(...(dailySignups || []).map(d => d.signups), 1);

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
              <h1 className="font-display font-bold text-lg text-foreground">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground hover:bg-muted" data-testid="theme-toggle">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground text-sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Home
            </Button>
            <Button variant="ghost" size="sm" onClick={fetchDashboardData} className="text-muted-foreground hover:text-foreground text-sm" data-testid="refresh-btn">
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="stats-cards">
          <StatCard icon={<Users className="w-5 h-5" />} label="Total Users" value={stats?.users?.total || 0} sub={`+${stats?.users?.this_week || 0} this week`} color="#3B82F6" />
          <StatCard icon={<UserPlus className="w-5 h-5" />} label="Signups Today" value={stats?.users?.today || 0} sub={`${stats?.users?.this_month || 0} this month`} color="#10B981" />
          <StatCard icon={<DollarSign className="w-5 h-5" />} label="Total Revenue" value={`$${stats?.revenue?.total || 0}`} sub={`$${stats?.revenue?.this_month || 0} this month`} color="#F59E0B" />
          <StatCard icon={<MessageSquare className="w-5 h-5" />} label="Total Messages" value={stats?.engagement?.total_messages || 0} sub={`${stats?.engagement?.anonymous_sessions || 0} anon sessions`} color="#FF2E4C" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Expert Usage */}
          <Card className="bg-card border-border" data-testid="expert-usage-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-[#FF2E4C]" /> Expert Usage
              </CardTitle>
            </CardHeader>
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
                          <div className="h-full rounded-full transition-all" style={{ width: `${(count / maxUsage) * 100}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(expertUsage || {}).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No usage data yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Signups Chart */}
          <Card className="bg-card border-border" data-testid="signups-chart-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-base">
                <TrendingUp className="w-4 h-4 text-[#10B981]" /> Daily Signups (14 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-40">
                {(dailySignups || []).map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted-foreground font-bold">{day.signups > 0 ? day.signups : ''}</span>
                    <div 
                      className="w-full rounded-t-sm transition-all"
                      style={{ 
                        height: `${Math.max((day.signups / maxDaily) * 100, 4)}%`,
                        backgroundColor: day.signups > 0 ? '#10B981' : 'hsl(var(--muted))',
                        minHeight: '4px'
                      }}
                    />
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
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-base">
                <UserPlus className="w-4 h-4 text-[#3B82F6]" /> Recent Signups
              </CardTitle>
            </CardHeader>
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
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-[#FFB800]" />
                        <span className="text-xs font-bold text-foreground">{u.tokens}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{u.auth_provider || 'email'}</span>
                    </div>
                  </div>
                ))}
                {recentSignups.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No signups yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-card border-border" data-testid="recent-transactions-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2 text-base">
                <CreditCard className="w-4 h-4 text-[#F59E0B]" /> Recent Transactions
              </CardTitle>
            </CardHeader>
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
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        t.payment_status === 'paid' ? 'text-green-500' : t.payment_status === 'pending' ? 'text-yellow-500' : 'text-muted-foreground'
                      )}>
                        {t.payment_status}
                      </span>
                    </div>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No transactions yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Token Stats */}
        <Card className="bg-card border-border" data-testid="token-stats-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <Coins className="w-8 h-8 text-[#FFB800] mx-auto mb-2" />
                <p className="font-display text-3xl font-bold text-foreground">{stats?.tokens?.total_held || 0}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Tokens Held by Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color }) => (
  <Card className="bg-card border-border">
    <CardContent className="pt-5 pb-4">
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>}
    </CardContent>
  </Card>
);

export default AdminDashboard;
