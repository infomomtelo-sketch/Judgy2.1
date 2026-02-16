import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as htmlToImage from 'html-to-image';
import { 
  ArrowLeft, 
  Flame, 
  AlertTriangle, 
  Scale, 
  Share2, 
  Download, 
  Loader2,
  Copy,
  Check,
  Twitter,
  Sparkles,
  MessageSquare,
  Heart,
  Zap
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// JudgyGPT Logo
const JUDGY_LOGO = "https://customer-assets.emergentagent.com/job_chat-assist-26/artifacts/ze789p6s_7DEC28F8-D66A-46B0-99EA-84F4FF846DBB.png";

const ViralToolsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roast');

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
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {!isAuthenticated && (
              <Link to="/register">
                <Button className="gradient-primary">Get Started Free</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-4 text-center">
        <Badge variant="secondary" className="mb-4 px-4 py-1">
          <Sparkles className="w-3 h-3 mr-1" />
          Viral Tools
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Get Roasted. Get Real. 🔥
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Three ways to get brutally honest feedback. Share the results and watch the chaos unfold.
        </p>
      </section>

      {/* Tools Tabs */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="roast" className="flex items-center gap-2" data-testid="tab-roast">
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Roast My Bio</span>
              <span className="sm:hidden">Roast</span>
            </TabsTrigger>
            <TabsTrigger value="redflag" className="flex items-center gap-2" data-testid="tab-redflag">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Red Flag Detector</span>
              <span className="sm:hidden">Red Flags</span>
            </TabsTrigger>
            <TabsTrigger value="verdict" className="flex items-center gap-2" data-testid="tab-verdict">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Who's Right?</span>
              <span className="sm:hidden">Verdict</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roast">
            <RoastMyBioTool />
          </TabsContent>
          
          <TabsContent value="redflag">
            <RedFlagDetectorTool />
          </TabsContent>
          
          <TabsContent value="verdict">
            <WhosRightTool />
          </TabsContent>
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
  const cardRef = useRef(null);

  const handleRoast = async () => {
    if (!bio.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/viral/roast-bio`, { bio, bio_type: bioType });
      setResult(response.data);
    } catch (error) {
      console.error('Roast failed:', error);
      setResult({
        roast: "Even my sass circuits are confused by this one. Try again, bestie.",
        improved_bio: bio,
        rating: 3
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Roast My Bio
          </CardTitle>
          <CardDescription>
            Paste your dating profile, LinkedIn, or Instagram bio. I'll roast it AND fix it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['dating', 'linkedin', 'instagram', 'twitter'].map((type) => (
              <Button
                key={type}
                variant={bioType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBioType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
          
          <Textarea
            placeholder="Paste your bio here... Don't worry, I've seen worse. Probably."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="resize-none"
            data-testid="roast-bio-input"
          />
          
          <Button 
            onClick={handleRoast} 
            disabled={loading || !bio.trim()}
            className="w-full gradient-primary"
            data-testid="roast-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Preparing your roast...
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 mr-2" />
                Roast Me
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <ShareableCard
          ref={cardRef}
          type="roast"
          title="Bio Roast Results"
          icon={<Flame className="w-6 h-6 text-orange-500" />}
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">The Roast:</p>
              <p className="text-foreground font-medium">{result.roast}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Cringe Rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Flame 
                    key={i} 
                    className={`w-4 h-4 ${i < result.rating ? 'text-orange-500' : 'text-muted'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-1">Your Glow-Up Version:</p>
              <p className="text-foreground bg-muted/50 p-3 rounded-lg">{result.improved_bio}</p>
            </div>
          </div>
        </ShareableCard>
      )}
    </div>
  );
};

// ==================== RED FLAG DETECTOR TOOL ====================
const RedFlagDetectorTool = () => {
  const [conversation, setConversation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  const handleDetect = async () => {
    if (!conversation.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/viral/red-flags`, { conversation });
      setResult(response.data);
    } catch (error) {
      console.error('Detection failed:', error);
      setResult({
        red_flags: ["Couldn't analyze this one - the chaos was too strong"],
        verdict: "Inconclusive",
        advice: "Try again with a clearer conversation.",
        danger_level: 3
      });
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Red Flag Detector
          </CardTitle>
          <CardDescription>
            Paste that sketchy text conversation. I'll find the red flags you're ignoring.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the conversation here... Names can be changed to protect the guilty 👀"
            value={conversation}
            onChange={(e) => setConversation(e.target.value)}
            rows={8}
            className="resize-none font-mono text-sm"
            data-testid="redflag-input"
          />
          
          <Button 
            onClick={handleDetect} 
            disabled={loading || !conversation.trim()}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            data-testid="redflag-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Scanning for red flags...
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Detect Red Flags
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <ShareableCard
          ref={cardRef}
          type="redflag"
          title="Red Flag Report"
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Danger Level:</span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-3 h-6 mx-0.5 rounded-sm ${i < result.danger_level ? getDangerColor(result.danger_level) : 'bg-muted'}`}
                      style={{ backgroundColor: i < result.danger_level ? undefined : undefined }}
                    >
                      {i < result.danger_level && (
                        <div className={`w-full h-full rounded-sm ${getDangerColor(result.danger_level)} bg-current opacity-80`} />
                      )}
                    </div>
                  ))}
                </div>
                <span className={`font-bold ${getDangerColor(result.danger_level)}`}>
                  {result.danger_level}/10
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Red Flags Found:</p>
              <ul className="space-y-2">
                {result.red_flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">🚩</span>
                    <span className="text-foreground">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-1">The Verdict:</p>
              <p className="text-foreground font-semibold text-lg">{result.verdict}</p>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">My Advice:</p>
              <p className="text-foreground">{result.advice}</p>
            </div>
          </div>
        </ShareableCard>
      )}
    </div>
  );
};

// ==================== WHO'S RIGHT TOOL ====================
const WhosRightTool = () => {
  const [yourSide, setYourSide] = useState('');
  const [theirSide, setTheirSide] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  const handleJudge = async () => {
    if (!yourSide.trim() || !theirSide.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/viral/whos-right`, { 
        your_side: yourSide, 
        their_side: theirSide,
        context 
      });
      setResult(response.data);
    } catch (error) {
      console.error('Judgment failed:', error);
      setResult({
        winner: "It's complicated",
        your_score: 50,
        their_score: 50,
        verdict: "Both of you need to sit down and have a real conversation.",
        roast_both: "Y'all are both exhausting, honestly."
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-500" />
            Who's Right?
          </CardTitle>
          <CardDescription>
            Present both sides of the argument. I'll deliver the verdict (and roast both of you).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Your Side:</label>
            <Textarea
              placeholder="Explain your perspective... Make it good."
              value={yourSide}
              onChange={(e) => setYourSide(e.target.value)}
              rows={3}
              className="resize-none"
              data-testid="verdict-your-side"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Their Side:</label>
            <Textarea
              placeholder="What's their argument? Be fair... or don't, I'll figure it out."
              value={theirSide}
              onChange={(e) => setTheirSide(e.target.value)}
              rows={3}
              className="resize-none"
              data-testid="verdict-their-side"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Context (optional):</label>
            <Input
              placeholder="e.g., Dating for 2 years, roommate dispute, work drama..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              data-testid="verdict-context"
            />
          </div>
          
          <Button 
            onClick={handleJudge} 
            disabled={loading || !yourSide.trim() || !theirSide.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            data-testid="verdict-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Deliberating...
              </>
            ) : (
              <>
                <Scale className="w-4 h-4 mr-2" />
                Deliver the Verdict
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <ShareableCard
          ref={cardRef}
          type="verdict"
          title="The Verdict Is In"
          icon={<Scale className="w-6 h-6 text-purple-500" />}
        >
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">The Winner:</p>
              <p className="text-3xl font-bold text-foreground">{result.winner}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1 text-center">You</p>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${result.your_score}%` }}
                  />
                </div>
                <p className="text-center font-bold mt-1">{result.your_score}%</p>
              </div>
              <span className="text-muted-foreground font-bold">VS</span>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1 text-center">Them</p>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${result.their_score}%` }}
                  />
                </div>
                <p className="text-center font-bold mt-1">{result.their_score}%</p>
              </div>
            </div>
            
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-1">The Verdict:</p>
              <p className="text-foreground font-medium">{result.verdict}</p>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Roast for Both of You:</p>
              <p className="text-foreground italic">"{result.roast_both}"</p>
            </div>
          </div>
        </ShareableCard>
      )}
    </div>
  );
};

// ==================== SHAREABLE CARD COMPONENT ====================
const ShareableCard = React.forwardRef(({ type, title, icon, children, inputPreview, resultData }, ref) => {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0f172a'
      });
      
      const link = document.createElement('a');
      link.download = `judgygpt-${type}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
    setDownloading(false);
  };

  const shareToTwitter = () => {
    const text = type === 'roast' 
      ? "Just got my bio roasted by @JudgyGPT 🔥 The AI said what my friends were too nice to say..."
      : type === 'redflag'
      ? "I ran that conversation through @JudgyGPT's Red Flag Detector... 🚩 Let's just say I have some thinking to do"
      : "Asked @JudgyGPT to settle an argument... The verdict is IN ⚖️";
    
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://judgygptonline.com/tools')}`;
    window.open(url, '_blank');
  };

  const copyShareText = () => {
    const text = type === 'roast' 
      ? "Just got roasted by JudgyGPT! 🔥 Try it: judgygptonline.com/tools"
      : type === 'redflag'
      ? "JudgyGPT found all the red flags I was ignoring 🚩 Check yours: judgygptonline.com/tools"
      : "JudgyGPT settled our argument! ⚖️ Who's right? judgygptonline.com/tools";
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWall = async () => {
    if (!inputPreview || !resultData) return;
    setSharing(true);
    try {
      await axios.post(`${API}/community/share`, {
        post_type: type,
        input_preview: inputPreview,
        result_data: resultData,
        share_public: true,
        display_name: "Anonymous"
      });
      setShared(true);
    } catch (error) {
      console.error('Share to wall failed:', error);
    }
    setSharing(false);
  };

  return (
    <div className="space-y-4">
      {/* The shareable card */}
      <div 
        ref={cardRef}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
            <img src={JUDGY_LOGO} alt="JudgyGPT" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-white">JudgyGPT</p>
            <p className="text-xs text-slate-400">judgygptonline.com</p>
          </div>
          <div className="ml-auto">{icon}</div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        
        <div className="text-slate-200">
          {children}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
          <p className="text-xs text-slate-500">Share your results!</p>
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            judgygptonline.com/tools
          </Badge>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Share to Judgment Wall - Primary CTA */}
        <Button 
          onClick={shareToWall} 
          className="gradient-primary"
          size="sm" 
          disabled={sharing || shared}
        >
          {sharing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Posting...
            </>
          ) : shared ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              On the Wall!
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Post to Wall
            </>
          )}
        </Button>

        <Button onClick={downloadImage} variant="outline" size="sm" disabled={downloading}>
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Save Image
        </Button>
        
        <Button onClick={shareToTwitter} variant="outline" size="sm">
          <Twitter className="w-4 h-4 mr-2" />
          Share on X
        </Button>
        
        <Button onClick={copyShareText} variant="outline" size="sm">
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </>
          )}
        </Button>
      </div>
    </div>
  );
});

ShareableCard.displayName = 'ShareableCard';

export default ViralToolsPage;
