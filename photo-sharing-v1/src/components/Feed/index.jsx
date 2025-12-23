import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import fetchModel from "../../lib/fetchModelData";

// --- CẤU HÌNH ĐỊA CHỈ BACKEND (GIỐNG CÁC FILE KHÁC) ---
const API_BASE = "https://w267l6-8080.csb.app"; // <--- Thay đúng ID sandbox của bạn
const IMAGE_BASE_URL = `${API_BASE}/images`;

// Hàm format ngày tháng
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

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy tất cả bài viết
    fetchModel("/posts")
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải feed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 2 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, color: "#fff", fontWeight: "bold" }}
      >
        News Feed
      </Typography>

      {posts.map((post) => (
        <Card
          key={post._id}
          sx={{ mb: 4, backgroundColor: "rgba(40,40,40,0.7)", color: "#fff" }}
        >
          {/* HEADER: Hiển thị Avatar & Tên người đăng */}
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "#d32f2f" }}>
                {post.user.first_name ? post.user.first_name[0] : "U"}
              </Avatar>
            }
            title={
              <Link
                to={`/users/${post.user._id}`}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {post.user.first_name} {post.user.last_name}
              </Link>
            }
            subheader={
              <Typography variant="caption" sx={{ color: "#aaa" }}>
                {formatDate(post.date_time)}
              </Typography>
            }
          />

          {/* ẢNH BÀI VIẾT */}
          <CardMedia
            component="img"
            image={`${IMAGE_BASE_URL}/${post.file_name}`}
            alt="Post image"
            sx={{ maxHeight: 600, objectFit: "contain", bgcolor: "#000" }}
          />

          <CardContent>
            {/* Nội dung mô tả (Description) */}
            {post.description && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.description}
              </Typography>
            )}

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 2 }} />

            {/* Danh sách Comment */}
            <Typography variant="subtitle2" sx={{ color: "#aaa", mb: 1 }}>
              Comments ({post.comments ? post.comments.length : 0})
            </Typography>

            {post.comments &&
              post.comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{
                    mb: 1,
                    p: 1,
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    <Link
                      to={`/users/${comment.user._id}`}
                      style={{ textDecoration: "none", color: "#90caf9" }}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ddd" }}>
                    {comment.comment}
                  </Typography>
                </Box>
              ))}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default Feed;
