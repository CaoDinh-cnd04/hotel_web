import React from 'react'
import { FiPlus, FiPrinter, FiLogOut } from 'react-icons/fi'
import clsx from 'clsx'

const sidebarLinks = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'hotels', label: 'Quản lý khách sạn' },
  { id: 'rooms', label: 'Quản lý phòng', active: true },
  { id: 'users', label: 'Quản lý người dùng' },
  { id: 'discounts', label: 'Quản lý mã giảm giá' },
  { id: 'rankings', label: 'Bảng xếp hạng' },
  { id: 'bookings', label: 'Quản lý đặt phòng' }
]

const roomData = [
  { id: 1, name: 'Phòng Deluxe', price: '1.500.000 VND', hotel: 1, type: 6 },
  { id: 2, name: 'Phòng Superior', price: '1.200.000 VND', hotel: 1, type: 6 },
  { id: 3, name: 'Phòng Gia Đình', price: '2.500.000 VND', hotel: 1, type: 4 },
  { id: 4, name: 'Phòng Premium View Hồ', price: '2.800.000 VND', hotel: 2, type: 6 },
  { id: 5, name: 'Phòng Suite', price: '3.500.000 VND', hotel: 2, type: 5 },
  { id: 6, name: 'Phòng Executive', price: '4.000.000 VND', hotel: 2, type: 7 },
  { id: 7, name: 'Phòng Superior', price: '900.000 VND', hotel: 3, type: 6 },
  { id: 8, name: 'Phòng Deluxe Phổ Cổ', price: '1.200.000 VND', hotel: 3, type: 5 }
]

const StatusButton = ({ label, intent = 'primary' }) => {
  const colors = {
    primary: 'bg-emerald-500 hover:bg-emerald-600',
    danger: 'bg-red-500 hover:bg-red-600'
  }

  return (
    <button
      type="button"
      className={clsx(
        'px-4 py-1.5 text-white text-sm font-semibold rounded transition-colors',
        colors[intent]
      )}
    >
      {label}
    </button>
  )
}

const HotelManagementPage = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-tight">TripHotel</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              className={clsx(
                'w-full text-left px-4 py-2 rounded-lg font-medium transition-colors',
                link.active
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-200 hover:bg-slate-800/60'
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            <FiLogOut className="text-lg" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8">
        <div className="bg-white shadow rounded-2xl border border-slate-200">
          <header className="px-8 pb-6 pt-7 border-b border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Bảng điều khiển</h2>
                <p className="text-slate-500 mt-1">
                  Quản lý danh sách phòng cho từng khách sạn
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors">
                  <FiPlus />
                  Thêm Phòng
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors">
                  <FiPrinter />
                  In
                </button>
              </div>
            </div>
            <div className="mt-6 max-w-md">
              <input
                type="text"
                placeholder="Tìm kiếm phòng..."
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-shadow"
              />
            </div>
          </header>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Tên phòng</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Giá tiền</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Khách sạn</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Loại phòng</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {roomData.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{room.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{room.name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{room.price}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{room.hotel}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{room.type}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <StatusButton label="Sửa" />
                        <StatusButton label="Xóa" intent="danger" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HotelManagementPage


