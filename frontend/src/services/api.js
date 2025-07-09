// frontend/src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

const publicApi = axios.create({ baseURL: API_BASE_URL });
const privateApi = axios.create({ baseURL: API_BASE_URL });

// --- Request Interceptor (Adds the token to outgoing requests) ---
privateApi.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.access) {
      config.headers['Authorization'] = `Bearer ${user.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- NEW: Response Interceptor (Handles 401 errors and token refresh) ---
privateApi.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the error is a 401 and we haven't already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request so we don't loop infinitely

      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const refreshToken = storedUser?.refresh;
        
        if (!refreshToken) {
            // If no refresh token, we can't do anything. Logout user.
            localStorage.removeItem('user');
            window.location.href = '/';
            return Promise.reject(error);
        }

        // Use the public instance to get a new access token
        const response = await publicApi.post('/token/refresh/', { refresh: refreshToken });
        const newAccessToken = response.data.access;

        // Update the stored user with the new access token
        storedUser.access = newAccessToken;
        localStorage.setItem('user', JSON.stringify(storedUser));

        // Update the header for the original request that failed
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return privateApi(originalRequest);
        
      } catch (refreshError) {
        // If the refresh token is also invalid, logout the user
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    // For any other error, just pass it along
    return Promise.reject(error);
  }
);


// --- API Functions ---
export const login = (username, password) => {
  return publicApi.post('/token/', { username, password })
    .then(response => response.data);
};

export const register = (username, email, password) => {
  return publicApi.post('/register/', { username, email, password });
};

// Video Functions
export const getVideos = () => privateApi.get('/videos/');
export const addVideo = (title, video_url, source) => privateApi.post('/videos/', { title, video_url, source });
export const getVideoById = (id) => privateApi.get(`/videos/${id}/`);
export const updateVideo = (id, title) => privateApi.patch(`/videos/${id}/`, { title });
export const deleteVideo = (id) => privateApi.delete(`/videos/${id}/`);

// Note Functions
export const addNote = (videoId, content, timestamp) => privateApi.post('/notes/', { video: videoId, content, timestamp });
export const updateNote = (id, content) => privateApi.patch(`/notes/${id}/`, { content });
export const deleteNote = (id) => privateApi.delete(`/notes/${id}/`);