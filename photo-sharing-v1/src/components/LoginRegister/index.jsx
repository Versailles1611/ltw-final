/**
 * LoginRegister Component - Login và Register với Glassmorphism Style
 * Không sử dụng Emoji - Chỉ dùng Material UI Icons
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Tab,
    Tabs,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Login as LoginIcon,
    PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

const API_BASE = 'http://localhost:3001';

function LoginRegister({ onLoginSuccess }) {
    const [tabValue, setTabValue] = useState(0); // 0: Login, 1: Register
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Login form state
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register form state
    const [regLoginName, setRegLoginName] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [regFirstName, setRegFirstName] = useState('');
    const [regLastName, setRegLastName] = useState('');
    const [regLocation, setRegLocation] = useState('');
    const [regDescription, setRegDescription] = useState('');
    const [regOccupation, setRegOccupation] = useState('');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setError('');
        setSuccess('');
    };

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ login_name: loginName, password: loginPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            onLoginSuccess(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Register
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validation
        if (regPassword !== regConfirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    login_name: regLoginName,
                    password: regPassword,
                    confirm_password: regConfirmPassword,
                    first_name: regFirstName,
                    last_name: regLastName,
                    location: regLocation,
                    description: regDescription,
                    occupation: regOccupation,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setSuccess('Registration successful! You can now login.');
            setTabValue(0); // Switch to login tab
            setLoginName(regLoginName);
            // Clear register form
            setRegLoginName('');
            setRegPassword('');
            setRegConfirmPassword('');
            setRegFirstName('');
            setRegLastName('');
            setRegLocation('');
            setRegDescription('');
            setRegOccupation('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                padding: 3,
            }}
        >
            <Card sx={{ maxWidth: 450, width: '100%' }}>
                <CardContent sx={{ padding: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            textAlign: 'center',
                            marginBottom: 3,
                            fontWeight: 700,
                            color: '#FFFFFF',
                            letterSpacing: '0.5px',
                        }}
                    >
                        Photo Sharing App
                    </Typography>

                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            marginBottom: 3,
                            '& .MuiTab-root': { color: '#B0B0B0' },
                            '& .Mui-selected': { color: '#FFFFFF' },
                            '& .MuiTabs-indicator': { backgroundColor: '#FFFFFF' },
                        }}
                    >
                        <Tab icon={<LoginIcon />} label="Login" />
                        <Tab icon={<PersonAddIcon />} label="Register" />
                    </Tabs>

                    {error && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ marginBottom: 2 }}>
                            {success}
                        </Alert>
                    )}

                    {/* LOGIN FORM */}
                    {tabValue === 0 && (
                        <Box component="form" onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Login Name"
                                value={loginName}
                                onChange={(e) => setLoginName(e.target.value)}
                                margin="normal"
                                required
                                sx={{ input: { color: '#E0E0E0' } }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                margin="normal"
                                required
                                sx={{ input: { color: '#E0E0E0' } }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                                sx={{ marginTop: 3, padding: '12px' }}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </Box>
                    )}

                    {/* REGISTER FORM */}
                    {tabValue === 1 && (
                        <Box component="form" onSubmit={handleRegister}>
                            <TextField
                                fullWidth
                                label="Login Name"
                                value={regLoginName}
                                onChange={(e) => setRegLoginName(e.target.value)}
                                margin="dense"
                                required
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="First Name"
                                value={regFirstName}
                                onChange={(e) => setRegFirstName(e.target.value)}
                                margin="dense"
                                required
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={regLastName}
                                onChange={(e) => setRegLastName(e.target.value)}
                                margin="dense"
                                required
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                margin="dense"
                                required
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                value={regConfirmPassword}
                                onChange={(e) => setRegConfirmPassword(e.target.value)}
                                margin="dense"
                                required
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Location"
                                value={regLocation}
                                onChange={(e) => setRegLocation(e.target.value)}
                                margin="dense"
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Occupation"
                                value={regOccupation}
                                onChange={(e) => setRegOccupation(e.target.value)}
                                margin="dense"
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={regDescription}
                                onChange={(e) => setRegDescription(e.target.value)}
                                margin="dense"
                                multiline
                                rows={2}
                                size="small"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
                                sx={{ marginTop: 2, padding: '12px' }}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

LoginRegister.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginRegister;
