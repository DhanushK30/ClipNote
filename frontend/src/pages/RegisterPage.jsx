// frontend/src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Import MUI Components
import { Button, TextField, Box, Typography, Container, Alert, Paper, Link } from '@mui/material';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await register(username, email, password);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
        // ... (your existing error handling logic)
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Sign Up for ClipNote
          </Typography>
          <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal" required fullWidth id="username" label="Username"
              name="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal" required fullWidth id="email" label="Email Address"
              name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal" required fullWidth name="password" label="Password"
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            {message && (
                <Alert severity={message.includes('successful') ? 'success' : 'error'} sx={{ mt: 2, width: '100%' }}>{message}</Alert>
            )}
            <Box mt={1} textAlign="center">
                <Link component={RouterLink} to="/login" variant="body2">
                    {"Already have an account? Sign In"}
                </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;