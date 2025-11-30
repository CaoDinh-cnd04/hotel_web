import { useState } from 'react'
import Rooms from './pages/Rooms'
import Discounts from './pages/Discounts'
import Users from './pages/Users'
import Hotels from './pages/Hotels'
import Overview from './pages/Overview'
import Bookings from './pages/Bookings'

const sections = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'hotels', label: 'Quản lý khách sạn' },
  { id: 'rooms', label: 'Quản lý phòng' },
  { id: 'users', label: 'Quản lý người dùng' },
  { id: 'discounts', label: 'Quản lý mã giảm giá' },
  { id: 'ranking', label: 'Bảng xếp hạng' },
  { id: 'bookings', label: 'Quản lý đặt phòng' }
]

const App = () => {
  const [activeSection, setActiveSection] = useState('overview')

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />
      case 'hotels':
        return <Hotels />
      case 'rooms':
        return <Rooms />
      case 'discounts':
        return <Discounts />
      case 'users':
        return <Users />
      case 'bookings':
        return <Bookings />
      default:
        return (
          <div className="p-12 text-center text-slate-500">
            Chức năng <strong>{sections.find((s) => s.id === activeSection)?.label}</strong> sẽ cập nhật sau.
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-200 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-wide">TripHotel</h1>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-2">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeSection === id ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(15,23,42,0.08)] border border-slate-100">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App

