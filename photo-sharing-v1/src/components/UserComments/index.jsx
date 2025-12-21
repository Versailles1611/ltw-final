/**
 * UserComments Component - Extra Credit với Icons
 * Không sử dụng Emoji - Dùng Material UI Icons
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
} from '@mui/icons-material';
import fetchModel from '../../lib/fetchModelData';

const IMAGE_BASE_URL = 'http://localhost:3001/images';

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

function UserComments({ setContextText }) {
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userId } = useParams();

    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        Promise.all([
            fetchModel(`/commentsOfUser/${userId}`),
            fetchModel(`/user/${userId}`),
        ])
            .then(([commentsData, userData]) => {
                setComments(commentsData || []);
                setUser(userData);
                setLoading(false);

                if (setContextText && userData) {
                    setContextText(`Comments by ${userData.first_name} ${userData.last_name}`);
                }
            })
            .catch((err) => {
                console.error('Error fetching comments:', err);
                setError('Cannot load comments');
                setLoading(false);
            });
    }, [userId, setContextText]);

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

    if (comments.length === 0) {
        return (
            <Box sx={{ padding: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 2, color: '#FFFFFF' }}>
                    Comments by {user?.first_name} {user?.last_name}
                </Typography>
                <Typography color="text.secondary">
                    This user has no comments yet
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography
                variant="h5"
                sx={{ fontWeight: 700, marginBottom: 3, color: '#FFFFFF', letterSpacing: '0.5px' }}
            >
                Comments by {user?.first_name} {user?.last_name}
            </Typography>

            <Typography variant="body2" sx={{ color: '#808080', marginBottom: 3 }}>
                Total: {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </Typography>

            {comments.map((comment) => (
                <Card key={comment._id} sx={{ marginBottom: 2 }}>
                    <CardContent sx={{ padding: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {/* Thumbnail - Click to go to photo */}
                            <Link
                                to={`/photos/${comment.photo.user_id}`}
                                style={{ textDecoration: 'none', flexShrink: 0 }}
                            >
                                <Box
                                    component="img"
                                    src={`${IMAGE_BASE_URL}/${comment.photo.file_name}`}
                                    alt="Photo thumbnail"
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, border-color 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            borderColor: 'rgba(255, 255, 255, 0.3)',
                                        },
                                    }}
                                />
                            </Link>

                            {/* Comment content */}
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: '#E0E0E0', marginBottom: 1, lineHeight: 1.5 }}
                                >
                                    {comment.comment}
                                </Typography>

                                {/* Date with Icon */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <ScheduleIcon sx={{ fontSize: 14, color: '#808080' }} />
                                    <Typography variant="caption" sx={{ color: '#808080' }}>
                                        {formatDate(comment.date_time)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

UserComments.propTypes = {
    setContextText: PropTypes.func,
};

UserComments.defaultProps = {
    setContextText: null,
};

export default UserComments;
