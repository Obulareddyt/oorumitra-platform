import { useState } from 'react'
import { Link } from 'react-router-dom'

const MOBILE_BANNERS = [
  { id: 1, title: 'Buy & Sell Anything in Your Village', badge: '🌾 MARKETPLACE', subtitle: '0% Brokerage • Instant Deals', color: 'from-emerald-800 to-green-700' },
  { id: 2, title: 'Find Trusted Local Services', badge: '🛠️ LOCAL SERVICES', subtitle: 'Verified Electricians & Plumbers', color: 'from-blue-900 to-indigo-800' },
  { id: 3, title: 'Supporting Farmers & Agriculture', badge: '🚜 FARMING', subtitle: 'Tractors, Harvesters & Seeds', color: 'from-emerald-900 to-teal-800' },
  { id: 4, title: 'Jobs & Opportunities Near You', badge: '👷 RURAL JOBS', subtitle: 'Daily Wage Work & Skilled Labor', color: 'from-amber-900 to-orange-800' },
  { id: 5, title: 'Connecting Communities Together', badge: '🎉 FESTIVALS', subtitle: 'Gram Sabha Meetings & Events', color: 'from-purple-900 to-pink-900' },
  { id: 6, title: 'Your Village in Your Pocket', badge: '📡 SMART MESH', subtitle: 'Real-Time Panchayat GPS Tracking', color: 'from-sky-900 to-blue-950' },
]

export default function MobileAppSimulator({ isOpen, onClose }) {
  const [deviceType, setDeviceType] = useState('android') // 'android' | 'ios'
  const [activeTab, setActiveTab] = useState('home') // 'home', 'categories', 'post', 'listings', 'profile'
  const [activeBannerIdx, setActiveBannerIdx] = useState(0)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  if (!isOpen) return null

  const mockMobileListings = [
    { id: 1, title: 'Fresh Organic Sona Masoori Paddy', price: '₹3,200 / Qtl', village: 'Malkajgiri', distance: '1.5 km', icon: '🌾' },
    { id: 2, title: 'John Deere Tractor Ploughing Service', price: '₹950 / Hour', village: 'Medchal', distance: '3.0 km', icon: '🚜' },
    { id: 3, title: 'Panchayat Electrician & Wiring', price: '₹350 / Visit', village: 'Kukatpally', distance: '0.8 km', icon: '⚡' },
    { id: 4, title: 'Cotton Harvest Labor Crew (8 Workers)', price: '₹600 / Day', village: 'Shamirpet', distance: '4.2 km', icon: '👷' },
  ]

  const currentBanner = MOBILE_BANNERS[activeBannerIdx]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row gap-6 max-h-[92vh] overflow-y-auto">
        
        {/* Controls Panel */}
        <div className="w-full md:w-80 space-y-5 text-left text-white flex-shrink-0">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Mobile Experience Switcher</span>
            <h2 className="text-2xl font-extrabold text-white mt-1">Native App Design</h2>
            <p className="text-xs text-gray-400 mt-1">
              Preview OoruMitra Android and iOS native mobile ecosystem UI/UX right in your browser.
            </p>
          </div>

          {/* OS Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">Device Platform Frame</label>
            <div className="grid grid-cols-2 gap-2 bg-gray-800 p-1 rounded-xl border border-gray-700">
              <button
                onClick={() => setDeviceType('android')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  deviceType === 'android' ? 'bg-[#2E7D32] text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>🤖 Android UI</span>
              </button>
              <button
                onClick={() => setDeviceType('ios')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  deviceType === 'ios' ? 'bg-[#1565C0] text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>🍎 iOS Frame</span>
              </button>
            </div>
          </div>

          {/* Banner Slide Selector inside Mobile App */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">Switch 3D Banner Slide</label>
            <div className="grid grid-cols-3 gap-1.5 bg-gray-800 p-1.5 rounded-xl border border-gray-700">
              {MOBILE_BANNERS.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBannerIdx(idx)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all ${
                    idx === activeBannerIdx ? 'bg-amber-500 text-gray-950 shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Slide {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Mode Toggles */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-gray-300">Mobile Native Features Simulator</label>
            
            <button
              onClick={() => setShowSkeleton(!showSkeleton)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                showSkeleton ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750'
              }`}
            >
              <span>{showSkeleton ? '✓ Skeleton Shimmer Active' : 'Toggle Skeleton Loader'}</span>
              <span className="text-base">✨</span>
            </button>

            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                isOffline ? 'bg-red-500/20 border-red-400 text-red-300' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750'
              }`}
            >
              <span>{isOffline ? '⚠️ Offline Mode Active' : 'Simulate Offline State'}</span>
              <span className="text-base">📡</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Close Simulator
          </button>
        </div>

        {/* Device Frame Viewport */}
        <div className="flex-1 flex justify-center items-center py-2">
          <div
            className={`relative w-[340px] h-[640px] bg-black rounded-[48px] p-3 shadow-2xl border-4 ${
              deviceType === 'ios' ? 'border-gray-700 rounded-[52px]' : 'border-gray-800 rounded-[44px]'
            }`}
          >
            {/* Speaker / Notch */}
            {deviceType === 'ios' ? (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gray-900 border border-gray-800" />
              </div>
            ) : (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-900 z-40 border border-gray-800" />
            )}

            {/* Screen Viewport */}
            <div className="relative w-full h-full bg-[#F8FAF5] rounded-[36px] overflow-hidden flex flex-col justify-between pt-8 pb-3">
              
              {/* Status Bar */}
              <div className="px-5 py-1 flex justify-between items-center text-[10px] font-bold text-gray-700 z-30">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>📶 5G</span>
                  <span>🔋 98%</span>
                </div>
              </div>

              {/* Offline Banner Indicator */}
              {isOffline && (
                <div className="bg-red-600 text-white text-[10px] font-bold py-1 px-3 text-center animate-pulse z-30">
                  ⚠️ Offline Mode - Showing cached village listings
                </div>
              )}

              {/* App Body Content */}
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
                
                {/* Header inside App */}
                <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl shadow-sm border border-emerald-900/5">
                  <img src="/Ooru_mitra_logo_2.png" alt="OoruMitra" className="h-7 w-auto" />
                  <span className="px-2 py-0.5 bg-emerald-100 text-[#2E7D32] rounded-full text-[10px] font-bold">
                    📍 Malkajgiri
                  </span>
                </div>

                {/* Banner inside Mobile (Responsive 3D atmosphere banner) */}
                <div className={`bg-gradient-to-r ${currentBanner.color} rounded-2xl p-4 text-white shadow-md text-left transition-all duration-300 min-h-[120px] flex flex-col justify-between`}>
                  <span className="text-[9px] bg-amber-400 text-gray-950 font-black px-2 py-0.5 rounded-full self-start tracking-wider">
                    {currentBanner.badge}
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold mt-1.5 leading-tight">{currentBanner.title}</h4>
                    <p className="text-[10px] text-gray-200 mt-0.5 font-medium">{currentBanner.subtitle}</p>
                  </div>
                </div>

                {/* Skeleton Loader Mode */}
                {showSkeleton ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 space-y-2 animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-xl" />
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Active Screen View */
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold text-gray-800">Nearby Village Postings</span>
                      <span className="text-[10px] text-[#2E7D32] font-semibold">View All</span>
                    </div>

                    {mockMobileListings.map((item) => (
                      <div key={item.id} className="bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="text-[11px] font-bold text-gray-900 line-clamp-1">{item.title}</h5>
                            <span className="text-[10px] text-gray-500 block">📍 {item.village} • {item.distance}</span>
                            <span className="text-[10px] font-extrabold text-[#2E7D32]">{item.price}</span>
                          </div>
                        </div>

                        {/* WhatsApp Sticky Action Button */}
                        <a
                          href={`https://wa.me/919999999999?text=Hi,%20interested%20in%20${encodeURIComponent(item.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-7 h-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center text-xs shadow shrink-0"
                          title="Chat on WhatsApp"
                        >
                          💬
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Floating Action Button (FAB) */}
              <div className="absolute right-4 bottom-14 z-30">
                <Link
                  to="/sell"
                  onClick={onClose}
                  className="w-11 h-11 bg-[#FFB300] text-gray-950 rounded-full flex items-center justify-center text-lg font-bold shadow-xl border-2 border-white transform active:scale-95 transition-transform"
                  title="Post New Listing"
                >
                  +
                </Link>
              </div>

              {/* Mobile Bottom Navigation Bar */}
              <div className="bg-white border-t border-gray-200 px-3 py-2 flex justify-between items-center z-20">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                    activeTab === 'home' ? 'text-[#2E7D32]' : 'text-gray-400'
                  }`}
                >
                  <span className="text-sm">🏠</span>
                  <span>Home</span>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                    activeTab === 'categories' ? 'text-[#2E7D32]' : 'text-gray-400'
                  }`}
                >
                  <span className="text-sm">🗂️</span>
                  <span>Categories</span>
                </button>

                <button
                  onClick={() => setActiveTab('post')}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                    activeTab === 'post' ? 'text-[#2E7D32]' : 'text-gray-400'
                  }`}
                >
                  <span className="text-sm">➕</span>
                  <span>Post</span>
                </button>

                <button
                  onClick={() => setActiveTab('listings')}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                    activeTab === 'listings' ? 'text-[#2E7D32]' : 'text-gray-400'
                  }`}
                >
                  <span className="text-sm">📋</span>
                  <span>Listings</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                    activeTab === 'profile' ? 'text-[#2E7D32]' : 'text-gray-400'
                  }`}
                >
                  <span className="text-sm">👤</span>
                  <span>Profile</span>
                </button>
              </div>

              {/* iOS Home Indicator Bar */}
              {deviceType === 'ios' && (
                <div className="w-28 h-1 bg-gray-400 rounded-full mx-auto mt-1" />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
