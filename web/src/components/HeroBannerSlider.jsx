import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SIMPLE_VILLAGE_BANNERS = [
  {
    id: 'banner-1-market',
    badge: '🌾 VILLAGE MARKETPLACE',
    title: 'Buy & Sell in Your Village',
    subtitle: 'Direct village mandi to buy crops, seeds, livestock, tools & groceries with 0% brokerage.',
    primaryCtaText: 'Browse Listings',
    primaryCtaLink: '/products',
    secondaryCtaText: 'Post Listing',
    secondaryCtaLink: '/sell',
    bgGradient: 'from-[#0d2a14] via-[#2E7D32] to-[#081b0d]',
    imageSrc: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80',
    sceneTag: '🌾 Village Mandi • Direct Buy & Sell',
  },
  {
    id: 'banner-2-services',
    badge: '🔧 LOCAL SERVICES & WORKERS',
    title: 'Find Local Workers & Services',
    subtitle: 'Book trusted electricians, plumbers, carpenters, tractor drivers & mechanics near your home.',
    primaryCtaText: 'Find Workers',
    primaryCtaLink: '/workers',
    secondaryCtaText: 'Offer Services',
    secondaryCtaLink: '/sell',
    bgGradient: 'from-[#092244] via-[#1565C0] to-[#05142a]',
    imageSrc: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80',
    sceneTag: '🛠️ Verified Local Workers • 1-Click Call',
  },
  {
    id: 'banner-3-agriculture',
    badge: '🚜 FARMING & JOBS',
    title: 'Jobs & Opportunities Near You',
    subtitle: 'Hire farm harvesting labor, book tractor ploughing & find daily wage work in your Panchayat.',
    primaryCtaText: 'Explore Agriculture',
    primaryCtaLink: '/products',
    secondaryCtaText: 'Book Tractor',
    secondaryCtaLink: '/vehicle-work',
    bgGradient: 'from-[#332402] via-[#8c6000] to-[#1c1301]',
    imageSrc: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=80',
    sceneTag: '🚜 Tractor Work & Harvest Jobs',
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
      setCurrentSlide((prev) => (prev + 1) % SIMPLE_VILLAGE_BANNERS.length)
    }, 5000)

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current)
    }
  }, [isPaused])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SIMPLE_VILLAGE_BANNERS.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SIMPLE_VILLAGE_BANNERS.length) % SIMPLE_VILLAGE_BANNERS.length)

  const slide = SIMPLE_VILLAGE_BANNERS[currentSlide]

  return (
    <div className="w-full max-w-6xl mx-auto px-1 sm:px-2">
      {/* Compact Banner: Desktop Height 350px, Mobile Height 220px */}
      <div
        className="relative w-full rounded-3xl overflow-hidden shadow-md border-2 border-emerald-800/30 bg-gray-900 h-[220px] sm:h-[290px] lg:h-[350px] flex items-center transition-all"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Simple Background Gradients */}
        {SIMPLE_VILLAGE_BANNERS.map((s, idx) => {
          const isActive = idx === currentSlide
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in bg-gradient-to-r ${s.bgGradient} ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            />
          )
        })}

        {/* Banner Content Grid */}
        <div className="relative z-20 w-full h-full px-4 sm:px-8 lg:px-10 py-3 sm:py-5 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* Left Column: Simple Large Text & Big CTAs */}
          <div className="lg:col-span-6 space-y-2 sm:space-y-3 text-left flex flex-col justify-center">
            
            {/* Category Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-gray-950 text-xs font-black tracking-wider uppercase self-start shadow-xs">
              <span>{slide.badge}</span>
            </div>

            {/* Title (22px+) */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight drop-shadow-sm font-heading line-clamp-2">
              {slide.title}
            </h1>

            {/* Subtitle (16px readable) */}
            <p className="text-gray-100 text-xs sm:text-sm lg:text-base font-medium max-w-lg line-clamp-2">
              {slide.subtitle}
            </p>

            {/* Action CTAs: Big 48px Height Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <Link
                to={slide.primaryCtaLink}
                className="bg-[#FFB300] hover:bg-[#e6a100] text-gray-950 font-extrabold px-5 py-2.5 rounded-2xl shadow-md text-sm sm:text-base border-2 border-amber-300 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <span>{slide.primaryCtaText}</span>
                <span>→</span>
              </Link>

              {slide.secondaryCtaText && (
                <Link
                  to={slide.secondaryCtaLink}
                  className="bg-white hover:bg-gray-100 text-[#2E7D32] font-bold px-5 py-2.5 rounded-2xl shadow-sm text-sm sm:text-base border-2 border-white hidden sm:inline-flex active:scale-95 transition-all"
                >
                  {slide.secondaryCtaText}
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Village Scene Visual (Desktop Only) */}
          <div className="lg:col-span-6 hidden lg:flex justify-end items-center h-full">
            <div className="relative w-full max-w-md h-[280px] rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg">
              <img
                src={slide.imageSrc}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="bg-black/80 text-amber-300 font-bold px-3 py-1 rounded-xl text-xs border border-white/20">
                  {slide.sceneTag}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Simple Slide Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 flex items-center justify-center text-xl font-black transition-all"
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 flex items-center justify-center text-xl font-black transition-all"
        >
          ›
        </button>

        {/* 3 Simple Dot Indicators */}
        <div className="absolute bottom-2.5 inset-x-0 z-30 flex items-center justify-center gap-2">
          {SIMPLE_VILLAGE_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to banner ${idx + 1}`}
              className={`h-3 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-[#FFB300]' : 'w-3 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
