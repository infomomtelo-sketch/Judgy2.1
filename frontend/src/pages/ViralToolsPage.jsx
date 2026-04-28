import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as htmlToImage from 'html-to-image';
import { 
  ArrowLeft, Flame, AlertTriangle, Scale, Share2, Download, Loader2,
  Copy, Check, Sparkles, Zap, Sun, Moon
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ViralToolsPage = () => {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roast');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="glass-header sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF2E4C] flex items-center justify-center rounded-sm">
              <span className="font-display font-bold text-lg sm:text-xl text-white">J</span>
            </div>
            <span className="font-display font-bold text-base sm:text-xl tracking-tight text-foreground">THE JUDGY</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground hover:bg-muted" data-testid="theme-toggle">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {!isAuthenticated && (
              <Link to="/register">
                <Button className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white text-sm">Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 text-center border-b border-border">
        <span className="tag-elegant inline-block mb-4 sm:mb-6 text-[10px] sm:text-xs">Viral Tools</span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
          GET <span className="text-[#FF2E4C]">ROASTED.</span> GET REAL.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Three viral tools to get brutally honest feedback. Share the results and watch the chaos unfold.
        </p>
      </section>

      {/* Tools Tabs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted border border-border p-1 h-auto rounded-lg">
            <TabsTrigger value="roast" className="flex items-center gap-2 data-[state=active]:bg-[#FF2E4C] data-[state=active]:text-white text-muted-foreground py-3 rounded-md" data-testid="tab-roast">
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline font-bold uppercase text-xs tracking-wider">Roast Bio</span>
              <span className="sm:hidden text-xs">Roast</span>
            </TabsTrigger>
            <TabsTrigger value="redflag" className="flex items-center gap-2 data-[state=active]:bg-[#FF2E4C] data-[state=active]:text-white text-muted-foreground py-3 rounded-md" data-testid="tab-redflag">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline font-bold uppercase text-xs tracking-wider">Red Flags</span>
              <span className="sm:hidden text-xs">Flags</span>
            </TabsTrigger>
            <TabsTrigger value="verdict" className="flex items-center gap-2 data-[state=active]:bg-[#FF2E4C] data-[state=active]:text-white text-muted-foreground py-3 rounded-md" data-testid="tab-verdict">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline font-bold uppercase text-xs tracking-wider">Who's Right</span>
              <span className="sm:hidden text-xs">Verdict</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roast"><RoastMyBioTool /></TabsContent>
          <TabsContent value="redflag"><RedFlagDetectorTool /></TabsContent>
          <TabsContent value="verdict"><WhosRightTool /></TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

// ==================== ROAST MY BIO TOOL ====================
const RoastMyBioTool = () => {
  const [bio, setBio] = useState('');
  const [bioType, setBioType] = useState('dating');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRoast = async () => {
    if (!bio.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/viral/roast-bio`, { bio, bio_type: bioType });
      setResult(response.data);
    } catch (error) {
      setResult({ roast: "Even my sass circuits are confused by this one. Try again, bestie.", improved_bio: bio, rating: 3 });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Flame className="w-5 h-5 text-orange-500" />Roast My Bio
          </CardTitle>
          <CardDescription>Paste your dating, LinkedIn, or Instagram bio. I'll roast it AND fix it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['dating', 'linkedin', 'instagram', 'twitter'].map((type) => (
              <Button key={type} variant={bioType === type ? 'default' : 'outline'} size="sm" onClick={() => setBioType(type)} className="capitalize">
                {type}
              </Button>
            ))}
          </div>
          <Textarea placeholder="Paste your bio here..." value={bio} onChange={(e) => setBio(e.target.value)} rows={5} className="resize-none bg-input border-border text-foreground" data-testid="roast-bio-input" />
          <Button onClick={handleRoast} disabled={loading || !bio.trim()} className="w-full bg-[#FF2E4C] hover:bg-[#E01F3D] text-white" data-testid="roast-submit-btn">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Preparing your roast...</> : <><Flame className="w-4 h-4 mr-2" />Roast Me</>}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <ShareableCard type="roast" title="Bio Roast Results" icon={<Flame className="w-6 h-6 text-orange-500" />}>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">The Roast:</p>
              <p className="text-foreground font-medium">{result.roast}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Cringe Rating:</span>
              <div className="flex">{[...Array(5)].map((_, i) => <Flame key={i} className={`w-4 h-4 ${i < result.rating ? 'text-orange-500' : 'text-muted'}`} />)}</div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-1">Your Glow-Up Version:</p>
              <p className="text-foreground bg-muted p-3 rounded-lg">{result.improved_bio}</p>
            </div>
          </div>
        </ShareableCard>
      )}
    </div>
  );
};

// ==================== RED FLAG DETECTOR ====================
const RedFlagDetectorTool = () => {
  const [conversation, setConversation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    if (!conversation.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/viral/red-flags`, { conversation });
      setResult(response.data);
    } catch (error) {
      setResult({ red_flags: ["Couldn't analyze this one"], verdict: "Inconclusive", advice: "Try again with a clearer conversation.", danger_level: 3 });
    }
    setLoading(false);
  };

  const getDangerColor = (level) => {
    if (level <= 2) return 'text-green-500';
    if (level <= 4) return 'text-yellow-500';
    if (level <= 6) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="w-5 h-5 text-red-500" />Red Flag Detector
          </CardTitle>
          <CardDescription>Paste that sketchy text conversation. I'll find the red flags you're ignoring.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="Paste the conversation here..." value={conversation} onChange={(e) => setConversation(e.target.value)} rows={8} className="resize-none bg-input border-border text-foreground font-mono text-sm" data-testid="redflag-input" />
          <Button onClick={handleDetect} disabled={loading || !conversation.trim()} className="w-full bg-red-500 hover:bg-red-600 text-white" data-testid="redflag-submit-btn">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Scanning...</> : <><AlertTriangle className="w-4 h-4 mr-2" />Detect Red Flags</>}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <ShareableCard type="redflag" title="Red Flag Report" icon={<AlertTriangle className="w-6 h-6 text-red-500" />}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Danger Level:</span>
              <span className={`font-bold ${getDangerColor(result.danger_level)}`}>{result.danger_level}/10</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Red Flags Found:</p>
              <ul className="space-y-2">
                {result.red_flags?.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 text-xs">&#9873;</span>
                    <span className="text-foreground text-sm">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-1">The Verdict:</p>
              <p className="text-foreground font-semibold text-lg">{result.verdict}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">My Advice:</p>
              <p className="text-foreground text-sm">{result.advice}</p>
            </div>
          </div>
        </ShareableCard>
      )}
    </div>
  );
};

// ==================== WHO'S RIGHT ====================
const WhosRightTool = () => {
  const [yourSide, setYourSide] = useState('');
  const [theirSide, setTheirSide] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleJudge = async () => {
    if (!yourSide.trim() || !theirSide.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/viral/whos-right`, { your_side: yourSide, their_side: theirSide, context });
      setResult(response.data);
    } catch (error) {
      setResult({ winner: "It's complicated", your_score: 50, their_score: 50, verdict: "Both of you need to sit down.", roast_both: "Y'all are both exhausting." });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Scale className="w-5 h-5 text-purple-500" />Who's Right?
          </CardTitle>
          <CardDescription>Present both sides. I'll deliver the verdict (and roast both of you).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Your Side:</label>
            <Textarea placeholder="Explain your perspective..." value={yourSide} onChange={(e) => setYourSide(e.target.value)} rows={3} className="resize-none bg-input border-border text-foreground" data-testid="verdict-your-side" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Their Side:</label>
            <Textarea placeholder="What's their argument?" value={theirSide} onChange={(e) => setTheirSide(e.target.value)} rows={3} className="resize-none bg-input border-border text-foreground" data-testid="verdict-their-side" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Context (optional):</label>
            <Input placeholder="e.g., Dating for 2 years, work drama..." value={context} onChange={(e) => setContext(e.target.value)} className="bg-input border-border text-foreground" data-testid="verdict-context" />
          </div>
          <Button onClick={handleJudge} disabled={loading || !yourSide.trim() || !theirSide.trim()} className="w-full bg-purple-500 hover:bg-purple-600 text-white" data-testid="verdict-submit-btn">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Deliberating...</> : <><Scale className="w-4 h-4 mr-2" />Deliver the Verdict</>}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <ShareableCard type="verdict" title="The Verdict Is In" icon={<Scale className="w-6 h-6 text-purple-500" />}>
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">The Winner:</p>
              <p className="text-3xl font-bold text-foreground">{result.winner}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1 text-center">You</p>
                <div className="h-4 bg-muted rounded-full overflow-hidden"><div className="h-full bg-[#FF2E4C] rounded-full" style={{ width: `${result.your_score}%` }} /></div>
                <p className="text-center font-bold mt-1 text-foreground">{result.your_score}%</p>
              </div>
              <span className="text-muted-foreground font-bold">VS</span>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1 text-center">Them</p>
                <div className="h-4 bg-muted rounded-full overflow-hidden"><div className="h-full bg-[#FFB800] rounded-full" style={{ width: `${result.their_score}%` }} /></div>
                <p className="text-center font-bold mt-1 text-foreground">{result.their_score}%</p>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-1">The Verdict:</p>
              <p className="text-foreground font-medium">{result.verdict}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Roast for Both:</p>
              <p className="text-foreground italic text-sm">"{result.roast_both}"</p>
            </div>
          </div>
        </ShareableCard>
      )}
    </div>
  );
};

// ==================== SHAREABLE CARD ====================
const ShareableCard = ({ type, title, icon, children }) => {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `thejudgy-${type}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
    setDownloading(false);
  };

  const shareToTwitter = () => {
    const texts = {
      roast: "Just got my bio roasted by The Judgy. The AI said what my friends were too nice to say...",
      redflag: "I ran that conversation through The Judgy's Red Flag Detector... Let's just say I have some thinking to do",
      verdict: "Asked The Judgy to settle our argument... The verdict is IN"
    };
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texts[type] || '')}&url=${encodeURIComponent('https://thejudgy.com/tools')}`;
    window.open(url, '_blank');
  };

  const copyShareText = () => {
    const texts = {
      roast: "Just got roasted by The Judgy! Try it: thejudgy.com/tools",
      redflag: "The Judgy found all the red flags I was ignoring. Check yours: thejudgy.com/tools",
      verdict: "The Judgy settled our argument! Who's right? thejudgy.com/tools"
    };
    navigator.clipboard.writeText(texts[type] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({
        title: `The Judgy - ${title}`,
        text: `Check out my ${type === 'roast' ? 'bio roast' : type === 'redflag' ? 'red flag report' : 'verdict'} from The Judgy!`,
        url: 'https://thejudgy.com/tools'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div ref={cardRef} className="bg-card border border-border rounded-lg p-6 shadow-elegant">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#FF2E4C] rounded-sm flex items-center justify-center">
            <span className="font-display font-bold text-lg text-white">J</span>
          </div>
          <div>
            <p className="font-semibold text-foreground">The Judgy</p>
            <p className="text-xs text-muted-foreground">thejudgy.com</p>
          </div>
          <div className="ml-auto">{icon}</div>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-4 font-display">{title}</h3>
        {children}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Share your results!</p>
          <Badge variant="secondary" className="text-xs"><Sparkles className="w-3 h-3 mr-1" />thejudgy.com/tools</Badge>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex flex-wrap gap-2">
        {navigator.share && (
          <Button onClick={shareNative} className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white" size="sm">
            <Share2 className="w-4 h-4 mr-2" />Share
          </Button>
        )}
        <Button onClick={downloadImage} variant="outline" size="sm" disabled={downloading}>
          {downloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}Save Image
        </Button>
        <Button onClick={shareToTwitter} variant="outline" size="sm">
          <span className="mr-2 font-bold">X</span>Share on X
        </Button>
        <Button onClick={copyShareText} variant="outline" size="sm">
          {copied ? <><Check className="w-4 h-4 mr-2" />Copied!</> : <><Copy className="w-4 h-4 mr-2" />Copy Text</>}
        </Button>
      </div>
    </div>
  );
};

export default ViralToolsPage;
