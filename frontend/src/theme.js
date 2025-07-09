// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgb(41, 67, 215)', // The blue color used for AppBars, buttons, etc.
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    // --- ADD THIS NEW PROPERTY ---
    // Define the gradient from the landing page design
    landingGradient: 'linear-gradient(135deg,rgb(41, 67, 215) 40%,rgb(175, 84, 235) 100%)',
  },
  typography: {
    fontFamily: 'Helvetica, Roboto, Arial, sans-serif',
  },
});

export default theme;