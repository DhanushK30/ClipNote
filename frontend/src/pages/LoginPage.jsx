// frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, TextField, Box, Typography, Container, Alert, Paper, Link } from '@mui/material';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the path the user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || "/app/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await login(username, password);
      // After successful login, navigate to the page they were trying to go to
      navigate(from, { replace: true });
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">Sign in</Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
            {message && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{message}</Alert>}
            <Box mt={1} textAlign="center">
              <Link component={RouterLink} to="/register" variant="body2">{"Don't have an account? Sign Up"}</Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;