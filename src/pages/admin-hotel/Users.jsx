import { useState, useEffect } from 'react'
import { Search, UserPlus, Loader2 } from 'lucide-react'
import { userAPI } from '../../../admin_hotel/src/services/api'
import { mockUsers } from '../../../admin_hotel/src/data/mockData'

const USE_MOCK_DATA = true // Set to false when API is ready

const filterOptions = ['Tất cả', 'Hoạt động', 'Chờ duyệt', 'Bị khóa']
const roleOptions = ['Tất cả', 'Khách hàng', 'Chủ khách sạn', 'Quản trị']

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('Tất cả')
  const [roleFilter, setRoleFilter] = useState('Tất cả')
  const [search, setSearch] = useState('')

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

  const filteredUsers = users.filter((user) => {
    const status = getUserStatus(user)
    const role = getUserRole(user)
    const matchStatus = filter === 'Tất cả' || status === filter
    const matchRole = roleFilter === 'Tất cả' || role === roleFilter
    const name = user.ho_ten || user.name || ''
    const email = user.email || ''
    const matchText =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchRole && matchText
  })

  const handleAddUser = () => {
    const newUser = {
      ma_nguoi_dung: users.length > 0 
        ? Math.max(...users.map(u => u.ma_nguoi_dung || u.id)) + 1 
        : 1,
      ho_ten: 'Người dùng mới',
      email: `user${users.length + 1}@example.com`,
      vai_tro: 'Customer',
      trang_thai: 1,
      ngay_tao: new Date().toISOString()
    }
    setUsers([newUser, ...users])
    alert('Thêm người dùng thành công! Vui lòng chỉnh sửa thông tin người dùng.')
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
          Người dùng: {users.length}
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl shadow mb-6">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-slate-900">Bộ lọc</h2>
          <p className="text-sm text-slate-500">Tìm kiếm nhanh theo trạng thái, vai trò, email hoặc tên.</p>
        </div>
        <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold text-slate-700">
            Trạng thái
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Vai trò
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:ring-2 focus:ring-sky-400"
            >
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2 text-sm font-semibold text-slate-700">
            Tìm kiếm
            <div className="mt-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập tên hoặc email..."
                className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </label>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl shadow">
        <div className="px-6 py-4 border-b border-slate-100 bg-sky-600 text-white rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Danh sách người dùng</h2>
            <p className="text-sm text-white/80">Theo dõi trạng thái và phân quyền nhanh</p>
          </div>
          <button 
            onClick={handleAddUser}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-sky-700 font-semibold shadow hover:bg-sky-50 transition-colors"
          >
            <UserPlus size={18} />
            Thêm người dùng
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-sky-500 text-white text-sm uppercase tracking-wide">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Tên</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Vai trò</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-left">Ngày tạo</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <Loader2 className="animate-spin text-sky-500 mx-auto" size={24} />
                    <span className="ml-2 text-slate-600">Đang tải dữ liệu...</span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
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
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    {search || filter !== 'Tất cả' || roleFilter !== 'Tất cả'
                      ? 'Không tìm thấy người dùng nào'
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
                  const createdAt = user.ngay_tao 
                    ? new Date(user.ngay_tao).toLocaleDateString('vi-VN')
                    : user.createdAt || 'N/A'

                  return (
                    <tr key={userId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-semibold text-slate-700">{userId}</td>
                      <td className="py-4 px-4 text-sm text-slate-900 font-semibold">{name}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{email}</td>
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
                        <div className="flex items-center justify-center gap-3">
                          {status === 'Chờ duyệt' && (
                            <button
                              onClick={() => handleApprove(userId)}
                              className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                            >
                              Duyệt
                            </button>
                          )}
                          <button
                            onClick={() => handleBlock(userId)}
                            className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                          >
                            Khóa
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

