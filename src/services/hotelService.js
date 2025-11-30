const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class HotelService {
  // Get all hotels
  async getAllHotels(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const url = `${API_URL}/api/khachsan${queryParams ? `?${queryParams}` : ''}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (response.ok && data.success) {
        return data.data || data.khachsan || []
      }
      
      throw new Error(data.message || 'Không thể tải danh sách khách sạn')
    } catch (error) {
      console.error('Error fetching hotels:', error)
      throw error
    }
  }

  // Get hotel by ID
  async getHotelById(id) {
    try {
      const response = await fetch(`${API_URL}/api/khachsan/${id}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        return data.data || data.khachsan
      }
      
      throw new Error(data.message || 'Không tìm thấy khách sạn')
    } catch (error) {
      console.error('Error fetching hotel:', error)
      throw error
    }
  }

  // Get rooms by hotel ID
  async getRoomsByHotelId(hotelId) {
    try {
      const response = await fetch(`${API_URL}/api/phong/khachsan/${hotelId}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        return data.data || data.phong || []
      }
      
      throw new Error(data.message || 'Không thể tải danh sách phòng')
    } catch (error) {
      console.error('Error fetching rooms:', error)
      throw error
    }
  }

  // Search hotels
  async searchHotels(searchParams) {
    try {
      const response = await fetch(`${API_URL}/api/khachsan/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams)
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        return data.data || data.khachsan || []
      }
      
      throw new Error(data.message || 'Không tìm thấy kết quả')
    } catch (error) {
      console.error('Error searching hotels:', error)
      throw error
    }
  }

  // Get hotel reviews
  async getHotelReviews(hotelId) {
    try {
      const response = await fetch(`${API_URL}/api/danhgia/khachsan/${hotelId}`)
      const data = await response.json()
      
      if (response.ok && data.success) {
        return data.data || data.danhgia || []
      }
      
      return []
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return []
    }
  }

  // Format hotel data for frontend
  formatHotelData(hotel) {
    if (!hotel) return null

    return {
      id: hotel.id_khach_san,
      ten: hotel.ten_khach_san,
      dia_chi: hotel.dia_chi,
      hinh_anh: hotel.hinh_anh || hotel.hinh_dai_dien,
      hinh_anh_gallery: hotel.hinh_anh_khac ? JSON.parse(hotel.hinh_anh_khac) : [],
      so_sao: hotel.hang_sao || hotel.so_sao,
      gia_thap_nhat: hotel.gia_thap_nhat,
      rating: hotel.diem_trung_binh || hotel.rating || 0,
      reviews_count: hotel.so_luot_danh_gia || 0,
      mo_ta: hotel.mo_ta,
      amenities: hotel.tien_nghi ? JSON.parse(hotel.tien_nghi) : [],
      thanh_pho: hotel.thanh_pho,
      quoc_gia: hotel.quoc_gia,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      dien_thoai: hotel.dien_thoai,
      email: hotel.email,
      website: hotel.website,
      chinh_sach_huy: hotel.chinh_sach_huy,
      gio_nhan_phong: hotel.gio_nhan_phong,
      gio_tra_phong: hotel.gio_tra_phong
    }
  }

  // Format room data for frontend
  formatRoomData(room) {
    if (!room) return null

    return {
      id: room.id_phong,
      hotelId: room.id_khach_san,
      type: room.loai_phong,
      name: room.ten_phong,
      englishName: room.ten_phong_en || room.ten_phong,
      price: room.gia_hien_tai || room.gia_goc,
      originalPrice: room.gia_goc,
      available: room.trang_thai === 'available' || room.trang_thai === 'Còn phòng',
      availableRooms: room.so_luong_con_lai || 0,
      maxGuests: room.so_nguoi_toi_da || 2,
      size: room.dien_tich ? `${room.dien_tich}m²` : '25m²',
      amenities: room.tien_nghi ? JSON.parse(room.tien_nghi) : [],
      image: room.hinh_anh || room.hinh_dai_dien,
      images: room.hinh_anh_khac ? JSON.parse(room.hinh_anh_khac) : [],
      description: room.mo_ta,
      view: room.huong_view,
      bed_type: room.loai_giuong
    }
  }
}

export const hotelService = new HotelService()
export default hotelService
