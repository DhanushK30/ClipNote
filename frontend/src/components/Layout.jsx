// frontend/src/components/Layout.jsx

import React from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { AppBar, Box, Toolbar, Typography, Button, Container } from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to landing page after logout
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <NotesIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* The main logo/title links to the dashboard if logged in, otherwise to the landing page */}
            <RouterLink to={user ? "/app/dashboard" : "/"} style={{ textDecoration: 'none', color: 'inherit' }}>
              ClipNote
            </RouterLink>
          </Typography>
          
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* The main content area is now wider */}
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
      
      <Box component="footer" sx={{ p: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © ClipNote '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;