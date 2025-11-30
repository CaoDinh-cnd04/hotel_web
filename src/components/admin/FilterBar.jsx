import { Search, Filter, Star, MapPin, MessageSquare } from 'lucide-react'

/**
 * FilterBar Component - Reusable filter bar for admin pages
 * @param {Object} props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Object} props.options - Filter options configuration
 */
const FilterBar = ({ 
  filters, 
  onFilterChange, 
  options = {} 
}) => {
  const {
    showRating = true,
    showLocation = true,
    showReviewCount = true,
    showStatus = false,
    showHotel = false,
    showRole = false,
    showDateRange = false,
    showPriceRange = false,
    showSearch = true,
    ratingOptions = ['Tất cả', '5 sao', '4 sao', '3 sao', '3 sao', '2 sao', '1 sao'],
    locationOptions = [],
    reviewCountOptions = ['Tất cả', '0-10', '11-50', '51-100', '100+'],
    statusOptions = [],
    hotelOptions = [],
    roleOptions = [],
    searchPlaceholder = 'Tìm kiếm...',
    title = 'Bộ lọc',
    description = 'Tìm kiếm và lọc theo tiêu chí.'
  } = options

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 })
  }

  const getFilterCount = () => {
    let count = 0
    if (filters.rating && filters.rating !== 'Tất cả') count++
    if (filters.location && filters.location !== 'Tất cả') count++
    if (filters.reviewCount && filters.reviewCount !== 'Tất cả') count++
    if (filters.status && filters.status !== 'Tất cả') count++
    if (filters.hotel_id && filters.hotel_id !== 'all') count++
    if (filters.role && filters.role !== 'Tất cả') count++
    if (filters.priceRange && filters.priceRange !== 'Tất cả') count++
    if (filters.dateRange && filters.dateRange !== 'Tất cả') count++
    if (filters.percentRange && filters.percentRange !== 'Tất cả') count++
    if (filters.search) count++
    return count
  }

  const activeFiltersCount = getFilterCount()

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow mb-6">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Filter size={20} />
              {title}
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-sky-500 text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                const resetFilters = {}
                if (showRating) resetFilters.rating = 'Tất cả'
                if (showLocation) resetFilters.location = 'Tất cả'
                if (showReviewCount) resetFilters.reviewCount = 'Tất cả'
                if (showStatus) resetFilters.status = 'Tất cả'
                if (showHotel) resetFilters.hotel_id = 'all'
                if (showRole) resetFilters.role = 'Tất cả'
                if (showPriceRange) resetFilters.priceRange = 'Tất cả'
                if (showDateRange) resetFilters.dateRange = 'Tất cả'
                if (options.showPercentRange) resetFilters.percentRange = 'Tất cả'
                if (showSearch) resetFilters.search = ''
                onFilterChange({ ...filters, ...resetFilters, page: 1 })
              }}
              className="text-sm text-sky-600 hover:text-sky-700 font-semibold"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>
      <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Rating Filter */}
        {showRating && (
          <label className="text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Star size={16} className="text-yellow-500" />
              Số sao
            </div>
            <select
              value={filters.rating || 'Tất cả'}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              {ratingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Location Filter */}
        {showLocation && (
          <label className="text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} className="text-blue-500" />
              Địa điểm
            </div>
            <select
              value={filters.location || 'Tất cả'}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="Tất cả">Tất cả địa điểm</option>
              {locationOptions.length > 0 ? (
                locationOptions.map((option) => (
                  <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>
                    {typeof option === 'string' ? option : option.label}
                  </option>
                ))
              ) : (
                <>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Nha Trang">Nha Trang</option>
                  <option value="Đà Lạt">Đà Lạt</option>
                  <option value="Phú Quốc">Phú Quốc</option>
                  <option value="Hội An">Hội An</option>
                  <option value="Huế">Huế</option>
                  <option value="Sapa">Sapa</option>
                  <option value="Mũi Né">Mũi Né</option>
                </>
              )}
            </select>
          </label>
        )}

        {/* Review Count Filter */}
        {showReviewCount && (
          <label className="text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare size={16} className="text-purple-500" />
              Số phản hồi
            </div>
            <select
              value={filters.reviewCount || 'Tất cả'}
              onChange={(e) => handleFilterChange('reviewCount', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              {reviewCountOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Status Filter */}
        {showStatus && statusOptions.length > 0 && (
          <label className="text-sm font-semibold text-slate-700">
            Trạng thái
            <select
              value={filters.status || 'Tất cả'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Hotel Filter */}
        {showHotel && hotelOptions.length > 0 && (
          <label className="text-sm font-semibold text-slate-700">
            Khách sạn
            <select
              value={filters.hotel_id || 'all'}
              onChange={(e) => handleFilterChange('hotel_id', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="all">Tất cả khách sạn</option>
              {hotelOptions.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name || hotel.ten_khach_san}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Role Filter */}
        {showRole && roleOptions.length > 0 && (
          <label className="text-sm font-semibold text-slate-700">
            Vai trò
            <select
              value={filters.role || 'Tất cả'}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Date Range Filter */}
        {showDateRange && (
          <label className="text-sm font-semibold text-slate-700">
            {options.dateRangeLabel || 'Khoảng thời gian'}
            <select
              value={filters.dateRange || 'Tất cả'}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              {options.dateRangeOptions ? (
                options.dateRangeOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))
              ) : (
                <>
                  <option value="Tất cả">Tất cả</option>
                  <option value="Hôm nay">Hôm nay</option>
                  <option value="Tuần này">Tuần này</option>
                  <option value="Tháng này">Tháng này</option>
                  <option value="Sắp tới">Sắp tới</option>
                </>
              )}
            </select>
          </label>
        )}

        {/* Price Range Filter */}
        {showPriceRange && (
          <label className="text-sm font-semibold text-slate-700">
            Khoảng giá
            <select
              value={filters.priceRange || 'Tất cả'}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Dưới 1 triệu">Dưới 1 triệu</option>
              <option value="1-2 triệu">1-2 triệu</option>
              <option value="2-5 triệu">2-5 triệu</option>
              <option value="Trên 5 triệu">Trên 5 triệu</option>
            </select>
          </label>
        )}

        {/* Percent Range Filter (for Discounts) */}
        {options.showPercentRange && (
          <label className="text-sm font-semibold text-slate-700">
            Phần trăm giảm
            <select
              value={filters.percentRange || 'Tất cả'}
              onChange={(e) => handleFilterChange('percentRange', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Dưới 10%">Dưới 10%</option>
              <option value="10-25%">10-25%</option>
              <option value="25-50%">25-50%</option>
              <option value="Trên 50%">Trên 50%</option>
            </select>
          </label>
        )}

        {/* Search Input */}
        {showSearch && (
          <label className={`text-sm font-semibold text-slate-700 ${showDateRange || showPriceRange || options.showPercentRange ? '' : 'md:col-span-2 lg:col-span-4'}`}>
            Tìm kiếm
            <div className="mt-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onFilterChange({ ...filters, search: e.target.value })
                  }
                }}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </label>
        )}
      </div>
    </section>
  )
}

export default FilterBar

