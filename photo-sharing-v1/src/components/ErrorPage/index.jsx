/**
 * ErrorPage Component - HTTP Cat Error Display
 * Catches all errors: 404, backend errors, code errors
 * Uses http.cat for error images
 */

import React, { useEffect, useState, Component } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';

// Error descriptions mapping
const ERROR_DESCRIPTIONS = {
    400: { title: 'Bad Request', description: 'The server could not understand your request.' },
    401: { title: 'Unauthorized', description: 'You need to login to access this page.' },
    403: { title: 'Forbidden', description: 'You do not have permission to access this resource.' },
    404: { title: 'Page Not Found', description: 'Are you sure you entered a right URL?' },
    405: { title: 'Method Not Allowed', description: 'The request method is not supported.' },
    408: { title: 'Request Timeout', description: 'The server timed out waiting for the request.' },
    500: { title: 'Internal Server Error', description: 'Something went wrong on our end.' },
    502: { title: 'Bad Gateway', description: 'The server received an invalid response.' },
    503: { title: 'Service Unavailable', description: 'The server is temporarily unavailable.' },
    504: { title: 'Gateway Timeout', description: 'The server did not receive a timely response.' },
};

// Get error info based on status code
const getErrorInfo = (code) => {
    const statusCode = parseInt(code, 10) || 404;
    return ERROR_DESCRIPTIONS[statusCode] || {
        title: 'Unknown Error',
        description: 'An unexpected error occurred.',
    };
};

// Main Error Page Content Component
function ErrorPageContent({ errorCode = 404, error = null }) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [imageError, setImageError] = useState(false);

    // Determine the status code
    const statusCode = params.code || error?.statusCode || errorCode || 404;
    const errorInfo = getErrorInfo(statusCode);

    // Build error details object
    const errorDetails = {
        error: true,
        url: location.pathname,
        statusCode: parseInt(statusCode, 10),
        statusMessage: errorInfo.title,
        message: error?.message || `Page not found: ${location.pathname}`,
        data: {
            path: location.pathname,
            ...(error?.stack && { stack: error.stack }),
        },
    };

    const handleGoBack = () => navigate(-1);
    const handleRefresh = () => window.location.reload();

    // Glassmorphism card style
    const cardStyle = {
        background: 'rgba(40, 40, 40, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
    };

    const buttonStyle = {
        background: 'rgba(60, 60, 60, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#E0E0E0',
        textTransform: 'none',
        borderRadius: '8px',
        px: 2,
        py: 1,
        '&:hover': {
            background: 'rgba(80, 80, 80, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
        },
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#121212', color: '#E0E0E0', py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5 }}>
                        An error occured
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#808080' }}>
                        Here are the details:
                    </Typography>
                </Box>

                {/* Main Card */}
                <Box sx={{ ...cardStyle, p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                        {/* Left: Cat Image */}
                        <Box sx={{ flexShrink: 0, width: { xs: '100%', md: '320px' } }}>
                            <Box
                                sx={{
                                    background: 'rgba(30, 30, 30, 0.9)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={imageError ? 'https://http.cat/404.jpg' : `https://http.cat/${statusCode}.jpg`}
                                    alt={`HTTP ${statusCode}`}
                                    onError={() => setImageError(true)}
                                    style={{
                                        width: '100%',
                                        display: 'block',
                                    }}
                                />
                                {/* Status Code Label */}
                                <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                                        {statusCode}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#808080' }}>
                                        {errorInfo.title}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Right: Error Details */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* Title */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="overline"
                                    sx={{ color: '#808080', fontWeight: 600, letterSpacing: 1 }}
                                >
                                    TITLE
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
                                    {errorInfo.title}
                                </Typography>
                            </Box>

                            {/* Description */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="overline"
                                    sx={{ color: '#808080', fontWeight: 600, letterSpacing: 1 }}
                                >
                                    DESCRIPTION
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
                                    {errorInfo.description}
                                </Typography>
                            </Box>

                            {/* Details */}
                            <Box>
                                <Typography
                                    variant="overline"
                                    sx={{ color: '#808080', fontWeight: 600, letterSpacing: 1 }}
                                >
                                    DETAILS
                                </Typography>
                                <Box
                                    component="pre"
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        bgcolor: 'rgba(20, 20, 20, 0.8)',
                                        borderRadius: '8px',
                                        overflow: 'auto',
                                        fontFamily: 'monospace',
                                        fontSize: '0.85rem',
                                        color: '#B0B0B0',
                                        m: 0,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {JSON.stringify(errorDetails, null, 2)}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button onClick={handleGoBack} startIcon={<ArrowBackIcon />} sx={buttonStyle}>
                        Go Back
                    </Button>
                    <Button onClick={handleRefresh} startIcon={<RefreshIcon />} sx={buttonStyle}>
                        Refresh Page
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

// Error Boundary Component - Catches JavaScript errors in child components
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        // Log error to console for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorPageContent
                    errorCode={500}
                    error={{
                        message: this.state.error?.message || 'A JavaScript error occurred',
                        stack: this.state.error?.stack,
                        statusCode: 500,
                    }}
                />
            );
        }
        return this.props.children;
    }
}

// Export both components
export { ErrorBoundary };
export default ErrorPageContent;