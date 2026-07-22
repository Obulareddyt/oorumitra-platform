import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { changeAppLanguage, getSavedLanguage } from '../api/i18n'
import { translationsApi } from '../api/client'

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const [menuOpen, setMenuOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [location, setLocation] = useState('Malkajgiri Panchayat')
  
  const adminRef = useRef(null)
  const langRef = useRef(null)
  
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const isAdmin = user?.role === 'ADMIN' || isSuperAdmin

  const [activeLanguages, setActiveLanguages] = useState([
    { languageCode: 'en', languageName: 'English', nativeName: 'English' },
    { languageCode: 'te', languageName: 'Telugu', nativeName: 'తెలుగు' },
    { languageCode: 'ta', languageName: 'Tamil', nativeName: 'தமிழ்' },
    { languageCode: 'ml', languageName: 'Malayalam', nativeName: 'മലയാളം' },
    { languageCode: 'kn', languageName: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { languageCode: 'hi', languageName: 'Hindi', nativeName: 'हिन्दी' }
  ])

  useEffect(() => {
    translationsApi.getActiveLanguages()
      .then(res => {
        if (res && res.length > 0) setActiveLanguages(res)
      })
      .catch(err => console.warn('Could not fetch active languages:', err))
  }, [])

  useEffect(() => {
    const close = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) setAdminOpen(false)
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const currentLang = activeLanguages.find(l => l.languageCode === getSavedLanguage()) || activeLanguages[0]

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }

  const navClass = ({ isActive }) =>
    isActive
      ? 'text-[#2E7D32] font-black border-b-4 border-[#2E7D32] pb-1 text-base'
      : 'text-gray-800 hover:text-[#2E7D32] transition-colors font-bold text-base'

  return (
    <>
      {/* Top Main Navigation Bar */}
      <nav className="bg-white border-b-2 border-emerald-800/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: OoruMitra Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center">
                <img src="/Ooru_mitra_logo_2.png" alt="OoruMitra" className="h-10 sm:h-12 w-auto drop-shadow-sm" />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-base">
              <NavLink to="/products" className={navClass}>{t('cat.products', 'Products')}</NavLink>
              <NavLink to="/workers" className={navClass}>{t('cat.workers', 'Workers')}</NavLink>
              <NavLink to="/transport" className={navClass}>{t('cat.transport', 'Transport')}</NavLink>
              <NavLink to="/vehicle-work" className={navClass}>{t('cat.vehicles', 'Vehicle Work')}</NavLink>
              <NavLink to="/emergency" className={navClass}>{t('cat.emergency', 'Emergency')}</NavLink>

              {isAdmin && (
                <div className="relative" ref={adminRef}>
                  <button
                    onClick={() => setAdminOpen(v => !v)}
                    className="flex items-center gap-1 text-gray-800 hover:text-[#2E7D32] font-bold text-base transition-colors"
                  >
                    Admin <span className="text-xs ml-0.5">{adminOpen ? '▴' : '▾'}</span>
                  </button>
                  {adminOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-gray-200 py-2 z-50 animate-fadeIn">
                      <Link to="/admin" onClick={() => setAdminOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-emerald-50 hover:text-[#2E7D32]">
                        Admin Verification Dashboard
                      </Link>
                      {isSuperAdmin && (
                        <Link to="/admin/villages" onClick={() => setAdminOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-emerald-50 hover:text-[#2E7D32]">
                          Village Management
                        </Link>
                      )}
                      <Link to="/admin/users" onClick={() => setAdminOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-emerald-50 hover:text-[#2E7D32]">
                        User Management
                      </Link>
                      {isSuperAdmin && (
                        <Link to="/admin/roles" onClick={() => setAdminOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-emerald-50 hover:text-[#2E7D32]">
                          Role Management
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Post Ad Button & Language Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Language Selector Dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(v => !v)}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 py-2 rounded-xl text-xs sm:text-sm font-black border border-gray-300"
                >
                  <span>🌐</span>
                  <span>{currentLang.nativeName}</span>
                  <span className="text-[10px]">▾</span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border-2 border-gray-200 py-2 z-50 animate-fadeIn">
                    {activeLanguages.map(l => (
                      <button
                        key={l.languageCode}
                        onClick={() => {
                          changeAppLanguage(l.languageCode)
                          setLangOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold flex items-center justify-between ${
                          currentLang.languageCode === l.languageCode ? 'bg-emerald-100 text-[#2E7D32]' : 'text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <span>{l.nativeName}</span>
                        <span className="text-xs text-gray-500">({l.languageName})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Big Post Listing CTA */}
              <Link to="/sell" className="btn-gold text-xs sm:text-sm font-black px-4 py-2.5 min-h-[44px]">
                <span>➕ Post Free</span>
              </Link>

              {/* Account Dropdown */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-1.5 bg-emerald-100 text-[#2E7D32] px-3 py-2 rounded-xl text-xs sm:text-sm font-black border border-emerald-300"
                  >
                    <span>👤</span>
                    <span className="hidden sm:inline">{user?.firstName || 'Account'}</span>
                    <span className="text-[10px]">▾</span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-gray-200 py-2 z-50 animate-scaleIn origin-top-right">
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-emerald-50">My Profile</Link>
                      <Link to="/bookings" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-emerald-50">My Bookings</Link>
                      <Link to="/interested-customers" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-emerald-50">Interested Customers</Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-emerald-50">Admin Panel</Link>
                      )}
                      <hr className="my-1 border-gray-200" />
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm font-black text-red-600 hover:bg-red-50">Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-xs sm:text-sm py-2 px-4 font-black">Sign In</Link>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION BAR (Home, Categories, Post, My Listings, Profile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl px-2 py-2 flex items-center justify-around">
        <NavLink
          to="/"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-black ${isActive ? 'text-[#2E7D32]' : 'text-gray-600'}`}
        >
          <span className="text-xl">🏠</span>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-black ${isActive ? 'text-[#2E7D32]' : 'text-gray-600'}`}
        >
          <span className="text-xl">🗂️</span>
          <span>Categories</span>
        </NavLink>

        <NavLink
          to="/sell"
          className="flex flex-col items-center justify-center bg-[#FFB300] text-gray-950 rounded-2xl w-14 h-12 shadow-md border-2 border-amber-300 active:scale-95"
        >
          <span className="text-xl">➕</span>
          <span className="text-[10px] font-black uppercase">Post</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-black ${isActive ? 'text-[#2E7D32]' : 'text-gray-600'}`}
        >
          <span className="text-xl">📋</span>
          <span>Listings</span>
        </NavLink>

        <NavLink
          to={isLoggedIn ? "/profile" : "/login"}
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-xs font-black ${isActive ? 'text-[#2E7D32]' : 'text-gray-600'}`}
        >
          <span className="text-xl">👤</span>
          <span>Profile</span>
        </NavLink>
      </div>
    </>
  )
}
