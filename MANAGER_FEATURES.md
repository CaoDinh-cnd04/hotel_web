# Gợi ý các chức năng cho Hotel Manager Dashboard

## 📋 Tổng quan các chức năng

### 1. **Tổng quan (Overview)**
- Thống kê tổng quan khách sạn:
  - Số phòng trống/đã đặt
  - Doanh thu hôm nay/tuần/tháng
  - Tỷ lệ lấp đầy (occupancy rate)
  - Số đặt phòng mới
  - Đánh giá trung bình
  - Biểu đồ doanh thu theo thời gian
  - Top phòng được đặt nhiều nhất

### 2. **Quản lý phòng (Rooms)**
- Xem danh sách tất cả phòng
- Thêm/Sửa/Xóa phòng
- Cập nhật trạng thái phòng (Trống/Đã đặt/Đang bảo trì)
- Quản lý giá phòng theo ngày/giờ cao điểm
- Upload hình ảnh phòng
- Quản lý tiện ích phòng (WiFi, TV, Minibar, v.v.)
- Đặt phòng là "không khả dụng" (maintenance mode)

### 3. **Quản lý đặt phòng (Bookings)**
- Xem tất cả đặt phòng của khách sạn
- Xác nhận/Hủy đặt phòng
- Check-in/Check-out
- Tìm kiếm đặt phòng theo tên, mã đặt phòng, ngày
- Lọc theo trạng thái (Đã xác nhận/Chờ xác nhận/Đã hủy)
- Xem chi tiết đặt phòng
- In hóa đơn
- Gửi email xác nhận cho khách

### 4. **Dịch vụ khách sạn (Services)**
- Quản lý các dịch vụ: Spa, Gym, Pool, Restaurant, v.v.
- Thêm/Sửa/Xóa dịch vụ
- Quản lý giá dịch vụ
- Đặt lịch dịch vụ
- Xem lịch sử sử dụng dịch vụ

### 5. **Thống kê (Statistics)**
- Doanh thu theo ngày/tuần/tháng/năm
- Biểu đồ doanh thu
- Tỷ lệ lấp đầy phòng
- Top khách hàng
- Phòng được đặt nhiều nhất
- Thời gian lưu trú trung bình
- Xu hướng đặt phòng
- So sánh với các tháng trước

### 6. **Đánh giá (Reviews)**
- Xem tất cả đánh giá của khách
- Phản hồi đánh giá
- Lọc theo điểm số (1-5 sao)
- Xem đánh giá chi tiết
- Thống kê điểm đánh giá trung bình
- Top đánh giá tích cực/tiêu cực

### 7. **Cài đặt khách sạn (Hotel Settings)**
- Cập nhật thông tin khách sạn:
  - Tên khách sạn
  - Địa chỉ
  - Số điện thoại
  - Email
  - Mô tả
  - Chính sách
- Upload logo và hình ảnh khách sạn
- Cài đặt chính sách:
  - Giờ check-in/check-out
  - Chính sách hủy phòng
  - Chính sách trẻ em
  - Chính sách thú cưng
- Quản lý tiện ích khách sạn
- Cài đặt giá phòng mặc định

### 8. **Hồ sơ Manager (Profile)**
- Xem và chỉnh sửa thông tin cá nhân
- Đổi mật khẩu
- Upload avatar
- Xem lịch sử hoạt động

## 🎨 Gợi ý UI/UX

1. **Dashboard Overview**: 
   - Cards hiển thị số liệu quan trọng
   - Biểu đồ trực quan (Chart.js hoặc Recharts)
   - Màu sắc phân biệt: Xanh (tốt), Vàng (cảnh báo), Đỏ (cần chú ý)

2. **Color Scheme**:
   - Manager: Màu xanh lá/emerald (khác với Admin màu xanh dương)
   - Sidebar: Dark slate với accent emerald
   - Buttons: Emerald-500/600

3. **Responsive Design**:
   - Mobile-friendly
   - Table có thể scroll ngang trên mobile

4. **Notifications**:
   - Thông báo đặt phòng mới
   - Cảnh báo phòng sắp check-out
   - Nhắc nhở cập nhật giá phòng

## 🔐 Phân quyền

- Manager chỉ có thể:
  - Quản lý khách sạn của chính họ
  - Xem đặt phòng của khách sạn họ
  - Không thể quản lý user khác
  - Không thể tạo/xóa khách sạn khác

## 📝 Lưu ý

- Tất cả dữ liệu liên quan đến khách sạn của manager
- Cần filter theo `ma_khach_san` của manager
- Manager có thể có nhiều khách sạn (nếu cần)



