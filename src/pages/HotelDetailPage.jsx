import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Form, Badge, Carousel, Modal } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell, 
  ArrowLeft,
  Heart,
  Share2,
  Users,
  Calendar,
  CalendarDays,
  Phone,
  Mail,
  UserCheck,
  CreditCard,
  Shield,
  Clock,
  Smartphone,
  Building2,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useFavoritesStore } from '../stores/favoritesStore'
import { useBookingsStore } from '../stores/bookingsStore'
import DiscountCodeInput from '../components/DiscountCodeInput'
import DateRangePicker from '../components/DateRangePicker'
import { useTranslation } from '../hooks/useTranslation'
import { paymentService } from '../services/paymentService'
import { hotelService } from '../services/hotelService'
import ChatWidget from '../components/ChatWidget'
import HotelMap from '../components/HotelMap'
// import { notificationService } from '../services/notificationService'
import toast from 'react-hot-toast'

const HotelDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const { createBooking } = useBookingsStore()
  const { t } = useTranslation()
  
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    checkinDate: '',
    checkoutDate: '',
    guests: 2,
    rooms: 1,
    customerName: '',
    email: '',
    phone: '',
    specialRequests: ''
  })

  // Helper function to generate gallery images
  const generateGallery = (mainImage) => {
    const galleryImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
    
    // Return main image first, then 3 random others
    const filtered = galleryImages.filter(img => img !== mainImage)
    return [mainImage, ...filtered.slice(0, 3)]
  }

  // Mock hotels data fallback
  const getMockHotels = () => [
    // TP.HCM - 8 khách sạn
    {
      id: 1,
      ten: 'Grand Hotel Saigon',
      dia_chi: '8 Đồng Khởi, Quận 1, TP.HCM',
      thanh_pho: 'TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      hinh_anh_gallery: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      so_sao: 5,
      gia_thap_nhat: 2500000,
      rating: 4.8,
      reviews_count: 245,
      mo_ta: 'Khách sạn sang trọng 5 sao tại trung tâm Sài Gòn với dịch vụ hoàn hảo và vị trí đắc địa.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar']
    },
    {
      id: 2,
      ten: 'Sheraton Saigon Hotel & Towers',
      dia_chi: '88 Đồng Khởi, Quận 1, TP.HCM',
      thanh_pho: 'TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3200000,
      rating: 4.7,
      reviews_count: 189,
      mo_ta: 'Khách sạn quốc tế 5 sao với thiết kế hiện đại và dịch vụ chuyên nghiệp tại trung tâm Sài Gòn.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng']
    },
    {
      id: 7,
      ten: 'Rex Hotel Saigon',
      dia_chi: '141 Nguyễn Huệ, Quận 1, TP.HCM',
      thanh_pho: 'TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 2200000,
      rating: 4.4,
      reviews_count: 198,
      mo_ta: 'Khách sạn lịch sử 4 sao tại trung tâm Sài Gòn với kiến trúc cổ điển và dịch vụ truyền thống.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar']
    },
    {
      id: 9,
      ten: 'The Reverie Saigon',
      dia_chi: '22-36 Nguyễn Huệ, Quận 1, TP.HCM',
      thanh_pho: 'TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 5200000,
      rating: 4.9,
      reviews_count: 287,
      mo_ta: 'Khách sạn 5 sao siêu sang với thiết kế Italia cổ điển và dịch vụ butler cá nhân.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Butler cá nhân', 'Helipad']
    },
    {
      id: 10,
      ten: 'Park Hyatt Saigon',
      dia_chi: '2 Lam Sơn Square, Quận 1, TP.HCM',
      thanh_pho: 'TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 4800000,
      rating: 4.8,
      reviews_count: 356,
      mo_ta: 'Khách sạn 5 sao đẳng cấp với vị trí prime tại trung tâm Sài Gòn và dịch vụ hoàn hảo.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Dịch vụ concierge']
    },
    {
      id: 13,
      ten: 'Hotel Nikko Saigon',
      dia_chi: '235 Nguyễn Văn Cừ, Quận 1, TP.HCM',
      thanh_pho: 'TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3500000,
      rating: 4.6,
      reviews_count: 267,
      mo_ta: 'Khách sạn Nhật Bản 5 sao với phong cách tinh tế và dịch vụ chu đáo.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Karaoke']
    },
    {
      id: 14,
      ten: 'Caravelle Saigon',
      dia_chi: '19 Lam Sơn Square, Quận 1, TP.HCM',
      thanh_pho: 'TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 4200000,
      rating: 4.7,
      reviews_count: 389,
      mo_ta: 'Khách sạn lịch sử nổi tiếng với Saigon Saigon Rooftop Bar và vị trí trung tâm.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Rooftop Bar']
    },
    {
      id: 15,
      ten: 'Liberty Central Saigon Riverside',
      dia_chi: '17 Tôn Đức Thắng, Quận 1, TP.HCM',
      thanh_pho: 'TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 1800000,
      rating: 4.5,
      reviews_count: 234,
      mo_ta: 'Khách sạn 4 sao ven sông Sài Gòn với view đẹp và giá hợp lý.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Nhà hàng', 'Bar']
    },

    // Đà Nẵng - 5 khách sạn
    {
      id: 3,
      ten: 'InterContinental Da Nang',
      dia_chi: 'Bãi Bắc, Ngũ Hành Sơn, Đà Nẵng',
      thanh_pho: 'Đà Nẵng',
      hinh_anh: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      hinh_anh_gallery: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      so_sao: 5,
      gia_thap_nhat: 3200000,
      rating: 4.9,
      reviews_count: 321,
      mo_ta: 'Resort 5 sao bên bờ biển Đà Nẵng với tầm nhìn tuyệt đẹp ra biển và núi.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Bãi biển riêng']
    },
    {
      id: 16,
      ten: 'Hyatt Regency Danang Resort',
      dia_chi: '5 Trường Sa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
      thanh_pho: 'Đà Nẵng',
      hinh_anh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3800000,
      rating: 4.8,
      reviews_count: 298,
      mo_ta: 'Resort 5 sao sang trọng với thiết kế độc đáo và dịch vụ đẳng cấp quốc tế.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Bãi biển riêng', 'Kids club']
    },
    {
      id: 17,
      ten: 'Premier Village Danang Resort',
      dia_chi: '99 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng',
      thanh_pho: 'Đà Nẵng',
      hinh_anh: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 4500000,
      rating: 4.9,
      reviews_count: 256,
      mo_ta: 'Villa resort 5 sao với không gian riêng tư và bãi biển đẹp nhất Đà Nẵng.',
      amenities: ['Wifi miễn phí', 'Bể bơi riêng', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Bãi biển riêng', 'Butler']
    },
    {
      id: 18,
      ten: 'Naman Retreat',
      dia_chi: 'Trường Sa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
      thanh_pho: 'Đà Nẵng',
      hinh_anh: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3600000,
      rating: 4.8,
      reviews_count: 189,
      mo_ta: 'Resort nghỉ dưỡng 5 sao với kiến trúc tre độc đáo và spa đẳng cấp.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Bãi biển riêng', 'Yoga']
    },
    {
      id: 19,
      ten: 'Melia Danang Beach Resort',
      dia_chi: '19 Trường Sa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
      thanh_pho: 'Đà Nẵng',
      hinh_anh: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 2200000,
      rating: 4.6,
      reviews_count: 312,
      mo_ta: 'Resort 4 sao với thiết kế hiện đại và vị trí đẹp bên bờ biển Đà Nẵng.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bãi biển gần']
    },

    // Hà Nội - 5 khách sạn
    {
      id: 6,
      ten: 'JW Marriott Hotel Hanoi',
      dia_chi: '8 Đỗ Đức Dục, Ba Đình, Hà Nội',
      thanh_pho: 'Hà Nội',
      hinh_anh: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3800000,
      rating: 4.9,
      reviews_count: 412,
      mo_ta: 'Khách sạn 5 sao cao cấp tại Hà Nội với thiết kế sang trọng và dịch vụ đẳng cấp thế giới.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Trung tâm hội nghị']
    },
    {
      id: 11,
      ten: 'Sofitel Legend Metropole Hanoi',
      dia_chi: '15 Ngô Quyền, Hoàn Kiếm, Hà Nội',
      thanh_pho: 'Hà Nội',
      hinh_anh: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 4500000,
      rating: 4.7,
      reviews_count: 423,
      mo_ta: 'Khách sạn lịch sử 5 sao với kiến trúc Pháp cổ điển và truyền thống dịch vụ hơn 100 năm.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Dịch vụ concierge', 'Phòng hội nghị']
    },
    {
      id: 20,
      ten: 'Hilton Hanoi Opera',
      dia_chi: '1 Lê Thánh Tông, Hoàn Kiếm, Hà Nội',
      thanh_pho: 'Hà Nội',
      hinh_anh: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3200000,
      rating: 4.7,
      reviews_count: 345,
      mo_ta: 'Khách sạn 5 sao gần Nhà hát Lớn với kiến trúc Pháp và dịch vụ hiện đại.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Executive lounge']
    },
    {
      id: 21,
      ten: 'InterContinental Hanoi Westlake',
      dia_chi: '1A Nghi Tàm, Tây Hồ, Hà Nội',
      thanh_pho: 'Hà Nội',
      hinh_anh: 'https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 4200000,
      rating: 4.8,
      reviews_count: 278,
      mo_ta: 'Khách sạn 5 sao duy nhất nằm trên Hồ Tây với view tuyệt đẹp.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Sunset bar']
    },
    {
      id: 22,
      ten: 'Pan Pacific Hanoi',
      dia_chi: '1 Thanh Niên, Ba Đình, Hà Nội',
      thanh_pho: 'Hà Nội',
      hinh_anh: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3500000,
      rating: 4.6,
      reviews_count: 289,
      mo_ta: 'Khách sạn 5 sao với view Hồ Tây và không gian xanh mát.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar']
    },

    // Phú Quốc - 4 khách sạn
    {
      id: 4,
      ten: 'Vinpearl Resort Phú Quốc',
      dia_chi: 'Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang',
      thanh_pho: 'Phú Quốc',
      hinh_anh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 4200000,
      rating: 4.7,
      reviews_count: 156,
      mo_ta: 'Resort 5 sao tại đảo ngọc Phú Quốc với không gian xanh mát và biển trong xanh.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Bãi biển riêng', 'Sân golf']
    },
    {
      id: 12,
      ten: 'Fusion Resort Phu Quoc',
      dia_chi: 'Vũng Bầu Beach, Phú Quốc, Kiên Giang',
      thanh_pho: 'Phú Quốc',
      hinh_anh: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 5800000,
      rating: 4.9,
      reviews_count: 178,
      mo_ta: 'Resort 5 sao all-spa với concept độc đáo - spa không giới hạn và bãi biển riêng tuyệt đẹp.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Spa không giới hạn', 'Nhà hàng', 'Bar', 'Bãi biển riêng', 'Kayak miễn phí']
    },
    {
      id: 23,
      ten: 'JW Marriott Phu Quoc Emerald Bay',
      dia_chi: 'Khem Beach, An Thới, Phú Quốc, Kiên Giang',
      thanh_pho: 'Phú Quốc',
      hinh_anh: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 6500000,
      rating: 4.9,
      reviews_count: 234,
      mo_ta: 'Resort 5 sao đẳng cấp với kiến trúc độc đáo lấy cảm hứng từ trường học Pháp cổ.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Bãi biển riêng', 'Kids club']
    },
    {
      id: 24,
      ten: 'InterContinental Phu Quoc Long Beach',
      dia_chi: 'Bãi Trường, Dương Tơ, Phú Quốc, Kiên Giang',
      thanh_pho: 'Phú Quốc',
      hinh_anh: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 5200000,
      rating: 4.8,
      reviews_count: 198,
      mo_ta: 'Resort 5 sao với bãi biển dài và nhiều hoạt động giải trí.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Bãi biển riêng', 'Water sports']
    },

    // Nha Trang - 4 khách sạn
    {
      id: 5,
      ten: 'Mường Thanh Luxury Nha Trang',
      dia_chi: '60 Trần Phú, Nha Trang, Khánh Hòa',
      thanh_pho: 'Nha Trang',
      hinh_anh: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 1500000,
      rating: 4.5,
      reviews_count: 278,
      mo_ta: 'Khách sạn 4 sao tại thành phố biển Nha Trang với tầm nhìn ra vịnh đẹp nhất Việt Nam.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bãi biển gần']
    },
    {
      id: 25,
      ten: 'Vinpearl Resort Nha Trang',
      dia_chi: 'Hòn Tre, Vĩnh Nguyên, Nha Trang, Khánh Hòa',
      thanh_pho: 'Nha Trang',
      hinh_anh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3800000,
      rating: 4.7,
      reviews_count: 345,
      mo_ta: 'Resort 5 sao trên đảo Hòn Tre với cáp treo và công viên giải trí.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Bãi biển riêng', 'Vinpearl Land']
    },
    {
      id: 26,
      ten: 'Sheraton Nha Trang Hotel',
      dia_chi: '26-28 Trần Phú, Nha Trang, Khánh Hòa',
      thanh_pho: 'Nha Trang',
      hinh_anh: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 2800000,
      rating: 4.6,
      reviews_count: 289,
      mo_ta: 'Khách sạn 5 sao bên bờ biển với thiết kế hiện đại và dịch vụ đẳng cấp.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Bãi biển gần']
    },
    {
      id: 27,
      ten: 'Sunrise Nha Trang Beach Hotel',
      dia_chi: '12-14 Trần Phú, Nha Trang, Khánh Hòa',
      thanh_pho: 'Nha Trang',
      hinh_anh: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 1200000,
      rating: 4.4,
      reviews_count: 234,
      mo_ta: 'Khách sạn 4 sao view biển với giá cả hợp lý tại trung tâm Nha Trang.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bãi biển gần']
    },

    // Các địa điểm khác
    {
      id: 8,
      ten: 'FLC Luxury Hotel Sầm Sơn',
      dia_chi: 'Trung tâm Du lịch FLC, Sầm Sơn, Thanh Hóa',
      thanh_pho: 'Thanh Hóa',
      hinh_anh: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 1200000,
      rating: 4.3,
      reviews_count: 134,
      mo_ta: 'Khách sạn 4 sao tại bãi biển Sầm Sơn với không gian nghỉ dưỡng thoải mái.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bãi biển gần']
    },
    {
      id: 28,
      ten: 'Vinpearl Resort Hội An',
      dia_chi: 'Bãi Dài, Cửa Đại, Hội An, Quảng Nam',
      thanh_pho: 'Hội An',
      hinh_anh: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3500000,
      rating: 4.7,
      reviews_count: 267,
      mo_ta: 'Resort 5 sao tại Hội An với không gian yên tĩnh và bãi biển đẹp.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Bãi biển riêng']
    },
    {
      id: 29,
      ten: 'Vinpearl Resort & Spa Đà Lạt',
      dia_chi: 'Khu Tuyệt Tình Cốc, Trần Phú, Đà Lạt, Lâm Đồng',
      thanh_pho: 'Đà Lạt',
      hinh_anh: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 2800000,
      rating: 4.6,
      reviews_count: 198,
      mo_ta: 'Resort 5 sao tại thành phố ngàn hoa với không khí trong lành và view đẹp.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar', 'Sân golf']
    },
    {
      id: 30,
      ten: 'Ana Mandara Huế Beach Resort',
      dia_chi: 'Thuan An Beach, Phú Vang, Huế, Thừa Thiên Huế',
      thanh_pho: 'Huế',
      hinh_anh: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 1800000,
      rating: 4.5,
      reviews_count: 156,
      mo_ta: 'Resort 4 sao tại bãi biển Thuận An với không gian yên tĩnh gần cố đô Huế.',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bãi biển riêng']
    }
  ]

  // Mock data for customer reviews
  const mockReviews = [
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      rating: 5,
      date: '2024-01-15',
      comment: 'Khách sạn tuyệt vời! Dịch vụ chu đáo, phòng sạch sẽ và view đẹp. Sẽ quay lại lần sau.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 2,
      customerName: 'Trần Thị B',
      rating: 4,
      date: '2024-01-10',
      comment: 'Khách sạn đẹp, nhân viên thân thiện. Bữa sáng ngon nhưng hơi đắt. Tổng thể rất hài lòng.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 3,
      customerName: 'John Smith',
      rating: 5,
      date: '2024-01-08',
      comment: 'Excellent hotel with amazing service. The staff was very helpful and the room was spotless.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 4,
      customerName: 'Lê Minh C',
      rating: 4,
      date: '2024-01-05',
      comment: 'Vị trí thuận tiện, gần trung tâm. Phòng rộng rãi, sạch sẽ. Chỉ có điều bãi đậu xe hơi nhỏ.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ]

  // Amenity details data
  const amenityDetails = {
    'Wifi miễn phí': {
      title: 'Wifi miễn phí',
      icon: '📶',
      images: [
        'https://images.unsplash.com/photo-1484807352052-23338990c6c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Kết nối internet không dây tốc độ cao miễn phí trong toàn bộ khu vực khách sạn',
      features: [
        'Tốc độ: 100 Mbps - 500 Mbps',
        'Phủ sóng: Tất cả các phòng, sảnh, nhà hàng',
        'Không giới hạn thiết bị kết nối',
        'Hỗ trợ streaming 4K',
        'Bảo mật WPA3'
      ],
      available: '24/7',
      location: 'Toàn bộ khách sạn'
    },
    'Bể bơi': {
      title: 'Bể bơi',
      icon: '🏊',
      images: [
        'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Bể bơi ngoài trời với tầm nhìn tuyệt đẹp, nước luôn được lọc và khử trùng',
      features: [
        'Kích thước: 25m x 15m',
        'Độ sâu: 1.2m - 2.5m',
        'Nhiệt độ nước: 26-28°C',
        'Khu vực dành cho trẻ em',
        'Ghế tắm nắng miễn phí',
        'Bar bể bơi',
        'Khăn tắm miễn phí'
      ],
      available: '6:00 AM - 10:00 PM',
      location: 'Tầng thượng / Sân vườn'
    },
    'Phòng gym': {
      title: 'Phòng tập gym',
      icon: '💪',
      images: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Phòng tập gym hiện đại với thiết bị cao cấp và huấn luyện viên chuyên nghiệp',
      features: [
        'Máy chạy bộ Technogym',
        'Xe đạp tập spinning',
        'Tạ tự do & máy tập lực',
        'Yoga studio',
        'Huấn luyện viên cá nhân (phụ phí)',
        'Khăn & nước uống miễn phí'
      ],
      available: '5:00 AM - 11:00 PM',
      location: 'Tầng 2'
    },
    'Spa': {
      title: 'Spa & Massage',
      icon: '💆',
      images: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1596178060810-aad4b99f042e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Dịch vụ spa và massage chuyên nghiệp giúp thư giãn và phục hồi sức khỏe',
      features: [
        'Massage body truyền thống',
        'Chăm sóc da mặt',
        'Sauna & Steam',
        'Liệu pháp đá nóng',
        'Aromatherapy',
        'Jacuzzi riêng tư'
      ],
      available: '9:00 AM - 10:00 PM',
      location: 'Tầng 3',
      note: 'Đặt trước để đảm bảo chỗ'
    },
    'Nhà hàng': {
      title: 'Nhà hàng',
      icon: '🍽️',
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Nhà hàng phục vụ ẩm thực Việt Nam và quốc tế do đầu bếp hàng đầu chế biến',
      features: [
        'Buffet sáng quốc tế',
        'Menu à la carte',
        'Ẩm thực Á - Âu',
        'Món chay đa dạng',
        'Bar rượu vang',
        'Phục vụ trong phòng 24/7'
      ],
      available: 'Sáng: 6:00-10:00, Trưa: 11:30-14:00, Tối: 18:00-22:00',
      location: 'Tầng 1 & Tầng thượng'
    },
    'Bar': {
      title: 'Bar & Lounge',
      icon: '🍸',
      images: [
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Bar sang trọng với đa dạng cocktail, rượu vang và đồ uống cao cấp',
      features: [
        'Cocktail đặc trưng',
        'Rượu vang nhập khẩu',
        'Bia craft',
        'Đồ uống không cồn',
        'Live music cuối tuần',
        'Happy hour 17:00-19:00'
      ],
      available: '16:00 - 01:00',
      location: 'Lobby lounge & Rooftop bar'
    },
    'Bãi biển riêng': {
      title: 'Bãi biển riêng',
      icon: '🏖️',
      images: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Khu vực bãi biển riêng dành riêng cho khách lưu trú với đầy đủ tiện nghi',
      features: [
        'Ghế nằm & ô dù miễn phí',
        'Khăn tắm biển',
        'Đồ uống phục vụ tại chỗ',
        'Thiết bị thể thao nước',
        'Cứu hộ bãi biển',
        'Khu vui chơi trẻ em'
      ],
      available: '6:00 AM - 6:00 PM',
      location: 'Truy cập trực tiếp từ khách sạn'
    },
    'Sân golf': {
      title: 'Sân golf',
      icon: '⛳',
      images: [
        'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1592919505780-303950717480?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Sân golf 18 lỗ đẳng cấp quốc tế với cảnh quan thiên nhiên tuyệt đẹp',
      features: [
        'Sân 18 lỗ chuẩn quốc tế',
        'Driving range',
        'Putting green',
        'Golf cart',
        'Cho thuê gậy & dụng cụ',
        'Huấn luyện viên golf pro'
      ],
      available: '5:30 AM - 6:30 PM',
      location: 'Khu resort',
      note: 'Phụ phí áp dụng'
    },
    'Bãi biển gần': {
      title: 'Gần bãi biển',
      icon: '🌊',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Khách sạn chỉ cách bãi biển công cộng vài phút đi bộ',
      features: [
        'Cách bãi biển: 200m',
        'Thời gian đi bộ: 3-5 phút',
        'Xe đưa đón miễn phí',
        'Cho mượn khăn tắm',
        'Bãi biển sạch đẹp',
        'Nhiều hoạt động thể thao nước'
      ],
      available: 'Cả ngày',
      location: 'Phía trước khách sạn'
    },
    'Dịch vụ concierge': {
      title: 'Dịch vụ Concierge',
      icon: '🎩',
      images: [
        'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Đội ngũ concierge chuyên nghiệp hỗ trợ mọi nhu cầu trong suốt kỳ nghỉ',
      features: [
        'Tư vấn điểm tham quan',
        'Đặt tour & vé',
        'Đặt nhà hàng bên ngoài',
        'Thuê xe & tài xế',
        'Dịch vụ hành lý',
        'Hỗ trợ 24/7'
      ],
      available: '24/7',
      location: 'Quầy lễ tân'
    },
    'Butler cá nhân': {
      title: 'Butler cá nhân',
      icon: '👔',
      images: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1596178060810-aad4b99f042e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Dịch vụ butler riêng biệt phục vụ tận tình cho nhu cầu cá nhân hóa',
      features: [
        'Phục vụ riêng 24/7',
        'Check-in/out tại phòng',
        'Chuẩn bị hành lý',
        'Sắp xếp lịch trình',
        'Đáp ứng yêu cầu đặc biệt',
        'Tư vấn cá nhân hóa'
      ],
      available: '24/7',
      location: 'Dành cho phòng VIP',
      note: 'Chỉ áp dụng phòng Suite trở lên'
    },
    'Helipad': {
      title: 'Sân đỗ trực thăng',
      icon: '🚁',
      images: [
        'https://images.unsplash.com/photo-1624969862644-791f3dc98927?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Sân đỗ trực thăng riêng phục vụ khách VIP và dịch vụ đưa đón cao cấp',
      features: [
        'Sân đỗ chuẩn quốc tế',
        'Dịch vụ đưa đón sân bay',
        'Tour tham quan từ trên cao',
        'An ninh nghiêm ngặt',
        'Phòng chờ VIP',
        'Đặt trước 24h'
      ],
      available: 'Theo lịch hẹn',
      location: 'Tầng thượng',
      note: 'Phụ phí cao - Chỉ theo yêu cầu'
    },
    'Phòng hội nghị': {
      title: 'Phòng hội nghị',
      icon: '🏢',
      images: [
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Hệ thống phòng họp và hội nghị hiện đại phục vụ sự kiện doanh nghiệp',
      features: [
        'Sức chứa: 20-500 người',
        'Thiết bị AV hiện đại',
        'Wifi tốc độ cao',
        'Màn hình LED',
        'Dịch vụ catering',
        'Hỗ trợ kỹ thuật'
      ],
      available: '7:00 AM - 10:00 PM',
      location: 'Tầng 2',
      note: 'Đặt trước - Có phụ phí'
    },
    'Trung tâm hội nghị': {
      title: 'Trung tâm hội nghị',
      icon: '🎤',
      images: [
        'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Trung tâm hội nghị quy mô lớn với trang thiết bị hiện đại nhất',
      features: [
        'Phòng ballroom 1000 chỗ',
        'Nhiều phòng họp đa năng',
        'Hệ thống âm thanh Bose',
        'Màn hình LED 4K',
        'Dịch vụ event planning',
        'Catering cao cấp'
      ],
      available: '24/7 (theo booking)',
      location: 'Tòa nhà phụ',
      note: 'Đặt trước - Gói dịch vụ đa dạng'
    }
  }

  // Handle amenity click
  const handleAmenityClick = (amenityName) => {
    const amenityInfo = amenityDetails[amenityName]
    if (amenityInfo) {
      setSelectedAmenity(amenityInfo)
      setShowAmenityModal(true)
    } else {
      // Default info for amenities not in details list
      setSelectedAmenity({
        title: amenityName,
        icon: '✨',
        description: `Khách sạn cung cấp dịch vụ ${amenityName} cho khách lưu trú.`,
        features: ['Dịch vụ chất lượng cao', 'Phục vụ chuyên nghiệp'],
        available: 'Liên hệ lễ tân để biết thêm chi tiết',
        location: 'Thông tin chi tiết tại quầy lễ tân'
      })
      setShowAmenityModal(true)
    }
  }

  // Mock data for available rooms
  const mockRooms = [
    {
      id: 1,
      type: 'standardRoom',
      name: 'Phòng Standard',
      englishName: 'Standard Room',
      price: 1500000,
      originalPrice: 1800000,
      available: true,
      availableRooms: 8,
      maxGuests: 2,
      size: '25m²',
      amenities: ['Wifi miễn phí', 'Điều hòa', 'TV LCD', 'Minibar', 'Phòng tắm riêng'],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      type: 'deluxeRoom',
      name: 'Phòng Deluxe',
      englishName: 'Deluxe Room', 
      price: 2200000,
      originalPrice: 2500000,
      available: true,
      availableRooms: 5,
      maxGuests: 3,
      size: '35m²',
      amenities: ['Wifi miễn phí', 'Điều hòa', 'TV LCD 50"', 'Minibar', 'Phòng tắm riêng', 'Balcony', 'Safe'],
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      type: 'suiteRoom',
      name: 'Phòng Suite',
      englishName: 'Suite Room',
      price: 3500000,
      originalPrice: 4000000,
      available: false,
      availableRooms: 0,
      maxGuests: 4,
      size: '55m²',
      amenities: ['Wifi miễn phí', 'Điều hòa', 'TV LCD 65"', 'Minibar', 'Phòng tắm riêng', 'Phòng khách riêng', 'Safe', 'Butler service'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      type: 'standardRoom',
      name: 'Phòng Standard Premium',
      englishName: 'Standard Premium Room',
      price: 1800000,
      originalPrice: 2100000,
      available: true,
      availableRooms: 3,
      maxGuests: 2,
      size: '30m²',
      amenities: ['Wifi miễn phí', 'Điều hòa', 'TV LCD 43"', 'Minibar', 'Phòng tắm riêng', 'Safe'],
      image: 'https://images.unsplash.com/photo-1631049035182-249067d7618e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ]

  // Filter state for rooms
  const [roomFilters, setRoomFilters] = useState({
    roomType: 'all',
    priceRange: 'all',
    availability: 'all'
  })

  // Room selection modal state
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedRoomType, setSelectedRoomType] = useState(null) // 'refundable' or 'non-refundable'
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCodeData, setQrCodeData] = useState(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [showAmenityModal, setShowAmenityModal] = useState(false)
  const [selectedAmenity, setSelectedAmenity] = useState(null)

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true)
        
        // Fetch hotel details from API
        const hotelData = await hotelService.getHotelById(id)
        const formattedHotel = hotelService.formatHotelData(hotelData)
        
        // Add gallery if not exists
        if (!formattedHotel.hinh_anh_gallery || formattedHotel.hinh_anh_gallery.length === 0) {
          formattedHotel.hinh_anh_gallery = generateGallery(formattedHotel.hinh_anh)
        }
        
        setHotel(formattedHotel)
        
        // Fetch rooms for this hotel
        try {
          const roomsData = await hotelService.getRoomsByHotelId(id)
          const formattedRooms = roomsData.map(room => hotelService.formatRoomData(room))
          // You can set rooms state here if needed
        } catch (roomError) {
          console.error('Error loading rooms:', roomError)
          // Use mock rooms if API fails
        }
        
      } catch (error) {
        console.error('Error loading hotel:', error)
        toast.error('Không thể tải thông tin khách sạn')
        
        // Fallback to mock data
        const mockHotels = getMockHotels()
        const foundHotel = mockHotels.find(h => h.id === parseInt(id))
        if (foundHotel) {
          if (!foundHotel.hinh_anh_gallery) {
            foundHotel.hinh_anh_gallery = generateGallery(foundHotel.hinh_anh)
          }
          setHotel(foundHotel)
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchHotelData()
  }, [id])

  const formatPrice = (price) => {
    try {
      if (price === null || price === undefined || isNaN(price)) {
        return '0 ₫'
      }
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    } catch (error) {
      console.error('Error formatting price:', error)
      return '0 ₫'
    }
  }

  // Helper functions for reviews and rooms
  const calculateAverageRating = () => {
    if (mockReviews.length === 0) return 0
    const total = mockReviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / mockReviews.length).toFixed(1)
  }

  const filteredRooms = mockRooms.filter(room => {
    if (roomFilters.roomType !== 'all' && room.type !== roomFilters.roomType) return false
    if (roomFilters.availability !== 'all') {
      if (roomFilters.availability === 'available' && !room.available) return false
      if (roomFilters.availability === 'unavailable' && room.available) return false
    }
    if (roomFilters.priceRange !== 'all') {
      switch (roomFilters.priceRange) {
        case 'under2m':
          if (room.price >= 2000000) return false
          break
        case '2m-3m':
          if (room.price < 2000000 || room.price > 3000000) return false
          break
        case 'over3m':
          if (room.price <= 3000000) return false
          break
      }
    }
    return true
  })

  const handleRoomFilterChange = (filterType, value) => {
    setRoomFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleRoomSelect = (room) => {
    console.log('Selecting room:', room)
    try {
      if (!room) {
        console.error('Room data is null or undefined')
        toast.error('Dữ liệu phòng không hợp lệ')
        return
      }
      
      setSelectedRoom(room)
      setShowRoomModal(true)
      console.log('Room modal should be shown now')
    } catch (error) {
      console.error('Error in handleRoomSelect:', error)
      toast.error('Có lỗi khi chọn phòng')
    }
  }

  const handleRoomBooking = (refundable = false) => {
    if (!selectedRoom) return
    
    const roomType = refundable ? 'refundable' : 'non-refundable'
    setSelectedRoomType(roomType)
    
    // Pre-fill booking data with user info
    if (user) {
      setBookingData(prev => ({
        ...prev,
        customerName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }))
    }
    
    setShowRoomModal(false)
    setShowBookingForm(true)
  }

  const calculateFinalPrice = () => {
    if (!selectedRoom || !selectedRoom.price || !bookingData.checkinDate || !bookingData.checkoutDate) return 0
    
    const checkinDate = new Date(bookingData.checkinDate)
    const checkoutDate = new Date(bookingData.checkoutDate)
    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))
    
    if (nights <= 0) return 0
    
    const basePrice = selectedRoomType === 'refundable' ? selectedRoom.price * 1.1 : selectedRoom.price
    const originalAmount = nights * basePrice * (bookingData.rooms || 1)
    
    // Apply discount if available
    if (appliedDiscount) {
      return appliedDiscount.finalAmount
    }
    
    return originalAmount
  }

  const handleFinalBooking = () => {
    if (!bookingData.customerName || !bookingData.email || !bookingData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    if (!bookingData.checkinDate || !bookingData.checkoutDate) {
      toast.error('Vui lòng chọn ngày nhận và trả phòng')
      return
    }

    // Move to payment step
    setShowBookingForm(false)
    setShowPaymentModal(true)
  }

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán')
      return
    }

    // If MoMo or ZaloPay, show QR code
    if (selectedPaymentMethod === 'momo' || selectedPaymentMethod === 'zalopay') {
      try {
        await handleQRPayment()
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tạo mã QR. Vui lòng thử lại.')
      }
      return
    }

    // For cash payment, proceed directly
    if (selectedPaymentMethod === 'cash') {
      completeBooking()
    }
  }

  const handleQRPayment = async () => {
    setShowPaymentModal(false)
    setShowQRModal(true)
    
    // Create booking data
    const bookingData = createBookingData()
    
    try {
      // Simulate API call to get QR code
      const qrData = await generateQRCode(selectedPaymentMethod, bookingData.totalPrice)
      setQrCodeData(qrData)
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Không thể tạo mã QR. Vui lòng thử lại.')
      setShowQRModal(false)
      setShowPaymentModal(true)
    }
  }

  const generateQRCode = async (paymentMethod, amount) => {
    try {
      const orderId = `TH${Date.now()}`
      const description = `Thanh toán đặt phòng ${selectedRoom?.name} tại ${hotel?.ten}`
      
      let response
      if (paymentMethod === 'momo') {
        response = await paymentService.generateMoMoQR(amount, orderId, description)
      } else if (paymentMethod === 'zalopay') {
        response = await paymentService.generateZaloPayQR(amount, orderId, description)
      }
      
      if (response.success) {
        return response.data
      } else {
        throw new Error('Failed to generate QR code')
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw error
    }
  }

  const createBookingData = () => {
    return {
      id: `TH${Date.now()}`,
      hotelId: hotel?.id,
      hotelName: hotel?.ten,
      hotel: hotel,
      room: selectedRoom,
      roomType: selectedRoomType,
      paymentMethod: selectedPaymentMethod,
      checkinDate: bookingData.checkinDate,
      checkoutDate: bookingData.checkoutDate,
      guests: bookingData.guests,
      rooms: bookingData.rooms,
      customerName: bookingData.customerName,
      email: bookingData.email,
      phone: bookingData.phone,
      specialRequests: bookingData.specialRequests,
      totalPrice: calculateFinalPrice(),
      status: 'confirmed',
      paymentStatus: selectedPaymentMethod === 'cash' ? 'pending' : 'paid',
      transactionId: selectedPaymentMethod !== 'cash' ? `TXN${Date.now()}` : null,
      // Include discount information if applied
      ...(appliedDiscount && {
        discountCode: appliedDiscount.code,
        discountAmount: appliedDiscount.discountAmount,
        originalAmount: appliedDiscount.originalAmount,
        discountDescription: appliedDiscount.description
      })
    }
  }

  const scheduleCheckOutNotification = (booking) => {
    try {
      const checkoutDate = new Date(booking.checkoutDate)
      const now = new Date()
      const timeUntilCheckout = checkoutDate.getTime() - now.getTime()
      
      // If checkout is in the future, schedule notification
      if (timeUntilCheckout > 0) {
        // Send immediate confirmation notification
        toast.success(`Đặt phòng thành công! Check-out: ${new Date(booking.checkoutDate).toLocaleDateString('vi-VN')}`, {
          icon: '✅',
          duration: 5000
        })
        
        // Schedule check-out reminder (1 day before)
        const oneDayBeforeCheckout = timeUntilCheckout - (24 * 60 * 60 * 1000)
        if (oneDayBeforeCheckout > 0) {
          setTimeout(() => {
            toast(`Ngày mai là ngày trả phòng tại ${booking.hotelName}. Vui lòng chuẩn bị hành lý.`, {
              icon: '⏰',
              duration: 6000
            })
          }, oneDayBeforeCheckout)
        }
        
        // Schedule check-out notification
        setTimeout(() => {
          toast.success(`Cảm ơn bạn đã lưu trú tại ${booking.hotelName}. Hẹn gặp lại!`, {
            icon: '🎉',
            duration: 5000
          })
          
          // Update booking status to completed
          const { updateBookingStatus } = useBookingsStore.getState()
          if (updateBookingStatus) {
            updateBookingStatus(booking.id, 'completed')
          }
        }, timeUntilCheckout)
      }
    } catch (error) {
      console.error('Error scheduling checkout notification:', error)
    }
  }

  const completeBooking = () => {
    // Create booking data
    const newBooking = createBookingData()
    
    // Add to bookings store
    const { addBooking } = useBookingsStore.getState()
    addBooking(newBooking)
    
    // Schedule check-out notification
    scheduleCheckOutNotification(newBooking)
    
    // Show success animation
    setShowPaymentModal(false)
    setShowQRModal(false)
    setShowSuccessAnimation(true)
    
    // Auto hide success animation after 3 seconds
    setTimeout(() => {
      setShowSuccessAnimation(false)
      setBookingComplete(true)
      
      setTimeout(() => {
        resetBookingStates()
        toast.success('Đặt phòng thành công! Đang chuyển đến trang đặt phòng của bạn...')
        
        // Navigate to bookings page after success
        setTimeout(() => {
          navigate('/bookings')
        }, 1500)
      }, 1000)
    }, 3000)
  }

  const resetBookingStates = () => {
    setSelectedRoom(null)
    setSelectedRoomType(null)
    setSelectedPaymentMethod('')
    setBookingComplete(false)
    setQrCodeData(null)
    setPaymentProcessing(false)
    setAppliedDiscount(null)
    setBookingData({
      checkinDate: '',
      checkoutDate: '',
      guests: 2,
      rooms: 1,
      customerName: '',
      email: '',
      phone: '',
      specialRequests: ''
    })
  }

  // Discount handlers
  const handleDiscountApplied = (discountData) => {
    setAppliedDiscount(discountData)
  }

  const handleDiscountRemoved = () => {
    setAppliedDiscount(null)
  }

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={16}
            className={index < Math.floor(rating) ? 'text-warning' : 'text-muted'}
            fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    )
  }

  const calculateTotalPrice = () => {
    if (!bookingData.checkinDate || !bookingData.checkoutDate || !hotel || !hotel.gia_thap_nhat) {
      return 0
    }
    
    const checkinDate = new Date(bookingData.checkinDate)
    const checkoutDate = new Date(bookingData.checkoutDate)
    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))
    
    if (nights <= 0) return 0
    
    const basePrice = nights * hotel.gia_thap_nhat * (bookingData.rooms || 1)
    
    // Apply discount if available
    if (appliedDiscount) {
      return appliedDiscount.finalAmount
    }
    
    return basePrice
  }

  const handleBooking = () => {
    if (!isAuthenticated()) {
      toast.error('Vui lòng đăng nhập để đặt phòng')
      navigate('/login')
      return
    }

    if (!bookingData.checkinDate || !bookingData.checkoutDate) {
      toast.error('Vui lòng chọn ngày nhận và trả phòng')
      return
    }

    if (!bookingData.customerName || !bookingData.email || !bookingData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin liên hệ')
      return
    }

    // Validate dates
    const checkinDate = new Date(bookingData.checkinDate)
    const checkoutDate = new Date(bookingData.checkoutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkinDate < today) {
      toast.error('Ngày nhận phòng không thể là ngày trong quá khứ')
      return
    }

    if (checkoutDate <= checkinDate) {
      toast.error('Ngày trả phòng phải sau ngày nhận phòng')
      return
    }

    const totalPrice = calculateTotalPrice()
    
    const booking = createBooking({
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkinDate: bookingData.checkinDate,
      checkoutDate: bookingData.checkoutDate,
      guests: bookingData.guests,
      rooms: bookingData.rooms,
      customerName: bookingData.customerName,
      email: bookingData.email,
      phone: bookingData.phone,
      specialRequests: bookingData.specialRequests,
      totalPrice: totalPrice
    })

    navigate(`/payment/${booking.id}`)
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang tải thông tin khách sạn...</p>
        </div>
      </Container>
    )
  }

  if (!hotel) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>Không tìm thấy khách sạn</h3>
          <Button variant="primary" onClick={() => navigate('/hotels')}>
            Quay về danh sách khách sạn
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="hotel-detail-page bg-light min-vh-100">
      <Container className="py-4">
        {/* Back Button */}
        <Button 
          variant="outline-secondary" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} className="me-2" />
          Quay lại
        </Button>

        <Row>
          {/* Hotel Information */}
          <Col lg={8}>
            {/* Hotel Images Carousel */}
            <Card className="border-0 shadow-sm mb-4 position-relative">
              <Carousel 
                fade 
                controls={true} 
                indicators={true}
                style={{ height: '400px' }}
                className="hotel-carousel"
              >
                {(hotel.hinh_anh_gallery || [hotel.hinh_anh]).map((image, index) => (
                  <Carousel.Item key={index} style={{ height: '400px' }}>
                    <img
                      src={image}
                      alt={`${hotel.ten} - Hình ${index + 1}`}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="carousel-overlay">
                      <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-75 text-white p-2 m-3 rounded">
                        <small className="fw-semibold">
                          {index + 1} / {(hotel.hinh_anh_gallery || [hotel.hinh_anh]).length}
                        </small>
                      </div>
                      <div className="position-absolute top-0 end-0 p-3">
                        <Badge bg="primary" className="px-3 py-2">
                          {hotel.so_sao} ⭐
                        </Badge>
                      </div>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
              
              {/* Custom Carousel Styles */}
              <style>{`
                .hotel-carousel .carousel-control-prev,
                .hotel-carousel .carousel-control-next {
                  width: 60px;
                  height: 60px;
                  background: rgba(0, 0, 0, 0.6);
                  border-radius: 50%;
                  top: 50%;
                  transform: translateY(-50%);
                  border: 2px solid rgba(255, 255, 255, 0.3);
                  transition: all 0.3s ease;
                }
                
                .hotel-carousel .carousel-control-prev {
                  left: 20px;
                }
                
                .hotel-carousel .carousel-control-next {
                  right: 20px;
                }
                
                .hotel-carousel .carousel-control-prev:hover,
                .hotel-carousel .carousel-control-next:hover {
                  background: rgba(0, 0, 0, 0.8);
                  border-color: rgba(255, 255, 255, 0.6);
                  transform: translateY(-50%) scale(1.1);
                }
                
                .hotel-carousel .carousel-indicators {
                  bottom: 20px;
                  margin-bottom: 0;
                }
                
                .hotel-carousel .carousel-indicators [data-bs-target] {
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  border: 2px solid rgba(255, 255, 255, 0.6);
                  background: rgba(255, 255, 255, 0.3);
                  margin: 0 4px;
                  transition: all 0.3s ease;
                }
                
                .hotel-carousel .carousel-indicators .active {
                  background: #ffffff;
                  border-color: #ffffff;
                  transform: scale(1.2);
                }
                
                .carousel-overlay {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  pointer-events: none;
                }
              `}</style>
            </Card>

            {/* Hotel Info */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 className="fw-bold mb-2">{hotel.ten}</h2>
                    <div className="d-flex align-items-center mb-2">
                      <MapPin size={16} className="text-muted me-2" />
                      <span className="text-muted">{hotel.dia_chi}</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      {renderStars(hotel.rating)}
                      <span className="fw-bold ms-2">{hotel.rating}</span>
                      <span className="text-muted ms-2">({hotel.reviews_count} đánh giá)</span>
                      <Badge bg="primary" className="ms-3">{hotel.so_sao} sao</Badge>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button 
                      variant={isFavorite(hotel.id) ? "danger" : "outline-secondary"}
                      onClick={() => toggleFavorite(hotel)}
                      title={isFavorite(hotel.id) ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                    >
                      <Heart 
                        size={18} 
                        fill={isFavorite(hotel.id) ? "currentColor" : "none"}
                      />
                    </Button>
                    <Button variant="outline-secondary">
                      <Share2 size={18} />
                    </Button>
                  </div>
                </div>

                <h5 className="fw-bold mb-3">Mô tả</h5>
                <p className="text-muted mb-4">{hotel.mo_ta}</p>

                <h5 className="fw-bold mb-3">Tiện nghi khách sạn</h5>
                <Row>
                  {hotel.amenities?.map((amenity, index) => (
                    <Col md={6} key={index} className="mb-2">
                      <button
                        onClick={() => handleAmenityClick(amenity)}
                        className="btn btn-link text-start p-0 text-decoration-none w-100"
                        style={{ border: 'none', background: 'none' }}
                      >
                        <div className="d-flex align-items-center hover-primary" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                          <div className="me-3">
                            {amenity.includes('Wifi') && <Wifi size={20} className="text-primary" />}
                            {amenity.includes('Bể bơi') && <Coffee size={20} className="text-primary" />}
                            {amenity.includes('gym') && <Dumbbell size={20} className="text-primary" />}
                            {amenity.includes('Spa') && <Coffee size={20} className="text-primary" />}
                            {amenity.includes('Nhà hàng') && <Coffee size={20} className="text-primary" />}
                            {!amenity.includes('Wifi') && !amenity.includes('Bể bơi') && !amenity.includes('gym') && !amenity.includes('Spa') && !amenity.includes('Nhà hàng') && <Coffee size={20} className="text-primary" />}
                          </div>
                          <span className="text-dark">{amenity}</span>
                        </div>
                      </button>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Booking Panel */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm position-sticky" style={{ top: '100px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Vị trí khách sạn</h5>
                
                {/* Map Placeholder */}
                <div 
                  className="bg-light border rounded d-flex align-items-center justify-content-center"
                  style={{ height: '300px' }}
                >
                  <div className="text-center text-muted">
                    <MapPin size={48} className="mb-2" />
                    <p className="mb-0">Bản đồ sẽ được hiển thị tại đây</p>
                    <small>{hotel?.dia_chi}</small>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">Thông tin liên hệ</h6>
                  <p className="mb-1"><strong>Địa chỉ:</strong> {hotel?.dia_chi}</p>
                  <p className="mb-1"><strong>Điện thoại:</strong> +84 123 456 789</p>
                  <p className="mb-0"><strong>Email:</strong> info@{hotel?.ten?.toLowerCase().replace(/\s+/g, '')}.com</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Room List Section */}
        <Row className="mt-5">
          <Col lg={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h4 className="mb-0">Danh sách phòng</h4>
                  <div className="d-flex align-items-center gap-3">
                    <Form.Select 
                      size="sm" 
                      style={{ width: 'auto' }}
                      value={roomFilters.roomType}
                      onChange={(e) => handleRoomFilterChange('roomType', e.target.value)}
                    >
                      <option value="all">Tất cả loại phòng</option>
                      <option value="standardRoom">Phòng Standard</option>
                      <option value="deluxeRoom">Phòng Deluxe</option>
                      <option value="suiteRoom">Phòng Suite</option>
                    </Form.Select>
                    
                    <Form.Select 
                      size="sm" 
                      style={{ width: 'auto' }}
                      value={roomFilters.priceRange}
                      onChange={(e) => handleRoomFilterChange('priceRange', e.target.value)}
                    >
                      <option value="all">Khoảng giá</option>
                      <option value="under2m">Dưới 2,000,000₫</option>
                      <option value="2m-3m">2,000,000₫ - 3,000,000₫</option>
                      <option value="over3m">Trên 3,000,000₫</option>
                    </Form.Select>
                    
                    <Form.Select 
                      size="sm" 
                      style={{ width: 'auto' }}
                      value={roomFilters.availability}
                      onChange={(e) => handleRoomFilterChange('availability', e.target.value)}
                    >
                      <option value="all">Tất cả</option>
                      <option value="available">Còn phòng</option>
                      <option value="unavailable">Hết phòng</option>
                    </Form.Select>
                  </div>
                </div>

                <Row>
                  {filteredRooms.map(room => (
                    <Col md={6} lg={4} key={room.id} className="mb-4">
                      <Card className="h-100 border-0 shadow-sm">
                        <div style={{ position: 'relative' }}>
                          <Card.Img 
                            variant="top" 
                            src={room.image}
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          {!room.available && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                              <Badge bg="danger" className="px-3 py-2">
                                Hết phòng
                              </Badge>
                            </div>
                          )}
                        </div>
                        <Card.Body>
                          <h6 className="mb-2">{room.name}</h6>
                          <p className="text-muted small mb-2">{room.size} • Tối đa {room.maxGuests} khách</p>
                          
                          {/* Available Rooms Count */}
                          <div className="mb-2">
                            {room.available ? (
                              <small className={`fw-bold ${room.availableRooms <= 3 ? 'text-warning' : 'text-success'}`}>
                                <Users size={14} className="me-1" />
                                Còn {room.availableRooms} phòng trống
                              </small>
                            ) : (
                              <small className="text-danger fw-bold">
                                <Users size={14} className="me-1" />
                                Hết phòng
                              </small>
                            )}
                          </div>
                          
                          <div className="mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="h5 mb-0 text-primary">{formatPrice(room.price)}</span>
                              {room.originalPrice > room.price && (
                                <small className="text-muted text-decoration-line-through">
                                  {formatPrice(room.originalPrice)}
                                </small>
                              )}
                            </div>
                            <small className="text-success">/ đêm</small>
                          </div>
                          
                          <div className="mb-3">
                            {room.amenities && Array.isArray(room.amenities) && room.amenities.slice(0, 3).map((amenity, idx) => (
                              <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                                {amenity}
                              </Badge>
                            ))}
                            {room.amenities && room.amenities.length > 3 && (
                              <Badge bg="light" text="dark" className="me-1">
                                +{room.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                          
                          <div className="d-grid">
                            <Button 
                              variant={room.available ? "primary" : "secondary"}
                              size="sm"
                              disabled={!room.available}
                              onClick={() => handleRoomSelect(room)}
                            >
                              {room.available ? 'Chọn phòng' : 'Không có sẵn'}
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {filteredRooms.length === 0 && (
                  <div className="text-center py-5">
                    <h6 className="text-muted">Không có phòng nào phù hợp với bộ lọc của bạn</h6>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Customer Reviews Section */}
        <Row className="mt-5">
          <Col lg={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h4 className="mb-0">Đánh giá của khách hàng</h4>
                  <div className="d-flex align-items-center">
                    <span className="me-2 fw-bold">{calculateAverageRating()}</span>
                    {renderStars(parseFloat(calculateAverageRating()))}
                    <span className="ms-2 text-muted">({mockReviews.length} đánh giá)</span>
                  </div>
                </div>

                <Row>
                  {mockReviews.slice(0, 4).map(review => (
                    <Col md={6} key={review.id} className="mb-3">
                      <div className="border rounded p-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <img 
                            src={review.avatar} 
                            alt={review.customerName}
                            className="rounded-circle me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <div>
                            <h6 className="mb-1">{review.customerName}</h6>
                            <div className="d-flex align-items-center">
                              {renderStars(review.rating)}
                              <small className="text-muted ms-2">{review.date}</small>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted mb-0 small">{review.comment}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Room Selection Modal */}
        <Modal 
          show={showRoomModal} 
          onHide={() => {
            console.log('Closing room modal')
            setShowRoomModal(false)
          }} 
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Chọn loại phòng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRoom ? (
              <div>
                <div className="text-center mb-4">
                  <img 
                    src={selectedRoom.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={selectedRoom.name || 'Room'}
                    className="img-fluid rounded"
                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                  />
                  <h5 className="mt-3 mb-1">{selectedRoom.name || 'Phòng'}</h5>
                  <p className="text-muted">{selectedRoom.size || '25m²'} • Tối đa {selectedRoom.maxGuests || 2} khách</p>
                </div>

                <div className="row g-3">
                  {/* Non-Refundable Option */}
                  <div className="col-12">
                    <Card className="border-2 h-100">
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 className="fw-bold text-success mb-1">Không thể hủy</h6>
                            <small className="text-muted">Giá tốt nhất - Không hoàn tiền</small>
                          </div>
                          <div className="text-end">
                            <div className="h5 mb-0 text-success">{formatPrice(selectedRoom.price || 0)}</div>
                            <small className="text-muted">/đêm</small>
                          </div>
                        </div>
                        <ul className="list-unstyled mb-3">
                          <li className="small text-muted mb-1">✗ Không thể hủy hoặc thay đổi</li>
                          <li className="small text-muted mb-1">✗ Không hoàn tiền khi hủy</li>
                          <li className="small text-success">✓ Giá ưu đãi nhất</li>
                        </ul>
                        <Button 
                          variant="success" 
                          className="w-100"
                          onClick={() => handleRoomBooking(false)}
                        >
                          Chọn - {formatPrice(selectedRoom.price || 0)}
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>

                  {/* Refundable Option */}
                  <div className="col-12">
                    <Card className="border-2 border-primary h-100">
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 className="fw-bold text-primary mb-1">Có thể hủy</h6>
                            <small className="text-muted">Linh hoạt - Hoàn tiền đầy đủ</small>
                          </div>
                          <div className="text-end">
                            <div className="h5 mb-0 text-primary">{formatPrice((selectedRoom.price || 0) * 1.1)}</div>
                            <small className="text-muted">/đêm</small>
                          </div>
                        </div>
                        <ul className="list-unstyled mb-3">
                          <li className="small text-success mb-1">✓ Miễn phí hủy trước 24h</li>
                          <li className="small text-success mb-1">✓ Hoàn tiền 100% khi hủy</li>
                          <li className="small text-success">✓ Linh hoạt thay đổi</li>
                        </ul>
                        <Button 
                          variant="primary" 
                          className="w-100"
                          onClick={() => handleRoomBooking(true)}
                        >
                          Chọn - {formatPrice((selectedRoom.price || 0) * 1.1)}
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2">Đang tải thông tin phòng...</div>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Enhanced Booking Form Modal */}
        <Modal show={showBookingForm} onHide={() => setShowBookingForm(false)} size="lg" centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title className="d-flex align-items-center">
              <CreditCard size={24} className="me-2" />
              Hoàn tất đặt phòng
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            {selectedRoom && (
              <div>
                {/* Booking Summary Header */}
                <div className="bg-light p-4 border-bottom">
                  <Row>
                    <Col md={8}>
                      <div className="d-flex">
                        <img 
                          src={selectedRoom.image} 
                          alt={selectedRoom.name}
                          className="rounded me-3"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="fw-bold mb-1">{selectedRoom.name}</h6>
                          <p className="text-muted mb-1">{hotel?.ten}</p>
                          <div className="d-flex align-items-center">
                            {selectedRoomType === 'refundable' ? (
                              <Badge bg="primary" className="me-2">
                                <Shield size={12} className="me-1" />
                                Có thể hủy
                              </Badge>
                            ) : (
                              <Badge bg="success" className="me-2">
                                <Clock size={12} className="me-1" />
                                Không thể hủy
                              </Badge>
                            )}
                            <small className="text-muted">{selectedRoom.size} • {selectedRoom.maxGuests} khách</small>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="text-end">
                      <div className="h5 mb-0 text-primary">
                        {formatPrice(selectedRoomType === 'refundable' ? selectedRoom.price * 1.1 : selectedRoom.price)}
                      </div>
                      <small className="text-muted">/đêm</small>
                    </Col>
                  </Row>
                </div>

                {/* Booking Form */}
                <div className="p-4">
                  <Row>
                    {/* Left Column - Dates & Guests */}
                    <Col md={6}>
                      <h6 className="fw-bold mb-3 d-flex align-items-center">
                        <CalendarDays size={18} className="me-2 text-primary" />
                        Thông tin lưu trú
                      </h6>
                      
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-3">Chọn ngày lưu trú</Form.Label>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <DateRangePicker
                            checkinDate={bookingData.checkinDate}
                            checkoutDate={bookingData.checkoutDate}
                            onDateChange={(dates) => setBookingData({
                              ...bookingData,
                              checkinDate: dates.checkinDate,
                              checkoutDate: dates.checkoutDate
                            })}
                            className="w-100"
                          />
                        </motion.div>
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Số phòng</Form.Label>
                            <Form.Select
                              value={bookingData.rooms}
                              onChange={(e) => setBookingData({...bookingData, rooms: parseInt(e.target.value)})}
                              className="form-select-lg"
                            >
                              <option value={1}>1 phòng</option>
                              <option value={2}>2 phòng</option>
                              <option value={3}>3 phòng</option>
                              <option value={4}>4 phòng</option>
                              <option value={5}>5+ phòng</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Số khách</Form.Label>
                            <Form.Select
                              value={bookingData.guests}
                              onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                              className="form-select-lg"
                            >
                              <option value={1}>1 khách</option>
                              <option value={2}>2 khách</option>
                              <option value={3}>3 khách</option>
                              <option value={4}>4 khách</option>
                              <option value={5}>5+ khách</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    {/* Right Column - Contact Info */}
                    <Col md={6}>
                      <h6 className="fw-bold mb-3 d-flex align-items-center">
                        <UserCheck size={18} className="me-2 text-primary" />
                        Thông tin khách hàng
                      </h6>
                      
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Họ và tên <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <UserCheck size={16} />
                          </span>
                          <Form.Control
                            type="text"
                            placeholder="Nhập họ và tên"
                            value={bookingData.customerName}
                            onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
                            className="form-control-lg"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Email <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <Mail size={16} />
                          </span>
                          <Form.Control
                            type="email"
                            placeholder="Nhập địa chỉ email"
                            value={bookingData.email}
                            onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                            className="form-control-lg"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Số điện thoại <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <Phone size={16} />
                          </span>
                          <Form.Control
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            value={bookingData.phone}
                            onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                            className="form-control-lg"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Yêu cầu đặc biệt</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Ghi chú thêm cho khách sạn (tùy chọn)"
                          value={bookingData.specialRequests}
                          onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Discount Code Input */}
                  {bookingData.checkinDate && bookingData.checkoutDate && (
                    <div className="mt-4">
                      <DiscountCodeInput
                        orderAmount={calculateTotalPrice()}
                        hotelId={hotel?.id}
                        onDiscountApplied={handleDiscountApplied}
                        onDiscountRemoved={handleDiscountRemoved}
                        appliedDiscount={appliedDiscount}
                      />
                    </div>
                  )}

                  {/* Price Summary */}
                  {bookingData.checkinDate && bookingData.checkoutDate && (
                    <div className="bg-light rounded p-4 mt-4">
                      <h6 className="fw-bold mb-3">Tóm tắt giá</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Giá phòng ({Math.ceil((new Date(bookingData.checkoutDate) - new Date(bookingData.checkinDate)) / (1000 * 60 * 60 * 24))} đêm × {bookingData.rooms} phòng)</span>
                        <span>{formatPrice(appliedDiscount ? appliedDiscount.originalAmount : calculateTotalPrice())}</span>
                      </div>
                      {selectedRoomType === 'refundable' && (
                        <div className="d-flex justify-content-between mb-2 text-info">
                          <span>Phí linh hoạt hủy phòng (+10%)</span>
                          <span>Đã bao gồm</span>
                        </div>
                      )}
                      {appliedDiscount && (
                        <div className="d-flex justify-content-between mb-2 text-success">
                          <span>Giảm giá ({appliedDiscount.code})</span>
                          <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
                        </div>
                      )}
                      <hr />
                      <div className="d-flex justify-content-between fs-5 fw-bold">
                        <span>Tổng cộng</span>
                        <span className="text-primary">{formatPrice(calculateTotalPrice())}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={() => setShowBookingForm(false)}>
              Quay lại
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleFinalBooking}
              disabled={!bookingData.customerName || !bookingData.email || !bookingData.phone || !bookingData.checkinDate || !bookingData.checkoutDate}
            >
              <CreditCard size={18} className="me-2" />
              Tiến hành thanh toán
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Payment Modal */}
        <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} size="lg" centered>
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title className="d-flex align-items-center">
              <CreditCard size={24} className="me-2" />
              Chọn phương thức thanh toán
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {selectedRoom && (
              <div>
                {/* Booking Summary */}
                <div className="bg-light rounded p-4 mb-4">
                  <h6 className="fw-bold mb-3">Thông tin đặt phòng</h6>
                  <Row>
                    <Col md={8}>
                      <p className="mb-1"><strong>Khách sạn:</strong> {hotel?.ten}</p>
                      <p className="mb-1"><strong>Phòng:</strong> {selectedRoom.name}</p>
                      <p className="mb-1"><strong>Loại:</strong> {selectedRoomType === 'refundable' ? 'Có thể hủy' : 'Không thể hủy'}</p>
                      <p className="mb-1"><strong>Khách:</strong> {bookingData.customerName}</p>
                      <p className="mb-1"><strong>Thời gian:</strong> {bookingData.checkinDate} - {bookingData.checkoutDate}</p>
                      {appliedDiscount && (
                        <p className="mb-0 text-success"><strong>Mã giảm giá:</strong> {appliedDiscount.code} (-{formatPrice(appliedDiscount.discountAmount)})</p>
                      )}
                    </Col>
                    <Col md={4} className="text-end">
                      {appliedDiscount && (
                        <div className="mb-1">
                          <div className="text-muted text-decoration-line-through">{formatPrice(appliedDiscount.originalAmount)}</div>
                        </div>
                      )}
                      <div className="h4 text-success mb-0">{formatPrice(calculateFinalPrice())}</div>
                      <small className="text-muted">Tổng thanh toán</small>
                    </Col>
                  </Row>
                </div>

                {/* Payment Methods */}
                <h6 className="fw-bold mb-3">Chọn phương thức thanh toán</h6>
                <div className="row g-3">
                  {/* ZaloPay */}
                  <div className="col-12">
                    <Card 
                      className={`border-2 cursor-pointer ${selectedPaymentMethod === 'zalopay' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                      onClick={() => setSelectedPaymentMethod('zalopay')}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div className="bg-primary rounded-circle p-2">
                              <Smartphone size={24} className="text-white" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold">ZaloPay</h6>
                            <small className="text-muted">Thanh toán qua ví điện tử ZaloPay</small>
                          </div>
                          <div>
                            <Form.Check
                              type="radio"
                              name="paymentMethod"
                              checked={selectedPaymentMethod === 'zalopay'}
                              onChange={() => setSelectedPaymentMethod('zalopay')}
                            />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>

                  {/* MoMo */}
                  <div className="col-12">
                    <Card 
                      className={`border-2 cursor-pointer ${selectedPaymentMethod === 'momo' ? 'border-danger bg-danger bg-opacity-10' : 'border-light'}`}
                      onClick={() => setSelectedPaymentMethod('momo')}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div className="bg-danger rounded-circle p-2">
                              <Smartphone size={24} className="text-white" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold">MoMo</h6>
                            <small className="text-muted">Thanh toán qua ví điện tử MoMo</small>
                          </div>
                          <div>
                            <Form.Check
                              type="radio"
                              name="paymentMethod"
                              checked={selectedPaymentMethod === 'momo'}
                              onChange={() => setSelectedPaymentMethod('momo')}
                            />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>

                  {/* Cash at Counter */}
                  <div className="col-12">
                    <Card 
                      className={`border-2 cursor-pointer ${selectedPaymentMethod === 'cash' ? 'border-warning bg-warning bg-opacity-10' : 'border-light'}`}
                      onClick={() => setSelectedPaymentMethod('cash')}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div className="bg-warning rounded-circle p-2">
                              <Building2 size={24} className="text-white" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold">Thanh toán tại quầy</h6>
                            <small className="text-muted">Thanh toán bằng tiền mặt khi nhận phòng</small>
                          </div>
                          <div>
                            <Form.Check
                              type="radio"
                              name="paymentMethod"
                              checked={selectedPaymentMethod === 'cash'}
                              onChange={() => setSelectedPaymentMethod('cash')}
                            />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={() => setShowPaymentModal(false)}>
              Quay lại
            </Button>
            <Button 
              variant="success" 
              size="lg"
              onClick={handlePayment}
              disabled={!selectedPaymentMethod}
            >
              <CreditCard size={18} className="me-2" />
              Xác nhận thanh toán - {selectedRoom && formatPrice(calculateFinalPrice())}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* QR Code Payment Modal */}
        <Modal 
          show={showQRModal} 
          onHide={() => setShowQRModal(false)} 
          size="md" 
          centered
        >
          <Modal.Header closeButton className="bg-info text-white">
            <Modal.Title className="d-flex align-items-center">
              <Smartphone size={24} className="me-2" />
              Thanh toán {selectedPaymentMethod === 'momo' ? 'MoMo' : 'ZaloPay'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center p-4">
            {qrCodeData ? (
              <div>
                <div className="mb-4">
                  <h5 className="mb-3">Quét mã QR để thanh toán</h5>
                  <div className="d-flex justify-content-center mb-3">
                    <img 
                      src={qrCodeData.qrCode} 
                      alt="QR Code" 
                      className="border rounded"
                      style={{ width: '250px', height: '250px' }}
                    />
                  </div>
                  <div className="bg-light rounded p-3 mb-3">
                    <p className="mb-1"><strong>Mã đơn hàng:</strong> {qrCodeData.orderId}</p>
                    <p className="mb-1"><strong>Số tiền:</strong> {formatPrice(qrCodeData.amount)}</p>
                    <p className="mb-1"><strong>Mô tả:</strong> {qrCodeData.description}</p>
                    <p className="mb-0"><strong>Hết hạn:</strong> {new Date(qrCodeData.expiryTime).toLocaleString('vi-VN')}</p>
                  </div>
                  
                  {/* Quick Pay Button */}
                  <div className="mb-3">
                    <Button 
                      variant="outline-primary" 
                      className="w-100"
                      onClick={() => window.open(qrCodeData.deepLink, '_blank')}
                    >
                      <Smartphone size={16} className="me-2" />
                      Mở ứng dụng {selectedPaymentMethod === 'momo' ? 'MoMo' : 'ZaloPay'}
                    </Button>
                  </div>
                </div>

                <div className="alert alert-info">
                  <small>
                    <strong>Hướng dẫn:</strong><br />
                    1. Mở ứng dụng {selectedPaymentMethod === 'momo' ? 'MoMo' : 'ZaloPay'}<br />
                    2. Chọn quét mã QR<br />
                    3. Quét mã QR trên màn hình<br />
                    4. Xác nhận thanh toán trên ứng dụng
                  </small>
                </div>

                {/* Simulate payment processing */}
                {paymentProcessing && (
                  <div className="text-center">
                    <div className="spinner-border text-success me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span>Đang xử lý thanh toán...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Đang tạo mã QR...</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="w-100">
              <div className="row g-2">
                <div className="col-6">
                  <Button 
                    variant="outline-secondary" 
                    className="w-100"
                    onClick={() => {
                      setShowQRModal(false)
                      setShowPaymentModal(true)
                      setQrCodeData(null)
                    }}
                    disabled={paymentProcessing}
                  >
                    Quay lại
                  </Button>
                </div>
                <div className="col-6">
                  <Button 
                    variant="success" 
                    className="w-100"
                    onClick={() => {
                      setPaymentProcessing(true)
                      // Simulate payment confirmation after 2 seconds
                      setTimeout(() => {
                        setPaymentProcessing(false)
                        completeBooking()
                      }, 2000)
                    }}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? 'Đang xử lý...' : 'Đã thanh toán'}
                  </Button>
                </div>
              </div>
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  Chỉ bấm "Đã thanh toán" sau khi hoàn tất thanh toán trên ứng dụng
                </small>
              </div>
            </div>
          </Modal.Footer>
        </Modal>

        {/* Success Animation Modal */}
        <Modal 
          show={showSuccessAnimation} 
          onHide={() => {}} 
          centered 
          backdrop="static" 
          keyboard={false}
          size="sm"
        >
          <Modal.Body className="text-center p-5">
            <div className="mb-4">
              <div className="position-relative d-inline-block">
                <CheckCircle size={80} className="text-success" />
                <Sparkles 
                  size={40} 
                  className="text-warning position-absolute"
                  style={{ 
                    top: '-10px', 
                    right: '-10px',
                    animation: 'sparkle 1.5s ease-in-out infinite'
                  }} 
                />
              </div>
            </div>
            <h4 className="text-success fw-bold mb-3">Đặt phòng thành công!</h4>
            <p className="text-muted mb-0">
              Cảm ơn bạn đã tin tưởng TripHotel.
              <br />
              Chúng tôi sẽ liên hệ với bạn sớm nhất.
            </p>
            
            <div className="mt-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>

      {/* Amenity Detail Modal */}
      <Modal 
        show={showAmenityModal} 
        onHide={() => setShowAmenityModal(false)} 
        size="lg" 
        centered
      >
        <Modal.Header closeButton className="border-0 position-absolute" style={{ zIndex: 1, right: 0 }}>
          <Button 
            variant="light" 
            className="rounded-circle p-2"
            onClick={() => setShowAmenityModal(false)}
            style={{ width: '40px', height: '40px' }}
          >
            <span className="fs-5">&times;</span>
          </Button>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedAmenity && (
            <div>
              {/* Banner Carousel */}
              {selectedAmenity.images && selectedAmenity.images.length > 0 && (
                <div className="position-relative">
                  <Carousel 
                    fade 
                    controls={true} 
                    indicators={true}
                    interval={3000}
                    pause="hover"
                  >
                    {selectedAmenity.images.map((image, index) => (
                      <Carousel.Item key={index} style={{ height: '400px' }}>
                        <img
                          src={image}
                          alt={`${selectedAmenity.title} - ${index + 1}`}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                        {index === 0 && (
                          <div 
                            className="position-absolute bottom-0 start-0 w-100 p-4"
                            style={{ 
                              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
                            }}
                          >
                            <div className="d-flex align-items-center text-white">
                              <span className="me-3" style={{ fontSize: '3rem' }}>{selectedAmenity.icon}</span>
                              <h3 className="mb-0 fw-bold">{selectedAmenity.title}</h3>
                            </div>
                          </div>
                        )}
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              )}

              {/* Content */}
              <div className="p-4">
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                {selectedAmenity.description}
              </p>

              <h6 className="fw-bold mb-3 text-primary">🌟 Tiện ích nổi bật</h6>
              <Row className="mb-4">
                {selectedAmenity.features?.map((feature, index) => (
                  <Col md={6} key={index} className="mb-2">
                    <div className="d-flex align-items-start">
                      <CheckCircle size={18} className="text-success me-2 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="bg-light rounded p-3 mb-3">
                <Row>
                  <Col md={6} className="mb-2">
                    <div className="d-flex align-items-center">
                      <Clock size={18} className="text-primary me-2" />
                      <div>
                        <small className="text-muted d-block">Thời gian phục vụ</small>
                        <strong>{selectedAmenity.available}</strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-2">
                    <div className="d-flex align-items-center">
                      <MapPin size={18} className="text-primary me-2" />
                      <div>
                        <small className="text-muted d-block">Vị trí</small>
                        <strong>{selectedAmenity.location}</strong>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {selectedAmenity.note && (
                <div className="alert alert-info mb-0">
                  <strong>Lưu ý:</strong> {selectedAmenity.note}
                </div>
              )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAmenityModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => {
            setShowAmenityModal(false)
            // Scroll to booking section
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}>
            Đặt phòng ngay
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom CSS for animations */}
      <style>{`
        .hover-primary:hover {
          transform: translateX(5px);
          color: #0d6efd !important;
        }
        .hover-primary:hover span {
          color: #0d6efd !important;
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        }
        .cursor-pointer {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cursor-pointer:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Hotel Location Map Section */}
      {hotel && (
        <Container className="my-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    backgroundColor: '#e3f2fd', 
                    borderRadius: '12px', 
                    padding: '12px',
                    display: 'inline-flex'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </span>
                  Vị trí khách sạn
                </h3>
                
                <div className="mb-3">
                  <p className="text-muted mb-2" style={{ fontSize: '15px' }}>
                    <strong>Địa chỉ:</strong> {hotel.dia_chi}
                  </p>
                  <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                    Bản đồ sẽ được hiển thị tại đây
                  </p>
                </div>

                <HotelMap hotel={hotel} />

                <div className="mt-3 p-3 bg-light rounded">
                  <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>
                    💡 <strong>Lưu ý:</strong> Bấm vào marker trên bản đồ để xem thông tin chi tiết. 
                    Sử dụng các nút điều khiển để phóng to/thu nhỏ và xem Street View.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Container>
      )}

      {/* Chat Widget */}
      <ChatWidget hotelName={hotel?.ten} />
    </div>
  )
}

export default HotelDetailPage