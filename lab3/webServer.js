/**
 * Final Project: webServer.js
 * Express Server với Authentication, Upload, Comment
 *
 * Port: 3001
 * Database: mongodb://127.0.0.1:27017/project-photo-sharing (ĐÃ SỬA)
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const app = express();
app.set("trust proxy", 1);
const PORT = 8080;
const MONGODB_URI =
  "mongodb+srv://yentth321:yentth321@yencluster.qqbzlz7.mongodb.net/final-ltw?appName=YenCluster"; // ĐÃ SỬA: Đổi tên DB

// ============================================
// MIDDLEWARE SETUP
// ============================================

// CORS với credentials - Hỗ trợ cả localhost và CodeSandbox
app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép requests không có origin (như mobile apps, curl, etc)
      if (!origin) return callback(null, true);

      // Whitelist các origins được phép
      const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

      // Cho phép tất cả CodeSandbox domains
      if (
        origin.includes("csb.app") ||
        origin.includes("codesandbox.io") ||
        origin.includes("csb.io") ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Session middleware - Hỗ trợ cả localhost và CodeSandbox
const isProduction = process.env.NODE_ENV === "production";
app.use(
  session({
    secret: "photo-sharing-secret-key-2024",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // Bắt buộc true để chạy trên CodeSandbox (HTTPS)
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none", // 'none' cho cross-origin (CodeSandbox)
    },
  })
);

// Multer config cho upload ảnh - ĐÃ SỬA: Đường dẫn sang folder src/images của frontend
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ĐÃ SỬA: Đường dẫn sang thư mục src/images của frontend (nơi chứa ảnh thực tế)
    const uploadPath = path.join(__dirname, "../photo-sharing-v1/src/images");
    console.log("Upload folder: " + uploadPath); // Log để kiểm tra đường dẫn
    // Tạo folder nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, GIF, WEBP allowed."));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// Serve static images - ĐÃ SỬA: Đường dẫn đến thư mục có ảnh thực tế
app.use(
  "/images",
  express.static(path.join(__dirname, "../photo-sharing-v1/src/images"))
);

// ============================================
// MONGOOSE SCHEMAS
// ============================================

const userSchema = new mongoose.Schema({
  _id: String,
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  location: String,
  description: String,
  occupation: String,
  login_name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const commentSchema = new mongoose.Schema({
  _id: String,
  comment: { type: String, required: true },
  date_time: { type: Date, default: Date.now },
  user_id: { type: String, required: true },
});

const photoSchema = new mongoose.Schema({
  _id: String,
  file_name: { type: String, required: true },
  description: { type: String, default: "" }, // Thêm description cho ảnh
  date_time: { type: Date, default: Date.now },
  user_id: { type: String, required: true },
  comments: [commentSchema],
  likes: [String],
});

const User = mongoose.model("User", userSchema);
const Photo = mongoose.model("Photo", photoSchema);

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected: " + MONGODB_URI))
  .catch((err) => console.error("MongoDB connection error:", err));

// ============================================
// AUTH MIDDLEWARE
// ============================================

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }
  next();
};

// ============================================
// AUTH API ENDPOINTS
// ============================================

/**
 * POST /admin/login - Đăng nhập
 */
app.post("/admin/login", async (req, res) => {
  const { login_name, password } = req.body;

  if (!login_name || !password) {
    return res.status(400).json({ error: "Login name and password required" });
  }

  try {
    const user = await User.findOne({ login_name }).lean();

    if (!user) {
      return res.status(400).json({ error: "Invalid login name or password" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid login name or password" });
    }

    // Lưu user vào session (không lưu password)
    req.session.user = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      login_name: user.login_name,
    };

    res.json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      login_name: user.login_name,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /admin/logout - Đăng xuất
 */
app.post("/admin/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ error: "Not logged in" });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

/**
 * GET /admin/check - Kiểm tra session
 */
app.get("/admin/check", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});

/**
 * POST /user - Đăng ký user mới
 */
app.post("/user", async (req, res) => {
  const {
    login_name,
    password,
    confirm_password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = req.body;

  // Validate required fields
  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).json({
      error: "Login name, password, first name, and last name are required",
    });
  }

  // Check password match
  if (password !== confirm_password) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Check if login_name exists
    const existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res.status(400).json({ error: "Login name already exists" });
    }

    // Create new user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId().toString(),
      first_name,
      last_name,
      location: location || "",
      description: description || "",
      occupation: occupation || "",
      login_name,
      password: bcrypt.hashSync(password, 10),
    });

    await newUser.save();

    res.json({
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      login_name: newUser.login_name,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================
// DATA API ENDPOINTS (Protected)
// ============================================

/**
 * GET /user/list - Yêu cầu đăng nhập để xem danh sách user
 */
/**
 * GET /posts - Lấy tất cả bài viết của tất cả user (News Feed)
 */
app.get("/posts", requireLogin, async (req, res) => {
  try {
    // 1. Lấy tất cả ảnh, sắp xếp mới nhất lên đầu (date_time: -1)
    const photos = await Photo.find({}).sort({ date_time: -1 }).lean();

    // 2. Xử lý từng ảnh để lấy thông tin User (Người đăng & Người comment)
    const newPhotos = await Promise.all(
      photos.map(async (photo) => {
        // A. Lấy thông tin người đăng bài
        const user = await User.findById(
          photo.user_id,
          "_id first_name last_name"
        ).lean();

        // B. Lấy thông tin người comment (nếu có)
        const commentsWithUser = await Promise.all(
          (photo.comments || []).map(async (comment) => {
            const commentUser = await User.findById(
              comment.user_id,
              "_id first_name last_name"
            ).lean();
            return {
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              user_id: comment.user_id,
              user: commentUser || {
                _id: null,
                first_name: "Unknown",
                last_name: "User",
              }, // Xử lý nếu user đã bị xóa
            };
          })
        );

        // C. Trả về object ảnh đầy đủ thông tin
        return {
          _id: photo._id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          user_id: photo.user_id,
          description: photo.description || "", // Thêm description nếu schema có
          user: user || { _id: null, first_name: "Unknown", last_name: "User" }, // Thêm object user vào
          comments: commentsWithUser,
        };
      })
    );

    // 3. Trả về kết quả
    res.json(newPhotos);
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/user/list", requireLogin, async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name").lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /user/:id - Yêu cầu đăng nhập để xem thông tin user
 */
app.get("/user/:id", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id,
      "_id first_name last_name location description occupation"
    ).lean();
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Invalid user ID" });
  }
});

/**
 * GET /photosOfUser/:id - Yêu cầu đăng nhập để xem photos
 */
app.get("/photosOfUser/:id", requireLogin, async (req, res) => {
  try {
    const userExists = await User.exists({ _id: req.params.id });
    if (!userExists) {
      return res.status(400).json({ error: "User not found" });
    }

    const photos = await Photo.find({ user_id: req.params.id }).lean();

    const transformedPhotos = await Promise.all(
      photos.map(async (photo) => {
        const transformedComments = await Promise.all(
          (photo.comments || []).map(async (comment) => {
            const commentUser = await User.findById(
              comment.user_id,
              "_id first_name last_name"
            ).lean();
            return {
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              user_id: comment.user_id,
              user: commentUser || {
                _id: null,
                first_name: "Unknown",
                last_name: "User",
              },
            };
          })
        );

        return {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          description: photo.description || "", // Thêm description
          date_time: photo.date_time,
          comments: transformedComments,
        };
      })
    );

    res.json(transformedPhotos);
  } catch (error) {
    res.status(400).json({ error: "Invalid user ID" });
  }
});

/**
 * GET /users/stats - Yêu cầu đăng nhập để xem stats
 */
app.get("/users/stats", requireLogin, async (req, res) => {
  try {
    const users = await User.find({}, "_id").lean();
    const allPhotos = await Photo.find({}).lean();

    const stats = {};
    users.forEach((user) => {
      stats[user._id] = { photoCount: 0, commentCount: 0 };
    });

    allPhotos.forEach((photo) => {
      if (stats[photo.user_id]) stats[photo.user_id].photoCount++;
      (photo.comments || []).forEach((comment) => {
        if (stats[comment.user_id]) stats[comment.user_id].commentCount++;
      });
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /commentsOfUser/:id
 */
/**
 * GET /commentsOfUser/:id
 * Fix lỗi không hiện comment do so sánh sai kiểu dữ liệu
 */
app.get("/commentsOfUser/:id", requireLogin, async (req, res) => {
  try {
    const userId = req.params.id; // Lấy ID từ URL

    // Kiểm tra user có tồn tại không
    const user = await User.findById(userId, "_id first_name last_name").lean();
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const allPhotos = await Photo.find({}).lean();
    const userComments = [];

    // --- LOGIC TÌM COMMENT ---
    allPhotos.forEach((photo) => {
      if (photo.comments) {
        photo.comments.forEach((comment) => {
          if (comment.user_id.toString() === userId.toString()) {
            userComments.push({
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              photo: {
                _id: photo._id,
                file_name: photo.file_name,
                user_id: photo.user_id,
              },
            });
          }
        });
      }
    });

    res.json(userComments);
  } catch (error) {
    console.error("Lỗi lấy comment:", error);
    res.status(400).json({ error: "Invalid user ID" });
  }
});

// ============================================
// COMMENT & UPLOAD API ENDPOINTS
// ============================================

/**
 * POST /commentsOfPhoto/:photo_id - Thêm comment
 */
app.post("/commentsOfPhoto/:photo_id", requireLogin, async (req, res) => {
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "Comment cannot be empty" });
  }

  try {
    const photo = await Photo.findById(req.params.photo_id);
    if (!photo) {
      return res.status(400).json({ error: "Photo not found" });
    }

    const newComment = {
      _id: new mongoose.Types.ObjectId().toString(),
      comment: comment.trim(),
      date_time: new Date(),
      user_id: req.session.user._id,
    };

    photo.comments.push(newComment);
    await photo.save();

    // Return comment với user info
    res.json({
      _id: newComment._id,
      comment: newComment.comment,
      date_time: newComment.date_time,
      user: {
        _id: req.session.user._id,
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * PUT /commentsOfPhoto/:photo_id/:comment_id - Sửa comment
 */
app.put(
  "/commentsOfPhoto/:photo_id/:comment_id",
  requireLogin,
  async (req, res) => {
    const { photo_id, comment_id } = req.params;
    const { comment } = req.body;

    // 1. SỬA LỖI: Lấy đúng ID từ session user object
    const currentUserId = req.session.user._id;

    // 2. SỬA LỖI: Kiểm tra độ dài chuỗi (length)
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    try {
      const photo = await Photo.findOne({ _id: photo_id });
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }

      const theComment = photo.comments.id(comment_id);
      if (!theComment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // Kiểm tra quyền sở hữu
      if (theComment.user_id.toString() !== currentUserId.toString()) {
        return res
          .status(403)
          .json({ error: "You are not authorized to edit this" });
      }

      // Cập nhật nội dung
      theComment.comment = comment;
      // (Tuỳ chọn) Lưu lại thời gian sửa nếu muốn
      // theComment.date_time = new Date();

      await photo.save();

      console.log(`Comment updated by user ${currentUserId}`);
      res.status(200).json(photo);
    } catch (err) {
      console.error("Edit comment error:", err);
      res.status(500).json({ error: "Could not update comment" });
    }
  }
);
app.delete(
  "/commentsOfPhoto/:photo_id/:comment_id",
  requireLogin,
  async (req, res) => {
    const { photo_id, comment_id } = req.params;
    const currentUserId = req.session.user._id;

    try {
      // 1. Tìm bài viết
      const photo = await Photo.findOne({ _id: photo_id });
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }

      // 2. Tìm comment
      const theComment = photo.comments.id(comment_id);
      if (!theComment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // 3. Kiểm tra quyền: Chủ comment HOẶC Chủ bài đăng (Photo owner) mới được xóa
      const isCommentOwner =
        theComment.user_id.toString() === currentUserId.toString();
      const isPhotoOwner =
        photo.user_id.toString() === currentUserId.toString();

      if (!isCommentOwner && !isPhotoOwner) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this comment" });
      }

      // 4. Xóa comment khỏi mảng
      photo.comments.pull(comment_id);

      await photo.save();

      console.log(`Comment ${comment_id} deleted by user ${currentUserId}`);
      res
        .status(200)
        .json({ message: "Comment deleted successfully", photo_id: photo_id });
    } catch (err) {
      console.error("Delete comment error:", err);
      res.status(500).json({ error: "Could not delete comment" });
    }
  }
);
/**
 * POST /photos/new - Upload ảnh mới
 */
/**
 * PUT /photos/:id - Sửa mô tả (caption) của ảnh
 */
app.put("/photos/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const currentUserId = req.session.user._id;

  try {
    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Kiểm tra quyền: Chỉ chủ ảnh mới được sửa
    if (photo.user_id.toString() !== currentUserId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Cập nhật description
    photo.description = description;
    await photo.save();

    console.log(`Photo ${id} caption updated by ${currentUserId}`);
    res.status(200).json(photo);
  } catch (err) {
    console.error("Update photo error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post(
  "/photos/new",
  requireLogin,
  upload.single("photo"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No photo uploaded" });
    }

    try {
      const newPhoto = new Photo({
        _id: new mongoose.Types.ObjectId().toString(),
        file_name: req.file.filename,
        date_time: new Date(),
        user_id: req.session.user._id,
        comments: [],
      });

      await newPhoto.save();

      res.json({
        _id: newPhoto._id,
        file_name: newPhoto.file_name,
        date_time: newPhoto.date_time,
        user_id: newPhoto.user_id,
      });
    } catch (error) {
      console.error("Upload photo error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);
/**
 * DELETE /photos/:id - Xóa ảnh
 */
app.delete("/photos/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.session.user._id;

  try {
    // 1. Tìm ảnh để lấy tên file (file_name)
    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // 2. Kiểm tra quyền: Chỉ chủ ảnh mới được xóa
    if (photo.user_id.toString() !== currentUserId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 3. Xóa file ảnh vật lý trong thư mục (Optional - nhưng khuyên dùng)
    const filePath = path.join(
      __dirname,
      "../photo-sharing-v1/src/images",
      photo.file_name
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Xóa file
    }

    // 4. Xóa ảnh khỏi Database
    await Photo.deleteOne({ _id: id });

    console.log(`Photo ${id} deleted by user ${currentUserId}`);
    res.status(200).json({ message: "Photo deleted" });
  } catch (err) {
    console.error("Delete photo error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
/**
 * POST /photos/:id/like - Thả tim hoặc Bỏ tim (Toggle)
 */
app.post("/photos/:id/like", requireLogin, async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user._id;

  try {
    const photo = await Photo.findById(id);
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    // Đảm bảo mảng likes tồn tại (đề phòng ảnh cũ chưa có field này)
    if (!photo.likes) photo.likes = [];

    // Kiểm tra xem user đã like chưa
    const index = photo.likes.indexOf(userId);

    if (index === -1) {
      // Chưa like -> Thêm vào (LIKE)
      photo.likes.push(userId);
    } else {
      // Đã like -> Xóa đi (UNLIKE)
      photo.likes.splice(index, 1);
    }

    await photo.save();

    // Trả về danh sách likes mới nhất để Frontend cập nhật
    res.status(200).json(photo.likes);
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/test/info", (req, res) => {
  res.json({
    version: "2.0.0",
    description: "Final Project Photo Sharing API",
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`Server running on https://w267l6-8080.csb.app`);
  console.log(
    "Images served from: " +
      path.join(__dirname, "../photo-sharing-v1/src/images")
  ); // ĐÃ SỬA
});
