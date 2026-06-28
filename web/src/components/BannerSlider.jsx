import { useEffect, useRef, useState } from 'react'

export default function BannerSlider({ slides, intervalMs = 5000 }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState('next')
  const timerRef = useRef(null)

  const goTo = (i, dir = 'next') => {
    setDirection(dir)
    setIndex((i + slides.length) % slides.length)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(index + 1, 'next'), intervalMs)
    return () => clearInterval(timerRef.current)
  }, [index, intervalMs])

  const slide = slides[index]

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-sm">
      <div
        key={index}
        className={`bg-gradient-to-r ${slide.gradient} text-white p-8 sm:p-10 relative overflow-hidden min-h-[220px] flex flex-col justify-center ${
          direction === 'next' ? 'animate-slideInRight' : 'animate-slideInLeft'
        }`}
      >
        <div className="absolute right-4 top-2 text-9xl opacity-15 select-none pointer-events-none">
          {slide.icon}
        </div>
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-2 animate-fadeIn">
            {slide.tag}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 animate-fadeInUp">{slide.title}</h2>
          <p className="text-white/90 text-base mb-5 max-w-md animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            {slide.subtitle}
          </p>
          {slide.cta && (
            <a
              href={slide.ctaTo}
              className="inline-block bg-white text-gray-800 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors animate-fadeInUp"
              style={{ animationDelay: '0.2s' }}
            >
              {slide.cta} →
            </a>
          )}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => goTo(index - 1, 'prev')}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={() => goTo(index + 1, 'next')}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > index ? 'next' : 'prev')}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
