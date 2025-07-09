// frontend/src/pages/VideoDetailPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import { getVideoById, addNote, updateNote, deleteNote } from '../services/api';
import { formatTime } from '../utils/formatTime';

import { 
  Box, Typography, List, ListItem, ListItemText, Chip, Button, TextField, 
  CircularProgress, Alert, IconButton, Switch, FormControlLabel, Paper, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function VideoDetailPage() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  
  const [newNoteContent, setNewNoteContent] = useState('');
  const [message, setMessage] = useState('');
  const playerRef = useRef(null);

  const [isNoteEditMode, setIsNoteEditMode] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');

  const fetchVideo = async () => {
    try {
      const response = await getVideoById(id);
      setVideo(response.data);
    } catch (err) {
      setError('Failed to load video data.');
      console.error(err);
    } finally {
      if(loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);
  
  const handleAddNote = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newNoteContent.trim()) {
      setMessage('Note content cannot be empty.');
      return;
    }
    if (!playerRef.current) {
        setMessage('Player is not ready yet.');
        return;
    }
    try {
      const currentTime = playerRef.current.getCurrentTime();
      await addNote(video.id, newNoteContent, currentTime);
      setNewNoteContent('');
      setMessage('Note added successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchVideo(); 
    } catch (err) {
      setMessage('Failed to add note.');
      console.error('Add note error:', err);
    }
  };

  const handleTimestampClick = (timeInSeconds) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timeInSeconds, 'seconds');
    }
  };

  const handleNoteEditClick = (note) => {
    setEditingNoteId(note.id);
    setEditingNoteContent(note.content);
  };

  const handleNoteEditCancel = () => {
    setEditingNoteId(null);
  };

  const handleNoteSave = async () => {
    if (!editingNoteContent.trim() || !editingNoteId) return;
    try {
      await updateNote(editingNoteId, editingNoteContent);
      setEditingNoteId(null);
      fetchVideo();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleNoteDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(noteId);
        fetchVideo();
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!video) return <Typography>Video not found.</Typography>;

  return (
    <Box>
      <Button 
        component={RouterLink} 
        to="/app/dashboard"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>{video.title}</Typography>
      
      <Paper elevation={3} sx={{ position: 'relative', paddingTop: '56.25%', mb: 4, borderRadius: '12px', overflow: 'hidden' }}>
        <ReactPlayer
          ref={playerRef}
          url={video.video_url}
          controls={true}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
           config={{
            youtube: {
              playerVars: {
                // This tells the YouTube player where our app is hosted
                origin: window.location.origin 
              }
            }
          }}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: '12px' }}>
        <Typography variant="h6" gutterBottom>Add a Note</Typography>
        <Box component="form" onSubmit={handleAddNote}>
          <TextField
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Type your note here..."
            fullWidth multiline rows={3} variant="outlined" sx={{ mb: 1 }}
          />
          <Button type="submit" variant="contained">Add Note at Current Time</Button>
        </Box>
      </Paper>

      {message && <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mt: 2, mb: 2 }}>{message}</Alert>}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2">Notes</Typography>
        <FormControlLabel
          control={<Switch checked={isNoteEditMode} onChange={(e) => setIsNoteEditMode(e.target.checked)} />}
          label="Edit Notes"
        />
      </Box>
      
      {video.notes && video.notes.length > 0 ? (
        <Paper elevation={3} sx={{ borderRadius: '12px', mt: 2 }}>
          <List>
            {video.notes
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((note, index) => (
                <React.Fragment key={note.id}>
                  <ListItem
                    secondaryAction={
                      isNoteEditMode && (
                        <Box>
                          <IconButton onClick={() => handleNoteEditClick(note)}><EditIcon fontSize="small" /></IconButton>
                          <IconButton onClick={() => handleNoteDelete(note.id)} sx={{ ml: 1 }}><DeleteIcon fontSize="small" color="error" /></IconButton>
                        </Box>
                      )
                    }
                  >
                    <Chip
                      label={formatTime(note.timestamp)}
                      onClick={() => handleTimestampClick(note.timestamp)}
                      sx={{ mr: 2, cursor: 'pointer', fontWeight: 'bold' }}
                      color="primary"
                    />
                    {editingNoteId === note.id ? (
                      <TextField
                        value={editingNoteContent}
                        onChange={(e) => setEditingNoteContent(e.target.value)}
                        variant="standard" fullWidth autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleNoteSave(); }}
                        onBlur={handleNoteSave}
                      />
                    ) : (
                      <ListItemText primary={note.content} />
                    )}
                  </ListItem>
                  {index < video.notes.length - 1 && <Divider />}
                </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          No notes for this video yet.
        </Typography>
      )}
    </Box>
  );
}

export default VideoDetailPage;