import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { emergencyApi, categoryApi, adApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import CinematicHero from '../components/CinematicHero'

const STATIC_CATEGORIES = [
  { keyName: 'AGRICULTURE', to: '/products', icon: '🌾', label: 'Agriculture', desc: 'Buy & sell farm equipment, seeds, fertilizers & crop yields', color: 'from-emerald-50 to-teal-100/40 border-emerald-200/50 hover:from-emerald-100 hover:to-teal-200 hover:shadow-emerald-500/10 hover:border-emerald-400', iconBg: 'bg-emerald-100 text-emerald-700' },
  { keyName: 'MARKETPLACE', to: '/products', icon: '🏪', label: 'Marketplace', desc: 'Browse and purchase goods, groceries & livestock locally', color: 'from-amber-50 to-orange-100/40 border-amber-200/50 hover:from-amber-100 hover:to-orange-200 hover:shadow-amber-500/10 hover:border-amber-400', iconBg: 'bg-amber-100 text-amber-700' },
  { keyName: 'JOBS', to: '/workers', icon: '👷', label: 'Jobs', desc: 'Hire local workers, farmhands & skilled craftsmen near you', color: 'from-blue-50 to-indigo-100/40 border-blue-200/60 hover:from-blue-100 hover:to-indigo-200 hover:shadow-blue-500/10 hover:border-blue-400', iconBg: 'bg-blue-100 text-blue-700' },
  { keyName: 'SERVICES', to: '/vehicle-work', icon: '🚜', label: 'Services', desc: 'Book tractor ploughing, transport trucks & local vehicles', color: 'from-purple-50 to-fuchsia-100/40 border-purple-200/60 hover:from-purple-100 hover:to-fuchsia-200 hover:shadow-purple-500/10 hover:border-purple-400', iconBg: 'bg-purple-100 text-purple-700' },
  { keyName: 'SCHEMES', to: 'modal', modalKey: 'schemes', icon: '🏛️', label: 'Govt Schemes', desc: 'Check and apply for state & central rural welfare initiatives', color: 'from-orange-50/50 to-yellow-100/30 border-orange-200/50 hover:from-orange-100 hover:to-yellow-200 hover:shadow-orange-500/10 hover:border-orange-400', iconBg: 'bg-orange-100 text-orange-700' },
  { keyName: 'EDUCATION', to: 'modal', modalKey: 'education', icon: '📚', label: 'Education', desc: 'Smart classes, study centers & coaching in the panchayat', color: 'from-cyan-50 to-sky-100/40 border-cyan-200/50 hover:from-cyan-100 hover:to-sky-200 hover:shadow-cyan-500/10 hover:border-cyan-400', iconBg: 'bg-cyan-100 text-cyan-700' },
  { keyName: 'HEALTHCARE', to: 'modal', modalKey: 'healthcare', icon: '🏥', label: 'Healthcare', desc: 'Village clinics, health camps & medicine availability listings', color: 'from-rose-50 to-red-100/40 border-rose-200/50 hover:from-rose-100 hover:to-red-200 hover:shadow-rose-500/10 hover:border-rose-400', iconBg: 'bg-rose-100 text-rose-700' },
  { keyName: 'EVENTS', to: 'modal', modalKey: 'events', icon: '🎉', label: 'Events', desc: 'Temple festivals, agricultural meets & community gatherings', color: 'from-yellow-50 to-amber-100/40 border-yellow-200/50 hover:from-yellow-100 hover:to-amber-200 hover:shadow-yellow-500/10 hover:border-yellow-400', iconBg: 'bg-yellow-100 text-yellow-700' },
  { keyName: 'COMMUNITY', to: 'modal', modalKey: 'community', icon: '🤝', label: 'Community', desc: 'Panchayat announcements, self-help groups & discussions', color: 'from-green-50 to-lime-100/40 border-green-200/50 hover:from-green-100 hover:to-lime-200 hover:shadow-green-500/10 hover:border-green-400', iconBg: 'bg-green-100 text-green-700' },
  { keyName: 'BUSINESSES', to: 'modal', modalKey: 'businesses', icon: '💼', label: 'Local Businesses', desc: 'Discover rural micro-enterprises, shops & local artisans', color: 'from-teal-50 to-emerald-100/40 border-teal-200/50 hover:from-teal-100 hover:to-emerald-200 hover:shadow-teal-500/10 hover:border-teal-400', iconBg: 'bg-teal-100 text-teal-700' },
]

const MODAL_INFO = {
  schemes: { title: 'Govt Schemes 🏛️', desc: 'Direct portal linking and verification for state & central rural welfare schemes (PM-KISAN, local subsidies, housing schemes) is being integrated in collaboration with your local Panchayat office. Launching next month!' },
  education: { title: 'Smart Education 📚', desc: 'Access to digitized textbooks, tutoring schedules, scholarship announcements, and virtual classes for primary and secondary village schools. Coming soon!' },
  healthcare: { title: 'Healthcare Connect 🏥', desc: 'Book telemedicine consultations, find the nearest Primary Health Centre (PHC), view doctors visit timetables, and verify essential medicine stocks at public pharmacies. Launching soon!' },
  events: { title: 'Village Events 🎉', desc: 'A common notice board for temple festivals, agricultural training programs, youth sports events, and local Gram Sabha assemblies. Launching soon!' },
  community: { title: 'Community circles 🤝', desc: 'Connect with local Self-Help Groups (SHGs), register community issues with local representatives, and exchange tools and machinery within your neighborhood. Launching soon!' },
  businesses: { title: 'Local Businesses 💼', desc: 'A dedicated directory for village micro-enterprises, Kirana stores, blacksmiths, carpenters, tailoring shops, and cottage industries. Launching next month!' },
}

export default function Home() {
  const { t } = useTranslation()
  const { user, isLoggedIn } = useAuth()
  const [emergency, setEmergency] = useState([])
  const [categories, setCategories] = useState([])
  const [activeModal, setActiveModal] = useState(null)

  // Advertisement states
  const [banners, setBanners] = useState([])
  const [popups, setPopups] = useState([])
  const [featured, setFeatured] = useState([])
  const [videos, setVideos] = useState([])
  const [activeBannerIndex, setActiveBannerIndex] = useState(0)
  const [showPopupAd, setShowPopupAd] = useState(false)

  useEffect(() => {
    emergencyApi.getServices().then(setEmergency).catch(() => { })

    // Fetch enabled categories dynamically
    categoryApi.getEnabled()
      .then(res => setCategories(res))
      .catch(() => setCategories(STATIC_CATEGORIES))

    // Fetch active advertisements
    adApi.getActive('BANNER').then(res => setBanners(res || [])).catch(() => {})
    adApi.getActive('POPUP').then(res => {
      setPopups(res || [])
      if (res && res.length > 0) {
        setShowPopupAd(true)
      }
    }).catch(() => {})
    adApi.getActive('FEATURED').then(res => setFeatured(res || [])).catch(() => {})
    adApi.getActive('VIDEO').then(res => setVideos(res || [])).catch(() => {})
  }, [])

  // Auto-scroll loop for banner advertisements + Cinematic Hero
  const totalSlides = 1 + banners.length
  useEffect(() => {
    if (totalSlides <= 1) return
    const timer = setInterval(() => {
      setActiveBannerIndex(idx => (idx + 1) % totalSlides)
    }, 8000)
    return () => clearInterval(timer)
  }, [totalSlides])

  const userName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
      {/* Decorative Rural Landscape Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/20 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse duration-10000" />
      <div className="absolute top-80 right-20 w-80 h-80 bg-amber-200/20 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse duration-7000" />
      <div className="absolute bottom-40 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse duration-8000" />

      {/* Hero Banner Component & Banner Slider Advertisement */}
      <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl bg-gray-950 border border-gray-800" style={{ height: '420px' }}>
        
        {/* Slide 0: Cinematic Village 3D Hero */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            activeBannerIndex === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <CinematicHero isLoggedIn={isLoggedIn} userName={userName} isInsideSlider={true} />
        </div>

        {/* Slides 1..N: Banner Advertisements */}
        {banners.map((banner, index) => {
          const slideIndex = index + 1;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-end p-8 text-left ${
                slideIndex === activeBannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {banner.mediaUrl && (
                banner.mediaType === 'VIDEO' ? (
                  <video
                    src={banner.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <img
                    src={banner.mediaUrl}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-85"
                  />
                )
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
              
              <div className="relative z-10 max-w-xl">
                <span className="px-3 py-1 bg-amber-500 text-gray-950 text-[10px] font-black uppercase rounded-lg tracking-wider">Sponsored Update</span>
                <h2 className="text-3xl font-black text-white mt-3 drop-shadow-md">{banner.title}</h2>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed drop-shadow-sm font-semibold">{banner.description}</p>
                {banner.redirectUrl && (
                  <a
                    href={banner.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-extrabold rounded-xl shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all text-xs uppercase tracking-wider"
                  >
                    View Details →
                  </a>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Navigation dots */}
        {totalSlides > 1 && (
          <div className="absolute bottom-6 right-8 z-20 flex gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBannerIndex(i)}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  i === activeBannerIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Concept Header illustrating the backgrounds */}
      <div className="text-left mb-8 max-w-2xl relative">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">{t('home.categories_title', 'Browse Digital Village Categories')}</h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {t('home.categories_subtitle', 'Explore smart village services connecting agriculture, marketplace trading, jobs, and community development.')}
        </p>
      </div>

      {/* Grid of enabled category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-12">
        {categories.map((cat, i) => {
          const isLink = cat.to !== 'modal';
          const Wrapper = isLink ? Link : 'button';
          const wrapperProps = isLink ? { to: cat.to } : { onClick: () => setActiveModal(cat.modalKey) };
          const keyLow = cat.keyName?.toLowerCase();
          return (
            <Wrapper
              key={cat.label}
              {...wrapperProps}
              className={`group text-left bg-gradient-to-br border p-5 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-lg hover:-translate-y-1.5 active:scale-98 transition-all duration-300 animate-fadeInUp ${cat.color}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 animate-float-icon ${cat.iconBg}`} style={{ animationDelay: `${i * 0.2}s` }}>
                {cat.icon}
              </div>
              <div>
                <p className="font-extrabold text-gray-800 text-base tracking-tight group-hover:text-primary-800 transition-colors">
                  {t(`category.${keyLow}.label`, cat.label)}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3 font-semibold">
                  {t(`category.${keyLow}.desc`, cat.desc || cat.description)}
                </p>
              </div>
              <span className="text-primary-600 text-xs font-black mt-auto flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                {isLink ? t('home.enter_module', 'Enter Module') : t('home.explore', 'Explore')} <span className="text-sm">→</span>
              </span>
            </Wrapper>
          );
        })}
      </div>

      {/* Featured Sponsored Spotlight Row */}
      {featured.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-6">⭐ Village Spotlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(item => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left">
                {item.mediaUrl && (
                  <div className="rounded-2xl overflow-hidden mb-4 border border-gray-50 h-44">
                    <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-gray-800 text-base">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3 font-semibold">{item.description}</p>
                </div>
                {item.redirectUrl && (
                  <a href={item.redirectUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1 text-primary-600 font-extrabold text-xs uppercase tracking-wider hover:underline">
                    Learn More <span className="text-sm">→</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Row Section */}
      {videos.length > 0 && (
        <div className="mb-12 bg-emerald-50/50 border border-emerald-100/50 rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-6">📺 Dynamic Announcements & Video features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map(vid => (
              <div key={vid.id} className="space-y-4 text-left">
                {vid.mediaUrl && (
                  <div className="rounded-2xl overflow-hidden shadow-md bg-black aspect-video border border-gray-200">
                    <video src={vid.mediaUrl} controls className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-gray-800 text-base">{vid.title}</h4>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-semibold">{vid.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Services */}
      {emergency.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">🆘 {t('home.emergency_title', 'Emergency Services')}</h2>
            <Link to="/emergency" className="text-sm text-primary-600 hover:underline font-bold">{t('home.emergency_view_all', 'View all services')}</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {emergency.map((svc) => (
              <a
                key={svc.id}
                href={`tel:${svc.number}`}
                className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200/70 border border-red-200/60 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500" />
                
                <p className="font-extrabold text-gray-800 text-sm tracking-tight">{svc.name}</p>
                <p className="text-red-600 font-black text-2xl mt-2 tracking-tight group-hover:scale-105 transition-transform duration-300">{svc.number}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{svc.description}</p>
                
                <div className="mt-3 text-[10px] font-extrabold text-red-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {t('home.tap_to_call', 'Call Now 📞')}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 mt-12 shadow-xl border border-gray-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-primary-500/10 rounded-full filter blur-xl" />
        <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full filter blur-xl" />
        
        <div className="text-left md:max-w-xs z-10">
          <h4 className="text-white font-extrabold text-xl tracking-tight">{t('home.impact_title', 'OoruMitra Impact')}</h4>
          <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{t('home.impact_desc', 'Driving economic growth, local jobs, and digital empowerment across rural communities.')}</p>
        </div>
        
        <div className="flex-1 w-full grid grid-cols-3 gap-4 z-10">
          {[
            { label: 'Villages Connected', value: '500+', key: 'home.villages', color: 'text-green-400' },
            { label: 'Active Listings', value: '2,000+', key: 'home.listings', color: 'text-amber-400' },
            { label: 'Happy Users', value: '10,000+', key: 'home.active_users', color: 'text-sky-400' },
          ].map((s, i) => (
            <div
              key={s.label}
              className="text-center bg-white/5 border border-white/5 p-5 rounded-2xl backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10 hover:border-white/10"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <p className={`text-2xl sm:text-3xl font-black tracking-tight ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">{t(s.key, s.label)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Popup Announcement Modal */}
      {showPopupAd && popups.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-100 shadow-2xl relative text-left animate-scaleUp">
            <button 
              onClick={() => setShowPopupAd(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ×
            </button>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-lg tracking-wider">Spotlight Announcement</span>
            <h3 className="text-xl font-black text-gray-900 tracking-tight mt-3">{popups[0].title}</h3>
            {popups[0].mediaUrl && (
              <div className="mt-4 rounded-2xl overflow-hidden shadow-inner border border-gray-100 max-h-56 flex items-center justify-center bg-gray-50">
                {popups[0].mediaType === 'VIDEO' ? (
                  <video src={popups[0].mediaUrl} controls className="w-full max-h-56 object-cover" />
                ) : (
                  <img src={popups[0].mediaUrl} alt={popups[0].title} className="w-full max-h-56 object-cover" />
                )}
              </div>
            )}
            <p className="text-gray-600 leading-relaxed text-sm font-semibold mt-4">{popups[0].description}</p>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowPopupAd(false)} 
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold rounded-xl text-xs uppercase"
              >
                Dismiss
              </button>
              {popups[0].redirectUrl && (
                <a 
                  href={popups[0].redirectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-extrabold rounded-xl shadow-md text-xs uppercase tracking-wider text-center"
                >
                  Visit Info
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* High Fidelity Feature Info Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-100 shadow-2xl relative text-left animate-scaleUp">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ×
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{(categories.length > 0 ? categories : STATIC_CATEGORIES).find(c => c.modalKey === activeModal)?.icon}</span>
              <h3 className="text-xl font-black text-gray-800 tracking-tight">{MODAL_INFO[activeModal]?.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm font-semibold">{MODAL_INFO[activeModal]?.desc}</p>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)} 
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 text-sm uppercase tracking-wider"
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
