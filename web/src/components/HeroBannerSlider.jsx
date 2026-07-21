import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const COMPACT_HERO_SLIDES = [
  {
    id: 'concept-1-market',
    badge: '🌾 VILLAGE MARKETPLACE',
    title: 'OoruMitra – Buy & Sell in Your Village',
    subtitle: 'Connect directly with local farmers, shop owners & buyers with 0% brokerage in your Panchayat.',
    primaryCtaText: 'Browse Listings',
    primaryCtaLink: '/products',
    secondaryCtaText: 'Post Listing',
    secondaryCtaLink: '/sell',
    bgGradient: 'from-[#0b2612] via-[#1c4d1e] to-[#081a0c]',
    sceneType: 'MARKETPLACE',
    imageSrc: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80',
    sceneTag: '🌾 Panchayat Mandi • Live Trading',
  },
  {
    id: 'concept-2-services',
    badge: '🛠️ LOCAL SERVICES',
    title: 'Find Trusted Services Near You',
    subtitle: 'Verified local electricians, plumbers, carpenters & mechanics ready at your doorstep.',
    primaryCtaText: 'Find Workers',
    primaryCtaLink: '/workers',
    secondaryCtaText: 'Offer Services',
    secondaryCtaLink: '/sell',
    bgGradient: 'from-[#091e3a] via-[#1565C0] to-[#061224]',
    sceneType: 'SERVICES',
    imageSrc: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80',
    sceneTag: '⚡ Verified Technicians • Rapid Visit',
  },
  {
    id: 'concept-3-agriculture',
    badge: '🚜 FARMING & HARVEST',
    title: 'Supporting Farmers & Agriculture',
    subtitle: 'Book tractors, harvesters, seeds, organic fertilizers & canal irrigation support in your village.',
    primaryCtaText: 'Explore Agriculture',
    primaryCtaLink: '/products',
    secondaryCtaText: 'Book Machinery',
    secondaryCtaLink: '/vehicle-work',
    bgGradient: 'from-[#072414] via-[#2E7D32] to-[#04160c]',
    sceneType: 'AGRICULTURE',
    imageSrc: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=80',
    sceneTag: '🚜 Green Farmland • Crop Logistics',
  },
  {
    id: 'concept-4-community',
    badge: '🎉 COMMUNITY & CIRCLES',
    title: 'Connecting Villages & Communities',
    subtitle: 'Gram Sabha notice board, temple festival updates, self-help groups & village gatherings.',
    primaryCtaText: 'Join OoruMitra',
    primaryCtaLink: '/register',
    secondaryCtaText: 'Gram Sabha Notices',
    secondaryCtaLink: '/emergency',
    bgGradient: 'from-[#240c1d] via-[#5c1c49] to-[#140610]',
    sceneType: 'COMMUNITY',
    imageSrc: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=700&q=80',
    sceneTag: '🤝 Gram Sabha • Community Circle',
  },
]

export default function HeroBannerSlider() {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slideTimerRef = useRef(null)

  // 5-second auto rotation
  useEffect(() => {
    if (isPaused) return
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % COMPACT_HERO_SLIDES.length)
    }, 5000)

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current)
    }
  }, [isPaused])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % COMPACT_HERO_SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + COMPACT_HERO_SLIDES.length) % COMPACT_HERO_SLIDES.length)

  const slide = COMPACT_HERO_SLIDES[currentSlide]

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
      {/* Compact Banner Container: Height 380px-420px on Desktop, 320px on Tablet, 240px on Mobile */}
      <div
        className="relative w-full rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-emerald-900/20 group bg-gray-950 h-[240px] sm:h-[320px] lg:h-[400px] flex items-center transition-all duration-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Dynamic Background Gradients & Ambient Flares */}
        {COMPACT_HERO_SLIDES.map((s, idx) => {
          const isActive = idx === currentSlide
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-all duration-700 ease-out bg-gradient-to-br ${s.bgGradient} ${
                isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            >
              {/* Atmospheric Sunlight Flares & Floating Micro-elements */}
              <div className="absolute -top-24 right-1/3 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
              <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
              
              {/* Subtle Depth Grid */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
              />

              {/* Floating Birds & Leaves SVG Animation */}
              <div className="absolute top-4 right-1/4 opacity-40 pointer-events-none animate-pulse">
                <svg className="w-8 h-8 text-amber-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.5 6.5s-2.5.5-4 2.5c-1.5-2-4-2.5-4-2.5s-2.5.5-4 2.5c-1.5-2-4-2.5-4-2.5C2 7.5 1 9.5 1 9.5s3.5-.5 5 1.5c1.5-2 4-1.5 4-1.5s2.5.5 4 2.5c1.5-2 4-2.5 4-2.5s2.5.5 4 2.5c1.5-2 4-2.5 4-2.5z" />
                </svg>
              </div>
            </div>
          )
        })}

        {/* 40% / 60% Split Ratio Layout Grid */}
        <div className="relative z-20 w-full h-full px-5 sm:px-8 lg:px-12 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">
          
          {/* Left Side: 40% Ratio Content (Desktop 5 cols, Mobile full) */}
          <div className="lg:col-span-5 space-y-2 sm:space-y-3 text-left flex flex-col justify-center">
            
            {/* Category Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-inner self-start animate-fadeIn">
              <span>{slide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-md font-heading animate-fadeZoom line-clamp-2">
              {slide.title}
            </h1>

            {/* Subheading */}
            <p className="text-gray-200 text-[11px] sm:text-xs lg:text-sm leading-relaxed font-body drop-shadow line-clamp-2">
              {slide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-2 pt-1 sm:pt-2">
              <Link
                to={slide.primaryCtaLink}
                className="bg-[#FFB300] hover:bg-[#e6a100] text-gray-950 font-extrabold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md hover:shadow-amber-500/30 hover:scale-105 active:scale-95 text-xs border border-amber-300 flex items-center gap-1.5"
              >
                <span>{slide.primaryCtaText}</span>
                <span className="text-xs">→</span>
              </Link>

              {slide.secondaryCtaText && (
                <Link
                  to={slide.secondaryCtaLink}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl backdrop-blur-md border border-white/25 transition-all hover:scale-105 active:scale-95 text-xs hidden sm:inline-flex"
                >
                  {slide.secondaryCtaText}
                </Link>
              )}
            </div>
          </div>

          {/* Right Side: 60% Ratio 3D Visual Scene (Desktop 7 cols) */}
          <div className="lg:col-span-7 hidden lg:flex justify-end items-center h-full">
            <div className="relative w-full max-w-lg h-[310px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl group/scene transform transition-transform duration-500 hover:scale-[1.02]">
              
              {/* Scene Image with Pixar/Unreal Quality Atmosphere */}
              <img
                src={slide.imageSrc}
                alt={slide.title}
                className="w-full h-full object-cover transform group-hover/scene:scale-105 transition-transform duration-700"
              />

              {/* Glassmorphism Scene Overlay & Live Tag */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent flex flex-col justify-between p-4 text-left">
                <span className="self-end px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-amber-300 rounded-full text-[10px] font-extrabold shadow-sm">
                  {slide.sceneTag}
                </span>

                <div className="bg-gray-900/80 backdrop-blur-md p-3 rounded-xl border border-white/15 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-bold">Smart Digital Village Platform</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-extrabold uppercase">0% Brokerage</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous Banner"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 text-lg font-bold"
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Banner"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 text-lg font-bold"
        >
          ›
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-1.5">
          {COMPACT_HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-7 bg-[#FFB300]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
