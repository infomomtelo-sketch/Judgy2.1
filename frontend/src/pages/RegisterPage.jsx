import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, User, AlertCircle, Check } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

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
      await register(name, email, password);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    '5 free roasts daily',
    'Brutally honest advice',
    'Upgrade anytime'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#FF2E4C] flex items-center justify-center mb-4">
            <span className="font-display font-black text-3xl text-white">J</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">THE JUDGY</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-wider mt-1">Create Account</p>
        </div>

        <div className="bg-[#141414] border border-zinc-800 p-8">
          <h2 className="font-display text-xl font-bold text-white text-center mb-2">Join The Judgment</h2>
          <p className="text-zinc-500 text-sm text-center mb-6">
            Start with our free plan today
          </p>

          {/* Benefits */}
          <div className="bg-[#0A0A0A] border border-zinc-800 p-4 mb-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-zinc-400 py-1">
                <Check className="w-4 h-4 text-[#FF2E4C] shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-400 text-xs uppercase tracking-wider">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-[#0A0A0A] border-zinc-800 text-white placeholder:text-zinc-600 focus:border-[#FF2E4C] h-12"
                  required
                  data-testid="register-name"
                />
              </div>
            </div>
            
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
                  data-testid="register-email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-400 text-xs uppercase tracking-wider">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#0A0A0A] border-zinc-800 text-white placeholder:text-zinc-600 focus:border-[#FF2E4C] h-12"
                  required
                  data-testid="register-password"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-400 text-xs uppercase tracking-wider">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-[#0A0A0A] border-zinc-800 text-white placeholder:text-zinc-600 focus:border-[#FF2E4C] h-12"
                  required
                  data-testid="register-confirm-password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#FF2E4C] hover:bg-[#E01F3D] text-white shadow-brutal h-12 font-bold uppercase tracking-wider"
              disabled={loading}
              data-testid="register-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            
            <p className="text-sm text-zinc-500 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF2E4C] hover:text-white font-bold transition-colors">
                Sign in
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

export default RegisterPage;
