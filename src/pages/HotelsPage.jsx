import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge } from 'react-bootstrap'
import { Search, Star, MapPin, Heart } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFavoritesStore } from '../stores/favoritesStore'

const HotelsPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    stars: searchParams.get('stars') || '',
    sortBy: 'rating'
  })

  // Mock data khách sạn
  const mockHotels = [
    {
      id: 1,
      ten: 'Grand Hotel Saigon',
      dia_chi: 'Quận 1, TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 2500000,
      rating: 4.8,
      reviews_count: 245
    },
    {
      id: 2,
      ten: 'Sheraton Hanoi Hotel',
      dia_chi: 'Ba Đình, Hà Nội',
      hinh_anh: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 1800000,
      rating: 4.6,
      reviews_count: 189
    },
    {
      id: 3,
      ten: 'InterContinental Da Nang',
      dia_chi: 'Ngũ Hành Sơn, Đà Nẵng',
      hinh_anh: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3200000,
      rating: 4.9,
      reviews_count: 321
    },
    {
      id: 4,
      ten: 'Vinpearl Resort Phú Quốc',
      dia_chi: 'Phú Quốc, Kiên Giang',
      hinh_anh: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 4200000,
      rating: 4.7,
      reviews_count: 156
    },
    {
      id: 5,
      ten: 'Muong Thanh Luxury Nha Trang',
      dia_chi: 'Nha Trang, Khánh Hòa',
      hinh_anh: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 1500000,
      rating: 4.5,
      reviews_count: 278
    },
    {
      id: 6,
      ten: 'JW Marriott Hotel Hanoi',
      dia_chi: 'Ba Đình, Hà Nội',
      hinh_anh: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 3800000,
      rating: 4.9,
      reviews_count: 412
    },
    {
      id: 7,
      ten: 'Rex Hotel Saigon',
      dia_chi: 'Quận 1, TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 2200000,
      rating: 4.4,
      reviews_count: 198
    },
    {
      id: 8,
      ten: 'FLC Luxury Hotel Sầm Sơn',
      dia_chi: 'Sầm Sơn, Thanh Hóa',
      hinh_anh: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 4,
      gia_thap_nhat: 1200000,
      rating: 4.3,
      reviews_count: 134
    },
    {
      id: 9,
      ten: 'The Reverie Saigon',
      dia_chi: 'Quận 1, TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1549294413-26f195200c16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 5200000,
      rating: 4.9,
      reviews_count: 287
    },
    {
      id: 10,
      ten: 'Park Hyatt Saigon',
      dia_chi: 'Quận 1, TP.HCM',
      hinh_anh: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 4800000,
      rating: 4.8,
      reviews_count: 356
    },
    {
      id: 11,
      ten: 'Sofitel Legend Metropole Hanoi',
      dia_chi: 'Hoàn Kiếm, Hà Nội',
      hinh_anh: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 4500000,
      rating: 4.7,
      reviews_count: 423
    },
    {
      id: 12,
      ten: 'Fusion Resort Phu Quoc',
      dia_chi: 'Phú Quốc, Kiên Giang',
      hinh_anh: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      so_sao: 5,
      gia_thap_nhat: 5800000,
      rating: 4.9,
      reviews_count: 178
    }
  ]

  const [hotels, setHotels] = useState(mockHotels)

  // Apply filters
  useEffect(() => {
    let filteredHotels = [...mockHotels]
    
    if (filters.search) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.ten.toLowerCase().includes(filters.search.toLowerCase()) ||
        hotel.dia_chi.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
    if (filters.stars) {
      filteredHotels = filteredHotels.filter(hotel => hotel.so_sao === parseInt(filters.stars))
    }
    
    // Sort hotels
    if (filters.sortBy === 'rating') {
      filteredHotels.sort((a, b) => b.rating - a.rating)
    } else if (filters.sortBy === 'price-low') {
      filteredHotels.sort((a, b) => a.gia_thap_nhat - b.gia_thap_nhat)
    } else if (filters.sortBy === 'price-high') {
      filteredHotels.sort((a, b) => b.gia_thap_nhat - a.gia_thap_nhat)
    }
    
    setHotels(filteredHotels)
  }, [filters])

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

  return (
    <div className="hotels-page bg-light min-vh-100">
      {/* Header */}
      <div className="bg-primary text-white py-4">
        <Container>
          <Row>
            <Col>
              <h2 className="fw-bold mb-3">Khám phá khách sạn</h2>
              <p className="mb-4">Tìm thấy {hotels.length} khách sạn phù hợp</p>
              
              {/* Search and Filters */}
              <Row className="g-3">
                <Col lg={6}>
                  <InputGroup size="lg">
                    <InputGroup.Text className="bg-white border-0">
                      <Search size={20} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Tìm kiếm khách sạn..."
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      className="border-0"
                    />
                  </InputGroup>
                </Col>
                <Col lg={3} md={6}>
                  <Form.Select 
                    size="lg"
                    value={filters.stars}
                    onChange={(e) => setFilters({...filters, stars: e.target.value})}
                    className="bg-white border-0"
                  >
                    <option value="">Tất cả hạng sao</option>
                    <option value="5">5 sao</option>
                    <option value="4">4 sao</option>
                    <option value="3">3 sao</option>
                  </Form.Select>
                </Col>
                <Col lg={3} md={6}>
                  <Form.Select 
                    size="lg"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    className="bg-white border-0"
                  >
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="price-low">Giá thấp đến cao</option>
                    <option value="price-high">Giá cao đến thấp</option>
                  </Form.Select>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Hotels Grid */}
      <Container className="py-4">
        <Row>
          {hotels.map((hotel) => (
            <Col xl={4} lg={6} md={6} key={hotel.id} className="mb-4">
              <Card 
                className="border-0 shadow-sm h-100 hotel-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/hotels/${hotel.id}`)}
              >
                <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                  <img 
                    src={hotel.hinh_anh} 
                    alt={hotel.ten}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  />
                  <div className="position-absolute top-0 start-0 m-3">
                    <Badge bg="primary" className="px-3 py-2">
                      {hotel.so_sao} sao
                    </Badge>
                  </div>
                  <div className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2">
                    <Badge bg="success" className="px-2 py-1">
                      Giảm 10%
                    </Badge>
                    <Button
                      variant={isFavorite(hotel.id) ? "danger" : "light"}
                      size="sm"
                      className="p-2 rounded-circle"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(hotel)
                      }}
                      style={{ 
                        width: '36px', 
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Heart 
                        size={16} 
                        fill={isFavorite(hotel.id) ? "currentColor" : "none"}
                      />
                    </Button>
                  </div>
                </div>
                
                <Card.Body className="p-3">
                  <h6 className="fw-bold mb-2 text-truncate" title={hotel.ten}>
                    {hotel.ten}
                  </h6>
                  
                  <div className="d-flex align-items-center mb-2">
                    <MapPin size={14} className="text-muted me-2" />
                    <small className="text-muted text-truncate">{hotel.dia_chi}</small>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <div className="me-2">
                      {renderStars(hotel.rating)}
                    </div>
                    <strong className="me-2 small">{hotel.rating}</strong>
                    <small className="text-muted">({hotel.reviews_count} đánh giá)</small>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-decoration-line-through">
                        {formatPrice(hotel.gia_thap_nhat * 1.1)}
                      </small>
                      <h6 className="text-primary fw-bold mb-0">
                        {formatPrice(hotel.gia_thap_nhat)}
                      </h6>
                      <small className="text-muted">/đêm</small>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/hotels/${hotel.id}`)
                      }}
                    >
                      Đặt ngay
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {hotels.length === 0 && (
          <Row>
            <Col className="text-center py-5">
              <Search size={64} className="text-muted mb-3" />
              <h4>Không tìm thấy khách sạn nào</h4>
              <p className="text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </Col>
          </Row>
        )}
      </Container>

      <style jsx>{`
        .hotel-card:hover img {
          transform: scale(1.1);
        }
        .hotel-card {
          transition: all 0.3s ease;
        }
        .hotel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  )
}

export default HotelsPage