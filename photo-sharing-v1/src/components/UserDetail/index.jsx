/**
 * UserDetail Component - Glassmorphism Style
 * Lấy dữ liệu từ API /user/:id
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import fetchModel from '../../lib/fetchModelData';

function UserDetail({ setContextText }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    // Gọi API /user/:id
    fetchModel(`/user/${userId}`)
      .then((data) => {
        setUser(data);
        setLoading(false);
        if (setContextText) {
          setContextText(`Details of ${data.first_name} ${data.last_name}`);
        }
      })
      .catch((err) => {
        console.error('Error fetching user detail:', err);
        setError('Không thể tải thông tin người dùng');
        setLoading(false);
      });
  }, [userId, setContextText]);

  const handleViewPhotos = () => {
    navigate(`/photos/${userId}`);
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

  if (!user) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography color="text.secondary">Không tìm thấy người dùng</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ maxWidth: 500, margin: '0 auto' }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, marginBottom: 2, color: '#FFFFFF', letterSpacing: '0.5px' }}
          >
            {user.first_name} {user.last_name}
          </Typography>

          <Divider sx={{ marginY: 2 }} />

          {/* Location */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body2" sx={{ color: '#808080', fontWeight: 500, marginBottom: 0.5 }}>
              Location
            </Typography>
            <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
              {user.location || 'N/A'}
            </Typography>
          </Box>

          {/* Occupation */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body2" sx={{ color: '#808080', fontWeight: 500, marginBottom: 0.5 }}>
              Occupation
            </Typography>
            <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
              {user.occupation || 'N/A'}
            </Typography>
          </Box>

          {/* Description */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body2" sx={{ color: '#808080', fontWeight: 500, marginBottom: 0.5 }}>
              About
            </Typography>
            <Typography variant="body1" sx={{ color: '#B0B0B0', lineHeight: 1.6 }}>
              {user.description || 'No description available'}
            </Typography>
          </Box>

          <Divider sx={{ marginY: 2 }} />

          {/* View Photos Button */}
          <Button
            variant="contained"
            onClick={handleViewPhotos}
            fullWidth
            sx={{
              padding: '14px 24px',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            View Photos
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

UserDetail.propTypes = {
  setContextText: PropTypes.func,
};

UserDetail.defaultProps = {
  setContextText: null,
};

export default UserDetail;
