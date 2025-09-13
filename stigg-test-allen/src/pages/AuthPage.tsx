import React from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();

  const handleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google', // You can replace 'google' with other providers like 'github', 'facebook', etc.
    });

    if (error) {
      console.error('Authentication error:', error.message);
    } else {
      // Redirect to the LoggedIn page after successful login
      navigate('/loggedin');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Demo Page</h1>
      <button onClick={handleAuth} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Log In / Sign Up
      </button>
    </div>
  );
};

export default AuthPage;