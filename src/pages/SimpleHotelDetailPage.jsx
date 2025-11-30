import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { ArrowLeft, Star } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const SimpleHotelDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const t = useTranslation()
  const [loading, setLoading] = useState(true)
  const [hotel, setHotel] = useState(null)

  // Simple mock hotel data
  const mockHotel = {
    id: 1,
    ten: 'Sunset Resort & Spa',
    dia_chi: 'Phan Thiết, Bình Thuận',
    hinh_anh: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    so_sao: 5,
    gia_thap_nhat: 1800000,
    rating: 4.8,
    reviews_count: 325,
    mo_ta: 'Resort 5 sao cao cấp với view biển tuyệt đẹp'
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setHotel(mockHotel)
      setLoading(false)
    }, 1000)
  }, [id])

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
      <Container className="py-4">
        <div className="text-center">
          <h3>Loading...</h3>
        </div>
      </Container>
    )
  }

  if (!hotel) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <h3>Hotel not found</h3>
          <Button variant="primary" onClick={() => navigate('/hotels')}>
            Back to Hotels
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
          Back
        </Button>

        <Row>
          <Col lg={8}>
            {/* Hotel Image */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Img 
                variant="top" 
                src={hotel.hinh_anh}
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </Card>

            {/* Hotel Info */}
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 className="mb-2">{hotel.ten}</h2>
                    <p className="text-muted mb-2">{hotel.dia_chi}</p>
                    <div className="d-flex align-items-center">
                      {renderStars(hotel.so_sao)}
                      <span className="ms-2">{hotel.so_sao} sao</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted">{hotel.mo_ta}</p>
                
                <div className="d-flex align-items-center">
                  {renderStars(hotel.rating)}
                  <span className="ms-2">{hotel.rating}/5</span>
                  <span className="text-muted ms-2">({hotel.reviews_count} reviews)</span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Booking Card */}
            <Card className="border-0 shadow-sm sticky-top">
              <Card.Body>
                <div className="text-center mb-3">
                  <h4 className="text-primary mb-0">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(hotel.gia_thap_nhat)}
                  </h4>
                  <small className="text-muted">/ night</small>
                </div>
                
                <Button variant="primary" className="w-100">
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default SimpleHotelDetailPage