import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { emergencyApi, categoryApi, adApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import HeroBannerSlider from '../components/HeroBannerSlider'

const POPULAR_CATEGORIES = [
  { keyName: 'AGRICULTURE', to: '/products', icon: '🌾', label: 'Agriculture', desc: 'Buy & sell crops, seeds, organic fertilizers, tractors & farm equipment', count: '480+ Listings', color: 'from-emerald-500/10 to-green-600/5 border-emerald-500/30 hover:border-emerald-500', iconBg: 'bg-[#2E7D32] text-white' },
  { keyName: 'SERVICES', to: '/vehicle-work', icon: '🛠️', label: 'Local Services', desc: 'Book verified electricians, plumbers, carpenters, painters & mechanics', count: '320+ Service Providers', color: 'from-blue-500/10 to-sky-600/5 border-blue-500/30 hover:border-blue-500', iconBg: 'bg-[#1565C0] text-white' },
  { keyName: 'JOBS', to: '/workers', icon: '👷', label: 'Jobs & Labor', desc: 'Hire farmhands, construction workers, harvesting crews & daily labor', count: '210+ Active Jobs', color: 'from-amber-500/10 to-orange-600/5 border-amber-500/30 hover:border-amber-500', iconBg: 'bg-[#FFB300] text-gray-950 font-bold' },
  { keyName: 'VEHICLES', to: '/transport', icon: '🚜', label: 'Vehicles & Machinery', desc: 'Tractors, JCB excavators, harvesters, auto trolleys & mini-trucks', count: '150+ Vehicles', color: 'from-teal-500/10 to-emerald-600/5 border-teal-500/30 hover:border-teal-500', iconBg: 'bg-teal-700 text-white' },
  { keyName: 'REAL_ESTATE', to: 'modal', modalKey: 'realestate', icon: '🏡', label: 'Real Estate & Land', desc: 'Agricultural land, village plots, godowns, shops & rental houses', count: '95+ Properties', color: 'from-purple-500/10 to-indigo-600/5 border-purple-500/30 hover:border-purple-500', iconBg: 'bg-purple-700 text-white' },
  { keyName: 'ELECTRONICS', to: 'modal', modalKey: 'electronics', icon: '📱', label: 'Electronics & Solar', desc: 'Mobile phones, solar pumps, batteries, TVs & home appliances', count: '180+ Products', color: 'from-cyan-500/10 to-blue-600/5 border-cyan-500/30 hover:border-cyan-500', iconBg: 'bg-cyan-700 text-white' },
  { keyName: 'EDUCATION', to: 'modal', modalKey: 'education', icon: '📚', label: 'Education & Learning', desc: 'Smart classes, tuition centers, competitive exams & vocational training', count: '60+ Centers', color: 'from-rose-500/10 to-red-600/5 border-rose-500/30 hover:border-rose-500', iconBg: 'bg-rose-700 text-white' },
  { keyName: 'HEALTHCARE', to: 'modal', modalKey: 'healthcare', icon: '🏥', label: 'Healthcare & Vet', desc: 'Primary health clinics, telemedicine doctors & livestock veterinary care', count: '45+ Services', color: 'from-red-500/10 to-orange-600/5 border-red-500/30 hover:border-red-500', iconBg: 'bg-red-600 text-white' },
]

const NEARBY_LISTINGS_MOCK = [
  {
    id: 1,
    title: 'Fresh Organic Sona Masoori Paddy (Harvest 2026)',
    price: '₹3,200',
    unit: '/ Qtl',
    village: 'Malkajgiri Panchayat',
    distance: '1.2 km away',
    seller: 'Kondaiah Naidu',
    whatsapp: '919876543210',
    category: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
  {
    id: 2,
    title: 'John Deere Tractor Deep Ploughing & Rotavator',
    price: '₹950',
    unit: '/ Hour',
    village: 'Medchal Village',
    distance: '2.5 km away',
    seller: 'Venkatesh Rao',
    whatsapp: '919876543211',
    category: 'Vehicle Work',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
  {
    id: 3,
    title: 'Licensed Panchayat Electrician & House Wiring',
    price: '₹350',
    unit: '/ Visit',
    village: 'Kukatpally North',
    distance: '0.8 km away',
    seller: 'Srinivas M.',
    whatsapp: '919876543212',
    category: 'Local Services',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
  {
    id: 4,
    title: 'Experienced Sugarcane Harvesting Crew (10 Workers)',
    price: '₹750',
    unit: '/ Day / Worker',
    village: 'Shamirpet Rural',
    distance: '3.8 km away',
    seller: 'Ramesh Labor Group',
    whatsapp: '919876543213',
    category: 'Jobs',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    verified: true,
  },
]

const SUCCESS_STORIES = [
  {
    id: 1,
    name: 'Balaram Reddy',
    role: 'Paddy Farmer, Medak',
    story: 'Sold 50 Quintals of paddy directly to a rice mill buyer in 2 days through OoruMitra without paying a single rupee to middlemen brokerage!',
    rating: 5,
    avatar: '👨‍🌾',
  },
  {
    name: 'Lakshmi Devi',
    role: 'Self Help Group Leader',
    story: 'Booked 2 tractor ploughing machines during peak monsoon season right through WhatsApp on OoruMitra. Saved our entire groundnut crop schedule!',
    rating: 5,
    avatar: '👩‍🌾',
  },
  {
    name: 'Suresh Kumar',
    role: 'Village Carpenter & Electrician',
    story: 'OoruMitra brought me 15+ local repair orders in my panchayat within my first week. My daily income grew by 40%!',
    rating: 5,
    avatar: '🛠️',
  },
]

const MODAL_INFO = {
  realestate: { title: 'Village Real Estate & Land 🏡', desc: 'Direct verification of agricultural land, farm plots, village houses, and commercial godowns linked with local revenue maps. Launching next month!' },
  electronics: { title: 'Rural Electronics & Solar 📱', desc: 'Buy refurbished smartphones, solar water pumps, inverter batteries, and TVs directly from authorized village distributors.' },
  education: { title: 'Smart Panchayat Education 📚', desc: 'Access to digitized textbooks, tutoring schedules, scholarship announcements, and virtual classes for primary and secondary village schools.' },
  healthcare: { title: 'Healthcare & Vet Connect 🏥', desc: 'Book telemedicine consultations, find nearest PHCs, view doctor visit timetables, and schedule livestock vet visits.' },
}

export default function Home() {
  const { t } = useTranslation()
  const { user, isLoggedIn } = useAuth()
  const [emergency, setEmergency] = useState([])
  const [activeModal, setActiveModal] = useState(null)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedLocation, setSelectedLocation] = useState('ALL')

  useEffect(() => {
    emergencyApi.getServices().then(setEmergency).catch(() => { })
  }, [])

  const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative overflow-hidden space-y-12">
      
      {/* 1. HERO BANNER SYSTEM (3D Carousel Slider) */}
      <HeroBannerSlider isLoggedIn={isLoggedIn} userName={userName} />

      {/* 2. FLOATING SEARCH ENGINE BAR */}
      <div className="relative -mt-10 z-30 max-w-5xl mx-auto">
        <div className="glass-panel p-4 sm:p-5 shadow-2xl border border-emerald-900/10 rounded-3xl bg-white/95 backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crops, tractors, workers, goods..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Category Select */}
            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white transition-all font-medium text-gray-700 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="AGRICULTURE">🌾 Agriculture</option>
                <option value="SERVICES">🛠️ Local Services</option>
                <option value="JOBS">👷 Jobs & Labor</option>
                <option value="VEHICLES">🚜 Vehicles & Machinery</option>
              </select>
            </div>

            {/* Location Select */}
            <div className="sm:col-span-2">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white transition-all font-medium text-gray-700 cursor-pointer"
              >
                <option value="ALL">📍 Nearby (5 km)</option>
                <option value="Malkajgiri">Malkajgiri</option>
                <option value="Medchal">Medchal</option>
                <option value="Kukatpally">Kukatpally</option>
              </select>
            </div>

            {/* Search Button CTA */}
            <div className="sm:col-span-2">
              <Link
                to="/products"
                className="w-full bg-[#2E7D32] hover:bg-[#256628] text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95"
              >
                <span>Search</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* 3. POPULAR ANIMATED CATEGORIES */}
      <section className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#2E7D32] tracking-wider">Digital Ecosystem</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-heading">
              Popular Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Explore verified village market modules with zero brokerage
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_CATEGORIES.map((cat, idx) => {
            const isLink = cat.to !== 'modal'
            const Wrapper = isLink ? Link : 'button'
            const wrapperProps = isLink ? { to: cat.to } : { onClick: () => setActiveModal(cat.modalKey) }

            return (
              <Wrapper
                key={cat.label}
                {...wrapperProps}
                className={`group text-left bg-gradient-to-br border p-5 rounded-2xl shadow-sm hover:shadow-village-hover hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between space-y-4 ${cat.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${cat.iconBg}`}>
                    {cat.icon}
                  </div>
                  <span className="px-2.5 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-extrabold text-gray-700 shadow-xs border border-gray-100">
                    {cat.count}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#2E7D32] transition-colors font-heading">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2 font-body font-normal">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#2E7D32] group-hover:translate-x-1 transition-transform">
                  <span>Explore Module</span>
                  <span>→</span>
                </div>
              </Wrapper>
            )
          })}
        </div>
      </section>

      {/* 4. NEARBY LISTINGS SHOWCASE */}
      <section className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#1565C0] tracking-wider">Verified Local Postings</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-heading">
              Nearby Village Listings
            </h2>
          </div>

          <Link to="/products" className="text-xs sm:text-sm font-bold text-[#2E7D32] hover:underline flex items-center gap-1">
            <span>View All Listings</span>
            <span>→</span>
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {NEARBY_LISTINGS_MOCK.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-emerald-950/5 overflow-hidden transition-all duration-300 hover:shadow-village-hover hover:-translate-y-1 hover:scale-[1.03] flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20">
                  📍 {item.distance}
                </div>

                {item.verified && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/90 text-white text-[10px] font-bold rounded-full shadow-md">
                    ✓ Verified
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1565C0]">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-[#2E7D32] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">📍 {item.village}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-[#2E7D32]">{item.price}</span>
                    <span className="text-[10px] text-gray-500 font-semibold ml-0.5">{item.unit}</span>
                  </div>

                  {/* Direct WhatsApp CTA */}
                  <a
                    href={`https://wa.me/${item.whatsapp}?text=Hi%20${encodeURIComponent(item.seller)},%20I%20am%20interested%20in%20your%20listing:%20${encodeURIComponent(item.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow hover:shadow-emerald-600/20 flex items-center gap-1 active:scale-95"
                    title="Chat on WhatsApp"
                  >
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SUCCESS STORIES */}
      <section className="bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 rounded-3xl p-8 text-white shadow-2xl space-y-6 text-left relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 relative z-10">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#FFB300] tracking-wider">Rural Voices</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              Success Stories & Community Impact
            </h2>
          </div>
          <p className="text-xs text-gray-300 font-medium max-w-sm">
            Empowering 10,000+ farmers and rural workers across Gram Panchayats
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {SUCCESS_STORIES.map((story) => (
            <div key={story.id || story.name} className="glass-panel p-6 border-white/10 text-left space-y-4 bg-white/10 backdrop-blur-md rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
                  {story.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{story.name}</h4>
                  <span className="text-xs text-amber-300 font-semibold">{story.role}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed italic">
                "{story.story}"
              </p>

              <div className="flex items-center text-amber-400 text-xs font-bold">
                {'★'.repeat(story.rating)} <span className="ml-1 text-gray-300 text-[10px]">Verified Beneficiary</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. VILLAGE STATISTICS COUNTER BANNER */}
      <section className="bg-white rounded-3xl p-8 border border-emerald-950/5 shadow-xl text-center space-y-6">
        <div className="max-w-xl mx-auto space-y-1">
          <span className="text-xs uppercase font-extrabold text-[#2E7D32] tracking-wider">Live Digital Platform Scale</span>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-heading">
            Connecting Rural India in Real Time
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#2E7D32] block font-heading">500+</span>
            <span className="text-xs text-gray-600 font-bold uppercase tracking-wider mt-1 block">Gram Panchayats</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#FFB300] block font-heading">2,500+</span>
            <span className="text-xs text-gray-600 font-bold uppercase tracking-wider mt-1 block">Active Listings</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1565C0] block font-heading">1,200+</span>
            <span className="text-xs text-gray-600 font-bold uppercase tracking-wider mt-1 block">Local Workers</span>
          </div>

          <div className="p-4 rounded-2xl bg-green-50/60 border border-green-100">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 block font-heading">15,000+</span>
            <span className="text-xs text-gray-600 font-bold uppercase tracking-wider mt-1 block">Happy Villagers</span>
          </div>
        </div>
      </section>

      {/* 7. EMERGENCY HOTLINES QUICK ROW */}
      {emergency.length > 0 && (
        <section className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <span>🆘</span>
              <span>Emergency Helpline Quick Access</span>
            </h2>
            <Link to="/emergency" className="text-xs font-bold text-red-600 hover:underline">Full Emergency List →</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {emergency.slice(0, 4).map((svc) => (
              <a
                key={svc.id}
                href={`tel:${svc.number}`}
                className="bg-red-50 hover:bg-red-100 border border-red-200/80 p-4 rounded-2xl text-center transition-all hover:scale-105 shadow-sm group"
              >
                <span className="text-xs font-bold text-gray-800 block">{svc.name}</span>
                <span className="text-xl font-extrabold text-red-600 block mt-1">{svc.number}</span>
                <span className="text-[10px] text-red-500 font-bold uppercase mt-1 block opacity-80 group-hover:opacity-100">
                  Tap to Call 📞
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 8. DOWNLOAD MOBILE APP SECTION */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-gray-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
        <div className="lg:col-span-7 space-y-4">
          <span className="px-3 py-1 bg-amber-400 text-gray-950 text-xs font-extrabold rounded-full uppercase tracking-wider">
            Mobile-First Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Download OoruMitra Android & iOS App
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-body">
            Get instant WhatsApp deal alerts, offline panchayat listing access, voice posting, and GPS distance mapping directly on your smartphone.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button className="bg-white hover:bg-gray-100 text-gray-950 font-bold px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg transition-transform hover:scale-105 active:scale-95 text-xs sm:text-sm">
              <span className="text-2xl">🤖</span>
              <div className="text-left">
                <span className="text-[10px] uppercase block text-gray-500 font-semibold">GET IT ON</span>
                <span className="text-sm font-extrabold">Google Play Store</span>
              </div>
            </button>

            <button className="bg-white hover:bg-gray-100 text-gray-950 font-bold px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg transition-transform hover:scale-105 active:scale-95 text-xs sm:text-sm">
              <span className="text-2xl">🍎</span>
              <div className="text-left">
                <span className="text-[10px] uppercase block text-gray-500 font-semibold">DOWNLOAD ON</span>
                <span className="text-sm font-extrabold">Apple App Store</span>
              </div>
            </button>
          </div>
        </div>

        {/* QR Code graphic */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="glass-panel p-6 border-white/20 text-center space-y-3 bg-white/10 rounded-3xl max-w-xs w-full">
            <div className="w-40 h-40 mx-auto bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://oorumitra.com/download"
                alt="Scan to download OoruMitra Mobile App"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-amber-300 font-bold">Scan QR Code to Download App</p>
            <span className="text-[10px] text-gray-400 block">Compatible with Android 8+ & iOS 14+</span>
          </div>
        </div>
      </section>

      {/* 9. REDESIGNED VILLAGE FOOTER */}
      <footer className="bg-white rounded-3xl border border-emerald-950/5 p-8 shadow-sm space-y-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <img src="/Ooru_mitra_logo_2.png" alt="OoruMitra" className="h-10 w-auto" />
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              Digital Village Ecosystem connecting villagers, farmers, workers, and local businesses with zero brokerage.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3">Marketplace Modules</h4>
            <ul className="space-y-2 text-xs text-gray-600 font-medium">
              <li><Link to="/products" className="hover:text-[#2E7D32]">Agricultural Crops & Seeds</Link></li>
              <li><Link to="/workers" className="hover:text-[#2E7D32]">Hire Local Workers</Link></li>
              <li><Link to="/transport" className="hover:text-[#2E7D32]">Transport & Mini Trucks</Link></li>
              <li><Link to="/vehicle-work" className="hover:text-[#2E7D32]">Tractor & JCB Work</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-3">Panchayat & Govt</h4>
            <ul className="space-y-2 text-xs text-gray-600 font-medium">
              <li><Link to="/emergency" className="hover:text-[#2E7D32]">Emergency Hotlines</Link></li>
              <li><span className="text-gray-400 cursor-not-allowed">PM-KISAN Scheme Portal</span></li>
              <li><span className="text-gray-400 cursor-not-allowed">Gram Sabha Notice Board</span></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-sm mb-3">Contact Support</h4>
            <p className="text-xs text-gray-600 font-medium">📍 Gram Panchayat Technology Hub</p>
            <p className="text-xs text-gray-600 font-medium">📞 Helpline: 1800-OORU-MITRA</p>
            <p className="text-xs text-gray-600 font-medium">📧 Email: support@oorumitra.org</p>
          </div>

        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-medium gap-3">
          <span>© 2026 OoruMitra Platform. Empowering Rural India.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#2E7D32] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#2E7D32] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#2E7D32] cursor-pointer">Digital India Initiative</span>
          </div>
        </div>
      </footer>

      {/* Feature Info Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-100 shadow-2xl relative text-left">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{POPULAR_CATEGORIES.find(c => c.modalKey === activeModal)?.icon}</span>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight font-heading">{MODAL_INFO[activeModal]?.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm font-medium">{MODAL_INFO[activeModal]?.desc}</p>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)} 
                className="btn-primary text-xs font-bold py-2.5 px-6 uppercase tracking-wider"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
