// src/services/authService.js
import axios from 'axios';
import api from './api'; // We'll still need this later for token refresh


const API_URL = 'http://127.0.0.1:8000/api/';

const register = (username, email, password) => {
  return axios.post(API_URL + 'register/', {
    username,
    email,
    password,
  });
};

// --- ADD THIS NEW FUNCTION ---
const login = (username, password) => {
  // It now just makes the request and returns the whole response
  return axios.post(API_URL + 'token/', {
    username,
    password,
  }).then(response => response.data); // Return only the data part of the response
};
// ----------------------------

// We will add a logout function later
const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
  register,
  login, // Export the new function
  logout,
};

export default authService;