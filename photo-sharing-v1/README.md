# HƯỚNG DẪN SETUP DỰ ÁN PHOTO SHARING APP (FULL STACK)

Tài liệu này hướng dẫn cách cài đặt và chạy dự án từ con số 0 trên một máy tính mới. Tech Stack: **MERN (MongoDB, Express, React, Node.js)**.

---

## 🛠 PHẦN 1: CÀI ĐẶT MÔI TRƯỜNG (PREREQUISITES)

Trước khi chạm vào code, máy tính cần được cài đặt các phần mềm sau:

### Node.js & npm:
- Tải bản LTS (Long Term Support) tại: https://nodejs.org/
- Kiểm tra sau khi cài (mở Terminal/CMD):
```bash
node -v
npm -v
```

### MongoDB:
- Tải MongoDB Community Server: [Link tải](https://www.mongodb.com/try/download/community)
- Tải MongoDB Compass (Giao diện quản lý DB): [Link tải](https://www.mongodb.com/try/download/compass)
- **Lưu ý:** Khi cài đặt xong, hãy chắc chắn MongoDB Service đang chạy (thường là `mongodb://127.0.0.1:27017`).

### Visual Studio Code (VS Code):
Trình soạn thảo code (Khuyên dùng).

---

## 📂 PHẦN 2: CHUẨN BỊ SOURCE CODE

Đảm bảo bạn đã copy toàn bộ source code về máy. Cấu trúc thư mục chuẩn phải trông như sau:

```
Project-Folder/
├── lab3/                  <-- THƯ MỤC BACKEND
│   ├── db/                <-- Chứa schema (userModel.js, photoModel.js...)
│   ├── webServer.js       <-- File chạy server chính
│   ├── initData.js        <-- Script nạp dữ liệu mẫu
│   └── package.json
│
└── photo-sharing-v1/      <-- THƯ MỤC FRONTEND
    ├── public/
    │   └── images/        <-- QUAN TRỌNG: Chứa ảnh user và ảnh upload
    ├── src/
    │   ├── components/
    │   ├── lib/
    │   └── App.js
    └── package.json
```

---

## ⚙️ PHẦN 3: SETUP BACKEND (Folder lab3)

Mở Terminal (hoặc CMD/PowerShell) và thực hiện lần lượt:

### Bước 1: Cài đặt thư viện

Di chuyển vào thư mục backend và cài các gói cần thiết (express, mongoose, multer, session, v.v.):

```bash
cd lab3
npm install
```

(Nếu máy chưa có node_modules, lệnh này sẽ tự tải dựa trên package.json. Nếu package.json chưa đủ, hãy chạy lệnh thủ công dưới đây để chắc chắn):

```bash
npm install express mongoose multer express-session body-parser cors async
```

### Bước 2: Nạp dữ liệu mẫu (Database Seeding)

Bước này **cực kỳ quan trọng** để tạo User, Password và Ảnh mẫu vào MongoDB.

```bash
node initData.js
```

- **Thành công:** Terminal báo "Done" hoặc "Data loaded".
- **Kiểm tra:** Mở MongoDB Compass, kết nối vào `mongodb://127.0.0.1:27017`. Tìm database tên `cs142project6`, kiểm tra xem đã có collection `users` và `photos` chưa.
- **Lưu ý:** Script này đã tạo sẵn user với password mặc định là `123`.

### Bước 3: Khởi chạy Server

```bash
node webServer.js
```

Server sẽ báo: `Listening at http://localhost:3001` (hoặc port 3000 tùy code, nhưng theo hướng dẫn trước là 3001).

**⚠️ GIỮ NGUYÊN TERMINAL NÀY, KHÔNG ĐƯỢC TẮT.**

---

## 🎨 PHẦN 4: SETUP FRONTEND (Folder photo-sharing-v1)

Mở một cửa sổ Terminal **MỚI** (Terminal thứ 2).

### Bước 1: Cài đặt thư viện Frontend

Di chuyển vào thư mục frontend:

```bash
cd photo-sharing-v1
npm install
```

(Nếu cần cài thủ công các thư viện giao diện và logic):

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material axios react-router-dom prop-types
```

### Bước 2: Kiểm tra thư mục ảnh (BẮT BUỘC)

Hãy chắc chắn rằng folder `photo-sharing-v1/public/images` đang chứa các file ảnh mẫu (kenobi1.jpg, ripley1.jpg...).

- **Nếu thư mục này trống:** Web sẽ không hiện ảnh.
- **Nếu ảnh đang ở `src/images`:** Hãy copy chúng sang `public/images`.

### Bước 3: Khởi chạy Ứng dụng React

```bash
npm start
```

Trình duyệt sẽ tự mở tại địa chỉ: `http://localhost:3000`.

---

## ✅ PHẦN 5: CÁCH SỬ DỤNG & TEST (VERIFICATION)

Khi cả 2 terminal đều đang chạy (Backend port 3001, Frontend port 3000):

### Đăng nhập (Login):
1. Trang web sẽ tự chuyển về trang Login.
2. Nhập **Login Name:** `kenobi` (hoặc `ripley`, `took`...).
3. **Password:** `123` (Mặc định do script tạo).
4. Bấm **Login**.

### Test Upload Ảnh:
1. Nhìn lên thanh TopBar, bấm nút **Add Photo** (Icon máy ảnh).
2. Chọn một file ảnh bất kỳ từ máy tính -> Upload.
3. Ảnh mới phải xuất hiện ngay lập tức trong trang My Photos.
4. **Kiểm tra folder:** File ảnh mới phải xuất hiện trong `photo-sharing-v1/public/images`.

### Test Comment:
1. Vào xem ảnh của user khác.
2. Gõ nội dung vào ô comment -> Bấm nút **Gửi** (Icon Send).
3. Comment phải hiện ra ngay lập tức.

### Test Logout:
1. Bấm nút **Logout** trên thanh TopBar -> Phải quay về màn hình Login.

---

## ❓ XỬ LÝ SỰ CỐ (TROUBLESHOOTING)

### Lỗi "Network Error" hoặc không hiện ảnh, không login được:
- Kiểm tra xem Terminal Backend (`node webServer.js`) có đang chạy không? Hay bị tắt rồi?
- Kiểm tra xem MongoDB có đang chạy không?

### Lỗi ảnh bị vỡ (Broken Image):
- Kiểm tra xem ảnh có thực sự nằm trong `photo-sharing-v1/public/images` không.

### Lỗi "Module not found":
- Chạy lại `npm install` ở thư mục bị báo lỗi (Frontend hoặc Backend).

---

**Chúc bạn setup thành công!** 🎉
