import { useState, useEffect, useRef } from 'react'

export default function MarketingPoster() {
  const [theme, setTheme] = useState('sunset') // sunset, forest, tech, ocean
  const [scaleMode, setScaleMode] = useState('fitscreen') // fitscreen, responsive, actual
  const [format, setFormat] = useState('status') // status (9:16), landscape (16:9)
  const [viewportScale, setViewportScale] = useState(0.35)
  const posterRef = useRef(null)

  // Color theme definitions using Green, Blue, White, Orange and subtle Village Gradients
  const themes = {
    sunset: {
      bg: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-indigo-950',
      cardBg: 'bg-white/10 backdrop-blur-md border border-white/10 hover:border-emerald-400/40',
      accentText: 'text-amber-400',
      headingGradient: 'from-emerald-400 via-amber-300 to-blue-400',
      borderAccent: 'border-emerald-500/30',
      iconColor: '#34d399', // emerald-400
      glow: 'shadow-[0_0_25px_rgba(52,211,153,0.15)]',
      primaryBtn: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
    },
    forest: {
      bg: 'bg-gradient-to-br from-green-950 via-emerald-900 to-amber-950',
      cardBg: 'bg-slate-900/40 backdrop-blur-md border border-emerald-500/20 hover:border-green-400/40',
      accentText: 'text-orange-400',
      headingGradient: 'from-green-400 via-emerald-300 to-orange-400',
      borderAccent: 'border-green-500/30',
      iconColor: '#4ade80', // green-400
      glow: 'shadow-[0_0_25px_rgba(74,222,128,0.15)]',
      primaryBtn: 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
    },
    tech: {
      bg: 'bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950',
      cardBg: 'bg-blue-950/20 backdrop-blur-md border border-blue-500/20 hover:border-blue-400/40',
      accentText: 'text-cyan-400',
      headingGradient: 'from-cyan-400 via-blue-300 to-orange-400',
      borderAccent: 'border-blue-500/30',
      iconColor: '#22d3ee', // cyan-400
      glow: 'shadow-[0_0_25px_rgba(34,211,238,0.15)]',
      primaryBtn: 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-500/20'
    },
    ocean: {
      bg: 'bg-gradient-to-br from-blue-950 via-cyan-900 to-emerald-950',
      cardBg: 'bg-white/5 backdrop-blur-md border border-cyan-500/10 hover:border-cyan-400/30',
      accentText: 'text-sky-300',
      headingGradient: 'from-sky-400 via-cyan-300 to-emerald-400',
      borderAccent: 'border-cyan-500/30',
      iconColor: '#38bdf8', // sky-400
      glow: 'shadow-[0_0_25px_rgba(56,189,248,0.15)]',
      primaryBtn: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20'
    }
  }

  const activeTheme = themes[theme]

  // Resize monitor for Fit Screen auto-scaling
  useEffect(() => {
    const handleResize = () => {
      if (scaleMode !== 'fitscreen') return

      const isLandscape = format === 'landscape'
      const targetW = isLandscape ? 3840 : 1080
      const targetH = isLandscape ? 1920 : 1920 // Fixed heights for 1:1 or 9:16 portrait viewport boxes

      const availW = window.innerWidth - 48
      const availH = window.innerHeight - 130 // header offset

      const scale = Math.min(availW / targetW, availH / targetH)
      setViewportScale(scale)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [scaleMode, format])

  const handlePrint = () => {
    window.print()
  }

  const getCanvasStyles = () => {
    if (scaleMode === 'responsive') {
      return {}
    }

    const isLandscape = format === 'landscape'
    const width = isLandscape ? 3840 : 1080
    const height = isLandscape ? 2160 : 1920 // Standard resolutions

    const scale = scaleMode === 'actual' ? 1 : viewportScale

    return {
      width: `${width}px`,
      height: `${height}px`,
      minWidth: `${width}px`,
      minHeight: `${height}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'center center'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900 overflow-x-hidden">
      
      {/* Top Controls Header (Hidden during print) */}
      <header className="no-print bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div>
              <h1 className="text-md font-bold text-white tracking-wide">OoruMitra Design Center</h1>
              <p className="text-xs text-slate-400">Premium App Launch & WhatsApp Status Publisher</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Format Toggles */}
            <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
              <button 
                onClick={() => setFormat('status')} 
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${format === 'status' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>📱</span> WhatsApp Status (9:16)
              </button>
              <button 
                onClick={() => setFormat('landscape')} 
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${format === 'landscape' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🖥️</span> Web Banner (16:9)
              </button>
            </div>

            {/* Theme Picker */}
            <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Palette:</span>
              <button onClick={() => setTheme('sunset')} className={`w-4 h-4 rounded-full bg-emerald-500 border-2 ${theme === 'sunset' ? 'border-white scale-125' : 'border-transparent'}`} title="Sunset Green-Blue-Orange" />
              <button onClick={() => setTheme('forest')} className={`w-4 h-4 rounded-full bg-green-600 border-2 ${theme === 'forest' ? 'border-white scale-125' : 'border-transparent'}`} title="Forest & Field" />
              <button onClick={() => setTheme('tech')} className={`w-4 h-4 rounded-full bg-blue-600 border-2 ${theme === 'tech' ? 'border-white scale-125' : 'border-transparent'}`} title="Smart Tech Blue" />
              <button onClick={() => setTheme('ocean')} className={`w-4 h-4 rounded-full bg-cyan-500 border-2 ${theme === 'ocean' ? 'border-white scale-125' : 'border-transparent'}`} title="Ocean Teal" />
            </div>

            {/* Scaling Selection */}
            <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
              <button 
                onClick={() => setScaleMode('fitscreen')} 
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${scaleMode === 'fitscreen' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                title="Automatically fit canvas inside browser window size"
              >
                Fit Screen
              </button>
              <button 
                onClick={() => setScaleMode('responsive')} 
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${scaleMode === 'responsive' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Responsive
              </button>
              <button 
                onClick={() => setScaleMode('actual')} 
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${scaleMode === 'actual' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                100% Size
              </button>
            </div>

            {/* Print trigger */}
            <button 
              onClick={handlePrint}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save
            </button>
          </div>
        </div>
      </header>

      {/* Canvas Wrap Workspace */}
      <div className={`flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-950 ${scaleMode !== 'responsive' ? 'overflow-auto h-[calc(100vh-80px)]' : ''}`}>
        
        {/* Canvas Element */}
        <div 
          ref={posterRef}
          className={`relative transition-all duration-300 shadow-[0_30px_80px_rgba(0,0,0,0.95)] ${activeTheme.bg} ${
            scaleMode === 'responsive' 
              ? 'w-full max-w-6xl rounded-3xl p-6 sm:p-12 flex flex-col gap-16 border border-white/5' 
              : 'border-4 border-slate-800/80 rounded-2xl flex flex-col justify-between overflow-hidden select-none'
          }`}
          style={getCanvasStyles()}
        >
          
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

          {/* ========================================================================= */}
          {/* FORMAT 1: PORTRAIT WHATSAPP STATUS (9:16, 1080x1920)                       */}
          {/* ========================================================================= */}
          {format === 'status' && scaleMode !== 'responsive' && (
            <div className="flex-1 flex flex-col justify-between p-14 relative z-10 text-center">
              
              {/* Logo & Headings */}
              <div className="space-y-3">
                <div className="flex justify-center mb-1">
                  <img src="/Ooru_mitra_logo_2.png" alt="OoruMitra Logo" className="h-28 w-auto filter drop-shadow-lg" />
                </div>
                <h1 className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${activeTheme.headingGradient} bg-clip-text text-transparent`}>
                  OoruMitra
                </h1>
                <p className="text-xl font-bold text-white px-2 leading-snug">
                  Connecting Villages, Services & Opportunities
                </p>
                <p className="text-xs text-slate-300 px-6 leading-relaxed">
                  One Platform for Workers, Services, Products & Local Communities
                </p>
                
                {/* Coming Soon Store Link Badge */}
                <div className="pt-2 flex justify-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    🚀 Coming Soon on Google Play & iOS
                  </span>
                </div>
              </div>

              {/* Village-to-Digital Artwork (Compact Vertical SVG) */}
              <div className="h-28 my-3 bg-slate-900/30 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center relative">
                <svg className="w-full h-full" viewBox="0 0 320 100">
                  <path d="M 0 80 Q 80 50 160 80 T 320 80 L 320 100 L 0 100 Z" fill="#064e3b" opacity="0.3" />
                  <path d="M 0 90 Q 60 70 120 90 T 240 90 T 320 90 L 320 100 L 0 100 Z" fill="#065f46" opacity="0.4" />
                  
                  {/* Traditional Village SVG Elements */}
                  <text x="30" y="75" fontSize="16">🌳</text>
                  <text x="70" y="80" fontSize="18">🏡</text>
                  <text x="240" y="80" fontSize="18">🏡</text>
                  <text x="280" y="75" fontSize="16">🌾</text>
                  
                  {/* Glowing Digital Node lines */}
                  <circle cx="160" cy="40" r="14" fill="#1e293b" stroke="#34d399" strokeWidth="1.5" />
                  <text x="160" y="44" textAnchor="middle" fontSize="10">🌐</text>
                  
                  <line x1="75" y1="70" x2="160" y2="40" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.7" />
                  <line x1="245" y1="70" x2="160" y2="40" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.7" />
                  
                  <circle cx="75" cy="70" r="3" fill="#60a5fa" />
                  <circle cx="245" cy="70" r="3" fill="#60a5fa" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-slate-900/10 to-transparent" />
              </div>

              {/* Side-by-Side Mobile and Web Preview containers (Scaled for WhatsApp format) */}
              <div className="flex gap-4 justify-center items-center my-3">
                {/* Mobile Preview */}
                <div className="relative w-[150px] h-[250px] bg-slate-950 rounded-[20px] border-[3.5px] border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between text-left">
                  <div className="h-4 bg-slate-950 flex justify-between items-center px-3 text-[5px] text-white/80">
                    <span>09:41 AM</span>
                    <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                  </div>
                  <div className="flex-1 bg-slate-900 p-2 space-y-1">
                    <span className="text-[5px] uppercase tracking-wider text-emerald-400 font-extrabold block">Mobile App</span>
                    <div className="h-8 bg-gradient-to-r from-emerald-800 to-indigo-900 rounded p-1 text-[6px] text-white leading-tight font-black flex items-center gap-1">
                      <span>🌾</span> OoruMitra
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      {['Marketplace', 'Services', 'Transport', 'Workers'].map((t, idx) => (
                        <div key={idx} className="p-1 rounded bg-white/5 text-[5px] text-white font-bold leading-none truncate">
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Web Dashboard Preview */}
                <div className="relative w-[210px] h-[250px] bg-slate-950 rounded-[14px] border-[3.5px] border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between text-left">
                  <div className="h-4 bg-slate-900 px-3 flex items-center border-b border-white/5 justify-between">
                    <div className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      <span className="w-1 h-1 rounded-full bg-yellow-500" />
                      <span className="w-1 h-1 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[5px] text-slate-400 font-mono">dashboard.oorumitra.in</span>
                  </div>
                  <div className="flex-1 bg-slate-950 flex">
                    {/* sidebar */}
                    <div className="w-10 bg-slate-900 border-r border-white/5 p-1 space-y-1">
                      <span className="block w-full h-1 bg-emerald-500/25 rounded" />
                      <span className="block w-full h-1 bg-white/5 rounded" />
                      <span className="block w-full h-1 bg-white/5 rounded" />
                    </div>
                    {/* main area */}
                    <div className="flex-1 p-2 space-y-1">
                      <span className="text-[5px] uppercase text-slate-400 font-black">Web Console</span>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="bg-white/5 p-1 rounded">
                          <span className="block text-[4px] text-slate-400">Total Users</span>
                          <span className="block text-[6px] font-black text-emerald-400">24,500</span>
                        </div>
                        <div className="bg-white/5 p-1 rounded">
                          <span className="block text-[4px] text-slate-400">Transactions</span>
                          <span className="block text-[6px] font-black text-blue-400">₹8.5L</span>
                        </div>
                      </div>
                      <div className="h-10 bg-white/5 rounded p-1">
                        <span className="block text-[4px] text-slate-400">Active Map Feed</span>
                        <div className="h-6 bg-emerald-500/10 rounded flex items-center justify-center text-[8px]">🗺️</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Infographics Flow diagrams (Vertical Layout) */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-left mb-1.5">
                  🔄 Platform Use Cases Flow
                </h3>
                
                <div className="grid grid-cols-2 gap-2 text-left">
                  {/* Diagram 1 */}
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[8px] leading-tight">
                    <span className="block font-black text-emerald-400 uppercase text-[9px] mb-0.5">🌾 Marketplace</span>
                    <span className="text-slate-300">Seller ➔ OoruMitra ➔ Buyer</span>
                    <p className="text-[7px] text-slate-400 mt-1">Crops, Cattle, Tractors, Equipments</p>
                  </div>
                  {/* Diagram 2 */}
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[8px] leading-tight">
                    <span className="block font-black text-blue-400 uppercase text-[9px] mb-0.5">🛠️ Worker Hub</span>
                    <span className="text-slate-300">Villager ➔ Platform ➔ Worker</span>
                    <p className="text-[7px] text-slate-400 mt-1">Electricians, Plumbers, Mason, Drivers</p>
                  </div>
                  {/* Diagram 3 */}
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[8px] leading-tight">
                    <span className="block font-black text-amber-400 uppercase text-[9px] mb-0.5">🚜 Transport</span>
                    <span className="text-slate-300">Provider ➔ Platform ➔ Customer</span>
                    <p className="text-[7px] text-slate-400 mt-1">Tractors, Auto, Mini Truck transport</p>
                  </div>
                  {/* Diagram 4 */}
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[8px] leading-tight">
                    <span className="block font-black text-pink-400 uppercase text-[9px] mb-0.5">🤝 Community</span>
                    <span className="text-slate-300">Citizen ➔ OoruMitra ➔ Support</span>
                    <p className="text-[7px] text-slate-400 mt-1">Announcements, Helplines, Emergencies</p>
                  </div>
                </div>
              </div>

              {/* Engineering Excellence & SVG Flowchart */}
              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 text-left leading-normal">
                  <h4 className={`text-[10px] font-black uppercase tracking-wider ${activeTheme.accentText} mb-1.5`}>
                    🛡️ Engineering Excellence & Solution Architecture
                  </h4>
                  
                  {/* Architecture Diagram SVG */}
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-white/5 flex items-center justify-between text-[7px] font-bold text-slate-300 font-mono mb-2">
                    <span className="text-emerald-400">App</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-blue-400">Gateway</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-amber-400">API</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-indigo-400">DB</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-pink-400">Notif</span>
                  </div>

                  <p className="text-[8px] text-slate-300 leading-snug">
                    OoruMitra is built with cloud-native microservices, AI-enabled roadmap features, and robust database backends to ensure 99.9% uptime and low latency for rural users.
                  </p>
                </div>
              </div>

              {/* Team Credits & Footer */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-around items-center text-[9px] text-slate-400">
                  <div className="text-left">
                    <span className="text-white font-bold block">Obulareddy Thavva</span>
                    <span>Senior Software/AI Engineer</span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="text-left">
                    <span className="text-white font-bold block">Madan Mohna Reddy G</span>
                    <span>Senior Architect | VP</span>
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mt-2">
                  "Empowering Villages Through Technology"
                </p>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* FORMAT 2: LANDSCAPE WEB LANDING PROMOTIONAL BANNER (16:9, 3840x2160)       */}
          {/* ========================================================================= */}
          {(format === 'landscape' || scaleMode === 'responsive') && (
            <>
              {/* Header Branding */}
              <div className="flex flex-col items-center text-center z-10">
                {/* Logo */}
                <div className="mb-4 flex justify-center">
                  <img 
                    src="/Ooru_mitra_logo_2.png" 
                    alt="OoruMitra Logo" 
                    className={`${scaleMode === 'hd4k' ? 'h-48' : 'h-24 md:h-28'} w-auto filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 duration-300`} 
                  />
                </div>
                
                {/* Main Heading */}
                <h1 className={`font-black tracking-tight bg-gradient-to-r ${activeTheme.headingGradient} bg-clip-text text-transparent ${
                  scaleMode === 'hd4k' ? 'text-8xl mb-4' : 'text-4xl md:text-6xl mb-3'
                }`}>
                  OoruMitra – Connecting Villages, Services & Opportunities
                </h1>
                
                {/* Tagline */}
                <p className={`font-semibold tracking-wide text-white/95 text-shadow-sm max-w-5xl mx-auto leading-relaxed ${
                  scaleMode === 'hd4k' ? 'text-4xl px-12' : 'text-lg md:text-xl px-4 text-slate-200'
                }`}>
                  One Platform for Workers, Services, Products & Local Communities
                </p>

                {/* Coming Soon Badges */}
                <div className={`flex justify-center gap-4 ${scaleMode === 'hd4k' ? 'mt-8' : 'mt-4'}`}>
                  <span className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full shadow-lg">
                    🚀 Coming Soon on Google Play Store & Apple iOS
                  </span>
                </div>

                <div className={`w-32 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full ${scaleMode === 'hd4k' ? 'mt-8' : 'mt-5'}`} />
              </div>

              {/* Grid Body Section */}
              <div className={`grid z-10 ${
                scaleMode === 'hd4k' 
                  ? 'grid-cols-3 gap-16 items-start flex-1 mt-10 mb-10' 
                  : 'grid-cols-1 lg:grid-cols-3 gap-10 items-start'
              }`}>
                
                {/* LEFT COLUMN: HERO PREVIEWS (Mockups + village vector illustration) */}
                <div className="flex flex-col gap-8 items-center h-full">
                  
                  {/* Custom Village-to-Digital SVG Illustration */}
                  <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 overflow-hidden relative shadow-lg">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">
                      🌱 Modern Village Digital Ecosystem
                    </h3>
                    
                    <svg className="w-full h-auto" viewBox="0 0 400 160">
                      {/* Sky & Sun */}
                      <circle cx="200" cy="140" r="90" fill="#f97316" opacity="0.1" />
                      
                      {/* Hills */}
                      <path d="M 0 130 Q 100 80 200 120 T 400 110 L 400 160 L 0 160 Z" fill="#047857" opacity="0.3" />
                      <path d="M 0 145 Q 80 115 180 140 T 360 130 T 400 135 L 400 160 L 0 160 Z" fill="#065f46" opacity="0.5" />
                      
                      {/* Traditional Items */}
                      <text x="40" y="125" fontSize="24">🌳</text>
                      <text x="80" y="135" fontSize="28">🏡</text>
                      <text x="310" y="135" fontSize="28">🏡</text>
                      <text x="350" y="125" fontSize="24">🌾</text>
                      <text x="140" y="145" fontSize="20">🚜</text>
                      
                      {/* Web Cloud Servers */}
                      <circle cx="200" cy="50" r="22" fill="#1e293b" stroke="#34d399" strokeWidth="2.5" />
                      <text x="200" y="55" textAnchor="middle" fontSize="16">☁️</text>
                      <text x="200" y="85" textAnchor="middle" fontSize="8" fill="#a7f3d0" fontWeight="bold">Cloud Backend</text>
                      
                      {/* Connection rays */}
                      <line x1="85" y1="120" x2="200" y2="50" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" opacity="0.8" />
                      <line x1="315" y1="120" x2="200" y2="50" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" opacity="0.8" />
                      <line x1="150" y1="130" x2="200" y2="50" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" opacity="0.8" />
                      
                      {/* Nodes */}
                      <circle cx="85" cy="120" r="4" fill="#60a5fa" className="animate-ping" />
                      <circle cx="315" cy="120" r="4" fill="#60a5fa" className="animate-ping" />
                      <circle cx="150" cy="130" r="4" fill="#60a5fa" className="animate-ping" />
                    </svg>
                  </div>

                  {/* Mobile & Web Mockups Side-by-Side */}
                  <div className="w-full flex gap-6 justify-center items-end">
                    
                    {/* Smartphone Mockup */}
                    <div className={`relative ${scaleMode === 'hd4k' ? 'w-[280px] h-[480px]' : 'w-[180px] h-[310px]'} bg-slate-950 rounded-[30px] border-[5px] border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between text-left ring-2 ring-emerald-500/20`}>
                      <div className="absolute top-0 inset-x-0 h-6 bg-transparent z-40 flex justify-between items-center px-4 text-[7px] font-bold text-white/80">
                        <span>09:41 AM</span>
                        <div className="w-14 h-2.5 bg-black rounded-full" />
                        <span className="w-2 h-1.5 bg-emerald-500 rounded-sm" />
                      </div>
                      
                      <div className="flex-1 pt-6 flex flex-col bg-slate-900">
                        <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-800 to-indigo-900 flex items-center gap-1 border-b border-white/5">
                          <span className="text-xs">🌾</span>
                          <span className="text-[8px] font-extrabold text-white">OoruMitra Mobile</span>
                        </div>
                        <div className="flex-1 p-2 space-y-2">
                          <div className="grid grid-cols-2 gap-1 pt-1">
                            {['Product Market', 'Local Services', 'Transport Rent', 'Skilled Workers'].map((n, i) => (
                              <div key={i} className="p-1 rounded bg-white/5 text-[5px] text-white font-bold leading-none truncate">
                                {n}
                              </div>
                            ))}
                          </div>
                          <div className="bg-white/5 rounded p-1.5 text-[5px] text-slate-300">
                            <span className="block text-[4px] text-slate-400 uppercase font-bold">Featured Listing</span>
                            🌽 Fresh Sweet Corn (3 Quintals)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Web Dashboard preview */}
                    <div className={`relative ${scaleMode === 'hd4k' ? 'w-[360px] h-[400px]' : 'w-[250px] h-[280px]'} bg-slate-950 rounded-[16px] border-[5px] border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between text-left ring-2 ring-blue-500/20`}>
                      <div className="h-5 bg-slate-900 border-b border-white/5 px-3 flex items-center justify-between">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                        <span className="text-[6px] text-slate-500 font-mono">admin.oorumitra.in/dashboard</span>
                      </div>
                      
                      <div className="flex-1 bg-slate-950 flex">
                        {/* Sidebar */}
                        <div className="w-12 bg-slate-900 border-r border-white/5 p-1 space-y-1.5">
                          <div className="w-full h-2 bg-emerald-500/20 rounded" />
                          <div className="w-full h-1.5 bg-white/5 rounded" />
                          <div className="w-full h-1.5 bg-white/5 rounded" />
                          <div className="w-full h-1.5 bg-white/5 rounded" />
                        </div>
                        {/* Main area */}
                        <div className="flex-1 p-3 space-y-2">
                          <span className="text-[6px] uppercase tracking-widest text-slate-400 font-black block">Web Administrator</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-white/5 p-1 rounded">
                              <span className="block text-[4px] text-slate-400 font-bold">Active Villages</span>
                              <span className="block text-[8px] font-black text-emerald-400">124</span>
                            </div>
                            <div className="bg-white/5 p-1 rounded">
                              <span className="block text-[4px] text-slate-400 font-bold">Total Workers</span>
                              <span className="block text-[8px] font-black text-orange-400">1,890</span>
                            </div>
                          </div>
                          
                          {/* Simulated line chart */}
                          <div className="bg-slate-900/80 p-1.5 rounded border border-white/5 h-16 flex flex-col justify-between">
                            <span className="text-[4px] text-slate-400 uppercase font-extrabold block">Monthly Transactions</span>
                            <svg className="w-full h-10" viewBox="0 0 100 30">
                              <path d="M 0 25 Q 20 5 40 20 T 80 10 T 100 5 L 100 30 L 0 30 Z" fill="url(#chartGrad)" />
                              <path d="M 0 25 Q 20 5 40 20 T 80 10 T 100 5" fill="none" stroke="#10b981" strokeWidth="1" />
                              <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* MIDDLE COLUMN: PLATFORM USE CASES FLOW DIAGRAMS */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📊</span>
                    <h2 className={`font-bold tracking-tight text-white ${scaleMode === 'hd4k' ? 'text-4xl' : 'text-2xl'}`}>
                      Interactive Use Cases Flow
                    </h2>
                  </div>

                  {/* Diagram 1: Villager -> Worker */}
                  <div className={`p-5 rounded-2xl ${activeTheme.cardBg} transition-all duration-300 ${activeTheme.glow}`}>
                    <h3 className="text-xs font-black text-white flex items-center gap-2 mb-3 uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      1. Villager ➔ Worker Hub
                    </h3>
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-950/40 rounded-xl border border-white/5">
                      <div className="text-center">
                        <span className="text-lg block">👨‍💼</span>
                        <span className="text-[8px] font-bold text-slate-400">Villager</span>
                      </div>
                      <span className="text-blue-400 text-xs">➔</span>
                      <div className="text-center px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] font-bold text-blue-400">
                        OoruMitra Hub
                      </div>
                      <span className="text-blue-400 text-xs">➔</span>
                      <div className="text-center">
                        <span className="text-lg block">👷</span>
                        <span className="text-[8px] font-bold text-slate-400">Worker</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[8px] font-semibold text-slate-300">
                      {['Electrician', 'Plumber', 'Carpenter', 'Mason', 'Driver', 'Agri Worker'].map((w, i) => (
                        <span key={i} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">{w}</span>
                      ))}
                    </div>
                  </div>

                  {/* Diagram 2: Seller -> Buyer */}
                  <div className={`p-5 rounded-2xl ${activeTheme.cardBg} transition-all duration-300 ${activeTheme.glow}`}>
                    <h3 className="text-xs font-black text-white flex items-center gap-2 mb-3 uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      2. Seller ➔ Buyer Marketplace
                    </h3>
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-950/40 rounded-xl border border-white/5">
                      <div className="text-center">
                        <span className="text-lg block">👨‍🌾</span>
                        <span className="text-[8px] font-bold text-slate-400">Seller</span>
                      </div>
                      <span className="text-emerald-400 text-xs">➔</span>
                      <div className="text-center px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-bold text-emerald-400">
                        Marketplace
                      </div>
                      <span className="text-emerald-400 text-xs">➔</span>
                      <div className="text-center">
                        <span className="text-lg block">🙋‍♂️</span>
                        <span className="text-[8px] font-bold text-slate-400">Buyer</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[8px] font-semibold text-slate-300">
                      {['Farm Products', 'Livestock', 'Vehicles', 'Tools', 'Household'].map((w, i) => (
                        <span key={i} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">{w}</span>
                      ))}
                    </div>
                  </div>

                  {/* Diagram 3: Transport */}
                  <div className={`p-5 rounded-2xl ${activeTheme.cardBg} transition-all duration-300 ${activeTheme.glow}`}>
                    <h3 className="text-xs font-black text-white flex items-center gap-2 mb-3 uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      3. Transport Provider ➔ Customer
                    </h3>
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-950/40 rounded-xl border border-white/5">
                      <div className="text-center">
                        <span className="text-lg block">🚜</span>
                        <span className="text-[8px] font-bold text-slate-400">Transporter</span>
                      </div>
                      <span className="text-amber-400 text-xs">➔</span>
                      <div className="text-center px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[8px] font-bold text-amber-400">
                        Dispatch
                      </div>
                      <span className="text-amber-400 text-xs">➔</span>
                      <div className="text-center">
                        <span className="text-lg block">🏡</span>
                        <span className="text-[8px] font-bold text-slate-400">Customer</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[8px] font-semibold text-slate-300">
                      {['Mini Truck', 'Tractor', 'Auto', 'Goods Transport'].map((w, i) => (
                        <span key={i} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">{w}</span>
                      ))}
                    </div>
                  </div>

                  {/* Diagram 4: Citizen -> Community */}
                  <div className={`p-5 rounded-2xl ${activeTheme.cardBg} transition-all duration-300 ${activeTheme.glow}`}>
                    <h3 className="text-xs font-black text-white flex items-center gap-2 mb-3 uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                      4. Citizen ➔ Community Network
                    </h3>
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-950/40 rounded-xl border border-white/5">
                      <div className="text-center">
                        <span className="text-lg block">👥</span>
                        <span className="text-[8px] font-bold text-slate-400">Citizen</span>
                      </div>
                      <span className="text-pink-400 text-xs">➔</span>
                      <div className="text-center px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded text-[8px] font-bold text-pink-400">
                        Announcements
                      </div>
                      <span className="text-pink-400 text-xs">➔</span>
                      <div className="text-center">
                        <span className="text-lg block">🤝</span>
                        <span className="text-[8px] font-bold text-slate-400">Support</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[8px] font-semibold text-slate-300">
                      {['Local Announcements', 'Village Info', 'Emergency Contacts', 'Services'].map((w, i) => (
                        <span key={i} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">{w}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: ENGINEERING EXCELLENCE & API ARCHITECTURE FLOWCHART */}
                <div className="flex flex-col gap-6">
                  
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">🛠️</span>
                    <h3 className="font-extrabold tracking-tight text-white text-lg">
                      Engineering & Architecture Excellence
                    </h3>
                  </div>

                  {/* Architecture & Engineering Description */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <h4 className={`text-xs font-black uppercase tracking-wider ${activeTheme.accentText}`}>
                      Design Thinking • Planning • Architecture • Implementation
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                      "OoruMitra is built using a scalable, secure and future-ready architecture. The platform combines modern software engineering practices, AI-driven innovation, intuitive user experience, cloud-native architecture, and robust integrations to empower rural communities through digital transformation."
                    </p>

                    {/* Architecture Flowchart Graphics */}
                    <div className="pt-2">
                      <span className="block text-[9px] uppercase font-bold text-slate-400 mb-2">🚀 System Request Flowchart</span>
                      <div className="space-y-1 text-[9px] font-semibold">
                        {[
                          { title: 'Mobile & Web Clients', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
                          { title: 'API Gateway (Rate Limit & Auth)', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300' },
                          { title: 'Microservices Backend Layer', color: 'border-amber-500 bg-amber-500/10 text-amber-300' },
                          { title: 'Relational & Key-Value Database', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-300' },
                          { title: 'Notification Engine (SMS, WhatsApp, Mail)', color: 'border-pink-500 bg-pink-500/10 text-pink-300' },
                          { title: 'External Integrations (Payments & Maps)', color: 'border-purple-500 bg-purple-500/10 text-purple-300' }
                        ].map((layer, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            {idx > 0 && <span className="text-slate-600 font-black text-xs my-0.5">↓</span>}
                            <div className={`w-full py-1.5 px-3 rounded-lg border text-center font-mono tracking-wide ${layer.color}`}>
                              {layer.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Highlights Grid checklist */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <span className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">✓ Key Platform Highlights</span>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-[11px] font-semibold text-slate-200">
                      {[
                        'User Friendly Interface',
                        'AI Enabled Roadmap',
                        'Secure Authentication',
                        'Real-Time Notifications',
                        'Multi-Language Support',
                        'Product & Service Market',
                        'Worker Discovery Hub',
                        'Transport Rent Manager',
                        'Scalable Cloud Infra',
                        'High Performance APIs'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Footer and Credits */}
              <div className="z-10 border-t border-white/10 pt-10 mt-auto">
                <div className={`grid ${scaleMode === 'hd4k' ? 'grid-cols-2 gap-12' : 'grid-cols-1 md:grid-cols-2 gap-8'} mb-8`}>
                  
                  {/* Credit 1 */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4 shadow-md">
                    <div className="text-3xl">👨‍💻</div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block mb-1">
                        Design, Planning, Architecture & Implementation
                      </span>
                      <h4 className="text-base font-bold text-white">Obulareddy Thavva</h4>
                      <p className="text-xs text-slate-400">Senior Software Engineer | AI Engineer</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-300 font-mono">
                        <span>📞 6302938955</span>
                        <span>📧 Obulareddyjd@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Credit 2 */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4 shadow-md">
                    <div className="text-3xl">🏛️</div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 block mb-1">
                        Interface Design & External API Integrations
                      </span>
                      <h4 className="text-base font-bold text-white">Madan Mohna Reddy Gangireddy</h4>
                      <p className="text-xs text-slate-400">Vice President | Senior Architect</p>
                    </div>
                  </div>

                </div>

                {/* Footer Text */}
                <div className="text-center pt-4">
                  <p className={`font-black uppercase tracking-widest text-white/90 ${scaleMode === 'hd4k' ? 'text-3xl' : 'text-sm'}`}>
                    "Empowering Villages Through Technology"
                  </p>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
