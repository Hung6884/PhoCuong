# Phở Cường — Hướng dẫn chạy dự án

## Yêu cầu cài đặt

| Công cụ | Tải về |
|---------|--------|
| Docker Desktop | https://www.docker.com/products/docker-desktop |
| Go 1.21+ | https://go.dev/dl |
| Node.js 18+ | https://nodejs.org |

---

## Cách 1: Chạy để phát triển (Khuyến nghị)

Dùng Docker cho MySQL, chạy backend và frontend trực tiếp.  
**Ưu điểm:** Frontend tự reload khi sửa code, không cần build lại.

### Bước 1 — Khởi động MySQL

```bash
docker-compose up -d mysql
```

Chờ khoảng 10 giây để MySQL sẵn sàng.

### Bước 2 — Chạy Backend (Go)

Mở terminal mới:

```bash
cd backend
go run .
```

Backend chạy tại `http://localhost:8080`  
Lần đầu chạy sẽ tự tạo bảng và dữ liệu mẫu.

### Bước 3 — Chạy Frontend (React)

Mở terminal mới:

```bash
cd frontend
npm install     # chỉ cần lần đầu
npm run dev
```

Truy cập: **http://localhost:5173**

### Khi sửa code

- Sửa file `.tsx` (React) → trình duyệt **tự động reload**
- Sửa file `.go` (Go) → nhấn `Ctrl+C` rồi chạy lại `go run .`

---

## Cách 2: Chạy hoàn toàn bằng Docker

Toàn bộ ứng dụng trong Docker, không cần cài Go hay Node.js.

### Bước 1 — Build frontend

```bash
cd frontend
npm install
npm run build
```

Frontend được build vào thư mục `backend/static/`.

### Bước 2 — Khởi động tất cả

```bash
docker-compose up --build -d
```

Truy cập: **http://localhost:8080**

### Khi sửa code

```bash
# Sau khi sửa frontend
cd frontend && npm run build
docker-compose restart backend

# Sau khi sửa backend (Go)
docker-compose up --build -d backend

# Sau khi sửa cả hai
cd frontend && npm run build && cd ..
docker-compose up --build -d backend
```

### Dừng ứng dụng

```bash
docker-compose down
```

---

## Tài khoản đăng nhập mẫu

| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| Admin | admin@phocuong.vn | admin123 |
| Nhân viên | staff@phocuong.vn | staff123 |
| Khách hàng | customer@phocuong.vn | customer123 |

---

## Cấu trúc thư mục

```
PhoCuong/
├── backend/            # Go API server
│   ├── main.go         # Điểm khởi động, seed dữ liệu
│   ├── config/         # Kết nối database
│   ├── models/         # Cấu trúc dữ liệu (User, Order...)
│   ├── handlers/       # Xử lý API request
│   ├── middleware/     # JWT auth
│   └── static/         # Frontend build (tự động tạo)
├── frontend/           # React app
│   └── src/
│       ├── pages/      # Các trang (Home, Menu, Admin...)
│       ├── components/ # Navbar, Footer
│       ├── api/        # Gọi API backend
│       └── contexts/   # Auth state
└── docker-compose.yml  # Cấu hình Docker
```

---

## API kiểm tra

```
GET http://localhost:8080/health
```

Trả về `{"status":"ok"}` nếu backend đang chạy.
