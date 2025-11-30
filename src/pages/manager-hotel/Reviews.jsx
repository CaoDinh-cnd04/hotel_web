import React, { useState, useEffect } from 'react'
import { Loader2, Star, Search, MessageSquare, User, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

const USE_MOCK_DATA = true

// Mock reviews data
const mockReviews = [
  { 
    ma_danh_gia: 1, 
    ten_khach: 'Nguyễn Văn A', 
    email: 'nguyenvana@email.com',
    diem: 5, 
    noi_dung: 'Khách sạn rất đẹp, phục vụ tuyệt vời! Phòng sạch sẽ, view đẹp. Tôi sẽ quay lại lần sau.',
    ngay_danh_gia: '2025-11-20',
    da_phan_hoi: false,
    phan_hoi: null
  },
  { 
    ma_danh_gia: 2, 
    ten_khach: 'Trần Thị B', 
    email: 'tranthib@email.com',
    diem: 4, 
    noi_dung: 'Phòng sạch sẽ, view đẹp nhưng wifi hơi chậm. Nhân viên phục vụ nhiệt tình.',
    ngay_danh_gia: '2025-11-18',
    da_phan_hoi: true,
    phan_hoi: 'Cảm ơn bạn đã đánh giá. Chúng tôi sẽ cải thiện chất lượng wifi ngay.'
  },
  { 
    ma_danh_gia: 3, 
    ten_khach: 'Lê Văn C', 
    email: 'levanc@email.com',
    diem: 3, 
    noi_dung: 'Phòng ổn nhưng giá hơi cao so với chất lượng. Cần cải thiện thêm.',
    ngay_danh_gia: '2025-11-15',
    da_phan_hoi: false,
    phan_hoi: null
  },
  { 
    ma_danh_gia: 4, 
    ten_khach: 'Phạm Thị D', 
    email: 'phamthid@email.com',
    diem: 5, 
    noi_dung: 'Tuyệt vời! Mọi thứ đều hoàn hảo. Đặc biệt là dịch vụ spa rất tốt.',
    ngay_danh_gia: '2025-11-12',
    da_phan_hoi: false,
    phan_hoi: null
  },
  { 
    ma_danh_gia: 5, 
    ten_khach: 'Hoàng Văn E', 
    email: 'hoangvane@email.com',
    diem: 2, 
    noi_dung: 'Phòng có mùi ẩm mốc, cần vệ sinh kỹ hơn. Nhân viên phục vụ chậm.',
    ngay_danh_gia: '2025-11-10',
    da_phan_hoi: true,
    phan_hoi: 'Xin lỗi vì sự bất tiện. Chúng tôi đã kiểm tra và xử lý vấn đề này.'
  }
]

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500))
        setReviews(mockReviews)
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
      toast.error('Không thể tải danh sách đánh giá')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = (review) => {
    setSelectedReview(review)
    setReplyText(review.phan_hoi || '')
    setIsReplyModalOpen(true)
  }

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      toast.error('Vui lòng nhập phản hồi')
      return
    }

    try {
      if (USE_MOCK_DATA) {
        setReviews(reviews.map(r => 
          r.ma_danh_gia === selectedReview.ma_danh_gia
            ? { ...r, da_phan_hoi: true, phan_hoi: replyText.trim() }
            : r
        ))
        toast.success('Phản hồi đánh giá thành công!')
        setIsReplyModalOpen(false)
        setSelectedReview(null)
        setReplyText('')
      }
    } catch (err) {
      toast.error('Lỗi khi phản hồi đánh giá')
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-slate-700">({rating}/5)</span>
      </div>
    )
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.ten_khach?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.noi_dung?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = ratingFilter === 'all' || review.diem.toString() === ratingFilter
    
    return matchesSearch && matchesRating
  })

  const stats = {
    total: reviews.length,
    average: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.diem, 0) / reviews.length).toFixed(1)
      : 0,
    pending: reviews.filter(r => !r.da_phan_hoi).length,
    byRating: {
      5: reviews.filter(r => r.diem === 5).length,
      4: reviews.filter(r => r.diem === 4).length,
      3: reviews.filter(r => r.diem === 3).length,
      2: reviews.filter(r => r.diem === 2).length,
      1: reviews.filter(r => r.diem === 1).length
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
        <span className="ml-3 text-slate-600">Đang tải dữ liệu...</span>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Quản lý đánh giá</h1>
          <p className="text-slate-500 mt-1">Xem và phản hồi đánh giá của khách hàng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-4">
          <p className="text-sm font-semibold text-slate-600 mb-1">Tổng đánh giá</p>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-4">
          <p className="text-sm font-semibold text-slate-600 mb-1">Điểm trung bình</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.average}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-4">
          <p className="text-sm font-semibold text-slate-600 mb-1">Chờ phản hồi</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-4">
          <p className="text-sm font-semibold text-slate-600 mb-1">5 sao</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.byRating[5]}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách, nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">Tất cả điểm đánh giá</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">
              {searchTerm || ratingFilter !== 'all' 
                ? 'Không tìm thấy đánh giá nào' 
                : 'Chưa có đánh giá nào'}
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <motion.div
              key={review.ma_danh_gia}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-slate-800">{review.ten_khach}</p>
                      <span className="text-sm text-slate-500">{review.email}</span>
                    </div>
                    {renderStars(review.diem)}
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      {review.ngay_danh_gia}
                    </div>
                  </div>
                </div>
                {!review.da_phan_hoi && (
                  <motion.button
                    onClick={() => handleReply(review)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageSquare size={16} />
                    Phản hồi
                  </motion.button>
                )}
              </div>

              <div className="mb-4">
                <p className="text-slate-700 leading-relaxed">{review.noi_dung}</p>
              </div>

              {review.da_phan_hoi && review.phan_hoi && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-emerald-600 mb-1">Phản hồi từ khách sạn:</p>
                      <p className="text-slate-700 bg-emerald-50 p-3 rounded-lg">{review.phan_hoi}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {isReplyModalOpen && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">Phản hồi đánh giá</h2>
                <button
                  onClick={() => {
                    setIsReplyModalOpen(false)
                    setSelectedReview(null)
                    setReplyText('')
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-500" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <p className="font-semibold text-slate-800 mb-2">{selectedReview.ten_khach}</p>
                {renderStars(selectedReview.diem)}
                <p className="text-slate-700 mt-2">{selectedReview.noi_dung}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phản hồi của bạn <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Nhập phản hồi cho khách hàng..."
                  rows="4"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setIsReplyModalOpen(false)
                    setSelectedReview(null)
                    setReplyText('')
                  }}
                  className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitReply}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  Gửi phản hồi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Reviews

