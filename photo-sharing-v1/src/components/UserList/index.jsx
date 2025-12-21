/**
 * UserList Component - Glassmorphism Style với Icons (Không Emoji)
 * Dùng Material UI Icons thay cho bong bóng emoji
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  PhotoLibrary as PhotoLibraryIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import fetchModel from '../../lib/fetchModelData';

function UserList() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();

  const activeUserId = userId || location.pathname.split('/')[2];

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetchModel('/user/list'),
      fetchModel('/users/stats'),
    ])
      .then(([usersData, statsData]) => {
        setUsers(usersData);
        setStats(statsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user list:', err);
        setError('Cannot load user list');
        setLoading(false);
      });
  }, []);

  const handleUserClick = (user) => {
    navigate(`/users/${user._id}`);
  };

  // Click Photo Icon -> UserPhotos
  const handlePhotoClick = (e, userId) => {
    e.stopPropagation();
    navigate(`/photos/${userId}`);
  };

  // Click Comment Icon -> UserComments
  const handleCommentClick = (e, userId) => {
    e.stopPropagation();
    navigate(`/comments/${userId}`);
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

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          padding: 2,
          fontWeight: 600,
          color: '#FFFFFF',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          letterSpacing: '0.5px',
        }}
      >
        Users
      </Typography>

      <List sx={{ padding: 1 }}>
        {users.map((user) => {
          const isActive = activeUserId === String(user._id);
          const userStats = stats[user._id] || { photoCount: 0, commentCount: 0 };

          return (
            <ListItem key={user._id} disablePadding sx={{ marginBottom: 0.5 }}>
              <ListItemButton
                onClick={() => handleUserClick(user)}
                sx={{
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  borderRadius: 2,
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#FFFFFF' : '#E0E0E0',
                    fontSize: '0.95rem',
                  }}
                />

                {/* Icons Container - Thay thế Emoji */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {/* Photo Icon (Green) */}
                  <Chip
                    icon={<PhotoLibraryIcon sx={{ fontSize: 16, color: '#4CAF50 !important' }} />}
                    label={userStats.photoCount}
                    size="small"
                    onClick={(e) => handlePhotoClick(e, user._id)}
                    sx={{
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      color: '#4CAF50',
                      fontSize: '0.75rem',
                      height: 24,
                      cursor: 'pointer',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.4)',
                      },
                      '& .MuiChip-icon': { marginLeft: '6px' },
                    }}
                  />

                  {/* Comment Icon (Red) */}
                  <Chip
                    icon={<CommentIcon sx={{ fontSize: 16, color: '#F44336 !important' }} />}
                    label={userStats.commentCount}
                    size="small"
                    onClick={(e) => handleCommentClick(e, user._id)}
                    sx={{
                      backgroundColor: 'rgba(244, 67, 54, 0.2)',
                      color: '#F44336',
                      fontSize: '0.75rem',
                      height: 24,
                      cursor: 'pointer',
                      border: '1px solid rgba(244, 67, 54, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.4)',
                      },
                      '& .MuiChip-icon': { marginLeft: '6px' },
                    }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

UserList.propTypes = {};

export default UserList;
