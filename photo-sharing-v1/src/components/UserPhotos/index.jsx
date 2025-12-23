/**
 * UserPhotos Component - Glassmorphism Style với Comment Input
 * Không sử dụng Emoji - Dùng Material UI Icons
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios"; // Đảm bảo đã cài: npm install axios
import fetchModel from "../../lib/fetchModelData";

// Auto-detect API URL based on environment
// Điền thẳng địa chỉ Backend vào đây (lấy từ tab Ports 8080)
const API_BASE = "https://w267l6-8080.csb.app";

// Luôn trỏ về folder images của Backend
const IMAGE_BASE_URL = `${API_BASE}/images`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

  const [editingCommentId, setEditingCommentId] = useState(null); // ID của comment đang sửa
  const [editVal, setEditVal] = useState(""); // Nội dung đang sửa

  useEffect(() => {
    if (!userId) return;

    const getPhotoIndexFromHash = () => {
      const hash = location.hash;
      if (hash && hash.includes("photo=")) {
        const index = parseInt(hash.split("photo=")[1], 10);
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
          setContextText(
            `Photos of ${userData.first_name} ${userData.last_name}`
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching photos:", err);
        setError("Cannot load photos");
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
    if (!commentText || commentText.trim() === "") return;

    setSubmittingComment((prev) => ({ ...prev, [photoId]: true }));

    try {
      const response = await fetch(`${API_BASE}/commentsOfPhoto/${photoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ comment: commentText.trim() }),
      });

      const newComment = await response.json();

      if (!response.ok) {
        throw new Error(newComment.error || "Failed to add comment");
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
      setCommentTexts((prev) => ({ ...prev, [photoId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
      alert(err.message);
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [photoId]: false }));
    }
  };
  const handleDeleteComment = async (photoId, commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa comment này?")) return;

    try {
      await axios.delete(`https://w267l6-8080.csb.app/commentsOfPhoto/${photoId}/${commentId}`, {
         withCredentials: true // Quan trọng để gửi session cookie
      });
      // Sau khi xóa xong, load lại dữ liệu để cập nhật giao diện
      // Gọi lại hàm load ảnh của bạn (ví dụ: fetchPhotos() hoặc reload lại trang)
      window.location.reload(); 
    } catch (err) {
      console.error("Lỗi xóa comment:", err);
      alert("Không thể xóa comment (Bạn không phải chủ bài viết hoặc chủ comment)");
    }
  };

  // 2. Hàm Bắt đầu sửa (Hiện ô nhập liệu)
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditVal(comment.comment);
  };

  // 3. Hàm Gửi nội dung sửa lên Server
  const handleSubmitEdit = async (photoId, commentId) => {
    try {
      await axios.put(
        `https://w267l6-8080.csb.app/commentsOfPhoto/${photoId}/${commentId}`,
        { comment: editVal },
        { withCredentials: true }
      );
      // Reset trạng thái
      setEditingCommentId(null);
      setEditVal("");
      // Load lại trang hoặc cập nhật state
      window.location.reload();
    } catch (err) {
      console.error("Lỗi sửa comment:", err);
      alert("Lỗi khi sửa comment");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
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
        <Typography color="text.secondary">
          This user has no photos yet
        </Typography>
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
          width: "100%",
          maxHeight: isStepperMode ? 600 : 500,
          objectFit: "contain",
          backgroundColor: "rgba(20, 20, 20, 0.8)",
        }}
      />

      <CardContent sx={{ padding: 2 }}>
        {/* Description - Mô tả bài đăng */}
        {photo.description && (
          <Typography
            variant="body1"
            sx={{ color: "#E0E0E0", marginBottom: 2, fontWeight: 500 }}
          >
            {photo.description}
          </Typography>
        )}

        {/* Date with Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginBottom: 2,
          }}
        >
          <ScheduleIcon sx={{ fontSize: 18, color: "#808080" }} />
          <Typography variant="body2" sx={{ color: "#808080" }}>
            {formatDate(photo.date_time)}
          </Typography>
        </Box>

        {/* Comments */}
        {photo.comments && photo.comments.length > 0 && (
          <Box>
            <Divider sx={{ marginY: 2 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, marginBottom: 1.5, color: "#FFFFFF" }}
            >
              Comments ({photo.comments.length})
            </Typography>

            {photo.comments && photo.comments.map((comment) => (
              <Box key={comment._id} sx={{ mb: 1, p: 1, bgcolor: "rgba(0,0,0,0.03)", borderRadius: 1 }}>
                
                {/* LOGIC HIỂN THỊ: NẾU ĐANG SỬA THÌ HIỆN INPUT, KHÔNG THÌ HIỆN TEXT */}
                {editingCommentId === comment._id ? (
                  // --- GIAO DIỆN SỬA ---
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField 
                      fullWidth size="small" variant="outlined" 
                      value={editVal} 
                      onChange={(e) => setEditVal(e.target.value)} 
                    />
                    <IconButton onClick={() => handleSubmitEdit(photo._id, comment._id)} color="primary">
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={() => setEditingCommentId(null)} color="error">
                      <CancelIcon />
                    </IconButton>
                  </Box>
                ) : (
                  // --- GIAO DIỆN XEM BÌNH THƯỜNG ---
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      {/* Tên người comment & Nội dung */}
                      <Typography variant="subtitle2" component={Link} to={`/users/${comment.user_id}`} sx={{ textDecoration: "none", fontWeight: "bold" }}>
                        {comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : "Unknown User"}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: "#FFFFF1" }}>
                        {comment.comment}
                      </Typography>
                      
                      <Typography variant="caption" sx={{ color: "#aaa" }}>
                        {new Date(comment.date_time).toLocaleDateString()}
                        {/* Hiện thêm chữ Edited nếu đã sửa */}
                        {comment.edited_at && <span> (Edited)</span>}
                      </Typography>
                    </Box>

                    {/* CÁC NÚT ACTION: CHỈ HIỆN KHI CÓ QUYỀN */}
                    {/*<Box>
                      {/* --- SỬA LẠI ĐOẠN NÀY: Dùng currentUser thay vì props.user --- */}
                      
                      {/* Nút Sửa: Chỉ hiện nếu là chính chủ comment */}
                     {/* {currentUser && comment.user_id === currentUser._id && (
                        <IconButton size="small" onClick={() => handleStartEdit(comment)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}

                      {/* Nút Xóa: Hiện nếu là chủ comment HOẶC chủ bài đăng (photo.user_id) */}
                     {/* {currentUser && (comment.user_id === currentUser._id || photo.user_id === currentUser._id) && (
                        <IconButton size="small" onClick={() => handleDeleteComment(photo._id, comment._id)}>
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      )}
                    </Box> */}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Add Comment Input - Chỉ hiển khi đã đăng nhập */}
        {currentUser && (
          <>
            <Divider sx={{ marginY: 2 }} />
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
              <TextField
                fullWidth
                placeholder="Write a comment..."
                value={commentTexts[photo._id] || ""}
                onChange={(e) =>
                  setCommentTexts((prev) => ({
                    ...prev,
                    [photo._id]: e.target.value,
                  }))
                }
                size="small"
                multiline
                maxRows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(60, 60, 60, 0.5)",
                    color: "#E0E0E0",
                  },
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment(photo._id);
                  }
                }}
              />
              <IconButton
                onClick={() => handleAddComment(photo._id)}
                disabled={
                  submittingComment[photo._id] ||
                  !commentTexts[photo._id]?.trim()
                }
                sx={{
                  backgroundColor: "rgba(33, 150, 243, 0.3)",
                  color: "#2196F3",
                  "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.5)" },
                  "&:disabled": { color: "#808080" },
                }}
              >
                {submittingComment[photo._id] ? (
                  <CircularProgress size={20} />
                ) : (
                  <SendIcon />
                )}
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
      <Box sx={{ padding: 3, maxWidth: 900, margin: "0 auto" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            marginBottom: 2,
            textAlign: "center",
            color: "#FFFFFF",
            letterSpacing: "0.5px",
          }}
        >
          Photos of {photoOwner?.first_name} {photoOwner?.last_name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            marginBottom: 3,
          }}
        >
          <Button
            variant="outlined"
            onClick={handlePrevPhoto}
            disabled={currentPhotoIndex === 0}
            startIcon={<ArrowBackIcon />}
          >
            Previous
          </Button>

          <Typography
            sx={{
              fontWeight: 500,
              minWidth: 80,
              textAlign: "center",
              alignSelf: "center",
              color: "#E0E0E0",
            }}
          >
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
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          marginBottom: 3,
          color: "#FFFFFF",
          letterSpacing: "0.5px",
        }}
      >
        Photos of {photoOwner?.first_name} {photoOwner?.last_name}
      </Typography>
      {photos.map((photo, index) => renderPhotoCard(photo, index, false))}
    </Box>
  );
}

UserPhotos.propTypes = {
  advancedFeatures: PropTypes.bool,
  setContextText: PropTypes.func,
  user: PropTypes.object, // currentUser - người đang đăng nhập
};

UserPhotos.defaultProps = {
  advancedFeatures: false,
  setContextText: null,
  user: null,
};

export default UserPhotos;
