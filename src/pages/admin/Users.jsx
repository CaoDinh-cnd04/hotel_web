import { useState, useEffect, useMemo } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { userAPI } from '../../services/admin/api'
import { mockUsers } from '../../data/admin/mockData'
import FilterBar from '../../components/admin/FilterBar'

const USE_MOCK_DATA = true // Set to false when API is ready

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: 'Tất cả',
    role: 'Tất cả',
    location: 'Tất cả',
    search: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (USE_MOCK_DATA) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        setUsers(mockUsers)
      } else {
        const response = await userAPI.getAll()
        const usersData = response.data || response || []
        setUsers(Array.isArray(usersData) ? usersData : [])
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách người dùng')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const getUserStatus = (user) => {
    if (user.trang_thai === 0) return 'Bị khóa'
    if (user.trang_thai === 2) return 'Chờ duyệt'
    return 'Hoạt động'
  }

  const getUserRole = (user) => {
    const role = user.vai_tro || user.role
    if (role === 'Admin') return 'Quản trị'
    if (role === 'HotelOwner') return 'Chủ khách sạn'
    return 'Khách hàng'
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const status = getUserStatus(user)
      const role = getUserRole(user)
      const matchStatus = filters.status === 'Tất cả' || status === filters.status
      const matchRole = filters.role === 'Tất cả' || role === filters.role
      const name = user.ho_ten || user.name || ''
      const email = user.email || ''
      const phone = user.sdt || user.phone || user.so_dien_thoai || ''
      const matchText = !filters.search || 
        name.toLowerCase().includes(filters.search.toLowerCase()) ||
        email.toLowerCase().includes(filters.search.toLowerCase()) ||
        phone.includes(filters.search)
      return matchStatus && matchRole && matchText
    })
  }, [users, filters])

  const handleDelete = async (id) => {
    const user = users.find(u => (u.ma_nguoi_dung || u.id) === id)
    const userName = user?.ho_ten || user?.name || 'người dùng này'
    
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${userName}? Hành động này không thể hoàn tác.`)) {
      return
    }
    
    try {
      if (USE_MOCK_DATA) {
        setUsers(users.filter(user => (user.ma_nguoi_dung || user.id) !== id))
        alert('Xóa người dùng thành công!')
      } else {
        await userAPI.delete(id)
        await fetchUsers()
        alert('Xóa người dùng thành công!')
      }
    } catch (err) {
      alert('Lỗi khi xóa người dùng: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleApprove = async (id) => {
    try {
      if (USE_MOCK_DATA) {
        setUsers(users.map(user => 
          (user.ma_nguoi_dung || user.id) === id 
            ? { ...user, trang_thai: 1 }
            : user
        ))
        alert('Duyệt người dùng thành công!')
      } else {
        await userAPI.approve(id)
        await fetchUsers()
        alert('Duyệt người dùng thành công!')
      }
    } catch (err) {
      alert('Lỗi khi duyệt người dùng: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const handleBlock = async (id) => {
    if (!window.confirm('Bạn có chắc muốn khóa người dùng này?')) return
    
    try {
      if (USE_MOCK_DATA) {
        setUsers(users.map(user => 
          (user.ma_nguoi_dung || user.id) === id 
            ? { ...user, trang_thai: 0 }
            : user
        ))
        alert('Khóa người dùng thành công!')
      } else {
        await userAPI.block(id)
        await fetchUsers()
        alert('Khóa người dùng thành công!')
      }
    } catch (err) {
      alert('Lỗi khi khóa người dùng: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="uppercase text-xs font-semibold text-slate-500 tracking-wide">Bảng điều khiển</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Quản lý người dùng</h1>
          <p className="text-slate-500 mt-1">
            Giám sát trạng thái tài khoản, phân quyền và xử lý đơn đăng ký chủ khách sạn.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold shadow">
          Người dùng: {filteredUsers.length} / {users.length}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        options={{
          showRating: false,
          showLocation: true,
          showReviewCount: false,
          showStatus: true,
          showRole: true,
          showSearch: true,
          statusOptions: ['Tất cả', 'Hoạt động', 'Chờ duyệt', 'Bị khóa'],
          roleOptions: ['Tất cả', 'Khách hàng', 'Chủ khách sạn', 'Quản trị'],
          searchPlaceholder: 'Tìm theo tên, email hoặc số điện thoại...',
          title: 'Bộ lọc người dùng',
          description: 'Lọc người dùng theo trạng thái, vai trò, địa điểm và tìm kiếm.'
        }}
      />

      <section className="bg-white border border-slate-200 rounded-2xl shadow">
        <div className="px-6 py-4 border-b border-slate-100 bg-sky-600 text-white rounded-t-2xl">
          <h2 className="text-lg font-semibold">Danh sách người dùng</h2>
          <p className="text-sm text-white/80">Theo dõi trạng thái và phân quyền nhanh</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-sky-500 text-white text-sm uppercase tracking-wide">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Tên</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Số điện thoại</th>
                <th className="py-3 px-4 text-left">Vai trò</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-left">Ngày tạo</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center">
                    <Loader2 className="animate-spin text-sky-500 mx-auto" size={24} />
                    <span className="ml-2 text-slate-600">Đang tải dữ liệu...</span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                      onClick={fetchUsers}
                      className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                    >
                      Thử lại
                    </button>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    {filters.search || filters.status !== 'Tất cả' || filters.role !== 'Tất cả' || filters.location !== 'Tất cả'
                      ? 'Không tìm thấy người dùng nào phù hợp với bộ lọc'
                      : 'Chưa có người dùng nào'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userId = user.ma_nguoi_dung || user.id
                  const status = getUserStatus(user)
                  const role = getUserRole(user)
                  const name = user.ho_ten || user.name || 'N/A'
                  const email = user.email || 'N/A'
                  const phone = user.sdt || user.phone || user.so_dien_thoai || 'N/A'
                  const createdAt = user.ngay_tao 
                    ? new Date(user.ngay_tao).toLocaleDateString('vi-VN')
                    : user.createdAt || 'N/A'

                  return (
                    <tr key={userId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-semibold text-slate-700">{userId}</td>
                      <td className="py-4 px-4 text-sm text-slate-900 font-semibold">{name}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{email}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{phone}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{role}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            status === 'Hoạt động'
                              ? 'bg-emerald-100 text-emerald-700'
                              : status === 'Chờ duyệt'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">{createdAt}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {status === 'Chờ duyệt' && (
                            <button
                              onClick={() => handleApprove(userId)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                            >
                              Duyệt
                            </button>
                          )}
                          <button
                            onClick={() => handleBlock(userId)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
                          >
                            Khóa
                          </button>
                          <button
                            onClick={() => handleDelete(userId)}
                            className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors inline-flex items-center gap-1"
                            title="Xóa người dùng"
                          >
                            <Trash2 size={14} />
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
      </section>
    </div>
  )
}

export default Users

