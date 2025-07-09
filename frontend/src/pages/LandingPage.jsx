// src/pages/LandingPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin, register as apiRegister } from '../services/api';

import { Box, Button, Typography, Stack, TextField, Alert, Link } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

// A reusable form component for both login and register
const AuthForm = ({ isRegister, onSubmit, message, onSwitchMode }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only pass email if it's a registration form
    onSubmit({ username, password, email: isRegister ? email : undefined });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h4" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
        {isRegister ? 'Create Your Account' : 'Welcome Back!'}
      </Typography>

      <TextField
        label="Username"
        variant="filled"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputProps={{ sx: { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' } }}
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
      />

      {isRegister && (
        <TextField
          label="Email Address"
          type="email"
          variant="filled"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{ sx: { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' } }}
          InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
        />
      )}

      <TextField
        label="Password"
        type="password"
        variant="filled"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{ sx: { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' } }}
        InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        sx={{
          mt: 2,
          py: 1.5,
          backgroundColor: 'white',
          color: '#662D8C',
          fontWeight: 'bold',
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
      >
        {isRegister ? 'Sign Up' : 'Sign In'}
      </Button>

      {message && (
        <Alert
          severity={message.includes('successful') ? 'success' : 'error'}
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}

      <Box mt={2} textAlign="center">
        <Link
          component="button"
          type="button"
          onClick={onSwitchMode}
          variant="body2"
          sx={{ color: 'rgba(255,255,255,0.8)', textTransform: 'none' }}
        >
          {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Link>
      </Box>
    </Box>
  );
};


function LandingPage() {
  const [mode, setMode] = useState('landing');
  const [message, setMessage] = useState('');

  const { login: contextLogin } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async ({ username, password }) => {
    setMessage('');
    try {
      await contextLogin(username, password);
      navigate('/app/dashboard');
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async ({ username, email, password }) => {
    setMessage('');
    try {
      await apiRegister(username, email, password);
      setMessage('Registration successful! Please sign in.');
      setMode('login');
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        background: (theme) => theme.palette.landingGradient,
        overflow: 'hidden',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', width: '100%', flexDirection: { xs: 'column-reverse', md: 'row' } }}>
        
        {/* --- Left Column (Illustration) --- */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: { xs: 'none', md: 'flex' }, // Hide on mobile for better usability
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Box sx={{
            position: 'absolute', width: '180px', height: '180px',
            borderRadius: '50%', backgroundColor: 'rgba(237, 30, 121, 0.5)',
            transform: 'translate(-60%, -50%)', display: 'flex',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <YouTubeIcon sx={{ fontSize: 90, color: 'white' }} />
          </Box>
          <Box sx={{
            position: 'absolute', width: '220px', height: '220px',
            borderRadius: '50%', backgroundColor: 'rgba(237, 30, 121, 0.6)',
            transform: 'translate(55%, -35%)', display: 'flex',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <FacebookIcon sx={{ fontSize: 100, color: 'white' }} />
          </Box>
          <Box sx={{
            position: 'absolute', width: '150px', height: '150px',
            borderRadius: '50%', backgroundColor: 'rgba(237, 30, 121, 0.4)',
            transform: 'translate(0%, 70%)', display: 'flex',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <TwitterIcon sx={{ fontSize: 80, color: 'white' }} />
          </Box>
        </Box>

        {/* --- Right Column (Content) --- */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: { xs: 2, sm: 4 },
          }}
        >
          {mode === 'landing' && (
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: '500px' }}>
              <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold', fontSize: { xs: '3.5rem', md: '5.5rem' }, lineHeight: 1.1 }}>
                ClipNote
              </Typography>
              <Typography variant="h6" component="p" sx={{ mt: 2, mb: 4, opacity: 0.9 }}>
                Bookmark your moments. 
                <br />
                Transform any video into a library of timestamped notes.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  onClick={() => setMode('login')}
                  variant="contained"
                  sx={{ py: 1.5, px: 4, backgroundColor: 'white', color: '#662D8C', fontWeight: 'bold', '&:hover': { backgroundColor: '#f0f0f0' } }}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setMode('register')}
                  variant="outlined"
                  sx={{ py: 1.5, px: 4, borderColor: 'white', color: 'white', '&:hover': { borderColor: '#f0f0f0', backgroundColor: 'rgba(255,255,255,0.1)' } }}
                >
                  Register Now
                </Button>
              </Stack>
            </Box>
          )}

          {mode === 'login' && (
            <AuthForm
              isRegister={false}
              onSubmit={handleLoginSubmit}
              message={message}
              onSwitchMode={() => { setMode('register'); setMessage(''); }}
            />
          )}
          
          {mode === 'register' && (
            <AuthForm
              isRegister={true}
              onSubmit={handleRegisterSubmit}
              message={message}
              onSwitchMode={() => { setMode('login'); setMessage(''); }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default LandingPage;