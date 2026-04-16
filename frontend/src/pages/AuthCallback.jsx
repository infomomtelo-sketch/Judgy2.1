import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUserAndToken } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Get session_id from URL fragment
        const hash = window.location.hash;
        const sessionId = hash.split('session_id=')[1]?.split('&')[0];

        if (!sessionId) {
          console.error('No session_id found');
          navigate('/login');
          return;
        }

        // Exchange session_id for user data
        const response = await axios.post(`${API}/auth/google/callback`, {
          session_id: sessionId
        });

        const { access_token, user } = response.data;

        // Store token and user
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update auth context
        if (setUserAndToken) {
          setUserAndToken(user, access_token);
        }

        // Clear the hash and redirect to chat
        window.history.replaceState({}, '', '/chat');
        navigate('/chat', { replace: true, state: { user } });
        
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };

    processAuth();
  }, [navigate, setUserAndToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF2E4C] mx-auto mb-4" />
        <p className="text-zinc-400 font-mono text-sm uppercase tracking-wider">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
