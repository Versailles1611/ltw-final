/**
 * UserPhotos Component - Glassmorphism Style với Comment Input
 * Không sử dụng Emoji - Dùng Material UI Icons
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Paper,
  TextField,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import fetchModel from '../../lib/fetchModelData';

const IMAGE_BASE_URL = 'http://localhost:3001/images';
const API_BASE = 'http://localhost:3001';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function UserPhotos({ advancedFeatures, setContextText, user: currentUser }) {
  const [photos, setPhotos] = useState([]);
  const [photoOwner, setPhotoOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [commentTexts, setCommentTexts] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const getPhotoIndexFromHash = () => {
      const hash = location.hash;
      if (hash && hash.includes('photo=')) {
        const index = parseInt(hash.split('photo=')[1], 10);
        return isNaN(index) ? 0 : index;
      }
      return 0;
    };

    setLoading(true);
    setError(null);

    Promise.all([
      fetchModel(`/photosOfUser/${userId}`),
      fetchModel(`/user/${userId}`),
    ])
      .then(([photosData, userData]) => {
        setPhotos(photosData || []);
        setPhotoOwner(userData);
        setLoading(false);

        const indexFromHash = getPhotoIndexFromHash();
        if (indexFromHash >= 0 && indexFromHash < (photosData || []).length) {
          setCurrentPhotoIndex(indexFromHash);
        } else {
          setCurrentPhotoIndex(0);
        }

        if (setContextText && userData) {
          setContextText(`Photos of ${userData.first_name} ${userData.last_name}`);
        }
      })
      .catch((err) => {
        console.error('Error fetching photos:', err);
        setError('Cannot load photos');
        setLoading(false);
      });
  }, [userId, setContextText, location.hash]);

  const updateUrlHash = (index) => {
    navigate(`/photos/${userId}#photo=${index}`, { replace: true });
  };

  const handlePrevPhoto = () => {
    const newIndex = Math.max(0, currentPhotoIndex - 1);
    setCurrentPhotoIndex(newIndex);
    updateUrlHash(newIndex);
  };

  const handleNextPhoto = () => {
    const newIndex = Math.min(photos.length - 1, currentPhotoIndex + 1);
    setCurrentPhotoIndex(newIndex);
    updateUrlHash(newIndex);
  };

  // Handle Add Comment
  const handleAddComment = async (photoId) => {
    const commentText = commentTexts[photoId];
    if (!commentText || commentText.trim() === '') return;

    setSubmittingComment((prev) => ({ ...prev, [photoId]: true }));

    try {
      const response = await fetch(`${API_BASE}/commentsOfPhoto/${photoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ comment: commentText.trim() }),
      });

      const newComment = await response.json();

      if (!response.ok) {
        throw new Error(newComment.error || 'Failed to add comment');
      }

      // Update photos state with new comment
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (photo._id === photoId) {
            return {
              ...photo,
              comments: [...(photo.comments || []), newComment],
            };
          }
          return photo;
        })
      );

      // Clear input
      setCommentTexts((prev) => ({ ...prev, [photoId]: '' }));
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.message);
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [photoId]: false }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (photos.length === 0) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography color="text.secondary">This user has no photos yet</Typography>
      </Box>
    );
  }

  // Render Photo Card với Comment Input
  const renderPhotoCard = (photo, photoIndex, isStepperMode = false) => (
    <Card key={photo._id} id={`photo-${photoIndex}`} sx={{ marginBottom: 3 }}>
      <CardMedia
        component="img"
        image={`${IMAGE_BASE_URL}/${photo.file_name}`}
        alt={`Photo by ${photoOwner?.first_name}`}
        sx={{
          width: '100%',
          maxHeight: isStepperMode ? 600 : 500,
          objectFit: 'contain',
          backgroundColor: 'rgba(20, 20, 20, 0.8)',
        }}
      />

      <CardContent sx={{ padding: 2 }}>
        {/* Description - Mô tả bài đăng */}
        {photo.description && (
          <Typography variant="body1" sx={{ color: '#E0E0E0', marginBottom: 2, fontWeight: 500 }}>
            {photo.description}
          </Typography>
        )}

        {/* Date with Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
          <ScheduleIcon sx={{ fontSize: 18, color: '#808080' }} />
          <Typography variant="body2" sx={{ color: '#808080' }}>
            {formatDate(photo.date_time)}
          </Typography>
        </Box>

        {/* Comments */}
        {photo.comments && photo.comments.length > 0 && (
          <Box>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1.5, color: '#FFFFFF' }}>
              Comments ({photo.comments.length})
            </Typography>

            {photo.comments.map((comment) => (
              <Paper
                key={comment._id}
                elevation={0}
                sx={{
                  padding: 1.5,
                  marginBottom: 1,
                  backgroundColor: 'rgba(60, 60, 60, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0.5 }}>
                  <Link
                    to={`/users/${comment.user._id}`}
                    style={{
                      textDecoration: 'none',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => { e.target.style.textDecoration = 'underline'; }}
                    onMouseLeave={(e) => { e.target.style.textDecoration = 'none'; }}
                  >
                    {comment.user.first_name} {comment.user.last_name}
                  </Link>
                  <Typography variant="caption" sx={{ color: '#808080' }}>
                    {formatDate(comment.date_time)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                  {comment.comment}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        {/* Add Comment Input - Chỉ hiển khi đã đăng nhập */}
        {currentUser && (
          <>
            <Divider sx={{ marginY: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                placeholder="Write a comment..."
                value={commentTexts[photo._id] || ''}
                onChange={(e) => setCommentTexts((prev) => ({ ...prev, [photo._id]: e.target.value }))}
                size="small"
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(60, 60, 60, 0.5)',
                    color: '#E0E0E0',
                  },
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment(photo._id);
                  }
                }}
              />
              <IconButton
                onClick={() => handleAddComment(photo._id)}
                disabled={submittingComment[photo._id] || !commentTexts[photo._id]?.trim()}
                sx={{
                  backgroundColor: 'rgba(33, 150, 243, 0.3)',
                  color: '#2196F3',
                  '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.5)' },
                  '&:disabled': { color: '#808080' },
                }}
              >
                {submittingComment[photo._id] ? <CircularProgress size={20} /> : <SendIcon />}
              </IconButton>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );

  // Stepper Mode
  if (advancedFeatures) {
    const currentPhoto = photos[currentPhotoIndex];

    return (
      <Box sx={{ padding: 3, maxWidth: 900, margin: '0 auto' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, marginBottom: 2, textAlign: 'center', color: '#FFFFFF', letterSpacing: '0.5px' }}
        >
          Photos of {photoOwner?.first_name} {photoOwner?.last_name}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 3 }}>
          <Button
            variant="outlined"
            onClick={handlePrevPhoto}
            disabled={currentPhotoIndex === 0}
            startIcon={<ArrowBackIcon />}
          >
            Previous
          </Button>

          <Typography sx={{ fontWeight: 500, minWidth: 80, textAlign: 'center', alignSelf: 'center', color: '#E0E0E0' }}>
            {currentPhotoIndex + 1} / {photos.length}
          </Typography>

          <Button
            variant="outlined"
            onClick={handleNextPhoto}
            disabled={currentPhotoIndex === photos.length - 1}
            endIcon={<ArrowForwardIcon />}
          >
            Next
          </Button>
        </Box>

        {renderPhotoCard(currentPhoto, currentPhotoIndex, true)}
      </Box>
    );
  }

  // Normal Mode
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 3, color: '#FFFFFF', letterSpacing: '0.5px' }}>
        Photos of {photoOwner?.first_name} {photoOwner?.last_name}
      </Typography>
      {photos.map((photo, index) => renderPhotoCard(photo, index, false))}
    </Box>
  );
}

UserPhotos.propTypes = {
  advancedFeatures: PropTypes.bool,
  setContextText: PropTypes.func,
  user: PropTypes.object,  // currentUser - người đang đăng nhập
};

UserPhotos.defaultProps = {
  advancedFeatures: false,
  setContextText: null,
  user: null,
};

export default UserPhotos;
