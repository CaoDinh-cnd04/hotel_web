// Mock data for testing UI before API integration

export const mockHotels = [
  {
    ma_khach_san: 1,
    ten_khach_san: 'The Lumière Riverside',
    dia_chi: '12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    so_sao: 5,
    trang_thai: 1,
    mo_ta: 'Khách sạn 5 sao sang trọng với view sông Sài Gòn tuyệt đẹp'
  },
  {
    ma_khach_san: 2,
    ten_khach_san: 'Highland Retreat Đà Lạt',
    dia_chi: '25 Hùng Vương, P.10, Đà Lạt, Lâm Đồng',
    so_sao: 4,
    trang_thai: 1,
    mo_ta: 'Resort nghỉ dưỡng với không khí trong lành và vườn hoa đẹp'
  },
  {
    ma_khach_san: 3,
    ten_khach_san: 'Sea Breeze Resort Phú Quốc',
    dia_chi: '45 Trần Hưng Đạo, Dương Đông, Phú Quốc, Kiên Giang',
    so_sao: 5,
    trang_thai: 0,
    mo_ta: 'Resort biển cao cấp với bãi biển riêng và spa'
  },
  {
    ma_khach_san: 4,
    ten_khach_san: 'Hanoi Grand Hotel',
    dia_chi: '8 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    so_sao: 4,
    trang_thai: 1,
    mo_ta: 'Khách sạn trung tâm Hà Nội, gần Hồ Hoàn Kiếm'
  },
  {
    ma_khach_san: 5,
    ten_khach_san: 'Da Nang Beachfront Hotel',
    dia_chi: '123 Bạch Đằng, Hải Châu, Đà Nẵng',
    so_sao: 4,
    trang_thai: 1,
    mo_ta: 'Khách sạn view biển với hồ bơi vô cực'
  },
  {
    ma_khach_san: 6,
    ten_khach_san: 'Nha Trang Ocean View',
    dia_chi: '56 Trần Phú, Nha Trang, Khánh Hòa',
    so_sao: 5,
    trang_thai: 1,
    mo_ta: 'Resort biển 5 sao với nhiều tiện ích giải trí'
  },
  {
    ma_khach_san: 7,
    ten_khach_san: 'Hue Imperial Hotel',
    dia_chi: '78 Lê Lợi, Phú Hội, Huế',
    so_sao: 4,
    trang_thai: 1,
    mo_ta: 'Khách sạn gần Đại Nội, phong cách kiến trúc cổ điển'
  },
  {
    ma_khach_san: 8,
    ten_khach_san: 'Sapa Mountain Lodge',
    dia_chi: '12 Cầu Mây, Sapa, Lào Cai',
    so_sao: 3,
    trang_thai: 1,
    mo_ta: 'Lodge trên núi với view ruộng bậc thang'
  },
  {
    ma_khach_san: 9,
    ten_khach_san: 'Hoi An Ancient Town Hotel',
    dia_chi: '34 Nguyễn Thái Học, Hội An, Quảng Nam',
    so_sao: 4,
    trang_thai: 1,
    mo_ta: 'Khách sạn trong phố cổ Hội An, gần sông Hoài'
  },
  {
    ma_khach_san: 10,
    ten_khach_san: 'Mui Ne Beach Resort',
    dia_chi: '89 Nguyễn Đình Chiểu, Mũi Né, Bình Thuận',
    so_sao: 4,
    trang_thai: 0,
    mo_ta: 'Resort biển với nhiều hoạt động thể thao nước'
  }
]

// Helper function to generate rooms for a hotel
const generateRoomsForHotel = (hotelId, startRoomId, roomCount = 10) => {
  const rooms = []
  const roomTypes = [
    { id: 4, name: 'Phòng Gia Đình', basePrice: 2000000 },
    { id: 5, name: 'Phòng Suite', basePrice: 3000000 },
    { id: 6, name: 'Phòng Deluxe', basePrice: 1500000 },
    { id: 7, name: 'Phòng Executive', basePrice: 4000000 }
  ]
  
  const statusOptions = ['trống', 'đang sử dụng', 'bảo trì']
  const paymentStatusOptions = ['đã thanh toán', 'chưa thanh toán', 'đang chờ']
  const paymentMethods = ['VNPay', 'MoMo', 'Tiền mặt', 'Chuyển khoản']
  
  for (let i = 0; i < roomCount; i++) {
    const roomType = roomTypes[i % roomTypes.length]
    const floor = Math.floor(i / 4) + 1
    const roomOnFloor = (i % 4) + 1
    const roomNumber = `${floor}${String(roomOnFloor).padStart(2, '0')}`
    
    // Phòng có thể hủy (50% chance) - giá cao hơn 20%
    const coTheHuy = Math.random() > 0.5
    const giaPhong = coTheHuy 
      ? Math.round(roomType.basePrice * 1.2)
      : roomType.basePrice
    
    // Trạng thái sử dụng
    const trangThaiSuDung = statusOptions[Math.floor(Math.random() * statusOptions.length)]
    
    // Nếu phòng đang sử dụng thì có thông tin thanh toán
    let trangThaiThanhToan = null
    let phuongThucThanhToan = null
    
    if (trangThaiSuDung === 'đang sử dụng') {
      trangThaiThanhToan = paymentStatusOptions[Math.floor(Math.random() * paymentStatusOptions.length)]
      if (trangThaiThanhToan === 'đã thanh toán' || trangThaiThanhToan === 'đang chờ') {
        phuongThucThanhToan = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      }
    }
    
    rooms.push({
      ma_phong: startRoomId + i,
      so_phong: roomNumber,
      ten_phong: `${roomType.name} ${roomNumber}`,
      ma_khach_san: hotelId,
      ma_loai_phong: roomType.id,
      gia_phong: giaPhong,
      trang_thai: trangThaiSuDung === 'bảo trì' ? 0 : 1,
      co_the_huy: coTheHuy,
      trang_thai_su_dung: trangThaiSuDung,
      trang_thai_thanh_toan: trangThaiThanhToan,
      phuong_thuc_thanh_toan: phuongThucThanhToan
    })
  }
  
  return rooms
}

// Generate ~10 rooms for each hotel (10 hotels = ~100 rooms)
export const mockRooms = [
  // Hotel 1: The Lumière Riverside (5 sao)
  ...generateRoomsForHotel(1, 1, 10),
  // Hotel 2: Highland Retreat Đà Lạt (4 sao)
  ...generateRoomsForHotel(2, 11, 10),
  // Hotel 3: Sea Breeze Resort Phú Quốc (5 sao)
  ...generateRoomsForHotel(3, 21, 10),
  // Hotel 4: Hanoi Grand Hotel (4 sao)
  ...generateRoomsForHotel(4, 31, 10),
  // Hotel 5: Da Nang Beachfront Hotel (4 sao)
  ...generateRoomsForHotel(5, 41, 10),
  // Hotel 6: Nha Trang Ocean View (5 sao)
  ...generateRoomsForHotel(6, 51, 10),
  // Hotel 7: Hue Imperial Hotel (4 sao)
  ...generateRoomsForHotel(7, 61, 10),
  // Hotel 8: Sapa Mountain Lodge (3 sao)
  ...generateRoomsForHotel(8, 71, 10),
  // Hotel 9: Hoi An Ancient Town Hotel (4 sao)
  ...generateRoomsForHotel(9, 81, 10),
  // Hotel 10: Mui Ne Beach Resort (4 sao)
  ...generateRoomsForHotel(10, 91, 10)
]

export const mockUsers = [
  {
    ma_nguoi_dung: 1,
    ho_ten: 'Trần Minh Khôi',
    email: 'khoi.tran@example.com',
    sdt: '0901234567',
    vai_tro: 'Customer',
    trang_thai: 1,
    ngay_tao: '2024-11-02T10:30:00Z'
  },
  {
    ma_nguoi_dung: 2,
    ho_ten: 'Lê Thảo Vy',
    email: 'thaovy.le@example.com',
    sdt: '0912345678',
    vai_tro: 'HotelOwner',
    trang_thai: 2,
    ngay_tao: '2024-12-18T14:20:00Z'
  },
  {
    ma_nguoi_dung: 3,
    ho_ten: 'Phạm Gia Huy',
    email: 'giahuy@example.com',
    sdt: '0923456789',
    vai_tro: 'Admin',
    trang_thai: 1,
    ngay_tao: '2023-08-10T09:15:00Z'
  },
  {
    ma_nguoi_dung: 4,
    ho_ten: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@example.com',
    sdt: '0934567890',
    vai_tro: 'Customer',
    trang_thai: 1,
    ngay_tao: '2024-10-15T11:45:00Z'
  },
  {
    ma_nguoi_dung: 5,
    ho_ten: 'Hoàng Văn Đức',
    email: 'duc.hoang@example.com',
    sdt: '0945678901',
    vai_tro: 'HotelOwner',
    trang_thai: 1,
    ngay_tao: '2024-09-20T16:30:00Z'
  },
  {
    ma_nguoi_dung: 6,
    ho_ten: 'Võ Thị Lan',
    email: 'lan.vo@example.com',
    sdt: '0956789012',
    vai_tro: 'Customer',
    trang_thai: 0,
    ngay_tao: '2024-08-05T13:20:00Z'
  },
  {
    ma_nguoi_dung: 7,
    ho_ten: 'Đặng Minh Tuấn',
    email: 'tuan.dang@example.com',
    sdt: '0967890123',
    vai_tro: 'HotelOwner',
    trang_thai: 2,
    ngay_tao: '2024-12-20T10:10:00Z'
  },
  {
    ma_nguoi_dung: 8,
    ho_ten: 'Bùi Thị Hương',
    email: 'huong.bui@example.com',
    sdt: '0978901234',
    vai_tro: 'Customer',
    trang_thai: 1,
    ngay_tao: '2024-11-25T15:50:00Z'
  },
  {
    ma_nguoi_dung: 9,
    ho_ten: 'Lý Văn Nam',
    email: 'nam.ly@example.com',
    sdt: '0989012345',
    vai_tro: 'Customer',
    trang_thai: 1,
    ngay_tao: '2024-10-30T12:00:00Z'
  },
  {
    ma_nguoi_dung: 10,
    ho_ten: 'Trương Thị Hoa',
    email: 'hoa.truong@example.com',
    sdt: '0990123456',
    vai_tro: 'HotelOwner',
    trang_thai: 1,
    ngay_tao: '2024-09-15T14:40:00Z'
  }
]

export const mockBookings = [
  {
    ma_phieu_dat: 'BK-0001',
    ma_khach_san: 1,
    ten_khach_san: 'The Lumière Riverside',
    ma_nguoi_dung: 1,
    ho_ten: 'Trần Minh Khôi',
    ngay_checkin: '2025-03-12T14:00:00Z',
    ngay_checkout: '2025-03-15T12:00:00Z',
    so_phong: 2,
    tong_tien: 7500000,
    trang_thai: 'confirmed'
  },
  {
    ma_phieu_dat: 'BK-0002',
    ma_khach_san: 2,
    ten_khach_san: 'Highland Retreat Đà Lạt',
    ma_nguoi_dung: 4,
    ho_ten: 'Nguyễn Thị Mai',
    ngay_checkin: '2025-03-20T14:00:00Z',
    ngay_checkout: '2025-03-22T12:00:00Z',
    so_phong: 1,
    tong_tien: 2300000,
    trang_thai: 'pending'
  },
  {
    ma_phieu_dat: 'BK-0003',
    ma_khach_san: 3,
    ten_khach_san: 'Sea Breeze Resort Phú Quốc',
    ma_nguoi_dung: 8,
    ho_ten: 'Bùi Thị Hương',
    ngay_checkin: '2025-04-01T14:00:00Z',
    ngay_checkout: '2025-04-05T12:00:00Z',
    so_phong: 1,
    tong_tien: 5900000,
    trang_thai: 'cancelled'
  },
  {
    ma_phieu_dat: 'BK-0004',
    ma_khach_san: 4,
    ten_khach_san: 'Hanoi Grand Hotel',
    ma_nguoi_dung: 9,
    ho_ten: 'Lý Văn Nam',
    ngay_checkin: '2025-02-10T14:00:00Z',
    ngay_checkout: '2025-02-12T12:00:00Z',
    so_phong: 1,
    tong_tien: 3600000,
    trang_thai: 'confirmed'
  },
  {
    ma_phieu_dat: 'BK-0005',
    ma_khach_san: 5,
    ten_khach_san: 'Da Nang Beachfront Hotel',
    ma_nguoi_dung: 1,
    ho_ten: 'Trần Minh Khôi',
    ngay_checkin: '2025-03-25T14:00:00Z',
    ngay_checkout: '2025-03-28T12:00:00Z',
    so_phong: 2,
    tong_tien: 8400000,
    trang_thai: 'confirmed'
  },
  {
    ma_phieu_dat: 'BK-0006',
    ma_khach_san: 6,
    ten_khach_san: 'Nha Trang Ocean View',
    ma_nguoi_dung: 4,
    ho_ten: 'Nguyễn Thị Mai',
    ngay_checkin: '2025-04-15T14:00:00Z',
    ngay_checkout: '2025-04-18T12:00:00Z',
    so_phong: 1,
    tong_tien: 6600000,
    trang_thai: 'pending'
  },
  {
    ma_phieu_dat: 'BK-0007',
    ma_khach_san: 7,
    ten_khach_san: 'Hue Imperial Hotel',
    ma_nguoi_dung: 8,
    ho_ten: 'Bùi Thị Hương',
    ngay_checkin: '2025-02-20T14:00:00Z',
    ngay_checkout: '2025-02-22T12:00:00Z',
    so_phong: 1,
    tong_tien: 2400000,
    trang_thai: 'confirmed'
  },
  {
    ma_phieu_dat: 'BK-0008',
    ma_khach_san: 8,
    ten_khach_san: 'Sapa Mountain Lodge',
    ma_nguoi_dung: 9,
    ho_ten: 'Lý Văn Nam',
    ngay_checkin: '2025-03-05T14:00:00Z',
    ngay_checkout: '2025-03-07T12:00:00Z',
    so_phong: 1,
    tong_tien: 1800000,
    trang_thai: 'confirmed'
  },
  {
    ma_phieu_dat: 'BK-0009',
    ma_khach_san: 9,
    ten_khach_san: 'Hoi An Ancient Town Hotel',
    ma_nguoi_dung: 1,
    ho_ten: 'Trần Minh Khôi',
    ngay_checkin: '2025-04-10T14:00:00Z',
    ngay_checkout: '2025-04-13T12:00:00Z',
    so_phong: 2,
    tong_tien: 7200000,
    trang_thai: 'pending'
  },
  {
    ma_phieu_dat: 'BK-0010',
    ma_khach_san: 10,
    ten_khach_san: 'Mui Ne Beach Resort',
    ma_nguoi_dung: 4,
    ho_ten: 'Nguyễn Thị Mai',
    ngay_checkin: '2025-05-01T14:00:00Z',
    ngay_checkout: '2025-05-04T12:00:00Z',
    so_phong: 1,
    tong_tien: 5400000,
    trang_thai: 'confirmed'
  }
]

export const mockDiscounts = [
  {
    ma_magiamgia: 1,
    ma_giam_gia: 'SUMMER50',
    ten_ma_giam_gia: 'Ưu đãi mùa hè',
    loai_giam_gia: 'percentage',
    gia_tri_giam: 50,
    ngay_bat_dau: '2025-06-01',
    ngay_ket_thuc: '2025-08-31',
    trang_thai: 1
  },
  {
    ma_magiamgia: 2,
    ma_giam_gia: 'TET2025',
    ten_ma_giam_gia: 'Tết 2025',
    loai_giam_gia: 'percentage',
    gia_tri_giam: 25,
    ngay_bat_dau: '2025-01-15',
    ngay_ket_thuc: '2025-02-15',
    trang_thai: 1
  },
  {
    ma_magiamgia: 3,
    ma_giam_gia: 'FLASH10',
    ten_ma_giam_gia: 'Flash Sale 10%',
    loai_giam_gia: 'percentage',
    gia_tri_giam: 10,
    ngay_bat_dau: '2025-11-05',
    ngay_ket_thuc: '2025-11-10',
    trang_thai: 1
  },
  {
    ma_magiamgia: 4,
    ma_giam_gia: 'WELCOME20',
    ten_ma_giam_gia: 'Chào mừng khách mới',
    loai_giam_gia: 'percentage',
    gia_tri_giam: 20,
    ngay_bat_dau: '2025-01-01',
    ngay_ket_thuc: '2025-12-31',
    trang_thai: 1
  },
  {
    ma_magiamgia: 5,
    ma_giam_gia: 'WEEKEND15',
    ten_ma_giam_gia: 'Giảm giá cuối tuần',
    loai_giam_gia: 'percentage',
    gia_tri_giam: 15,
    ngay_bat_dau: '2025-01-01',
    ngay_ket_thuc: '2025-12-31',
    trang_thai: 1
  },
  {
    ma_magiamgia: 6,
    ma_giam_gia: 'VIP30',
    ten_ma_giam_gia: 'Ưu đãi VIP',
    loai_giam_gia: 'percentage',
    gia_tri_giam: 30,
    ngay_bat_dau: '2025-03-01',
    ngay_ket_thuc: '2025-03-31',
    trang_thai: 1
  },
  {
    ma_magiamgia: 7,
    ma_giam_gia: 'SPRING40',
    ten_ma_giam_gia: 'Khuyến mãi mùa xuân',
    loai_giam_gia: 'percentage',
    gia_tri_giam: 40,
    ngay_bat_dau: '2025-02-01',
    ngay_ket_thuc: '2025-04-30',
    trang_thai: 1
  },
  {
    ma_magiamgia: 8,
    ma_giam_gia: 'EARLYBIRD25',
    ten_ma_giam_gia: 'Đặt sớm giảm 25%',
    loai_giam_gia: 'percentage',
    gia_tri_giam: 25,
    ngay_bat_dau: '2025-01-01',
    ngay_ket_thuc: '2025-06-30',
    trang_thai: 1
  },
  {
    ma_magiamgia: 9,
    ma_giam_gia: 'STUDENT35',
    ten_ma_giam_gia: 'Ưu đãi sinh viên',
    loai_giam_gia: 'percentage',
    gia_tri_giam: 35,
    ngay_bat_dau: '2025-01-01',
    ngay_ket_thuc: '2025-12-31',
    trang_thai: 1
  },
  {
    ma_magiamgia: 10,
    ma_giam_gia: 'FAMILY60',
    ten_ma_giam_gia: 'Gói gia đình',
    loai_giam_gia: 'percentage',
    gia_tri_giam: 60,
    ngay_bat_dau: '2025-06-01',
    ngay_ket_thuc: '2025-08-31',
    trang_thai: 1
  }
]

// Mock reviews grouped by hotel (for Hotels page)
export const mockReviews = {
  1: [
    {
      ma_danh_gia: 1,
      ma_khach_san: 1,
      ma_nguoi_dung: 1,
      ho_ten: 'Mai Anh',
      status: 'Đã duyệt',
      trang_thai: 'Đã duyệt',
      diem_danh_gia: 5,
      noi_dung: 'Phòng sạch sẽ, view sông tuyệt đẹp, nhân viên thân thiện.',
      ngay_danh_gia: '2024-11-02T10:30:00Z'
    },
    {
      ma_danh_gia: 2,
      ma_khach_san: 1,
      ma_nguoi_dung: 4,
      ho_ten: 'Ngọc Huy',
      status: 'Đã duyệt',
      trang_thai: 'Đã duyệt',
      diem_danh_gia: 4,
      noi_dung: 'Buffet sáng đa dạng, bể bơi hơi đông vào cuối tuần.',
      ngay_danh_gia: '2024-10-25T14:20:00Z'
    },
    {
      ma_danh_gia: 3,
      ma_khach_san: 1,
      ma_nguoi_dung: 8,
      ho_ten: 'Lan Anh',
      status: 'Đã duyệt',
      trang_thai: 'Đã duyệt',
      diem_danh_gia: 5,
      noi_dung: 'Dịch vụ tuyệt vời, sẽ quay lại lần sau.',
      ngay_danh_gia: '2024-11-15T09:15:00Z'
    }
  ],
  2: [
    {
      ma_danh_gia: 4,
      ma_khach_san: 2,
      ma_nguoi_dung: 9,
      ho_ten: 'Trúc Phương',
      status: 'Đã duyệt',
      trang_thai: 'Đã duyệt',
      diem_danh_gia: 4,
      noi_dung: 'Không khí trong lành, vườn hoa đẹp, sẽ quay lại.',
      ngay_danh_gia: '2024-09-14T16:30:00Z'
    }
  ],
  3: []
}

// Mock reviews for Admin Reviews page (full format matching API response)
export const mockReviewsAdmin = [
  {
    id: 1,
    rating: 5,
    so_sao_tong: 5,
    content: 'Khách sạn tuyệt vời! Phòng sạch sẽ, view sông Sài Gòn tuyệt đẹp. Nhân viên rất thân thiện và chuyên nghiệp. Buffet sáng đa dạng và ngon miệng. Sẽ quay lại lần sau.',
    binh_luan: 'Khách sạn tuyệt vời! Phòng sạch sẽ, view sông Sài Gòn tuyệt đẹp. Nhân viên rất thân thiện và chuyên nghiệp. Buffet sáng đa dạng và ngon miệng. Sẽ quay lại lần sau.',
    review_date: '2025-01-15T10:30:00Z',
    ngay: '2025-01-15T10:30:00Z',
    status: 'Đã duyệt',
    trang_thai: 'Đã duyệt',
    hotel_response: 'Cảm ơn bạn đã đánh giá! Chúng tôi rất vui khi bạn hài lòng với dịch vụ.',
    response_date: '2025-01-16T09:00:00Z',
    hotel_id: 1,
    user_id: 1,
    booking_id: 1,
    customer_name: 'Trần Minh Khôi',
    customer_email: 'khoi.tran@example.com',
    customer_avatar: null,
    hotel_name: 'The Lumière Riverside',
    hotel_address: '12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    booking_code: 'BOOK-20250115-0001',
    room_type: 'Deluxe View Sông'
  },
  {
    id: 2,
    rating: 4,
    so_sao_tong: 4,
    content: 'Khách sạn đẹp, vị trí thuận tiện. Phòng rộng rãi và thoáng mát. Tuy nhiên wifi hơi chậm vào buổi tối. Nhân viên phục vụ tốt.',
    binh_luan: 'Khách sạn đẹp, vị trí thuận tiện. Phòng rộng rãi và thoáng mát. Tuy nhiên wifi hơi chậm vào buổi tối. Nhân viên phục vụ tốt.',
    review_date: '2025-01-12T14:20:00Z',
    ngay: '2025-01-12T14:20:00Z',
    status: 'Đã duyệt',
    trang_thai: 'Đã duyệt',
    hotel_response: null,
    response_date: null,
    hotel_id: 1,
    user_id: 4,
    booking_id: 2,
    customer_name: 'Nguyễn Thị Mai',
    customer_email: 'mai.nguyen@example.com',
    customer_avatar: null,
    hotel_name: 'The Lumière Riverside',
    hotel_address: '12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    booking_code: 'BOOK-20250112-0002',
    room_type: 'Superior'
  },
  {
    id: 3,
    rating: 5,
    so_sao_tong: 5,
    content: 'Trải nghiệm tuyệt vời! Không khí trong lành, vườn hoa đẹp mắt. Phòng ốc sạch sẽ, đầy đủ tiện nghi. Nhân viên nhiệt tình, chu đáo. Đặc biệt là spa rất thư giãn.',
    binh_luan: 'Trải nghiệm tuyệt vời! Không khí trong lành, vườn hoa đẹp mắt. Phòng ốc sạch sẽ, đầy đủ tiện nghi. Nhân viên nhiệt tình, chu đáo. Đặc biệt là spa rất thư giãn.',
    review_date: '2025-01-10T09:15:00Z',
    ngay: '2025-01-10T09:15:00Z',
    status: 'Đã duyệt',
    trang_thai: 'Đã duyệt',
    hotel_response: 'Cảm ơn bạn đã dành thời gian đánh giá! Chúng tôi rất vui khi bạn có trải nghiệm tốt tại resort.',
    response_date: '2025-01-11T08:30:00Z',
    hotel_id: 2,
    user_id: 8,
    booking_id: 3,
    customer_name: 'Bùi Thị Hương',
    customer_email: 'huong.bui@example.com',
    customer_avatar: null,
    hotel_name: 'Highland Retreat Đà Lạt',
    hotel_address: '25 Hùng Vương, P.10, Đà Lạt, Lâm Đồng',
    booking_code: 'BOOK-20250110-0003',
    room_type: 'Premium View Hồ'
  },
  {
    id: 4,
    rating: 3,
    so_sao_tong: 3,
    content: 'Khách sạn ổn nhưng cần cải thiện. Phòng sạch nhưng hơi cũ. Nhân viên thân thiện nhưng phản hồi chậm. Giá cả hợp lý.',
    binh_luan: 'Khách sạn ổn nhưng cần cải thiện. Phòng sạch nhưng hơi cũ. Nhân viên thân thiện nhưng phản hồi chậm. Giá cả hợp lý.',
    review_date: '2025-01-08T16:45:00Z',
    ngay: '2025-01-08T16:45:00Z',
    status: 'Chờ duyệt',
    trang_thai: 'Chờ duyệt',
    hotel_response: null,
    response_date: null,
    hotel_id: 4,
    user_id: 9,
    booking_id: 4,
    customer_name: 'Lý Văn Nam',
    customer_email: 'nam.ly@example.com',
    customer_avatar: null,
    hotel_name: 'Hanoi Grand Hotel',
    hotel_address: '8 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    booking_code: 'BOOK-20250108-0004',
    room_type: 'Family Room'
  },
  {
    id: 5,
    rating: 5,
    so_sao_tong: 5,
    content: 'Tuyệt vời! View biển đẹp, phòng rộng rãi. Hồ bơi vô cực rất ấn tượng. Nhân viên phục vụ chu đáo. Buffet sáng phong phú. Sẽ quay lại!',
    binh_luan: 'Tuyệt vời! View biển đẹp, phòng rộng rãi. Hồ bơi vô cực rất ấn tượng. Nhân viên phục vụ chu đáo. Buffet sáng phong phú. Sẽ quay lại!',
    review_date: '2025-01-05T11:20:00Z',
    ngay: '2025-01-05T11:20:00Z',
    status: 'Đã duyệt',
    trang_thai: 'Đã duyệt',
    hotel_response: 'Cảm ơn bạn đã đánh giá tích cực! Chúng tôi rất vui khi bạn hài lòng.',
    response_date: '2025-01-06T10:00:00Z',
    hotel_id: 5,
    user_id: 1,
    booking_id: 5,
    customer_name: 'Trần Minh Khôi',
    customer_email: 'khoi.tran@example.com',
    customer_avatar: null,
    hotel_name: 'Da Nang Beachfront Hotel',
    hotel_address: '123 Bạch Đằng, Hải Châu, Đà Nẵng',
    booking_code: 'BOOK-20250105-0005',
    room_type: 'Deluxe Ocean View'
  },
  {
    id: 6,
    rating: 4,
    so_sao_tong: 4,
    content: 'Resort đẹp, nhiều tiện ích. Bãi biển riêng rất tuyệt. Phòng sạch sẽ, view đẹp. Tuy nhiên giá hơi cao so với dịch vụ.',
    binh_luan: 'Resort đẹp, nhiều tiện ích. Bãi biển riêng rất tuyệt. Phòng sạch sẽ, view đẹp. Tuy nhiên giá hơi cao so với dịch vụ.',
    review_date: '2025-01-03T13:10:00Z',
    ngay: '2025-01-03T13:10:00Z',
    status: 'Đã duyệt',
    trang_thai: 'Đã duyệt',
    hotel_response: null,
    response_date: null,
    hotel_id: 6,
    user_id: 4,
    booking_id: 6,
    customer_name: 'Nguyễn Thị Mai',
    customer_email: 'mai.nguyen@example.com',
    customer_avatar: null,
    hotel_name: 'Nha Trang Ocean View',
    hotel_address: '56 Trần Phú, Nha Trang, Khánh Hòa',
    booking_code: 'BOOK-20250103-0006',
    room_type: 'Deluxe Ocean View'
  },
  {
    id: 7,
    rating: 2,
    so_sao_tong: 2,
    content: 'Không hài lòng lắm. Phòng hơi ồn, wifi yếu. Nhân viên phục vụ chậm. Cần cải thiện nhiều.',
    binh_luan: 'Không hài lòng lắm. Phòng hơi ồn, wifi yếu. Nhân viên phục vụ chậm. Cần cải thiện nhiều.',
    review_date: '2025-01-01T15:30:00Z',
    ngay: '2025-01-01T15:30:00Z',
    status: 'Đã ẩn',
    trang_thai: 'Đã ẩn',
    hotel_response: null,
    response_date: null,
    hotel_id: 7,
    user_id: 8,
    booking_id: 7,
    customer_name: 'Bùi Thị Hương',
    customer_email: 'huong.bui@example.com',
    customer_avatar: null,
    hotel_name: 'Hue Imperial Hotel',
    hotel_address: '78 Lê Lợi, Phú Hội, Huế',
    booking_code: 'BOOK-20250101-0007',
    room_type: 'Superior'
  },
  {
    id: 8,
    rating: 4,
    so_sao_tong: 4,
    content: 'Lodge trên núi với view ruộng bậc thang tuyệt đẹp. Không khí trong lành, yên tĩnh. Phòng ấm cúng, phù hợp cho nghỉ dưỡng.',
    binh_luan: 'Lodge trên núi với view ruộng bậc thang tuyệt đẹp. Không khí trong lành, yên tĩnh. Phòng ấm cúng, phù hợp cho nghỉ dưỡng.',
    review_date: '2024-12-28T10:00:00Z',
    ngay: '2024-12-28T10:00:00Z',
    status: 'Đã duyệt',
    trang_thai: 'Đã duyệt',
    hotel_response: 'Cảm ơn bạn đã đánh giá! Chúng tôi rất vui khi bạn thích view và không khí tại lodge.',
    response_date: '2024-12-29T09:00:00Z',
    hotel_id: 8,
    user_id: 9,
    booking_id: 8,
    customer_name: 'Lý Văn Nam',
    customer_email: 'nam.ly@example.com',
    customer_avatar: null,
    hotel_name: 'Sapa Mountain Lodge',
    hotel_address: '12 Cầu Mây, Sapa, Lào Cai',
    booking_code: 'BOOK-20241228-0008',
    room_type: 'Standard'
  },
  {
    id: 9,
    rating: 5,
    so_sao_tong: 5,
    content: 'Khách sạn trong phố cổ rất đẹp, gần sông Hoài. Phòng cổ kính nhưng đầy đủ tiện nghi hiện đại. Nhân viên nhiệt tình. Địa điểm lý tưởng để khám phá Hội An.',
    binh_luan: 'Khách sạn trong phố cổ rất đẹp, gần sông Hoài. Phòng cổ kính nhưng đầy đủ tiện nghi hiện đại. Nhân viên nhiệt tình. Địa điểm lý tưởng để khám phá Hội An.',
    review_date: '2024-12-25T12:15:00Z',
    ngay: '2024-12-25T12:15:00Z',
    status: 'Đã duyệt',
    trang_thai: 'Đã duyệt',
    hotel_response: null,
    response_date: null,
    hotel_id: 9,
    user_id: 1,
    booking_id: 9,
    customer_name: 'Trần Minh Khôi',
    customer_email: 'khoi.tran@example.com',
    customer_avatar: null,
    hotel_name: 'Hoi An Ancient Town Hotel',
    hotel_address: '34 Nguyễn Thái Học, Hội An, Quảng Nam',
    booking_code: 'BOOK-20241225-0009',
    room_type: 'Deluxe Phố Cổ'
  },
  {
    id: 10,
    rating: 4,
    so_sao_tong: 4,
    content: 'Resort biển tốt, nhiều hoạt động thể thao nước. Phòng sạch, view biển đẹp. Nhân viên thân thiện. Giá cả hợp lý.',
    binh_luan: 'Resort biển tốt, nhiều hoạt động thể thao nước. Phòng sạch, view biển đẹp. Nhân viên thân thiện. Giá cả hợp lý.',
    review_date: '2024-12-22T14:40:00Z',
    ngay: '2024-12-22T14:40:00Z',
    status: 'Chờ duyệt',
    trang_thai: 'Chờ duyệt',
    hotel_response: null,
    response_date: null,
    hotel_id: 10,
    user_id: 4,
    booking_id: 10,
    customer_name: 'Nguyễn Thị Mai',
    customer_email: 'mai.nguyen@example.com',
    customer_avatar: null,
    hotel_name: 'Mui Ne Beach Resort',
    hotel_address: '89 Nguyễn Đình Chiểu, Mũi Né, Bình Thuận',
    booking_code: 'BOOK-20241222-0010',
    room_type: 'Superior'
  },
  {
    id: 11,
    rating: 5,
    so_sao_tong: 5,
    content: 'Khách sạn 5 sao đúng nghĩa! Mọi thứ đều hoàn hảo từ phòng ốc, dịch vụ đến ẩm thực. Nhân viên chuyên nghiệp, luôn sẵn sàng hỗ trợ. View sông tuyệt đẹp vào ban đêm.',
    binh_luan: 'Khách sạn 5 sao đúng nghĩa! Mọi thứ đều hoàn hảo từ phòng ốc, dịch vụ đến ẩm thực. Nhân viên chuyên nghiệp, luôn sẵn sàng hỗ trợ. View sông tuyệt đẹp vào ban đêm.',
    review_date: '2024-12-20T09:00:00Z',
    ngay: '2024-12-20T09:00:00Z',
    status: 'Đã duyệt',
    trang_thai: 'Đã duyệt',
    hotel_response: 'Cảm ơn bạn đã đánh giá 5 sao! Chúng tôi rất vinh dự khi được phục vụ bạn.',
    response_date: '2024-12-21T08:00:00Z',
    hotel_id: 1,
    user_id: 8,
    booking_id: 11,
    customer_name: 'Bùi Thị Hương',
    customer_email: 'huong.bui@example.com',
    customer_avatar: null,
    hotel_name: 'The Lumière Riverside',
    hotel_address: '12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    booking_code: 'BOOK-20241220-0011',
    room_type: 'Suite'
  },
  {
    id: 12,
    rating: 3,
    so_sao_tong: 3,
    content: 'Khách sạn ổn, vị trí tốt nhưng cần nâng cấp. Phòng hơi cũ, điều hòa ồn. Nhân viên thân thiện. Giá cả phù hợp.',
    binh_luan: 'Khách sạn ổn, vị trí tốt nhưng cần nâng cấp. Phòng hơi cũ, điều hòa ồn. Nhân viên thân thiện. Giá cả phù hợp.',
    review_date: '2024-12-18T11:30:00Z',
    ngay: '2024-12-18T11:30:00Z',
    status: 'Chờ duyệt',
    trang_thai: 'Chờ duyệt',
    hotel_response: null,
    response_date: null,
    hotel_id: 4,
    user_id: 1,
    booking_id: 12,
    customer_name: 'Trần Minh Khôi',
    customer_email: 'khoi.tran@example.com',
    customer_avatar: null,
    hotel_name: 'Hanoi Grand Hotel',
    hotel_address: '8 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    booking_code: 'BOOK-20241218-0012',
    room_type: 'Standard'
  }
]

// Mock stats for Reviews page
export const mockReviewStats = {
  total_reviews: 12,
  average_rating: 4.25,
  rating_distribution: {
    five_star: 5,
    four_star: 5,
    three_star: 2,
    two_star: 1,
    one_star: 0
  },
  status_distribution: {
    approved: 8,
    pending: 3,
    hidden: 1
  },
  recent_reviews: 8,
  with_response: 5,
  top_hotels: [
    {
      id: 1,
      hotel_name: 'The Lumière Riverside',
      review_count: 3,
      avg_rating: 4.67
    },
    {
      id: 2,
      hotel_name: 'Highland Retreat Đà Lạt',
      review_count: 1,
      avg_rating: 5.0
    },
    {
      id: 5,
      hotel_name: 'Da Nang Beachfront Hotel',
      review_count: 1,
      avg_rating: 5.0
    },
    {
      id: 6,
      hotel_name: 'Nha Trang Ocean View',
      review_count: 1,
      avg_rating: 4.0
    },
    {
      id: 8,
      hotel_name: 'Sapa Mountain Lodge',
      review_count: 1,
      avg_rating: 4.0
    }
  ]
}

// Mock hotels list for filter
export const mockHotelsForFilter = [
  { id: 1, name: 'The Lumière Riverside' },
  { id: 2, name: 'Highland Retreat Đà Lạt' },
  { id: 3, name: 'Sea Breeze Resort Phú Quốc' },
  { id: 4, name: 'Hanoi Grand Hotel' },
  { id: 5, name: 'Da Nang Beachfront Hotel' },
  { id: 6, name: 'Nha Trang Ocean View' },
  { id: 7, name: 'Hue Imperial Hotel' },
  { id: 8, name: 'Sapa Mountain Lodge' },
  { id: 9, name: 'Hoi An Ancient Town Hotel' },
  { id: 10, name: 'Mui Ne Beach Resort' }
]


