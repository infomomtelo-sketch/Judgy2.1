import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { isDark, toggleTheme } = useTheme();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerifying(false);
        return;
      }

      try {
        const response = await axios.get(`${API}/auth/verify-reset-token/${token}`);
        setTokenValid(true);
        setEmail(response.data.email);
      } catch (err) {
        setTokenValid(false);
        setError(err.response?.data?.detail || 'Invalid or expired reset link');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/auth/reset-password`, {
        token,
        new_password: password
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ThemeToggle = () => (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="fixed top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted" data-testid="theme-toggle">
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <ThemeToggle />
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF2E4C] mx-auto mb-4" />
          <p className="text-muted-foreground text-sm uppercase tracking-wider">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!token || !tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <ThemeToggle />
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-destructive/10 border border-destructive/30 flex items-center justify-center rounded-sm mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Invalid Link</h1>
            <p className="text-muted-foreground text-sm text-center mt-2 max-w-xs">
              {error || 'This password reset link is invalid or has expired.'}
            </p>
          </div>

          <div className="bg-card border border-border p-8 space-y-4 rounded-lg shadow-elegant">
            <Link to="/forgot-password" className="block">
              <Button className="w-full bg-[#FF2E4C] hover:bg-[#E01F3D] h-12 font-bold uppercase tracking-wider">
                Request New Link
              </Button>
            </Link>
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <ThemeToggle />
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-success/10 border border-success/30 flex items-center justify-center rounded-sm mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Password Reset!</h1>
            <p className="text-muted-foreground text-sm text-center mt-2 max-w-xs">
              Your password has been updated. You can now log in.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-lg shadow-elegant">
            <Link to="/login" className="block">
              <Button className="w-full bg-[#FF2E4C] hover:bg-[#E01F3D] h-12 font-bold uppercase tracking-wider">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <ThemeToggle />
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#FF2E4C] flex items-center justify-center rounded-sm mb-4">
            <span className="font-display font-bold text-3xl text-white">J</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">THE JUDGY</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-wider mt-1">Reset Password</p>
        </div>

        <div className="bg-card border border-border p-8 rounded-lg shadow-elegant">
          <h2 className="font-display text-xl font-bold text-foreground text-center mb-2">New Password</h2>
          <p className="text-muted-foreground text-sm text-center mb-8">
            Enter a new password for <strong className="text-foreground">{email}</strong>
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground text-xs uppercase tracking-wider">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-[#FF2E4C] h-12"
                  required
                  minLength={6}
                  data-testid="reset-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-muted-foreground text-xs uppercase tracking-wider">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-[#FF2E4C] h-12"
                  required
                  minLength={6}
                  data-testid="reset-confirm-password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#FF2E4C] hover:bg-[#E01F3D] text-white h-12 font-bold uppercase tracking-wider"
              disabled={loading}
              data-testid="reset-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
            
            <div className="text-center">
              <Link to="/login" className="text-sm text-[#FF2E4C] hover:text-foreground transition-colors">
                <ArrowLeft className="w-3 h-3 inline mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
