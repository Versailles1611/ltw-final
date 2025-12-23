/**
 * App.js - Final Project với Authentication
 * Theme: Modern Dark Granite Glassmorphism
 * Route Protection: Redirect to /login-register if not logged in
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";
import LoginRegister from "./components/LoginRegister";
import ErrorPage, { ErrorBoundary } from "./components/ErrorPage";
import Feed from './components/Feed';
import "./App.css";

// Auto-detect API URL based on environment
// const getBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     const hostname = window.location.hostname;
//     if (hostname.includes('csb.app') || hostname.includes('codesandbox')) {
//       return '';
//     }
//   }
//   return 'http://localhost:8080';
// };

const API_BASE = "https://w267l6-8080.csb.app";

/**
 * Modern Dark Granite Glassmorphism Theme
 */
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFFFFF",
      light: "#F5F5F5",
      dark: "#B0B0B0",
      contrastText: "#121212",
    },
    secondary: {
      main: "#B0B0B0",
      light: "#E0E0E0",
      dark: "#808080",
      contrastText: "#FFFFFF",
    },
    background: { default: "#121212", paper: "rgba(40, 40, 40, 0.7)" },
    text: { primary: "#E0E0E0", secondary: "#B0B0B0" },
    divider: "rgba(255, 255, 255, 0.1)",
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
    h5: { fontWeight: 700, letterSpacing: "0.5px" },
    h6: { fontWeight: 600, letterSpacing: "0.3px" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#121212",
          backgroundImage:
            "radial-gradient(ellipse at top, #1e1e1e 0%, #121212 100%)",
          minHeight: "100vh",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(30, 30, 30, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(40, 40, 40, 0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(45, 45, 45, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 12, fontWeight: 600 },
        contained: {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#E0E0E0",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.3)",
          color: "#E0E0E0",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.5)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
          "&.Mui-disabled": {
            borderColor: "rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.3)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
            "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#FFFFFF" },
          },
          "& .MuiInputLabel-root": { color: "#B0B0B0" },
          "& .MuiInputBase-input": { color: "#E0E0E0" },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.5)",
          "&.Mui-checked": { color: "#FFFFFF" },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: { root: { color: "#E0E0E0" } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(40, 40, 40, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
});

/**
 * ProtectedRoute - Redirect to login if not authenticated
 */
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login-register" replace />;
  }
  return children;
}

/**
 * Layout with sidebar for authenticated users
 */
function AuthenticatedLayout({ children }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4} md={3}>
        <Paper
          elevation={0}
          sx={{ overflow: "hidden", position: "sticky", top: 80 }}
        >
          <UserList />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8} md={9}>
        <Paper elevation={0} sx={{ minHeight: 400, overflow: "hidden" }}>
          {children}
        </Paper>
      </Grid>
    </Grid>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  const [contextText, setContextText] = useState("");

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_BASE}/admin/check`, {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleSetContextText = useCallback((text) => {
    setContextText(text);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setContextText("");
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ErrorBoundary>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <TopBar
              advancedFeatures={advancedFeatures}
              setAdvancedFeatures={setAdvancedFeatures}
              contextText={contextText}
              user={user}
              onLogout={handleLogout}
            />

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                paddingTop: "80px",
                paddingX: 2,
                paddingBottom: 4,
              }}
            >
              <Routes>
                {/* Login/Register Route - Public */}
                <Route
                  path="/login-register"
                  element={
                    user ? (
                      <Navigate to={`/users/${user._id}`} replace />
                    ) : (
                      <LoginRegister onLoginSuccess={handleLoginSuccess} />
                    )
                  }
                />

                {/* Protected Routes - Require login */}
                <Route
                  path="/users/:userId"
                  element={
                    <ProtectedRoute user={user}>
                      <AuthenticatedLayout>
                        <UserDetail setContextText={handleSetContextText} />
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/photos/:userId"
                  element={
                    <ProtectedRoute user={user}>
                      <AuthenticatedLayout>
                        <UserPhotos
                          advancedFeatures={advancedFeatures}
                          setContextText={handleSetContextText}
                          user={user}
                        />
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/comments/:userId"
                  element={
                    <ProtectedRoute user={user}>
                      <AuthenticatedLayout>
                        <UserComments setContextText={handleSetContextText} />
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/users"
                  element={
                    <ProtectedRoute user={user}>
                      <AuthenticatedLayout>
                        <Box
                          sx={{
                            padding: 3,
                            textAlign: "center",
                            color: "#B0B0B0",
                          }}
                        >
                          <Typography>
                            Select a user from the list to view their profile
                          </Typography>
                        </Box>
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feed"
                  element={
                    <ProtectedRoute user={user}>
                      <AuthenticatedLayout>
                        {/* Gọi component Feed ở đây */}
                        <Feed />
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Default redirect - Go to login if not authenticated, else to user profile */}
                <Route
                  path="/"
                  element={
                    user ? (
                      <Navigate to={`/users/${user._id}`} replace />
                    ) : (
                      <Navigate to="/login-register" replace />
                    )
                  }
                />

                {/* Error Page for 404 */}
                <Route path="/error/:code" element={<ErrorPage />} />

                {/* Catch-all route - 404 */}
                <Route path="*" element={<ErrorPage errorCode="404" />} />
              </Routes>
            </Box>
          </Box>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
