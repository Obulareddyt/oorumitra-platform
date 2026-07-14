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
      ? 'text-primary-600 font-semibold border-b-2 border-primary-600 pb-0.5'
      : 'text-gray-600 hover:text-primary-600 transition-colors'

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center group">
            <img src="/logo-primary.svg" alt="OoruMitra" className="h-10 w-auto transition-transform group-hover:scale-105" />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <NavLink to="/products" className={navClass}>{t('cat.products', 'Products')}</NavLink>
            <NavLink to="/workers" className={navClass}>{t('cat.workers', 'Workers')}</NavLink>
            <NavLink to="/transport" className={navClass}>{t('cat.transport', 'Transport')}</NavLink>
            <NavLink to="/vehicle-work" className={navClass}>{t('cat.vehicles', 'Vehicle Work')}</NavLink>
            <NavLink to="/emergency" className={navClass}>{t('cat.emergency', 'Emergency')}</NavLink>
            <NavLink to="/banner" className={navClass}>Promo Video</NavLink>

            {isAdmin && (
              <div className="relative" ref={adminRef}>
                <button
                  onClick={() => setAdminOpen(v => !v)}
                  className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Administration <span className="text-xs ml-0.5">{adminOpen ? '▴' : '▾'}</span>
                </button>
                {adminOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    {isSuperAdmin && (
                      <Link to="/admin/villages" onClick={() => setAdminOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Village Management
                      </Link>
                    )}
                    <Link to="/admin/users" onClick={() => setAdminOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      User Management
                    </Link>
                    {isSuperAdmin && (
                      <Link to="/admin/roles" onClick={() => setAdminOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Role Management
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/sell" className="btn-primary text-sm py-1.5 px-4 hidden sm:inline-block">
              {t('action.post_ad', 'Create Post')}
            </Link>

            {/* Language Selection Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 px-2 py-1.5 rounded-lg border border-gray-200 hover:border-primary-500 bg-white hover:bg-primary-50/20 text-xs font-semibold transition-all cursor-pointer"
              >
                <span>🌐</span>
                <span>{currentLang?.nativeName || 'English'}</span>
                <span className="text-[10px]">▼</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-150 py-1.5 z-50 animate-scaleIn origin-top-right">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Select Language
                  </div>
                  {activeLanguages.map((lang) => (
                    <button
                      key={lang.languageCode}
                      type="button"
                      onClick={() => {
                        changeAppLanguage(lang.languageCode)
                        setLangOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors flex justify-between items-center ${
                        currentLang.languageCode === lang.languageCode
                          ? 'text-primary-600 bg-primary-50/50 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{lang.languageName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-scaleIn origin-top-right">
                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                    <Link to="/bookings" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Bookings</Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Panel</Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin/users" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">User Management</Link>
                    )}
                    {isSuperAdmin && (
                      <Link to="/admin/villages" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Village Management</Link>
                    )}
                    {isSuperAdmin && (
                      <Link to="/admin/roles" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Role Management</Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-1.5 px-4">Sign In</Link>
            )}
            <button className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 flex flex-col gap-2 text-sm">
            {[
              ['/sell', 'Create Post'],
              ['/products', 'Products'],
              ['/workers', 'Workers'],
              ['/transport', 'Transport'],
              ['/vehicle-work', 'Vehicle Work'],
              ['/emergency', 'Emergency'],
              ...(isLoggedIn ? [
                ['/profile', 'My Profile'],
                ['/bookings', 'My Bookings'],
                ...(isAdmin ? [['/admin', 'Admin Panel'], ['/admin/users', 'User Management']] : []),
                ...(isSuperAdmin ? [['/admin/villages', 'Village Management'], ['/admin/roles', 'Role Management']] : []),
              ] : []),
            ].map(([to, label]) => (
              <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `px-2 py-1.5 rounded-lg ${isActive ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600'}`}>
                {label}
              </NavLink>
            ))}
            {isLoggedIn && (
              <button onClick={handleLogout} className="text-left px-2 py-1.5 text-red-600">Sign Out</button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
