// frontend/src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';

// Import necessary components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashBoardPage';
import VideoDetailPage from './pages/VideoDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* The LandingPage is now the main entry point for all non-app routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Main Application Routes (with AppBar Layout) */}
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="videos/:id" element={<VideoDetailPage />} />
      </Route>
      
      {/* Fallback for any path that doesn't match */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;