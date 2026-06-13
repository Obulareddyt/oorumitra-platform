import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { emergencyApi } from '../api/client'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  { to: '/products', icon: '🛒', label: 'Products', desc: 'Buy & sell agricultural goods, hardware, livestock', color: 'bg-green-50 border-green-200 hover:bg-green-100' },
  { to: '/workers', icon: '👷', label: 'Workers', desc: 'Find skilled labour for farming & construction', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { to: '/transport', icon: '🚛', label: 'Transport', desc: 'Hire trucks, tractors & autos for goods', color: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
  { to: '/vehicle-work', icon: '🚜', label: 'Vehicle Work', desc: 'Tractor ploughing, harvesting & field work', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
]

export default function Home() {
  const { user, isLoggedIn } = useAuth()
  const [emergency, setEmergency] = useState([])

  useEffect(() => {
    emergencyApi.getServices().then(setEmergency).catch(() => {})
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white p-8 mb-8 relative overflow-hidden">
        <div className="absolute right-4 top-2 text-8xl opacity-20 select-none">🌾</div>
        <div className="relative">
          {isLoggedIn ? (
            <p className="text-primary-200 mb-1">Welcome back,</p>
          ) : null}
          <h1 className="text-3xl font-bold mb-2">
            {isLoggedIn ? `${user?.firstName} ${user?.lastName}` : 'OoruMitra'}
          </h1>
          <p className="text-primary-100 text-lg mb-4">
            {isLoggedIn
              ? 'Find services, list your offerings, and connect with your community.'
              : 'Your trusted rural marketplace — connecting villages across India.'}
          </p>
          {!isLoggedIn && (
            <Link to="/login" className="inline-block bg-white text-primary-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-50 transition-colors">
              Get Started →
            </Link>
          )}
        </div>
      </div>

      {/* Categories */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Browse Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.to}
            to={cat.to}
            className={`card border p-5 flex flex-col gap-3 transition-colors ${cat.color}`}
          >
            <span className="text-4xl">{cat.icon}</span>
            <div>
              <p className="font-bold text-gray-800 text-lg">{cat.label}</p>
              <p className="text-sm text-gray-500 mt-0.5 leading-snug">{cat.desc}</p>
            </div>
            <span className="text-primary-600 text-sm font-semibold mt-auto">Browse →</span>
          </Link>
        ))}
      </div>

      {/* Emergency Services */}
      {emergency.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">🆘 Emergency Services</h2>
            <Link to="/emergency" className="text-sm text-primary-600 hover:underline font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {emergency.map((svc) => (
              <a
                key={svc.id}
                href={`tel:${svc.number}`}
                className="card border border-red-100 bg-red-50 hover:bg-red-100 p-4 text-center transition-colors"
              >
                <p className="font-semibold text-gray-800 text-sm">{svc.name}</p>
                <p className="text-red-600 font-bold text-xl mt-1">{svc.number}</p>
                <p className="text-xs text-gray-400 mt-1">{svc.description}</p>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-10">
        {[
          { label: 'Villages Connected', value: '500+' },
          { label: 'Active Listings', value: '2,000+' },
          { label: 'Happy Users', value: '10,000+' },
        ].map((s) => (
          <div key={s.label} className="text-center bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-2xl font-bold text-primary-600">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
