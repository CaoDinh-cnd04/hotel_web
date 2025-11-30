# API Integration Summary

## Đã hoàn thành

### 1. API Service Setup
- ✅ Tạo `src/config/api.js` - Cấu hình API endpoints
- ✅ Tạo `src/services/api.js` - API client với axios
- ✅ Cài đặt axios package

### 2. Các trang đã kết nối API

#### ✅ Rooms (Quản lý phòng)
- Fetch danh sách phòng từ `/api/v2/phong`
- Xóa phòng qua API
- Loading và error states
- Tìm kiếm phòng

#### ✅ Discounts (Quản lý mã giảm giá)
- Fetch danh sách mã giảm giá từ `/api/v2/magiamgia`
- Thêm mã giảm giá mới qua API
- Xóa mã giảm giá qua API
- Loading và error states
- Hiển thị trạng thái (Hoạt động/Sắp diễn ra/Đã kết thúc)

### 3. Các trang cần cập nhật tiếp

#### ⏳ Hotels (Quản lý khách sạn)
- Cần fetch từ `/api/v2/khachsan`
- Cần fetch reviews từ `/api/v2/danhgia?ma_khach_san=...`

#### ⏳ Users (Quản lý người dùng)
- Cần fetch từ `/api/v2/nguoidung`
- Cần approve/block user qua API

#### ⏳ Bookings (Quản lý đặt phòng)
- Cần fetch từ `/api/v2/phieudatphong`
- Cần update status qua API

#### ⏳ Overview (Tổng quan)
- Cần fetch stats từ `/api/v2/admin/stats` hoặc tính từ các API khác

## Cách sử dụng

1. Đảm bảo backend đang chạy tại `http://localhost:5000`
2. Nếu cần authentication, thêm token vào localStorage:
   ```javascript
   localStorage.setItem('admin_token', 'your-token-here')
   ```
3. API sẽ tự động thêm token vào header Authorization

## Lưu ý

- Một số endpoint yêu cầu Admin role
- Cần kiểm tra response format từ backend để map đúng field names
- Error handling đã được tích hợp sẵn


