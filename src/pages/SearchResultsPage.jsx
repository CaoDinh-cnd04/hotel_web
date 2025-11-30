import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container, Row, Col, Card, Badge, Button as BootstrapButton, Form, Alert } from 'react-bootstrap'
import { Filter, Star, MapPin, Calendar, Users, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const searchQuery = searchParams.get('q') || ''
  const destination = searchParams.get('destination') || ''
  const checkin = searchParams.get('checkin') || ''
  const checkout = searchParams.get('checkout') || ''
  const guests = parseInt(searchParams.get('guests')) || 2

  const [filters, setFilters] = useState({
    sortBy: 'rating',
    priceRange: '',
    stars: ''
  })
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState([])

  // Mock data cho tìm kiếm
  const getMockHotels = () => [
    // TP.HCM - 8 khách sạn
    {
      id: 1,
      ten: 'Grand Hotel Saigon',
      dia_chi: '8 Đồng Khởi, Quận 1, TP.HCM',
      thanh_pho: 'TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 2500000,
      rating: 4.8,
      reviews_count: 245,
      mo_ta: 'Khách sạn sang trọng 5 sao tại trung tâm Sài Gòn với dịch vụ hoàn hảo và vị trí đắc địa.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Phòng gym']
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
      mo_ta: 'Khách sạn quốc tế 5 sao với thiết kế hiện đại và dịch vụ chuyên nghiệp.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng']
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
      mo_ta: 'Khách sạn lịch sử 4 sao tại trung tâm Sài Gòn với kiến trúc cổ điển.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar']
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
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar']
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
      mo_ta: 'Khách sạn 5 sao đẳng cấp với vị trí prime tại trung tâm Sài Gòn.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng', 'Bar']
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
      mo_ta: 'Khách sạn Nhật Bản 5 sao với phong cách tinh tế.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng']
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
      mo_ta: 'Khách sạn lịch sử nổi tiếng với Saigon Saigon Rooftop Bar.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng']
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
      mo_ta: 'Khách sạn 4 sao ven sông Sài Gòn với view đẹp.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Nhà hàng']
    },

    // Đà Nẵng - 5 khách sạn
    {
      id: 3,
      ten: 'InterContinental Da Nang',
      dia_chi: 'Ngũ Hành Sơn, Đà Nẵng',
      thanh_pho: 'Đà Nẵng',
      hinh_anh: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3200000,
      rating: 4.9,
      reviews_count: 321,
      mo_ta: 'Resort 5 sao bên bờ biển Đà Nẵng với tầm nhìn tuyệt đẹp.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Bãi biển riêng']
    },
    {
      id: 16,
      ten: 'Hyatt Regency Danang Resort',
      dia_chi: '5 Trường Sa, Ngũ Hành Sơn, Đà Nẵng',
      thanh_pho: 'Đà Nẵng',
      hinh_anh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3800000,
      rating: 4.8,
      reviews_count: 298,
      mo_ta: 'Resort 5 sao sang trọng với thiết kế độc đáo.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Bãi biển riêng']
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
      mo_ta: 'Villa resort 5 sao với không gian riêng tư.',
      amenities: ['Wifi miễn phí', 'Bể bơi riêng', 'Spa', 'Bãi biển riêng']
    },
    {
      id: 18,
      ten: 'Naman Retreat',
      dia_chi: 'Trường Sa, Ngũ Hành Sơn, Đà Nẵng',
      thanh_pho: 'Đà Nẵng',
      hinh_anh: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3600000,
      rating: 4.8,
      reviews_count: 189,
      mo_ta: 'Resort nghỉ dưỡng 5 sao với kiến trúc tre độc đáo.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Bãi biển riêng']
    },
    {
      id: 19,
      ten: 'Melia Danang Beach Resort',
      dia_chi: '19 Trường Sa, Ngũ Hành Sơn, Đà Nẵng',
      thanh_pho: 'Đà Nẵng',
      hinh_anh: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 2200000,
      rating: 4.6,
      reviews_count: 312,
      mo_ta: 'Resort 4 sao với thiết kế hiện đại.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa']
    },

    // Hà Nội - 5 khách sạn
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
      mo_ta: 'Khách sạn 5 sao gần Nhà hát Lớn.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng']
    },
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
      mo_ta: 'Khách sạn 5 sao cao cấp với dịch vụ đẳng cấp.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng']
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
      mo_ta: 'Khách sạn lịch sử 5 sao với kiến trúc Pháp cổ điển.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng']
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
      mo_ta: 'Khách sạn 5 sao duy nhất nằm trên Hồ Tây.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng']
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
      mo_ta: 'Khách sạn 5 sao với view Hồ Tây.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa', 'Nhà hàng']
    },

    // Phú Quốc - 4 khách sạn
    {
      id: 4,
      ten: 'Vinpearl Resort Phú Quốc',
      dia_chi: 'Bãi Dài, Phú Quốc, Kiên Giang',
      thanh_pho: 'Phú Quốc',
      hinh_anh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 4200000,
      rating: 4.7,
      reviews_count: 156,
      mo_ta: 'Resort 5 sao tại đảo ngọc Phú Quốc.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Bãi biển riêng', 'Sân golf']
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
      mo_ta: 'Resort 5 sao all-spa với spa không giới hạn.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa không giới hạn', 'Bãi biển riêng']
    },
    {
      id: 23,
      ten: 'JW Marriott Phu Quoc Emerald Bay',
      dia_chi: 'Khem Beach, Phú Quốc, Kiên Giang',
      thanh_pho: 'Phú Quốc',
      hinh_anh: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 6500000,
      rating: 4.9,
      reviews_count: 234,
      mo_ta: 'Resort 5 sao đẳng cấp với kiến trúc độc đáo.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Bãi biển riêng']
    },
    {
      id: 24,
      ten: 'InterContinental Phu Quoc Long Beach',
      dia_chi: 'Bãi Trường, Phú Quốc, Kiên Giang',
      thanh_pho: 'Phú Quốc',
      hinh_anh: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 5200000,
      rating: 4.8,
      reviews_count: 198,
      mo_ta: 'Resort 5 sao với bãi biển dài.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Bãi biển riêng']
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
      mo_ta: 'Khách sạn 4 sao tại vịnh đẹp nhất Việt Nam.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Nhà hàng']
    },
    {
      id: 25,
      ten: 'Vinpearl Resort Nha Trang',
      dia_chi: 'Hòn Tre, Nha Trang, Khánh Hòa',
      thanh_pho: 'Nha Trang',
      hinh_anh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3800000,
      rating: 4.7,
      reviews_count: 345,
      mo_ta: 'Resort 5 sao trên đảo Hòn Tre.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Bãi biển riêng']
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
      mo_ta: 'Khách sạn 5 sao bên bờ biển.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa']
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
      mo_ta: 'Khách sạn 4 sao view biển với giá hợp lý.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Phòng gym', 'Spa']
    },

    // Các địa điểm khác
    {
      id: 8,
      ten: 'FLC Luxury Hotel Sầm Sơn',
      dia_chi: 'FLC Sầm Sơn, Thanh Hóa',
      thanh_pho: 'Thanh Hóa',
      hinh_anh: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 1200000,
      rating: 4.3,
      reviews_count: 134,
      mo_ta: 'Khách sạn 4 sao tại bãi biển Sầm Sơn.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Nhà hàng']
    },
    {
      id: 28,
      ten: 'Vinpearl Resort Hội An',
      dia_chi: 'Bãi Dài, Hội An, Quảng Nam',
      thanh_pho: 'Hội An',
      hinh_anh: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3500000,
      rating: 4.7,
      reviews_count: 267,
      mo_ta: 'Resort 5 sao tại Hội An.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Bãi biển riêng']
    },
    {
      id: 29,
      ten: 'Vinpearl Resort Đà Lạt',
      dia_chi: 'Tuyệt Tình Cốc, Đà Lạt, Lâm Đồng',
      thanh_pho: 'Đà Lạt',
      hinh_anh: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 2800000,
      rating: 4.6,
      reviews_count: 198,
      mo_ta: 'Resort 5 sao tại thành phố ngàn hoa.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Sân golf']
    },
    {
      id: 30,
      ten: 'Ana Mandara Huế Beach Resort',
      dia_chi: 'Thuận An Beach, Huế, Thừa Thiên Huế',
      thanh_pho: 'Huế',
      hinh_anh: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 1800000,
      rating: 4.5,
      reviews_count: 156,
      mo_ta: 'Resort 4 sao gần cố đô Huế.',
      amenities: ['Wifi miễn phí', 'Hồ bơi', 'Spa', 'Bãi biển riêng']
    }
  ];

const mockHotels = [
    {
      id: 1,
      name: "Grand Hotel Saigon",
      location: "Quận 1, TP.HCM",
      rating: 4.8,
      reviews: 245,
      price: 2500000,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi miễn phí", "Hồ bơi", "Spa", "Phòng gym"],
      stars: 5
    },
    {
      id: 2,
      name: "Sheraton Hanoi Hotel",
      location: "Ba Đình, Hà Nội",
      rating: 4.6,
      reviews: 189,
      price: 1800000,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi miễn phí", "Hồ bơi", "Nhà hàng"],
      stars: 4
    },
    {
      id: 3,
      name: "InterContinental Da Nang",
      location: "Ngũ Hành Sơn, Đà Nẵng",
      rating: 4.9,
      reviews: 321,
      price: 3200000,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi miễn phí", "Hồ bơi", "Spa", "Bãi biển riêng"],
      stars: 5
    }
  ]

  useEffect(() => {
    // Simulate API call with search filtering
    setTimeout(() => {
      let results = getMockHotels()

      console.log('=== SEARCH DEBUG ===')
      console.log('destination param:', destination)
      console.log('searchQuery:', searchQuery)
      console.log('Total hotels:', results.length)

      if (searchQuery) {
        results = results.filter(hotel =>
          hotel.ten.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.thanh_pho.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Filter by destination/city
      if (destination) {
        console.log('=== DESTINATION FILTER ===')
        console.log('Raw destination:', destination)
        
        // Normalize for keyword detection (keep spaces)
        const destLowerWithSpaces = destination.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
        
        console.log('Normalized with spaces:', destLowerWithSpaces)
        
        // Keyword matching with variations
        let cityMatch = null
        if (destLowerWithSpaces.includes('ho chi minh') || 
            destLowerWithSpaces.includes('saigon') || 
            destLowerWithSpaces.includes('sai gon') ||
            destLowerWithSpaces.includes('hcm')) {
          cityMatch = 'hcm'
        } else if (destLowerWithSpaces.includes('da nang') || 
                   destLowerWithSpaces.includes('danang')) {
          cityMatch = 'danang'
        } else if (destLowerWithSpaces.includes('ha noi') || 
                   destLowerWithSpaces.includes('hanoi')) {
          cityMatch = 'hanoi'
        } else if (destLowerWithSpaces.includes('phu quoc')) {
          cityMatch = 'phuquoc'
        } else if (destLowerWithSpaces.includes('nha trang')) {
          cityMatch = 'nhatrang'
        }
        
        console.log('City match:', cityMatch)

        results = results.filter(hotel => {
          if (cityMatch) {
            // Normalize hotel city for comparison
            const hotelCityNorm = hotel.thanh_pho.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '')
              .replace(/\./g, '')
            
            const matches = hotelCityNorm.includes(cityMatch)
            
            if (matches) {
              console.log('✓ Matched:', hotel.ten, '-', hotel.thanh_pho)
            }
            return matches
          }
          
          return false
        })
      }

      console.log('After filter:', results.length, 'hotels')

      // Apply filters
      if (filters.stars) {
        results = results.filter(hotel => hotel.so_sao === parseInt(filters.stars))
      }

      // Sort results
      if (filters.sortBy === 'rating') {
        results.sort((a, b) => b.rating - a.rating)
      } else if (filters.sortBy === 'price-low') {
        results.sort((a, b) => a.gia_thap_nhat - b.gia_thap_nhat)
      } else if (filters.sortBy === 'price-high') {
        results.sort((a, b) => b.gia_thap_nhat - a.gia_thap_nhat)
      }

      console.log('Final results:', results.length)
      setSearchResults(results)
      setLoading(false)
    }, 1000)
  }, [searchQuery, destination, filters])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
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

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang tìm kiếm khách sạn...</p>
        </div>
      </Container>
    )
  }

  return (
    <div className="search-results-page bg-light min-vh-100">
      {/* Search Summary */}
      <div className="bg-white border-bottom shadow-sm">
        <Container className="py-4">
          <Row className="align-items-center">
            <Col md={8}>
              <h4 className="mb-2">
                <Search className="me-2 text-primary" size={24} />
                Kết quả tìm kiếm
                {searchQuery && (
                  <span className="text-muted"> cho "{searchQuery}"</span>
                )}
              </h4>
              <p className="text-muted mb-0">
                Tìm thấy {searchResults.length} khách sạn
                {destination && ` tại ${destination}`}
                {checkin && checkout && ` từ ${checkin} đến ${checkout}`}
                {guests > 0 && ` cho ${guests} khách`}
              </p>
            </Col>
            <Col md={4}>
              <div className="d-flex gap-2">
                <Form.Select 
                  size="sm"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                >
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                </Form.Select>
                <Form.Select 
                  size="sm"
                  value={filters.stars}
                  onChange={(e) => setFilters({...filters, stars: e.target.value})}
                >
                  <option value="">Tất cả hạng sao</option>
                  <option value="5">5 sao</option>
                  <option value="4">4 sao</option>
                  <option value="3">3 sao</option>
                </Form.Select>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {searchResults.length === 0 ? (
          <Alert variant="info" className="text-center">
            <Search size={48} className="text-muted mb-3" />
            <h4>Không tìm thấy kết quả nào</h4>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc</p>
            <BootstrapButton variant="primary" onClick={() => navigate('/')}>
              Quay về trang chủ
            </BootstrapButton>
          </Alert>
        ) : (
          <Row>
            {searchResults.map((hotel, index) => (
              <Col lg={12} key={hotel.id} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-sm border-0 h-100">
                    <Row className="g-0 align-items-center">
                      <Col md={4}>
                        <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                          <Card.Img
                            src={hotel.hinh_anh}
                            alt={hotel.ten}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="position-absolute top-0 start-0 m-3">
                            <Badge bg="primary" className="px-3 py-2">
                              {hotel.so_sao} sao
                            </Badge>
                          </div>
                        </div>
                      </Col>
                      <Col md={5}>
                        <Card.Body>
                          <Card.Title className="h4 mb-2">{hotel.ten}</Card.Title>

                          <div className="d-flex align-items-center mb-2">
                            <MapPin size={16} className="text-muted me-2" />
                            <small className="text-muted">{hotel.dia_chi}</small>
                          </div>

                          <div className="d-flex align-items-center mb-3">
                            <div className="me-2">
                              {renderStars(hotel.rating)}
                            </div>
                            <strong className="me-2">{hotel.rating}</strong>
                            <small className="text-muted">({hotel.reviews_count} đánh giá)</small>
                          </div>

                          <div className="mb-3">
                            {hotel.amenities.map((amenity, idx) => (
                              <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </Card.Body>
                      </Col>
                      <Col md={3}>
                        <Card.Body className="text-center border-start">
                          <div className="mb-3">
                            <h5 className="text-primary fw-bold mb-1">
                              {formatPrice(hotel.gia_thap_nhat)}
                            </h5>
                            <small className="text-muted">/ đêm</small>
                          </div>
                          
                          <div className="d-grid gap-2">
                            <BootstrapButton 
                              variant="primary" 
                              size="lg"
                              onClick={() => navigate(`/hotels/${hotel.id}`)}
                            >
                              Xem chi tiết
                            </BootstrapButton>
                            <BootstrapButton 
                              variant="outline-success" 
                              size="sm"
                            >
                              Đặt ngay
                            </BootstrapButton>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  )
}

export default SearchResultsPage