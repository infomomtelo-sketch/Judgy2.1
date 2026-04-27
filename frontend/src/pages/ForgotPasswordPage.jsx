import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Loader2, CheckCircle2, AlertCircle, Sun, Moon } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="fixed top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted" data-testid="theme-toggle">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-success/10 border border-success/30 flex items-center justify-center rounded-sm mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Check Your Email</h1>
            <p className="text-muted-foreground text-sm text-center mt-2 max-w-xs">
              If an account exists for <strong className="text-foreground">{email}</strong>, we've sent a password reset link.
            </p>
          </div>

          <div className="bg-card border border-border p-8 space-y-4 rounded-lg shadow-elegant">
            <p className="text-sm text-muted-foreground text-center">
              The link expires in 1 hour. Check your spam folder if you don't see it.
            </p>
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full h-12">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Button variant="ghost" size="icon" onClick={toggleTheme} className="fixed top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted" data-testid="theme-toggle">
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#FF2E4C] flex items-center justify-center rounded-sm mb-4">
            <span className="font-display font-bold text-3xl text-white">J</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">THE JUDGY</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-wider mt-1">Forgot Password</p>
        </div>

        <div className="bg-card border border-border p-8 rounded-lg shadow-elegant">
          <h2 className="font-display text-xl font-bold text-foreground text-center mb-2">Reset Password</h2>
          <p className="text-muted-foreground text-sm text-center mb-8">
            Enter your email and we'll send you a reset link.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground text-xs uppercase tracking-wider">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-[#FF2E4C] h-12"
                  required
                  data-testid="forgot-email"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#FF2E4C] hover:bg-[#E01F3D] text-white h-12 font-bold uppercase tracking-wider"
              disabled={loading}
              data-testid="forgot-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              Remember your password?{' '}
              <Link to="/login" className="text-[#FF2E4C] hover:text-foreground font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
