import { useState, useEffect, useMemo } from 'react'
import { Plus, Percent, Loader2 } from 'lucide-react'
import { discountAPI } from '../../services/admin/api'
import { mockDiscounts } from '../../data/admin/mockData'
import FilterBar from '../../components/admin/FilterBar'

const USE_MOCK_DATA = true // Set to false when API is ready

const Discounts = () => {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: 'Tất cả',
    percentRange: 'Tất cả',
    dateRange: 'Tất cả',
    search: ''
  })
  const [form, setForm] = useState({
    code: '',
    name: '',
    percent: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (USE_MOCK_DATA) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        setDiscounts(mockDiscounts)
      } else {
        const response = await discountAPI.getAll()
        const discountsData = response.data || response || []
        setDiscounts(Array.isArray(discountsData) ? discountsData : [])
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách mã giảm giá')
      console.error('Error fetching discounts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.code || !form.name || !form.percent || !form.startDate || !form.endDate) {
      alert('Vui lòng nhập đầy đủ thông tin mã giảm giá.')
      return
    }

    // Validate dates
    if (new Date(form.startDate) > new Date(form.endDate)) {
      alert('Ngày kết thúc phải sau ngày bắt đầu!')
      return
    }

    // Validate percent
    const percent = Number(form.percent)
    if (percent < 1 || percent > 100) {
      alert('Phần trăm giảm giá phải từ 1% đến 100%!')
      return
    }

    try {
      if (USE_MOCK_DATA) {
        // Add to mock data
        const newDiscount = {
          ma_magiamgia: discounts.length > 0 
            ? Math.max(...discounts.map(d => d.ma_magiamgia || d.id)) + 1 
            : 1,
          ma_giam_gia: form.code.toUpperCase(),
          ten_ma_giam_gia: form.name,
          loai_giam_gia: 'percentage',
          gia_tri_giam: percent,
          ngay_bat_dau: form.startDate,
          ngay_ket_thuc: form.endDate,
          trang_thai: 1
        }
        setDiscounts((prev) => [newDiscount, ...prev])
        setForm({
          code: '',
          name: '',
          percent: '',
          startDate: '',
          endDate: ''
        })
        alert('Thêm mã giảm giá thành công!')
      } else {
        // Call API
        const discountData = {
          ma_giam_gia: form.code.toUpperCase(),
          ten_ma_giam_gia: form.name,
          loai_giam_gia: 'percentage',
          gia_tri_giam: percent,
          ngay_bat_dau: form.startDate,
          ngay_ket_thuc: form.endDate
        }
        await discountAPI.create(discountData)
        await fetchDiscounts()
        setForm({
          code: '',
          name: '',
          percent: '',
          startDate: '',
          endDate: ''
        })
        alert('Thêm mã giảm giá thành công!')
      }
    } catch (err) {
      alert('Lỗi khi thêm mã giảm giá: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) {
      try {
        if (USE_MOCK_DATA) {
          // Remove from mock data
          setDiscounts((prev) => prev.filter((item) => (item.ma_magiamgia || item.id) !== id))
          alert('Xóa mã giảm giá thành công!')
        } else {
          // Call API
          await discountAPI.delete(id)
          setDiscounts((prev) => prev.filter((item) => (item.ma_magiamgia || item.id) !== id))
          alert('Xóa mã giảm giá thành công!')
        }
      } catch (err) {
        alert('Lỗi khi xóa mã giảm giá: ' + (err.message || 'Vui lòng thử lại'))
      }
    }
  }

  const getDiscountStatus = (discount) => {
    const now = new Date()
    const start = new Date(discount.ngay_bat_dau)
    const end = new Date(discount.ngay_ket_thuc)
    
    if (now < start) return 'Sắp diễn ra'
    if (now > end) return 'Đã kết thúc'
    return 'Hoạt động'
  }

  // Filter discounts
  const filteredDiscounts = useMemo(() => {
    let filtered = [...discounts]

    // Filter by status
    if (filters.status !== 'Tất cả') {
      filtered = filtered.filter(d => {
        const status = getDiscountStatus(d)
        return status === filters.status
      })
    }

    // Filter by percent range
    if (filters.percentRange !== 'Tất cả') {
      filtered = filtered.filter(d => {
        const percent = d.gia_tri_giam || d.percent || 0
        switch (filters.percentRange) {
          case 'Dưới 10%':
            return percent < 10
          case '10-25%':
            return percent >= 10 && percent <= 25
          case '25-50%':
            return percent > 25 && percent <= 50
          case 'Trên 50%':
            return percent > 50
          default:
            return true
        }
      })
    }

    // Filter by date range
    if (filters.dateRange !== 'Tất cả') {
      const now = new Date()
      filtered = filtered.filter(d => {
        const start = new Date(d.ngay_bat_dau || d.startDate)
        const end = new Date(d.ngay_ket_thuc || d.endDate)
        
        switch (filters.dateRange) {
          case 'Đang diễn ra':
            return now >= start && now <= end
          case 'Sắp diễn ra':
            return now < start
          case 'Đã kết thúc':
            return now > end
          default:
            return true
        }
      })
    }

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(d => {
        return (
          (d.ma_giam_gia || d.code || '').toLowerCase().includes(search) ||
          (d.ten_ma_giam_gia || d.name || '').toLowerCase().includes(search)
        )
      })
    }

    return filtered
  }, [discounts, filters])

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Quản lý mã giảm giá</h1>
          <p className="text-slate-500 mt-1">Tạo, cập nhật và theo dõi các chương trình khuyến mại</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 text-white font-semibold shadow">
          <Percent size={18} />
          Tổng số: {filteredDiscounts.length} / {discounts.length}
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl shadow mb-8">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-slate-900">Thêm mã giảm giá</h2>
          <p className="text-sm text-slate-500">Nhập thông tin bên dưới để tạo khuyến mại mới</p>
        </div>
        <form className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3" onSubmit={handleAdd}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Mã code</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              className="rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
              placeholder="Ví dụ: SPRING40"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Tên chương trình</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
              placeholder="Ví dụ: Khuyến mãi mùa xuân"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">% giảm</label>
            <input
              type="number"
              name="percent"
              value={form.percent}
              onChange={handleChange}
              min="1"
              max="100"
              className="rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Ngày bắt đầu</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Ngày kết thúc</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold shadow hover:bg-sky-600 transition-colors"
            >
              <Plus size={18} />
              Thêm mã
            </button>
          </div>
        </form>
      </section>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        options={{
          showRating: false,
          showLocation: false,
          showReviewCount: false,
          showStatus: true,
          showDateRange: true,
          showSearch: true,
          showPercentRange: true,
          statusOptions: ['Tất cả', 'Hoạt động', 'Sắp diễn ra', 'Đã kết thúc'],
          dateRangeOptions: ['Tất cả', 'Đang diễn ra', 'Sắp diễn ra', 'Đã kết thúc'],
          dateRangeLabel: 'Thời gian',
          searchPlaceholder: 'Tìm theo mã code, tên chương trình...',
          title: 'Bộ lọc mã giảm giá',
          description: 'Lọc mã giảm giá theo trạng thái, phần trăm và thời gian.'
        }}
      />

      <section className="bg-white border border-slate-200 rounded-2xl shadow">
        <div className="px-6 py-4 border-b border-slate-100 bg-sky-600 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Danh sách mã giảm giá</h2>
            <span className="text-sm text-white/80">Quản lý mã đang hoạt động</span>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-sky-500" size={32} />
            <span className="ml-3 text-slate-600">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchDiscounts}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-sky-500 text-white text-sm uppercase tracking-wide">
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Mã code</th>
                  <th className="py-3 px-4 text-left">Tên chương trình</th>
                  <th className="py-3 px-4 text-left">% Giảm</th>
                  <th className="py-3 px-4 text-left">Ngày bắt đầu</th>
                  <th className="py-3 px-4 text-left">Ngày kết thúc</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredDiscounts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      {filters.search || filters.status !== 'Tất cả' || filters.percentRange !== 'Tất cả' || filters.dateRange !== 'Tất cả'
                        ? 'Không tìm thấy mã giảm giá nào phù hợp với bộ lọc'
                        : 'Chưa có mã giảm giá nào'}
                    </td>
                  </tr>
                ) : (
                  filteredDiscounts.map((discount) => {
                    const status = getDiscountStatus(discount)
                    const discountId = discount.ma_magiamgia || discount.id
                    return (
                      <tr key={discountId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-slate-700">{discountId}</td>
                        <td className="py-4 px-4 text-sm text-slate-900 font-semibold">
                          {discount.ma_giam_gia || discount.code}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-700">
                          {discount.ten_ma_giam_gia || discount.name}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-pink-600">
                          {discount.gia_tri_giam || discount.percent}%
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {discount.ngay_bat_dau || discount.startDate}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {discount.ngay_ket_thuc || discount.endDate}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              status === 'Hoạt động'
                                ? 'bg-emerald-100 text-emerald-700'
                                : status === 'Sắp diễn ra'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleDelete(discountId)}
                              className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default Discounts

