/**
 * TopBar Component - Glassmorphism Style với Auth
 * Không sử dụng Emoji - Chỉ dùng Material UI Icons
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  AddAPhoto as AddAPhotoIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

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

const API_BASE = "https://w2dy33-8080.csb.app";

function TopBar({
  advancedFeatures,
  setAdvancedFeatures,
  contextText,
  user,
  onLogout,
}) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const handleAdvancedFeaturesChange = (event) => {
    setAdvancedFeatures(event.target.checked);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
      onLogout();
    }
  };

  // Handle Upload
  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadError("Please select a file");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    const formData = new FormData();
    formData.append("photo", uploadFile);

    try {
      const response = await fetch(`${API_BASE}/photos/new`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadSuccess("Photo uploaded successfully!");
      setUploadFile(null);
      setTimeout(() => {
        setUploadOpen(false);
        setUploadSuccess("");
        // Reload page to show new photo
        window.location.reload();
      }, 1500);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: App Name */}
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600, letterSpacing: "1px", color: "#FFFFFF" }}
          >
            Trần Thị Hải Yến -- B22DCAT321
          </Typography>

          {/* Right: Context + Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Context Text */}
            {contextText && (
              <Typography
                variant="subtitle1"
                sx={{ color: "#B0B0B0", fontWeight: 400 }}
              >
                {contextText}
              </Typography>
            )}

            {/* If Logged In */}
            {user && (
              <>
                {/* Advanced Features Checkbox */}
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      checked={advancedFeatures || false}
                      onChange={handleAdvancedFeaturesChange}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: "#E0E0E0" }}>
                      Advanced
                    </Typography>
                  }
                /> */}
                <Button color="inherit" component={Link} to="/feed">
                  News Feed
                </Button>
                {/* User Greeting */}
                <Typography variant="body2" sx={{ color: "#E0E0E0" }}>
                  Hi, {user.first_name}
                </Typography>
                {/* Upload Button */}
                <IconButton
                  onClick={() => setUploadOpen(true)}
                  sx={{
                    color: "#FFFFFF",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                  }}
                >
                  <AddAPhotoIcon />
                </IconButton>
                {/* Logout Button */}
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    color: "#FFFFFF",
                    backgroundColor: "rgba(244, 67, 54, 0.3)",
                    "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.5)" },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </>
            )}

            {/* If Not Logged In - Show Please Login Button */}
            {!user && (
              <Button
                component={Link}
                to="/login-register"
                variant="outlined"
                startIcon={<LoginIcon />}
                sx={{
                  color: "#E0E0E0",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Please Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Upload Dialog */}
      <Dialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ backgroundColor: "rgba(40, 40, 40, 0.95)", color: "#FFFFFF" }}
        >
          Upload New Photo
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: "rgba(40, 40, 40, 0.95)",
            paddingTop: "20px !important",
          }}
        >
          {uploadError && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {uploadError}
            </Alert>
          )}
          {uploadSuccess && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              {uploadSuccess}
            </Alert>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => setUploadFile(e.target.files[0])}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "rgba(60, 60, 60, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "8px",
              color: "#E0E0E0",
            }}
          />
          {uploadFile && (
            <Typography variant="body2" sx={{ marginTop: 1, color: "#B0B0B0" }}>
              Selected: {uploadFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: "rgba(40, 40, 40, 0.95)", padding: 2 }}
        >
          <Button
            onClick={() => setUploadOpen(false)}
            sx={{ color: "#B0B0B0" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={uploading || !uploadFile}
            startIcon={<AddAPhotoIcon />}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

TopBar.propTypes = {
  advancedFeatures: PropTypes.bool,
  setAdvancedFeatures: PropTypes.func.isRequired,
  contextText: PropTypes.string,
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
};

TopBar.defaultProps = {
  advancedFeatures: false,
  contextText: "",
  user: null,
};

export default TopBar;
