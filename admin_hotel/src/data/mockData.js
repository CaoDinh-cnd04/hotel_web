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

export const mockRooms = [
  {
    ma_phong: 1,
    so_phong: '101',
    ten_phong: 'Phòng Deluxe View Sông',
    ma_khach_san: 1,
    ma_loai_phong: 6,
    gia_phong: 1500000,
    trang_thai: 1
  },
  {
    ma_phong: 2,
    so_phong: '102',
    ten_phong: 'Phòng Superior',
    ma_khach_san: 1,
    ma_loai_phong: 6,
    gia_phong: 1200000,
    trang_thai: 1
  },
  {
    ma_phong: 3,
    so_phong: '201',
    ten_phong: 'Phòng Gia Đình',
    ma_khach_san: 1,
    ma_loai_phong: 4,
    gia_phong: 2500000,
    trang_thai: 1
  },
  {
    ma_phong: 4,
    so_phong: '301',
    ten_phong: 'Phòng Premium View Hồ',
    ma_khach_san: 2,
    ma_loai_phong: 6,
    gia_phong: 2800000,
    trang_thai: 1
  },
  {
    ma_phong: 5,
    so_phong: '401',
    ten_phong: 'Phòng Suite',
    ma_khach_san: 2,
    ma_loai_phong: 5,
    gia_phong: 3500000,
    trang_thai: 1
  },
  {
    ma_phong: 6,
    so_phong: '501',
    ten_phong: 'Phòng Executive',
    ma_khach_san: 2,
    ma_loai_phong: 7,
    gia_phong: 4000000,
    trang_thai: 1
  },
  {
    ma_phong: 7,
    so_phong: '101',
    ten_phong: 'Phòng Superior',
    ma_khach_san: 3,
    ma_loai_phong: 6,
    gia_phong: 900000,
    trang_thai: 1
  },
  {
    ma_phong: 8,
    so_phong: '201',
    ten_phong: 'Phòng Deluxe Phổ Cổ',
    ma_khach_san: 3,
    ma_loai_phong: 5,
    gia_phong: 1200000,
    trang_thai: 1
  },
  {
    ma_phong: 9,
    so_phong: '301',
    ten_phong: 'Phòng Family Room',
    ma_khach_san: 4,
    ma_loai_phong: 4,
    gia_phong: 1800000,
    trang_thai: 1
  },
  {
    ma_phong: 10,
    so_phong: '401',
    ten_phong: 'Phòng Deluxe Ocean View',
    ma_khach_san: 6,
    ma_loai_phong: 6,
    gia_phong: 2200000,
    trang_thai: 1
  }
]

export const mockUsers = [
  {
    ma_nguoi_dung: 1,
    ho_ten: 'Trần Minh Khôi',
    email: 'khoi.tran@example.com',
    vai_tro: 'Customer',
    trang_thai: 1,
    ngay_tao: '2024-11-02T10:30:00Z'
  },
  {
    ma_nguoi_dung: 2,
    ho_ten: 'Lê Thảo Vy',
    email: 'thaovy.le@example.com',
    vai_tro: 'HotelOwner',
    trang_thai: 2,
    ngay_tao: '2024-12-18T14:20:00Z'
  },
  {
    ma_nguoi_dung: 3,
    ho_ten: 'Phạm Gia Huy',
    email: 'giahuy@example.com',
    vai_tro: 'Admin',
    trang_thai: 1,
    ngay_tao: '2023-08-10T09:15:00Z'
  },
  {
    ma_nguoi_dung: 4,
    ho_ten: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@example.com',
    vai_tro: 'Customer',
    trang_thai: 1,
    ngay_tao: '2024-10-15T11:45:00Z'
  },
  {
    ma_nguoi_dung: 5,
    ho_ten: 'Hoàng Văn Đức',
    email: 'duc.hoang@example.com',
    vai_tro: 'HotelOwner',
    trang_thai: 1,
    ngay_tao: '2024-09-20T16:30:00Z'
  },
  {
    ma_nguoi_dung: 6,
    ho_ten: 'Võ Thị Lan',
    email: 'lan.vo@example.com',
    vai_tro: 'Customer',
    trang_thai: 0,
    ngay_tao: '2024-08-05T13:20:00Z'
  },
  {
    ma_nguoi_dung: 7,
    ho_ten: 'Đặng Minh Tuấn',
    email: 'tuan.dang@example.com',
    vai_tro: 'HotelOwner',
    trang_thai: 2,
    ngay_tao: '2024-12-20T10:10:00Z'
  },
  {
    ma_nguoi_dung: 8,
    ho_ten: 'Bùi Thị Hương',
    email: 'huong.bui@example.com',
    vai_tro: 'Customer',
    trang_thai: 1,
    ngay_tao: '2024-11-25T15:50:00Z'
  },
  {
    ma_nguoi_dung: 9,
    ho_ten: 'Lý Văn Nam',
    email: 'nam.ly@example.com',
    vai_tro: 'Customer',
    trang_thai: 1,
    ngay_tao: '2024-10-30T12:00:00Z'
  },
  {
    ma_nguoi_dung: 10,
    ho_ten: 'Trương Thị Hoa',
    email: 'hoa.truong@example.com',
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

export const mockReviews = {
  1: [
    {
      ma_danh_gia: 1,
      ma_khach_san: 1,
      ma_nguoi_dung: 1,
      ho_ten: 'Mai Anh',
      diem_danh_gia: 5,
      noi_dung: 'Phòng sạch sẽ, view sông tuyệt đẹp, nhân viên thân thiện.',
      ngay_danh_gia: '2024-11-02T10:30:00Z'
    },
    {
      ma_danh_gia: 2,
      ma_khach_san: 1,
      ma_nguoi_dung: 4,
      ho_ten: 'Ngọc Huy',
      diem_danh_gia: 4,
      noi_dung: 'Buffet sáng đa dạng, bể bơi hơi đông vào cuối tuần.',
      ngay_danh_gia: '2024-10-25T14:20:00Z'
    },
    {
      ma_danh_gia: 3,
      ma_khach_san: 1,
      ma_nguoi_dung: 8,
      ho_ten: 'Lan Anh',
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
      diem_danh_gia: 4,
      noi_dung: 'Không khí trong lành, vườn hoa đẹp, sẽ quay lại.',
      ngay_danh_gia: '2024-09-14T16:30:00Z'
    }
  ],
  3: []
}


