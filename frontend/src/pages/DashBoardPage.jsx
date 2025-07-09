// frontend/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getVideos, addVideo, updateVideo, deleteVideo } from '../services/api';

// Import all necessary MUI components
import { 
  Paper, Box, Typography, TextField, Button, Alert, List, ListItem, ListItemText, 
  Divider, Link, IconButton, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, CircularProgress, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function DashboardPage() {
  const [videos, setVideos] = useState([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getVideos();
      setVideos(response.data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      setMessage('Could not load your videos.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newVideoTitle.trim()) {
      setMessage('Please enter a title for the video.');
      return;
    }
    try {
      let source = 'unknown';
      if (newVideoUrl.includes('youtube.com')) source = 'youtube';
      await addVideo(newVideoTitle, newVideoUrl, source);
      setNewVideoUrl('');
      setNewVideoTitle('');
      fetchVideos();
      setMessage('Video added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Failed to add video:", error);
      setMessage('Failed to add video. Please provide a valid URL.');
    }
  };
  
  const handleEditClick = (video) => {
    setEditingVideoId(video.id);
    setEditingTitle(video.title);
  };

  const handleEditCancel = () => {
    setEditingVideoId(null);
  };

  const handleSaveClick = async (videoId) => {
    if (!editingTitle.trim()) return;
    try {
      await updateVideo(videoId, editingTitle);
      setEditingVideoId(null);
      fetchVideos();
    } catch (error) {
      console.error("Failed to update video:", error);
      setMessage('Could not update video title.');
    }
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setVideoToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return;
    try {
      await deleteVideo(videoToDelete.id);
      fetchVideos();
    } catch (error) {
      console.error("Failed to delete video:", error);
      setMessage('Could not delete video.');
    } finally {
      handleDialogClose();
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Video Dashboard
      </Typography>
      
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: '12px' }}>
        <Typography variant="h6" gutterBottom>Add a New Video</Typography>
        <Box component="form" onSubmit={handleAddVideo} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            variant="outlined" label="Video Title" fullWidth
            value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} required
          />
          <TextField
            variant="outlined" label="Video URL" fullWidth
            value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} required type="url"
          />
          <Button type="submit" variant="contained" size="large" sx={{ alignSelf: 'flex-start' }}>
            Add Video
          </Button>
        </Box>
      </Paper>
      
      {message && <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{message}</Alert>}

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Your Videos
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
      ) : videos.length > 0 ? (
        <Paper elevation={3} sx={{ borderRadius: '12px' }}>
          <List>
            {videos.map((video, index) => (
              <React.Fragment key={video.id}>
                <ListItem
                  secondaryAction={
                    editingVideoId === video.id ? (
                      <Box>
                        <Tooltip title="Save">
                          <IconButton onClick={() => handleSaveClick(video.id)}><SaveIcon color="primary" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton onClick={handleEditCancel} sx={{ ml: 1 }}><CancelIcon /></IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Box>
                        <Tooltip title="Edit Title">
                          <IconButton onClick={() => handleEditClick(video)}><EditIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Video">
                          <IconButton onClick={() => handleDeleteClick(video)} sx={{ ml: 1 }}><DeleteIcon color="error" /></IconButton>
                        </Tooltip>
                      </Box>
                    )
                  }
                >
                  {editingVideoId === video.id ? (
                    <TextField 
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      variant="standard" fullWidth autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveClick(video.id); }}
                    />
                  ) : (
                    <ListItemText 
                      primary={
                        <Link component={RouterLink} to={`/app/videos/${video.id}`} underline="hover" sx={{ fontWeight: '500' }}>
                          {video.title}
                        </Link>
                      }
                      secondary={`Source: ${video.source}`}
                    />
                  )}
                </ListItem>
                {index < videos.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          You haven't added any videos yet. Add one above to get started!
        </Typography>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Delete Video?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the video titled "{videoToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardPage;