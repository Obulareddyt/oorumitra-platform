import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const navClass = ({ isActive }) =>
    isActive
      ? 'text-primary-600 font-semibold border-b-2 border-primary-600 pb-0.5'
      : 'text-gray-600 hover:text-primary-600 transition-colors'

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <div>
              <span className="text-xl font-bold text-primary-600">OoruMitra</span>
              <span className="hidden sm:block text-xs text-gray-400 -mt-1">Rural Marketplace</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <NavLink to="/products" className={navClass}>Products</NavLink>
            <NavLink to="/workers" className={navClass}>Workers</NavLink>
            <NavLink to="/transport" className={navClass}>Transport</NavLink>
            <NavLink to="/vehicle-work" className={navClass}>Vehicle Work</NavLink>
            <NavLink to="/emergency" className={navClass}>Emergency</NavLink>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link to="/sell" className="btn-primary text-sm py-1.5 px-4 hidden sm:inline-block">
              + Post Ad
            </Link>
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <span className="text-base">👤</span>
                  <span className="hidden sm:inline">{user?.firstName || 'Account'}</span>
                  <span className="text-xs">▾</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Bookings
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-1.5 px-4">
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-2 text-sm">
            {[
              ['/sell', '+ Post Ad'],
              ['/products', 'Products'],
              ['/workers', 'Workers'],
              ['/transport', 'Transport'],
              ['/vehicle-work', 'Vehicle Work'],
              ['/emergency', 'Emergency'],
              ...(isLoggedIn ? [['/profile', 'My Profile'], ['/bookings', 'My Bookings'], ...(user?.role === 'ADMIN' ? [['/admin', 'Admin Panel']] : [])] : []),
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-2 py-1.5 rounded-lg ${isActive ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600'}`
                }
              >
                {label}
              </NavLink>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-left px-2 py-1.5 text-red-600"
              >
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
