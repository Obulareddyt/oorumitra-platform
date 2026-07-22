import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { emergencyApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import HeroBannerSlider from '../components/HeroBannerSlider'

// 9 Categories matching Prompt: 4 per row on Mobile
const VILLAGE_CATEGORIES = [
  { keyName: 'AGRICULTURE', to: '/products', icon: '🌾', label: 'Agriculture', color: 'bg-emerald-100 text-[#2E7D32] border-emerald-300' },
  { keyName: 'SERVICES', to: '/vehicle-work', icon: '🔧', label: 'Services', color: 'bg-blue-100 text-[#1565C0] border-blue-300' },
  { keyName: 'JOBS', to: '/workers', icon: '💼', label: 'Jobs', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { keyName: 'REAL_ESTATE', to: 'modal', modalKey: 'realestate', icon: '🏠', label: 'Real Estate', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  { keyName: 'VEHICLES', to: '/transport', icon: '🚜', label: 'Vehicles', color: 'bg-teal-100 text-teal-900 border-teal-300' },
  { keyName: 'ELECTRONICS', to: 'modal', modalKey: 'electronics', icon: '📱', label: 'Electronics', color: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
  { keyName: 'SHOPS', to: '/products', icon: '🛒', label: 'Shops', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { keyName: 'EDUCATION', to: 'modal', modalKey: 'education', icon: '📚', label: 'Education', color: 'bg-rose-100 text-rose-900 border-rose-300' },
  { keyName: 'HEALTHCARE', to: 'modal', modalKey: 'healthcare', icon: '🏥', label: 'Healthcare', color: 'bg-red-100 text-red-900 border-red-300' },
]

const NEARBY_LISTINGS_MOCK = [
  {
    id: 1,
    title: 'Fresh Organic Sona Masoori Paddy',
    price: '₹3,200',
    unit: '/ Qtl',
    village: 'Malkajgiri Panchayat',
    distance: '1.2 km away',
    seller: 'Kondaiah Naidu',
    mobile: '919876543210',
    whatsapp: '919876543210',
    category: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'John Deere Tractor Ploughing Service',
    price: '₹950',
    unit: '/ Hour',
    village: 'Medchal Village',
    distance: '2.5 km away',
    seller: 'Venkatesh Rao',
    mobile: '919876543211',
    whatsapp: '919876543211',
    category: 'Vehicles',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Panchayat Electrician & House Wiring',
    price: '₹350',
    unit: '/ Visit',
    village: 'Kukatpally North',
    distance: '0.8 km away',
    seller: 'Srinivas M.',
    mobile: '919876543212',
    whatsapp: '919876543212',
    category: 'Services',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Sugarcane Harvest Labor Crew (10 Workers)',
    price: '₹750',
    unit: '/ Day / Worker',
    village: 'Shamirpet Rural',
    distance: '3.8 km away',
    seller: 'Ramesh Labor Group',
    mobile: '919876543213',
    whatsapp: '919876543213',
    category: 'Jobs',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
  },
]

const MODAL_INFO = {
  realestate: { title: 'Village Real Estate & Land 🏠', desc: 'Direct verification of agricultural land, farm plots, village houses, and commercial godowns. Launching soon!' },
  electronics: { title: 'Rural Electronics & Solar 📱', desc: 'Buy refurbished smartphones, solar water pumps, inverter batteries, and TVs directly from village distributors.' },
  education: { title: 'Village Education & Learning 📚', desc: 'Tuition classes, digitized textbooks, competitive exam prep, and village school updates.' },
  healthcare: { title: 'Healthcare & Vet Clinic 🏥', desc: 'Nearest primary health centers, telemedicine doctors, and livestock veterinary doctor visits.' },
}

export default function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [activeModal, setActiveModal] = useState(null)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedLocation, setSelectedLocation] = useState('ALL')

  const EXAMPLE_SEARCHES = ['Tractor', 'Worker', 'House Rent', 'Bike', 'Agriculture']

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-8 text-left">
      
      {/* 1. LARGE VILLAGE SEARCH BAR */}
      <div className="bg-white border-2 border-emerald-800/20 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          
          {/* Main Search Input */}
          <div className="w-full md:flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="input pl-12 pr-4 text-base sm:text-lg min-h-[52px]"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input min-h-[52px] text-sm font-bold text-gray-800"
            >
              <option value="ALL">All Categories</option>
              <option value="AGRICULTURE">🌾 Agriculture</option>
              <option value="SERVICES">🔧 Services</option>
              <option value="JOBS">💼 Jobs</option>
              <option value="VEHICLES">🚜 Vehicles</option>
            </select>
          </div>

          {/* Search Button (Big 48px+ CTA) */}
          <Link
            to="/products"
            className="w-full md:w-auto btn-primary text-base font-black px-8 min-h-[52px]"
          >
            <span>Search Now</span>
            <span>→</span>
          </Link>
        </div>

        {/* Quick Example Searches */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="font-bold text-gray-500">Popular:</span>
          {EXAMPLE_SEARCHES.map((item) => (
            <button
              key={item}
              onClick={() => setSearchQuery(item)}
              className="px-3 py-1 bg-gray-100 hover:bg-emerald-100 text-gray-800 font-bold rounded-full border border-gray-200 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 2. COMPACT HERO BANNER (3 Simple Rotating Banners) */}
      <HeroBannerSlider />

      {/* 3. CATEGORIES SECTION (Large Icons, 4 Per Row on Mobile) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-heading flex items-center gap-2">
            <span>🗂️</span>
            <span>Explore Categories</span>
          </h2>
          <span className="text-xs text-gray-500 font-semibold">Easy Tap</span>
        </div>

        {/* 4 Per Row on Mobile, 9 Columns on Large Screens */}
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-9 gap-2.5 sm:gap-3">
          {VILLAGE_CATEGORIES.map((cat) => {
            const isModal = cat.to === 'modal'
            const content = (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-center gap-1 hover:border-[#2E7D32] hover:bg-emerald-50/50 transition-all active:scale-95 shadow-sm">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl ${cat.color} border shadow-sm`}>
                  {cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-gray-900 line-clamp-1">{cat.label}</span>
              </div>
            )

            if (isModal) {
              return (
                <button key={cat.keyName} onClick={() => setActiveModal(cat.modalKey)} className="w-full">
                  {content}
                </button>
              )
            }

            return (
              <Link key={cat.keyName} to={cat.to} className="w-full">
                {content}
              </Link>
            )
          })}
        </div>
      </section>

      {/* 4. NEARBY VILLAGE LISTINGS (Simple White Cards with WhatsApp & Call CTAs) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-heading">
              📍 Nearby Village Postings
            </h2>
            <p className="text-xs text-gray-500 font-medium">Direct contact with sellers in your Panchayat</p>
          </div>
          <Link to="/products" className="text-sm font-extrabold text-[#2E7D32] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NEARBY_LISTINGS_MOCK.map((item) => (
            <div key={item.id} className="card bg-white border-2 border-gray-200 rounded-3xl p-3 flex flex-col justify-between space-y-3">
              <div>
                {/* Photo */}
                <div className="relative h-44 rounded-2xl overflow-hidden bg-gray-100 mb-3 border border-gray-200">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-1 bg-amber-400 text-gray-950 font-black text-xs rounded-lg shadow-xs">
                    {item.category}
                  </span>
                </div>

                {/* Title & Price */}
                <h3 className="text-base font-extrabold text-gray-900 leading-snug line-clamp-2">{item.title}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-[#2E7D32]">{item.price}</span>
                  <span className="text-xs font-bold text-gray-500">{item.unit}</span>
                </div>

                <p className="text-xs text-gray-600 font-semibold mt-1">📍 {item.village} • {item.distance}</p>
                <p className="text-xs text-gray-500 mt-0.5">👤 Seller: {item.seller}</p>
              </div>

              {/* Action Buttons: Big WhatsApp & Call CTAs */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <a
                  href={`https://wa.me/${item.whatsapp}?text=Hi,%20interested%20in%20${encodeURIComponent(item.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp text-xs font-black min-h-[44px] py-2"
                >
                  <span>💬 WhatsApp</span>
                </a>

                <a
                  href={`tel:${item.mobile}`}
                  className="btn-call text-xs font-black min-h-[44px] py-2"
                >
                  <span>📞 Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. POST AN AD BANNER (Large Simple Village CTA) */}
      <section className="bg-[#2E7D32] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border-2 border-emerald-800">
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-3 py-1 bg-amber-400 text-gray-950 text-xs font-black uppercase rounded-full">0% Brokerage</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Want to Sell Crops, Services or Rent Tractor?</h2>
          <p className="text-sm text-emerald-100 font-medium">Post your listing in 1 minute. Simple & free for all villagers.</p>
        </div>

        <Link to="/sell" className="btn-gold text-base font-black px-8 min-h-[52px] shrink-0">
          <span>➕ Post Listing Free</span>
        </Link>
      </section>

      {/* Modal Popup for Special Categories */}
      {activeModal && MODAL_INFO[activeModal] && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-emerald-700 text-left space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">{MODAL_INFO[activeModal].title}</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">✕</button>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">{MODAL_INFO[activeModal].desc}</p>
            <button onClick={() => setActiveModal(null)} className="w-full btn-primary text-sm py-3 font-bold">
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
