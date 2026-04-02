import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/chat';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#FF2E4C] flex items-center justify-center mb-4">
            <span className="font-display font-black text-3xl text-white">J</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">THE JUDGY</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-wider mt-1">Sign In</p>
        </div>

        <div className="bg-[#141414] border border-zinc-800 p-8">
          <h2 className="font-display text-xl font-bold text-white text-center mb-2">Welcome Back</h2>
          <p className="text-zinc-500 text-sm text-center mb-8">
            Enter your credentials to continue
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-wider">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[#0A0A0A] border-zinc-800 text-white placeholder:text-zinc-600 focus:border-[#FF2E4C] h-12"
                  required
                  data-testid="login-email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-400 text-xs uppercase tracking-wider">Password</Label>
                <Link to="/forgot-password" className="text-xs text-[#FF2E4C] hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#0A0A0A] border-zinc-800 text-white placeholder:text-zinc-600 focus:border-[#FF2E4C] h-12"
                  required
                  data-testid="login-password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#FF2E4C] hover:bg-[#E01F3D] text-white shadow-brutal h-12 font-bold uppercase tracking-wider"
              disabled={loading}
              data-testid="login-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <p className="text-sm text-zinc-500 text-center">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[#FF2E4C] hover:text-white font-bold transition-colors">
                Sign up
              </Link>
            </p>
            
            <Link to="/pricing" className="block text-sm text-zinc-600 hover:text-zinc-400 text-center transition-colors">
              View pricing plans
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
