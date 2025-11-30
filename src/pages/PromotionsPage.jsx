import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap'
import { Search, Calendar, MapPin, Percent, Tag, Clock, Users } from 'lucide-react'

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(true)

  // Mock data cho khuyến mãi
  const mockPromotions = [
    {
      id: 1,
      title: "Giảm giá 30% cho khách sạn 5 sao",
      description: "Đặt phòng khách sạn 5 sao và nhận ngay ưu đãi giảm giá 30% cho đêm nghỉ đầu tiên",
      discount: 30,
      type: "percentage",
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      code: "LUXURY30",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      conditions: ["Áp dụng cho khách sạn 5 sao", "Tối thiểu 2 đêm nghỉ", "Không áp dụng cho ngày lễ"],
      hotels: ["Grand Hotel Saigon", "Sheraton Hanoi", "InterContinental Da Nang"]
    },
    {
      id: 2,
      title: "Ưu đãi Cuối tuần - Giảm 500,000đ",
      description: "Book phòng cuối tuần và tiết kiệm ngay 500,000đ cho kỳ nghỉ của bạn",
      discount: 500000,
      type: "fixed",
      validFrom: "2024-01-01",
      validTo: "2024-06-30",
      code: "WEEKEND500",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      conditions: ["Chỉ áp dụng thứ 6, 7, CN", "Tối thiểu 1 đêm nghỉ", "Áp dụng cho tất cả khách sạn"],
      hotels: ["Tất cả khách sạn trong hệ thống"]
    },
    {
      id: 3,
      title: "Flash Sale - Giảm đến 50%",
      description: "Chương trình flash sale đặc biệt với mức giảm giá lên đến 50% cho một số khách sạn được chọn",
      discount: 50,
      type: "percentage",
      validFrom: "2024-01-15",
      validTo: "2024-01-31",
      code: "FLASH50",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      conditions: ["Số lượng có hạn", "Không hoàn hủy", "Thanh toán ngay"],
      hotels: ["Muong Thanh Hotel", "Vinpearl Resort", "FLC Hotel"]
    },
    {
      id: 4,
      title: "Khuyến mãi Sinh viên - Giảm 25%",
      description: "Sinh viên xuất trình thẻ học sinh, sinh viên hợp lệ sẽ được giảm 25% giá phòng",
      discount: 25,
      type: "percentage",
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      code: "STUDENT25",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      conditions: ["Xuất trình thẻ sinh viên", "Độ tuổi từ 18-25", "Tối đa 2 phòng/booking"],
      hotels: ["Các khách sạn 3-4 sao"]
    },
    {
      id: 5,
      title: "Combo Family - Giảm 40% cho gia đình",
      description: "Đặt phòng cho gia đình từ 4 người trở lên và nhận ưu đãi đặc biệt 40%",
      discount: 40,
      type: "percentage",
      validFrom: "2024-01-01",
      validTo: "2024-08-31",
      code: "FAMILY40",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      conditions: ["Tối thiểu 4 người", "Phòng gia đình hoặc 2 phòng đôi", "Bao gồm bữa sáng"],
      hotels: ["Resort và khách sạn có hồ bơi"]
    },
    {
      id: 6,
      title: "Early Bird - Đặt sớm giảm 35%",
      description: "Đặt phòng trước 30 ngày và nhận ưu đãi giảm giá 35% cực hấp dẫn",
      discount: 35,
      type: "percentage",
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      code: "EARLY35",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      conditions: ["Đặt trước 30 ngày", "Thanh toán toàn bộ", "Không hoàn hủy"],
      hotels: ["Tất cả khách sạn"]
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPromotions(mockPromotions)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || promotion.type === filterType

    return matchesSearch && matchesFilter
  })

  const formatDiscount = (discount, type) => {
    return type === 'percentage' ? `${discount}%` : `${discount.toLocaleString()}đ`
  }

  const isValidPromotion = (validTo) => {
    return new Date(validTo) >= new Date()
  }

  const getDiscountBadgeColor = (discount, type) => {
    if (type === 'percentage') {
      if (discount >= 40) return 'danger'
      if (discount >= 25) return 'warning'
      return 'success'
    } else {
      if (discount >= 1000000) return 'danger'
      if (discount >= 500000) return 'warning'
      return 'success'
    }
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang tải khuyến mãi...</p>
        </div>
      </Container>
    )
  }

  return (
    <div className="promotions-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-4 fw-bold mb-3">
                  <Percent className="me-3" size={48} />
                  Khuyến Mãi Đặc Biệt
                </h1>
                <p className="lead">
                  Khám phá những ưu đãi tuyệt vời và tiết kiệm chi phí cho chuyến du lịch của bạn
                </p>
              </motion.div>
            </Col>
            <Col lg={4} className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="bg-white bg-opacity-20 rounded-3 p-4">
                  <h3 className="text-warning fw-bold">Tiết kiệm đến</h3>
                  <h2 className="display-3 fw-bold">50%</h2>
                  <p>cho kỳ nghỉ của bạn</p>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search and Filter Section */}
      <Container className="py-4">
        <Row className="mb-4">
          <Col md={8}>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <Search size={20} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm khuyến mãi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tất cả khuyến mãi</option>
              <option value="percentage">Giảm theo %</option>
              <option value="fixed">Giảm số tiền cố định</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Stats */}
        <Row className="mb-5">
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <Tag className="text-primary mb-3" size={48} />
                <h4>{promotions.length}</h4>
                <p className="text-muted">Tổng khuyến mãi</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <Clock className="text-success mb-3" size={48} />
                <h4>{promotions.filter(p => isValidPromotion(p.validTo)).length}</h4>
                <p className="text-muted">Đang có hiệu lực</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="text-center">
                <Users className="text-info mb-3" size={48} />
                <h4>1000+</h4>
                <p className="text-muted">Khách hàng đã sử dụng</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Promotions Grid */}
        <Row className="g-4">
          {filteredPromotions.map((promotion, index) => (
            <Col lg={6} xl={4} key={promotion.id} className="d-flex">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-100"
              >
                <Card className="h-100 border-0 shadow-sm hover-shadow-lg transition-all d-flex flex-column">
                  <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                    <Card.Img
                      variant="top"
                      src={promotion.image}
                      style={{ height: '100%', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 start-0 m-3">
                      <Badge 
                        bg={getDiscountBadgeColor(promotion.discount, promotion.type)}
                        className="fs-6 px-3 py-2"
                      >
                        Giảm {formatDiscount(promotion.discount, promotion.type)}
                      </Badge>
                    </div>
                    {!isValidPromotion(promotion.validTo) && (
                      <div className="position-absolute top-0 end-0 m-3">
                        <Badge bg="secondary">Hết hạn</Badge>
                      </div>
                    )}
                  </div>

                  <Card.Body className="p-4 flex-grow-1 d-flex flex-column">
                    <Card.Title className="fw-bold text-dark mb-3" style={{ minHeight: '60px' }}>
                      {promotion.title}
                    </Card.Title>
                    <Card.Text className="text-muted mb-3" style={{ minHeight: '72px', fontSize: '0.95rem' }}>
                      {promotion.description}
                    </Card.Text>

                    <div className="mb-3">
                      <div className="d-flex align-items-start mb-2">
                        <Calendar className="text-muted me-2 flex-shrink-0" size={16} style={{ marginTop: '2px' }} />
                        <small className="text-muted" style={{ lineHeight: '1.4' }}>
                          Có hiệu lực: {new Date(promotion.validFrom).toLocaleDateString('vi-VN')} - {new Date(promotion.validTo).toLocaleDateString('vi-VN')}
                        </small>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <Tag className="text-muted me-2 flex-shrink-0" size={16} />
                        <small className="text-muted fw-bold">
                          Mã: <code className="bg-light px-2 py-1 rounded">{promotion.code}</code>
                        </small>
                      </div>
                    </div>

                    <div className="mb-3" style={{ minHeight: '100px' }}>
                      <h6 className="fw-bold mb-2" style={{ fontSize: '0.9rem' }}>Điều kiện áp dụng:</h6>
                      <ul className="list-unstyled mb-0">
                        {promotion.conditions.map((condition, idx) => (
                          <li key={idx} className="text-muted mb-1" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                            • {condition}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-0 mt-auto">
                      <h6 className="fw-bold mb-2" style={{ fontSize: '0.9rem' }}>Khách sạn áp dụng:</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {promotion.hotels.map((hotel, idx) => (
                          <Badge key={idx} bg="light" text="dark" className="px-2 py-1" style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>
                            {hotel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card.Body>

                  <Card.Footer className="bg-transparent border-0 p-4 pt-3 mt-auto">
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        className="fw-semibold"
                        disabled={!isValidPromotion(promotion.validTo)}
                        onClick={() => {
                          // Copy mã khuyến mãi vào clipboard
                          navigator.clipboard.writeText(promotion.code)
                          alert(`Đã sao chép mã: ${promotion.code}`)
                        }}
                        style={{ height: '44px' }}
                      >
                        {isValidPromotion(promotion.validTo) ? 'Sao chép mã' : 'Đã hết hạn'}
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        className="fw-semibold"
                        style={{ height: '44px' }}
                      >
                        Xem khách sạn
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {filteredPromotions.length === 0 && (
          <div className="text-center py-5">
            <Search size={64} className="text-muted mb-3" />
            <h4>Không tìm thấy khuyến mãi nào</h4>
            <p className="text-muted">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        )}
      </Container>

      {/* CTA Section */}
      <section className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h3 className="fw-bold mb-3">Đừng bỏ lỡ những ưu đãi tuyệt vời!</h3>
              <p className="text-muted mb-4">
                Đăng ký nhận thông tin về các chương trình khuyến mãi mới nhất
              </p>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Nhập email của bạn"
                    />
                    <Button variant="primary">
                      Đăng ký ngay
                    </Button>
                  </InputGroup>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .hover-shadow-lg {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-shadow-lg:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(147, 51, 234, 0.25) !important;
        }
        .hover-shadow-lg img {
          transition: transform 0.5s ease;
        }
        .hover-shadow-lg:hover img {
          transform: scale(1.08);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .bg-gradient-to-r {
          background: linear-gradient(to right, #9333ea, #3b82f6);
        }
        .bg-opacity-20 {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        code {
          font-family: 'Courier New', monospace;
          font-weight: 600;
        }
        .card {
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default PromotionsPage