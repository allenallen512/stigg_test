import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { StiggProvider } from '@stigg/react-sdk'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Pricing from './pages/Pricing'
import { getUsage, addTaskEvent, reportAPIUsage } from './api-methods'
import AuthPage from './pages/AuthPage'
import LoggedIn from './pages/LoggedIn'
import { supabase } from '../supabase';

function Home() {
  const CUSTOMER_ID = import.meta.env.VITE_CUSTOMER_ID
  const navigate = useNavigate()

  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showSignUpForm, setShowSignUpForm] = useState(false)

  // login form fields (email + password)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // signup form fields (email + password)
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  async function handleLoginEmailPassword(e) {
    e.preventDefault()
    if (!loginEmail || !loginPassword) return alert('Please provide email and password')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword
    })
    if (error) {
      console.error('Login error', error)
      alert('Login failed: ' + error.message)
      return
    }
    // signed in successfully
    navigate('/loggedin')
  }

  async function handleSignUp(e) {
    e.preventDefault()
    if (!signupEmail || !signupPassword) return alert('Please provide email and password')
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword
    })
    if (error) {
      console.error('Signup error', error)
      alert('Sign up failed: ' + error.message)
      return
    }
    alert('Sign up successful. Redirecting...')
    navigate('/loggedin')
  }

  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <h2>Demo Auth</h2>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
        <button onClick={() => { setShowLoginForm(true); setShowSignUpForm(false); }}>
          Log In
        </button>
        <button onClick={() => { setShowSignUpForm(true); setShowLoginForm(false); }}>
          Sign Up
        </button>
      </div>

      {showLoginForm && (
        <form onSubmit={handleLoginEmailPassword} style={{ display: 'inline-block', textAlign: 'left' }}>
          <div style={{ marginBottom: 8 }}>
            <label>Email</label><br />
            <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Password</label><br />
            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowLoginForm(false)}>Cancel</button>
            <button type="submit">Log In</button>
          </div>
        </form>
      )}

      {showSignUpForm && (
        <form onSubmit={handleSignUp} style={{ display: 'inline-block', textAlign: 'left' }}>
          <div style={{ marginBottom: 8 }}>
            <label>Email</label><br />
            <input value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Password</label><br />
            <input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowSignUpForm(false)}>Cancel</button>
            <button type="submit">Create Account</button>
          </div>
        </form>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/loggedin" element={<LoggedIn />} />
      </Routes>
    </Router>
  )
}

export default App
