import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function PromotionalBanner() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0) // 0 to 20 seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1) // 1x, 0.5x, 2x
  const [quality, setQuality] = useState('1080p')
  const [showMetadata, setShowMetadata] = useState(true)
  const containerRef = useRef(null)

  const duration = 20 // seconds
  const fps = 60
  const totalFrames = duration * fps

  // Handle animation timer loop
  useEffect(() => {
    if (!isPlaying) return

    const intervalTime = 1000 / (fps * playbackSpeed)
    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + (1 / fps)
        if (next >= duration) {
          return 0 // Loop animation
        }
        return next
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [isPlaying, playbackSpeed])

  const handleSeek = (e) => {
    setCurrentTime(parseFloat(e.target.value))
  }

  // Format time to 00:00:00 format
  const formatTimecode = (time) => {
    const totalFramesCount = Math.floor(time * fps)
    const secs = Math.floor(time)
    const frames = totalFramesCount % fps
    const pad = (num, size = 2) => ('00' + num).slice(-size)
    return `00:00:${pad(secs)}:${pad(frames)}`
  }

  // Calculate current animation percentages for manual keyframing
  const progressPercent = (currentTime / duration) * 100

  // 3D Drone Camera properties mapping based on time
  const getCameraStyle = () => {
    if (currentTime >= 13) {
      // Transition to Logo Zoom Out Phase
      const logoPhaseProgress = (currentTime - 13) / 7 // 0 to 1
      const zoom = 1 + logoPhaseProgress * 0.15
      const blur = logoPhaseProgress * 8
      const brightness = 1 - logoPhaseProgress * 0.7
      return {
        transform: `scale(${zoom}) translate3d(0, 0, 0) rotate(0deg)`,
        filter: `blur(${blur}px) brightness(${brightness})`,
        transition: 'filter 0.3s ease-out'
      }
    } else {
      // Village Drone flythrough phase
      const p = currentTime / 13
      const scale = 1.18 - p * 0.12
      const x = -30 + p * 40
      const y = -15 + p * 20
      const rotate = 0.8 - p * 1.1
      return {
        transform: `scale(${scale}) translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`,
      }
    }
  }

  // Tractor movement mapping
  const getTractorStyle = () => {
    const startX = 1200
    const endX = 300
    if (currentTime < 10) {
      const p = currentTime / 10
      const x = startX - p * (startX - endX)
      return {
        transform: `translate3d(${x}px, 345px, 0) scale(0.6) scaleX(-1)`,
        opacity: 0.95
      }
    } else if (currentTime < 13) {
      const p = (currentTime - 10) / 3
      const x = endX + p * (1300 - endX)
      return {
        transform: `translate3d(${x}px, 345px, 0) scale(0.6) scaleX(1)`,
        opacity: 0.95
      }
    }
    return { display: 'none' } // Faded out in logo phase
  }

  // Floating UI elements controls
  const getUiCardStyle = (cardNum) => {
    // Card 1 appears at 2s, vanishes at 7s
    if (cardNum === 1) {
      if (currentTime >= 1.5 && currentTime < 7) {
        const age = currentTime - 1.5
        let opacity = 1
        let yOffset = -age * 8
        let scale = 1
        if (age < 0.8) {
          opacity = age / 0.8
          scale = 0.8 + (age / 0.8) * 0.2
        } else if (7 - currentTime < 0.8) {
          opacity = (7 - currentTime) / 0.8
          scale = 1 - (1 - (7 - currentTime) / 0.8) * 0.1
        }
        return { opacity, transform: `translate3d(-80px, ${yOffset}px, 50px) scale(${scale})`, transition: 'opacity 0.2s, transform 0.1s' }
      }
    }
    // Card 2 appears at 4.5s, vanishes at 9.5s
    if (cardNum === 2) {
      if (currentTime >= 4 && currentTime < 9.5) {
        const age = currentTime - 4
        let opacity = 1
        let yOffset = -age * 8
        let scale = 1
        if (age < 0.8) {
          opacity = age / 0.8
          scale = 0.8 + (age / 0.8) * 0.2
        } else if (9.5 - currentTime < 0.8) {
          opacity = (9.5 - currentTime) / 0.8
          scale = 1 - (1 - (9.5 - currentTime) / 0.8) * 0.1
        }
        return { opacity, transform: `translate3d(80px, ${yOffset}px, 50px) scale(${scale})`, transition: 'opacity 0.2s, transform 0.1s' }
      }
    }
    // Card 3 appears at 7.5s, vanishes at 12.5s
    if (cardNum === 3) {
      if (currentTime >= 7 && currentTime < 12.5) {
        const age = currentTime - 7
        let opacity = 1
        let yOffset = -age * 8 - 40
        let scale = 1
        if (age < 0.8) {
          opacity = age / 0.8
          scale = 0.8 + (age / 0.8) * 0.2
        } else if (12.5 - currentTime < 0.8) {
          opacity = (12.5 - currentTime) / 0.8
          scale = 1 - (1 - (12.5 - currentTime) / 0.8) * 0.1
        }
        return { opacity, transform: `translate3d(0px, ${yOffset}px, 50px) scale(${scale})`, transition: 'opacity 0.2s, transform 0.1s' }
      }
    }
    return { opacity: 0, transform: 'translate3d(0, 100px, 0) scale(0.8)', pointerEvents: 'none' }
  }

  // 3D Phone placement style
  const getPhoneStyle = () => {
    if (currentTime >= 1 && currentTime < 13) {
      const age = currentTime - 1
      let opacity = 1
      let zAngle = 0
      let yAngle = -15
      let xTranslate = 260
      if (age < 1) {
        opacity = age / 1
        xTranslate = 400 - (age / 1) * 140
        yAngle = -35 + (age / 1) * 20
      } else if (13 - currentTime < 1) {
        const outProgress = 1 - (13 - currentTime)
        opacity = 1 - outProgress
        xTranslate = 260 + outProgress * 140
        yAngle = -15 - outProgress * 20
      }
      return {
        opacity,
        transform: `translate3d(${xTranslate}px, 10px, 100px) rotateY(${yAngle}deg) rotateX(10deg) rotateZ(${zAngle}deg)`,
        transition: 'transform 0.1s, opacity 0.2s'
      }
    }
    return { opacity: 0, transform: 'translate3d(400px, 10px, 100px) rotateY(-35deg)', pointerEvents: 'none' }
  }

  // Logo sequence triggers after 13s
  const getLogoContainerStyle = () => {
    if (currentTime >= 13) {
      const elapsed = currentTime - 13
      let opacity = 0
      let scale = 0.5
      let blur = 10
      if (elapsed < 2) {
        opacity = elapsed / 2
        scale = 0.5 + (elapsed / 2) * 0.5
        blur = 10 - (elapsed / 2) * 10
      } else {
        opacity = 1
        scale = 1 + (elapsed - 2) * 0.015 // Slow hover zoom
        blur = 0
      }
      return {
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        display: 'flex'
      }
    }
    return { display: 'none', opacity: 0 }
  }

  const getTaglineStyle = () => {
    if (currentTime >= 14.5) {
      const elapsed = currentTime - 14.5
      const opacity = Math.min(elapsed / 1.5, 1)
      const letterSpacing = `${0.05 + Math.min(elapsed * 0.03, 0.1)}em`
      return {
        opacity,
        letterSpacing,
        textShadow: '0 0 12px rgba(251, 191, 36, 0.4)'
      }
    }
    return { opacity: 0 }
  }

  return (
    <div className="bg-gray-955 min-h-screen text-gray-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            <span className="text-xl">←</span>
          </Link>
          <div>
            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest">
              Promo Cinema
            </span>
            <h1 className="text-lg font-bold text-white tracking-wide mt-0.5">OoruMitra - Interactive 3D Cinematic Banner</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              showMetadata
                ? 'bg-amber-500 text-gray-900 border-amber-500 hover:bg-amber-600'
                : 'bg-transparent text-gray-300 border-gray-700 hover:bg-gray-800'
            }`}
          >
            {showMetadata ? 'Hide Specs' : 'Show Specs'}
          </button>
          <a
            href="/oorumitra_village_3d.png"
            download="oorumitra_banner_still.png"
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            Download Render Still
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Left Column: Player & Controls */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {/* Cinema Frame (16:9 Aspect Ratio) */}
          <div
            ref={containerRef}
            className="w-full aspect-video bg-black rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden group select-none"
            style={{ maxWidth: '100%' }}
          >
            {/* 1. Backdrop Drone Layer */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
              style={{
                backgroundImage: "url('/oorumitra_village_3d.png')",
                ...getCameraStyle()
              }}
            />

            {/* 2. Light Rays / Volumetric Fog */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-amber-200/10 to-transparent mix-blend-color-dodge cinematic-rays" />

            {/* 3. Birds Moving Layer */}
            {currentTime < 13 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 1440 1080">
                <g style={{ transform: `translate3d(${(currentTime * 90) - 100}px, ${200 - (currentTime * 10)}px, 0) scale(${0.4 + (currentTime * 0.02)})` }}>
                  <path d="M 0 0 Q 15 -10 30 0" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 40 -10 Q 55 -20 70 -10" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </g>
                <g style={{ transform: `translate3d(${(currentTime * 110) - 150}px, ${280 - (currentTime * 15)}px, 0) scale(${0.3 + (currentTime * 0.01)})` }}>
                  <path d="M 0 0 Q 15 -10 30 0" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 38 -8 Q 50 -18 62 -8" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" />
                </g>
              </svg>
            )}

            {/* 4. Tractor Drive Layer */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1440 480">
                <g style={getTractorStyle()}>
                  {/* Tractor Body SVG Representation */}
                  <rect x="15" y="10" width="30" height="20" fill="#E53935" rx="3" />
                  <rect x="30" y="2" width="12" height="10" fill="#E53935" rx="1" />
                  <circle cx="20" cy="30" r="8" fill="#212121" stroke="#E0E0E0" strokeWidth="1.5" />
                  <circle cx="40" cy="30" r="5" fill="#212121" stroke="#E0E0E0" strokeWidth="1.5" />
                  <line x1="42" y1="2" x2="42" y2="10" stroke="#424242" strokeWidth="2" />
                  <rect x="23" y="14" width="8" height="6" fill="#1e88e5" opacity="0.8" />
                </g>
              </svg>
            </div>

            {/* 5. 3D Smartphone and Floating Cards Layer */}
            {currentTime < 13 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* 3D SmartPhone Frame */}
                <div
                  className="w-56 h-[380px] bg-gray-900 border-[6px] border-gray-800 rounded-[36px] shadow-2xl relative flex flex-col overflow-hidden"
                  style={getPhoneStyle()}
                >
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-800 rounded-b-xl z-20" />
                  
                  {/* App Dashboard UI Screen */}
                  <div className="flex-1 bg-gradient-to-b from-green-500/10 via-amber-500/5 to-gray-950 p-3 pt-6 flex flex-col gap-2.5">
                    {/* Header Logo */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mt-1">
                      <img src="/Ooru_mitra_logo_2.png" alt="logo" className="h-6 w-auto" />
                      <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-bold">Online</span>
                    </div>

                    {/* Banner Card inside Phone */}
                    <div className="bg-white/5 border border-white/10 p-2 rounded-xl text-left">
                      <p className="text-[10px] font-bold text-amber-400">PM-KISAN Update</p>
                      <p className="text-[8px] text-gray-300 leading-tight mt-0.5">17th installment scheme benefits disbursed directly.</p>
                    </div>

                    {/* Small category grid */}
                    <div className="grid grid-cols-2 gap-1.5 mt-1">
                      {[
                        { title: 'Products', icon: '🛒', color: 'bg-green-500/10' },
                        { title: 'Workers', icon: '👷', color: 'bg-blue-500/10' },
                        { title: 'Transport', icon: '🚛', color: 'bg-amber-500/10' },
                        { title: 'Tractors', icon: '🚜', color: 'bg-purple-500/10' },
                      ].map((cat) => (
                        <div key={cat.title} className={`${cat.color} border border-white/5 p-1.5 rounded-lg flex flex-col items-center justify-center`}>
                          <span className="text-xs">{cat.icon}</span>
                          <span className="text-[7px] font-semibold text-gray-300 mt-0.5">{cat.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* Active listings list inside phone */}
                    <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Nearby Workers</p>
                      {[
                        { name: 'Ramesh K. (Harvester)', dist: '1.2 km' },
                        { name: 'Srinivas L. (Plumber)', dist: '2.5 km' },
                      ].map((w, i) => (
                        <div key={i} className="bg-white/5 p-1.5 rounded-lg flex items-center justify-between text-left">
                          <div>
                            <p className="text-[8px] font-bold text-gray-200">{w.name}</p>
                            <p className="text-[6px] text-gray-400">Rating: ★ 4.9</p>
                          </div>
                          <span className="text-[7px] text-green-400 font-bold">{w.dist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating UI Glassmorphic Cards emerging from the phone */}
                {/* Floating Card 1: Harvest & Tractor */}
                <div
                  className="absolute w-52 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl flex items-center gap-3"
                  style={getUiCardStyle(1)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg text-lg text-white font-bold">
                    🚜
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Tractor Ploughing</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">Book by the acre</p>
                    <p className="text-[10px] text-amber-400 font-bold mt-1">₹800/acre</p>
                  </div>
                </div>

                {/* Floating Card 2: Local Labor */}
                <div
                  className="absolute w-52 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl flex items-center gap-3"
                  style={getUiCardStyle(2)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg text-lg text-white font-bold">
                    👷
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Agricultural Labor</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">Verified local workers</p>
                    <p className="text-[10px] text-blue-400 font-bold mt-1">10 categories nearby</p>
                  </div>
                </div>

                {/* Floating Card 3: Goods Transport */}
                <div
                  className="absolute w-52 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl flex items-center gap-3"
                  style={getUiCardStyle(3)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg text-lg text-white font-bold">
                    🚛
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Goods Transport</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">Book by km, skip brokers</p>
                    <p className="text-[10px] text-green-400 font-bold mt-1">Direct Driver Contact</p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. FADING TRANSITION OVERLAY */}
            {currentTime >= 12.8 && currentTime < 13.5 && (
              <div
                className="absolute inset-0 bg-gray-950 pointer-events-none"
                style={{
                  opacity: (currentTime - 12.8) / 0.7,
                  transition: 'opacity 0.1s linear'
                }}
              />
            )}

            {/* 7. FINAL FRAME: LOGO & TAGLINE ZOOM */}
            {currentTime >= 13 && (
              <div className="absolute inset-0 bg-gray-950 flex flex-col items-center justify-center">
                {/* Cinematic Ambient Background Rays */}
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-amber-500/5 to-transparent filter blur-3xl opacity-40 pointer-events-none" />
                <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.15),transparent_60%)] filter blur-2xl animate-pulse" />

                {/* Logo and Tagline Container */}
                <div className="flex flex-col items-center justify-center z-10" style={getLogoContainerStyle()}>
                  <img
                    src="/Ooru_mitra_logo_2.png"
                    alt="OoruMitra Logo"
                    className="h-28 sm:h-36 w-auto object-contain drop-shadow-[0_10px_35px_rgba(251,191,36,0.3)]"
                  />
                  <div className="h-0.5 w-44 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-6 opacity-60" />
                  <p
                    className="text-amber-400 font-bold uppercase tracking-[0.05em] text-sm sm:text-lg transition-all duration-300"
                    style={getTaglineStyle()}
                  >
                    Connecting Villages, Empowering Communities
                  </p>
                </div>
              </div>
            )}

            {/* 8. WATERMARK */}
            <div className="absolute bottom-3 right-3 bg-black/40 text-gray-400 text-[10px] px-2 py-0.5 rounded backdrop-blur-sm tracking-wider uppercase font-semibold">
              OoruMitra Renderer v1.0
            </div>
          </div>

          {/* Timeline & Player Bar */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
            {/* Seek Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold font-mono text-amber-500">{formatTimecode(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration}
                step="0.0166" // 60 FPS step
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
              <span className="text-xs font-semibold font-mono text-gray-500">{formatTimecode(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>

                <button
                  onClick={() => setCurrentTime(0)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  Replay ↺
                </button>
              </div>

              {/* Playback speed & Info */}
              <div className="flex items-center gap-3">
                {/* Speed selector */}
                <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1">
                  {[0.5, 1, 2].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setPlaybackSpeed(sp)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                        playbackSpeed === sp ? 'bg-amber-500 text-gray-950' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>

                {/* Quality selector */}
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-2 py-1 text-xs font-semibold outline-none"
                >
                  <option value="720p">720p (HD)</option>
                  <option value="1080p">1080p (Full HD)</option>
                  <option value="4k">4K (Ultra HD)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scene Metadata & Specs */}
        {showMetadata && (
          <div className="w-full lg:w-80 bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4 text-left animate-fadeInRight">
            <h2 className="text-md font-bold text-white border-b border-gray-800 pb-2.5 flex items-center gap-2">
              <span>📊</span> Animation Metadata
            </h2>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <p className="text-gray-500 uppercase tracking-wider font-semibold">Active Scene Phase</p>
                <p className="text-amber-400 font-bold mt-0.5">
                  {currentTime < 1.5 && '🎬 Scene Intro: Village Sunrise Flyover'}
                  {currentTime >= 1.5 && currentTime < 4 && '📱 Step 1: Services Interface Reveal'}
                  {currentTime >= 4 && currentTime < 7 && '👷 Step 2: Workers Marketplace Emergence'}
                  {currentTime >= 7 && currentTime < 10 && '🚛 Step 3: Local Transport Infrastructure'}
                  {currentTime >= 10 && currentTime < 12.8 && '🌾 Step 4: Village Community Overview'}
                  {currentTime >= 12.8 && currentTime < 14.5 && '⚡ Transition: Golden Sunlight Dissolve'}
                  {currentTime >= 14.5 && '🏆 Final Frame: OoruMitra Logo & Tagline'}
                </p>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider font-semibold">Target Specs</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-800">
                    <p className="text-[10px] text-gray-400">Resolution</p>
                    <p className="font-bold text-white text-xs">{quality === '4k' ? '3840x2160' : quality === '720p' ? '1280x720' : '1920x1080'}</p>
                  </div>
                  <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-800">
                    <p className="text-[10px] text-gray-400">Frame Rate</p>
                    <p className="font-bold text-white text-xs">60 FPS (V-Sync)</p>
                  </div>
                  <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-800">
                    <p className="text-[10px] text-gray-400">Aspect Ratio</p>
                    <p className="font-bold text-white text-xs">16:9 (Cinema)</p>
                  </div>
                  <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-800">
                    <p className="text-[10px] text-gray-400">Runtime</p>
                    <p className="font-bold text-white text-xs">20 Seconds</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-500 uppercase tracking-wider font-semibold">Render Settings</p>
                <ul className="list-disc list-inside mt-1 text-gray-300 flex flex-col gap-1">
                  <li>Raytraced Shadows (Volumetric)</li>
                  <li>3D Matrix Transformation Pipelines</li>
                  <li>Glassmorphic CSS3 Filters</li>
                  <li>Subpixel Anti-aliasing (Sub-px)</li>
                </ul>
              </div>

              <div className="border-t border-gray-800 pt-3 mt-1">
                <p className="text-gray-500 uppercase tracking-wider font-semibold">Tagline</p>
                <p className="text-gray-100 font-bold italic mt-0.5">"Connecting Villages, Empowering Communities"</p>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl mt-2 text-left">
                <p className="text-[11px] text-amber-500 font-bold flex items-center gap-1.5">
                  <span>💡</span> Designer Note
                </p>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                  The background still is rendered at Unreal Engine 5 quality showing a golden sunset, traditional structures, and active crop fields. Use the timeline controls to review each keyframe transition step-by-step.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
