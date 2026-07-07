import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY

function LocationBadge() {
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!navigator.geolocation) return
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}&result_type=locality|sublocality|neighborhood|administrative_area_level_3`
          )
          const data = await res.json()
          const name = data.results?.[0]?.address_components?.find(c =>
            c.types.some(t => ['locality','sublocality','sublocality_level_1','neighborhood','administrative_area_level_3'].includes(t))
          )?.long_name || data.results?.[0]?.formatted_address?.split(',')[0]
          setLocation(name || 'Location found')
          setStatus('done')
        } catch {
          setLocation(`${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`)
          setStatus('done')
        }
      },
      () => setStatus('denied'),
      { timeout: 8000 }
    )
  }, [])

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex items-center gap-1.5 text-white/80 text-xs mt-1.5">
        <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span>Detecting location…</span>
      </div>
    )
  }
  if (status === 'denied') {
    return (
      <div className="flex items-center gap-1.5 text-white/60 text-xs mt-1.5">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span>Location disabled</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-white/90 text-xs mt-1.5 drop-shadow">
      <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
      <span>{location}</span>
    </div>
  )
}

export default function CinematicHero({ isLoggedIn, userName, isInsideSlider }) {
  const { t } = useTranslation()
  const [time, setTime] = useState(0)

  // Autoplay loop (runs 20 seconds, syncing CSS keyframes and React triggers)
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => (t + 1) % 20)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Floating cards status timing
  const showCard1 = time >= 2 && time < 7
  const showCard2 = time >= 5 && time < 10
  const showCard3 = time >= 8 && time < 13
  const isLogoPhase = time >= 14 // Fades into OoruMitra logo/tagline from 14s to 20s

  return (
    <div className={isInsideSlider ? "relative w-full h-full overflow-hidden bg-gray-950" : "relative rounded-2xl overflow-hidden mb-8 shadow-2xl bg-gray-950 border border-gray-800"} style={{ height: '420px' }}>
      {/* 1. Backdrop Drone Moving Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: "url('/oorumitra_village_3d.png')",
          transform: isLogoPhase ? 'scale(1.15) translate3d(0, 0, 0)' : 'scale(1.08) translate3d(5px, 3px, 0)',
          filter: isLogoPhase ? 'blur(10px) brightness(0.2)' : 'blur(0px) brightness(1.0)',
          transition: 'transform 6s ease-out, filter 1.2s ease-out'
        }}
      />

      {/* 2. Light Rays / Volumetric Fog */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-amber-200/10 to-transparent mix-blend-color-dodge cinematic-rays" />

      {/* 3. Birds Moving Layer */}
      {!isLogoPhase && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 1440 480">
          <g className="cinematic-birds">
            <path d="M 0 0 Q 12 -8 24 0" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 32 -8 Q 44 -16 56 -8" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      )}

      {/* 4. Tractor Driving */}
      {!isLogoPhase && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 480">
            <g className="cinematic-tractor">
              <rect x="15" y="10" width="30" height="20" fill="#E53935" rx="3" />
              <rect x="30" y="2" width="12" height="10" fill="#E53935" rx="1" />
              <circle cx="20" cy="30" r="8" fill="#212121" stroke="#E0E0E0" strokeWidth="1.5" />
              <circle cx="40" cy="30" r="5" fill="#212121" stroke="#E0E0E0" strokeWidth="1.5" />
              <line x1="42" y1="2" x2="42" y2="10" stroke="#424242" strokeWidth="2" />
            </g>
          </svg>
        </div>
      )}

      {/* 5. Left Column overlay: Text and CTAs */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-900/40 to-transparent z-10" />

      <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 z-20 max-w-xl">
        <div className="transition-all duration-700" style={{ transform: isLogoPhase ? 'translateY(15px)' : 'translateY(0)' }}>
          {isLogoPhase ? (
            <div className="flex flex-col items-start text-left animate-fadeIn">
              <img src="/Ooru_mitra_logo_2.png" alt="OoruMitra Logo" className="h-16 w-auto drop-shadow-[0_8px_20px_rgba(251,191,36,0.35)]" />
              <div className="h-0.5 w-32 bg-gradient-to-r from-amber-400 to-transparent my-3.5 opacity-80" />
              <p className="text-amber-400 font-extrabold uppercase tracking-widest text-sm sm:text-base animate-pulse">
                {t('home.hero_title', 'Connecting Villages, Empowering Communities')}
              </p>
              <p className="text-gray-300 text-xs mt-2 max-w-sm">
                {t('home.hero_subtitle', 'Connect directly with agricultural buyers, book tractor service, or secure skilled job orders instantly.')}
              </p>
            </div>
          ) : (
            <div className="text-left animate-fadeIn">
              <img src="/Ooru_mitra_logo_2.png" alt="OoruMitra" className="h-12 sm:h-14 w-auto mb-1 drop-shadow-lg" />
              <LocationBadge />
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mt-4 mb-2.5 drop-shadow" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
                {isLoggedIn ? t('home.welcome_back', 'Welcome back, {{name}}!', { name: userName }) : t('home.hero_title', 'Connecting Villages, Empowering Communities')}
              </h1>
              <p className="text-white/90 text-xs sm:text-sm max-w-sm mb-6 drop-shadow leading-relaxed">
                {isLoggedIn 
                  ? t('home.hero_subtitle_logged', 'Manage your products, hire tractor services, and find work opportunities near you.') 
                  : t('home.hero_subtitle', 'Connect directly with agricultural buyers, book tractor service, or secure skilled job orders instantly.')}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Link
                  to={isLoggedIn ? '/sell' : '/register'}
                  className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg text-sm active:scale-95 border border-amber-400"
                >
                  {isLoggedIn ? t('home.post_ad', 'Post a Listing →') : 'Join OoruMitra →'}
                </Link>
                <Link
                  to="/banner"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-all backdrop-blur-sm text-sm border border-white/20 active:scale-95"
                >
                  🎥 {t('home.watch_promo', 'Watch Cinematic Promo')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Right Column: 3D phone and emerging cards */}
      {!isLogoPhase && (
        <div className="absolute inset-y-0 right-0 hidden md:flex items-center justify-center w-[450px] z-10 pointer-events-none">
          {/* Phone Frame */}
          <div className="w-48 h-[320px] bg-gray-900 border-[5px] border-gray-800 rounded-[28px] shadow-2xl relative flex flex-col overflow-hidden cinematic-phone">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-800 rounded-b-lg z-20" />
            
            {/* Phone Screen App mock */}
            <div className="flex-1 bg-gradient-to-b from-green-500/10 via-amber-500/5 to-gray-950 p-2.5 pt-5 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-1 mt-1">
                <img src="/Ooru_mitra_logo_2.png" alt="logo" className="h-5 w-auto" />
                <span className="text-[7px] bg-green-500/20 text-green-400 px-1 py-0.5 rounded-full font-bold">Online</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-1.5 rounded-lg text-left">
                <p className="text-[8px] font-bold text-amber-400">Agricultural Market</p>
                <p className="text-[6px] text-gray-300 mt-0.5">Live rates available for 14 nearby mandi centers.</p>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-0.5">
                {[
                  { title: 'Products', icon: '🌾' },
                  { title: 'Workers', icon: '👷' },
                  { title: 'Transport', icon: '🚛' },
                  { title: 'Tractors', icon: '🚜' },
                ].map((cat, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-1 rounded flex items-center gap-1">
                    <span className="text-xs">{cat.icon}</span>
                    <span className="text-[6px] font-bold text-gray-300">{cat.title}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-1 overflow-hidden mt-1 text-left">
                <p className="text-[6px] text-gray-400 font-bold uppercase">Popular Listings</p>
                <div className="bg-white/5 p-1.5 rounded flex items-center justify-between">
                  <div>
                    <p className="text-[7px] font-bold text-gray-200">Tractor Ploughing</p>
                    <p className="text-[5px] text-gray-400">By Satish Kumar</p>
                  </div>
                  <span className="text-[6px] text-green-400 font-bold">₹800/acre</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emerging Float Cards */}
          {/* Card 1 */}
          <div
            className="absolute w-44 bg-gray-900/85 backdrop-blur-md border border-white/10 p-2.5 rounded-xl shadow-xl flex items-center gap-2 transition-all duration-700"
            style={{
              opacity: showCard1 ? 1 : 0,
              transform: showCard1 ? 'translate3d(-100px, -70px, 40px) scale(1)' : 'translate3d(-70px, -20px, 10px) scale(0.8)',
            }}
          >
            <span className="text-xl">🚜</span>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white leading-tight">Tractor Rental</p>
              <p className="text-[8px] text-amber-400 font-semibold mt-0.5">Book field ploughing</p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="absolute w-44 bg-gray-900/85 backdrop-blur-md border border-white/10 p-2.5 rounded-xl shadow-xl flex items-center gap-2 transition-all duration-700"
            style={{
              opacity: showCard2 ? 1 : 0,
              transform: showCard2 ? 'translate3d(100px, 40px, 40px) scale(1)' : 'translate3d(70px, 80px, 10px) scale(0.8)',
            }}
          >
            <span className="text-xl">👷</span>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white leading-tight">Harvest Workers</p>
              <p className="text-[8px] text-blue-400 font-semibold mt-0.5">14 active bids nearby</p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="absolute w-44 bg-gray-900/85 backdrop-blur-md border border-white/10 p-2.5 rounded-xl shadow-xl flex items-center gap-2 transition-all duration-700"
            style={{
              opacity: showCard3 ? 1 : 0,
              transform: showCard3 ? 'translate3d(-80px, 70px, 40px) scale(1)' : 'translate3d(-50px, 100px, 10px) scale(0.8)',
            }}
          >
            <span className="text-xl">🚛</span>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white leading-tight">Crop Transport</p>
              <p className="text-[8px] text-green-400 font-semibold mt-0.5">Direct driver booking</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. Slide Badge */}
      <div className="absolute top-4 right-4 bg-black/40 text-white/95 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm tracking-wide z-20">
        🌾 {isLogoPhase ? 'OoruMitra Branding' : 'Cinematic Village Scene'}
      </div>
    </div>
  )
}
