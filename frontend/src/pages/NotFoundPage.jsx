// src/pages/NotFoundPage.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';

function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h5">Page Not Found</Typography>
      <Typography>The page you are looking for does not exist.</Typography>
    </Box>
  );
}

export default NotFoundPage;