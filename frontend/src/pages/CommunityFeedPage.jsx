import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Flame, 
  AlertTriangle, 
  Scale, 
  Skull, 
  Laugh, 
  Flag,
  TrendingUp,
  Clock,
  Star,
  Loader2,
  Share2,
  MessageSquare,
  Eye,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// JudgyGPT Logo
const JUDGY_LOGO = "https://customer-assets.emergentagent.com/job_chat-assist-26/artifacts/ze789p6s_7DEC28F8-D66A-46B0-99EA-84F4FF846DBB.png";

const CommunityFeedPage = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState('hot');
  const [filter, setFilter] = useState(null);
  const observerRef = useRef();
  const loadMoreRef = useRef();

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: 15,
        sort: sort
      });
      if (filter) params.append('post_type', filter);

      const response = await axios.get(`${API}/community/feed?${params}`);
      const data = response.data;

      if (append) {
        setPosts(prev => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setHasMore(data.has_more);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sort, filter]);

  // Initial load and when sort/filter changes
  useEffect(() => {
    setPage(1);
    fetchPosts(1, false);
  }, [sort, filter, fetchPosts]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage(prev => {
            const nextPage = prev + 1;
            fetchPosts(nextPage, true);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loading, fetchPosts]);

  const handleReaction = async (postId, reactionType) => {
    try {
      await axios.post(`${API}/community/react/${postId}`, {
        post_id: postId,
        reaction: reactionType
      });
      
      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              [reactionType]: (post.reactions[reactionType] || 0) + 1
            }
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };

  const getPostIcon = (type) => {
    switch (type) {
      case 'roast': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'redflag': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'verdict': return <Scale className="w-5 h-5 text-purple-500" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getPostTypeLabel = (type) => {
    switch (type) {
      case 'roast': return 'Bio Roast';
      case 'redflag': return 'Red Flag Check';
      case 'verdict': return 'Verdict';
      default: return 'Post';
    }
  };

  const getPostColor = (type) => {
    switch (type) {
      case 'roast': return 'border-orange-500/30 bg-orange-500/5';
      case 'redflag': return 'border-red-500/30 bg-red-500/5';
      case 'verdict': return 'border-purple-500/30 bg-purple-500/5';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-glow">
              <img src={JUDGY_LOGO} alt="JudgyGPT" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold text-foreground">JudgyGPT</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link to="/tools">
              <Button variant="outline" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Create
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/register">
                <Button className="gradient-primary" size="sm">Sign Up</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-8 px-4 text-center border-b border-border">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
          The Judgment Wall 🔥
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Real roasts. Real red flags. Real verdicts. All anonymous. All savage.
        </p>
        
        <div className="flex justify-center mt-6">
          <Link to="/tools">
            <Button className="gradient-primary">
              Get Your Judgment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Filters & Sort */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Sort Tabs */}
          <Tabs value={sort} onValueChange={setSort}>
            <TabsList>
              <TabsTrigger value="hot" className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Hot</span>
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
              </TabsTrigger>
              <TabsTrigger value="top" className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Top</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Type Filter */}
          <div className="flex gap-2">
            <Button 
              variant={filter === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter(null)}
            >
              All
            </Button>
            <Button 
              variant={filter === 'roast' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('roast')}
              className={filter === 'roast' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            >
              <Flame className="w-4 h-4 mr-1" />
              Roasts
            </Button>
            <Button 
              variant={filter === 'redflag' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('redflag')}
              className={filter === 'redflag' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Flags
            </Button>
            <Button 
              variant={filter === 'verdict' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('verdict')}
              className={filter === 'verdict' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            >
              <Scale className="w-4 h-4 mr-1" />
              Verdicts
            </Button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🦗</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet!</h3>
            <p className="text-muted-foreground mb-6">Be the first to share your judgment</p>
            <Link to="/tools">
              <Button className="gradient-primary">
                Create & Share
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onReaction={handleReaction}
                getPostIcon={getPostIcon}
                getPostTypeLabel={getPostTypeLabel}
                getPostColor={getPostColor}
              />
            ))}

            {/* Load more trigger */}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {loadingMore && (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              )}
              {!hasMore && posts.length > 0 && (
                <p className="text-muted-foreground text-sm">You've seen it all! 👀</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link to="/tools">
          <Button size="lg" className="gradient-primary shadow-lg rounded-full h-14 px-6">
            <Sparkles className="w-5 h-5 mr-2" />
            Get Judged
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Individual Post Card Component
const PostCard = ({ post, onReaction, getPostIcon, getPostTypeLabel, getPostColor }) => {
  const [showFullResult, setShowFullResult] = useState(false);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const renderResultPreview = () => {
    const { result_data, post_type } = post;
    
    if (post_type === 'roast') {
      return (
        <div className="space-y-3">
          <p className="text-foreground">{result_data.roast}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Cringe:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Flame 
                  key={i} 
                  className={`w-4 h-4 ${i < result_data.rating ? 'text-orange-500' : 'text-muted'}`} 
                />
              ))}
            </div>
          </div>
          {showFullResult && result_data.improved_bio && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Glow-up version:</p>
              <p className="text-sm text-foreground">{result_data.improved_bio}</p>
            </div>
          )}
        </div>
      );
    }
    
    if (post_type === 'redflag') {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Danger Level:</span>
            <span className={`font-bold ${
              result_data.danger_level <= 3 ? 'text-green-500' :
              result_data.danger_level <= 6 ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {result_data.danger_level}/10
            </span>
          </div>
          <p className="text-foreground font-medium">{result_data.verdict}</p>
          {showFullResult && (
            <>
              <ul className="space-y-1">
                {result_data.red_flags?.slice(0, 3).map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span>🚩</span>
                    <span className="text-foreground">{flag}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground italic">"{result_data.advice}"</p>
            </>
          )}
        </div>
      );
    }
    
    if (post_type === 'verdict') {
      return (
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Winner:</p>
            <p className="text-xl font-bold text-foreground">{result_data.winner}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex-1 text-center">
              <div className="font-semibold text-primary">{result_data.your_score}%</div>
              <div className="text-muted-foreground">Them</div>
            </div>
            <span className="text-muted-foreground">vs</span>
            <div className="flex-1 text-center">
              <div className="font-semibold text-accent">{result_data.their_score}%</div>
              <div className="text-muted-foreground">Other</div>
            </div>
          </div>
          {showFullResult && (
            <p className="text-sm text-foreground italic">"{result_data.roast_both}"</p>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className={`p-4 border-2 transition-all hover:shadow-lg ${getPostColor(post.post_type)}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getPostIcon(post.post_type)}
          <Badge variant="secondary" className="text-xs">
            {getPostTypeLabel(post.post_type)}
          </Badge>
          {post.is_featured && (
            <Badge className="bg-yellow-500/20 text-yellow-600 text-xs">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Eye className="w-3 h-3" />
          {post.view_count}
          <span>•</span>
          {formatTimeAgo(post.created_at)}
        </div>
      </div>

      {/* Input Preview */}
      <div className="mb-3 p-2 bg-muted/30 rounded text-sm text-muted-foreground">
        <span className="text-foreground font-medium">{post.display_name}:</span>{' '}
        "{post.input_preview}..."
      </div>

      {/* Result */}
      <div className="mb-4">
        {renderResultPreview()}
      </div>

      {/* Toggle & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowFullResult(!showFullResult)}
          className="text-xs"
        >
          {showFullResult ? 'Show less' : 'Show more'}
        </Button>

        {/* Reactions */}
        <div className="flex items-center gap-1">
          <ReactionButton 
            icon={<Flame className="w-4 h-4" />}
            count={post.reactions?.fire || 0}
            onClick={() => onReaction(post.id, 'fire')}
            activeColor="text-orange-500"
          />
          <ReactionButton 
            icon={<Skull className="w-4 h-4" />}
            count={post.reactions?.skull || 0}
            onClick={() => onReaction(post.id, 'skull')}
            activeColor="text-slate-400"
          />
          <ReactionButton 
            icon={<Laugh className="w-4 h-4" />}
            count={post.reactions?.laugh || 0}
            onClick={() => onReaction(post.id, 'laugh')}
            activeColor="text-yellow-500"
          />
          <ReactionButton 
            icon={<Flag className="w-4 h-4" />}
            count={post.reactions?.flag || 0}
            onClick={() => onReaction(post.id, 'flag')}
            activeColor="text-red-500"
            isReport
          />
        </div>
      </div>
    </Card>
  );
};

// Reaction Button Component
const ReactionButton = ({ icon, count, onClick, activeColor, isReport = false }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all ${
        clicked 
          ? `${activeColor} bg-current/10` 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      } ${isReport ? 'opacity-50 hover:opacity-100' : ''}`}
      title={isReport ? 'Report' : undefined}
    >
      {icon}
      {count > 0 && <span className="text-xs">{count}</span>}
    </button>
  );
};

export default CommunityFeedPage;
