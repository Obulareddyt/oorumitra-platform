import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsApi, workersApi, transportApi, vehicleWorkApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import Toast, { useToast } from '../components/Toast'

const NO_PHOTO_BANNER = {
  products: { icon: '🛒', label: 'Product Listing', gradient: 'from-emerald-100 to-green-50' },
  workers: { icon: '👷', label: 'Worker Service', gradient: 'from-blue-100 to-sky-50' },
  transport: { icon: '🚛', label: 'Transport Service', gradient: 'from-amber-100 to-orange-50' },
  'vehicle-work': { icon: '🚜', label: 'Vehicle Work Service', gradient: 'from-purple-100 to-violet-50' },
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return (2 * R * Math.asin(Math.sqrt(a))).toFixed(1)
}

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtAmount(n) {
  return Number(n).toLocaleString('en-IN')
}

function resolveMediaUrl(url) {
  if (!url) return ''
  if (typeof url !== 'string') return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }
  let path = url.startsWith('/') ? url : `/${url}`
  if (path.startsWith('/uploads/')) {
    path = `/api${path}`
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
  const serverHost = apiBase.startsWith('http')
    ? apiBase.replace(/\/api\/?$/, '')
    : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080')
  return `${serverHost}${path}`
}

const STATUS_BADGE = {
  PENDING:  'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  SOLD:     'bg-red-600 text-white font-extrabold uppercase shadow-sm',
}

function Row({ label, value }) {
  if (!value && value !== 0 && value !== false) return null
  return (
    <div className="flex gap-3 py-2.5 border-b border-gray-100 last:border-0 items-center">
      <span className="text-gray-500 text-xs sm:text-sm w-36 shrink-0 font-medium">{label}</span>
      <span className="text-gray-900 text-xs sm:text-sm font-bold flex-1">{String(value)}</span>
    </div>
  )
}

const TYPE_CONFIG = {
  products: {
    api: productsApi,
    getTitle: d => d.productName,
    getVillage: d => d.location,
    rows: d => [
      ['Category', d.category],
      ['Sub Category', d.subCategory],
      ['Price', d.amount != null ? `₹${fmtAmount(d.amount)}${d.negotiable ? ' (Negotiable)' : ''}` : null],
      ['Location', d.location],
      ['Description', d.description],
    ],
  },
  workers: {
    api: workersApi,
    getTitle: d => d.groupName,
    getVillage: d => d.village,
    rows: d => [
      ['Work Type', d.workType],
      ['Available Workers', d.availableWorkers],
      ['Price', d.amount != null ? `₹${fmtAmount(d.amount)} / ${d.priceType}` : null],
      ['Village', d.village],
      ['Description', d.description],
    ],
  },
  transport: {
    api: transportApi,
    getTitle: d => d.vehicleType,
    getVillage: d => d.village,
    rows: d => [
      ['Vehicle Type', d.vehicleType],
      ['Price', d.amount != null ? `₹${fmtAmount(d.amount)} / ${d.priceType}` : null],
      ['Weight Capacity', d.weightCapacity],
      ['Availability', d.availability],
      ['Village', d.village],
      ['Negotiable', d.negotiable ? 'Yes' : null],
      ['Description', d.description],
    ],
  },
  'vehicle-work': {
    api: vehicleWorkApi,
    getTitle: d => d.vehicleType,
    getVillage: d => d.village,
    rows: d => [
      ['Vehicle Type', d.vehicleType],
      ['Price', d.amount != null ? `₹${fmtAmount(d.amount)} / ${d.priceType}` : null],
      ['Village', d.village],
      ['Available Until', d.availableUntil],
      ['Description', d.description],
    ],
  },
}

export default function ListingDetail() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  const toast = useToast()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [photo, setPhoto] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [userLoc, setUserLoc] = useState(null)

  const cfg = TYPE_CONFIG[type]

  useEffect(() => {
    if (!cfg) { setError('Unknown listing type'); setLoading(false); return }
    cfg.api.getById(id)
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [type, id])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      )
    }
  }, [])

  const handleMarkAsSold = async () => {
    const confirm = window.confirm("Are you sure you want to mark this product as sold?")
    if (!confirm) return
    try {
      setLoading(true)
      const updated = await productsApi.markAsSold(id)
      setData(updated)
      toast.add('Listing marked as Sold successfully!', 'success')
    } catch (err) {
      alert(err.message || "Failed to mark product as sold.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageSpinner />
  if (error || !data) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-4xl mb-4">😕</p>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Listing not found</h2>
      <p className="text-gray-500 mb-6">{error || 'This listing may have been removed.'}</p>
      <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
    </div>
  )

  const title = cfg.getTitle(data)
  const rows = cfg.rows(data).filter(([, v]) => v != null && v !== '')
  const sellerLat = data.latitude ? parseFloat(data.latitude) : null
  const sellerLng = data.longitude ? parseFloat(data.longitude) : null
  const distance = userLoc && sellerLat && sellerLng
    ? haversine(userLoc.lat, userLoc.lng, sellerLat, sellerLng)
    : null

  const mapsUrl = userLoc && sellerLat && sellerLng
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${sellerLat},${sellerLng}`
    : sellerLat
    ? `https://www.google.com/maps/search/?api=1&query=${sellerLat},${sellerLng}`
    : null

  const rawImages = Array.isArray(data.imageUrls) ? data.imageUrls : typeof data.imageUrls === 'string' ? data.imageUrls.split(',') : []
  const images = rawImages.map(url => resolveMediaUrl(url)).filter(Boolean)
  const voiceUrl = data.voiceNoteUrl ? resolveMediaUrl(data.voiceNoteUrl) : null
  const isSold = data.approvalStatus === 'SOLD'
  const isOwner = user && data && Number(user.userId || user.id) === Number(data.userId)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Toast toasts={toast.toasts} remove={toast.remove} />
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-[#2E7D32]">
          ← Back to Marketplace
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm"
        >
          <span>🔗</span>
          <span>Share Listing</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Gallery & Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-emerald-950/10 overflow-hidden shadow-md">
            {images.length > 0 ? (
              <div className="relative">
                <img
                  src={images[photo]}
                  alt={title}
                  onClick={() => setShowLightbox(true)}
                  className="w-full h-80 sm:h-96 object-cover cursor-zoom-in"
                  onError={e => { e.target.src = 'https://placehold.co/600x400?text=No+Image' }}
                />
                
                {isSold && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="border-4 border-red-500 text-red-500 font-black tracking-widest text-2xl uppercase px-5 py-2.5 rounded-xl rotate-[-8deg] shadow-lg">
                      SOLD OUT
                    </span>
                  </div>
                )}

                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto bg-gray-900/40 backdrop-blur-md">
                    {images.map((url, i) => (
                      <img key={i} src={url} alt="" onClick={() => setPhoto(i)}
                        className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition-all ${i === photo ? 'border-amber-400 scale-105' : 'border-transparent opacity-60'}`} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={`w-full h-64 bg-gradient-to-br ${NO_PHOTO_BANNER[type]?.gradient || 'from-gray-100 to-gray-50'} flex flex-col items-center justify-center gap-2 relative`}>
                <span className="text-6xl">{NO_PHOTO_BANNER[type]?.icon || '🛍️'}</span>
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wide">{NO_PHOTO_BANNER[type]?.label || 'Listing'}</span>
                {isSold && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="border-4 border-red-500 text-red-500 font-black tracking-widest text-2xl uppercase px-5 py-2.5 rounded-xl rotate-[-8deg] shadow-lg">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Specification Rows */}
          <div className="bg-white rounded-3xl border border-emerald-950/10 p-6 shadow-sm text-left space-y-4">
            <h3 className="text-lg font-bold text-gray-900 font-heading border-b border-gray-100 pb-3">
              Listing Details & Specifications
            </h3>
            <div className="space-y-1">
              {rows.map(([label, value]) => (
                <Row key={label} label={label} value={value} />
              ))}
              <Row label="Posted Date" value={fmt(data.createdAt)} />
            </div>

            {voiceUrl && (
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100">
                <p className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>🎙️</span> Seller's Voice Note
                </p>
                <audio src={voiceUrl} controls className="w-full h-10" />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing, Seller Info, CTAs, Map */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Main Price & Title Card */}
          <div className="bg-white rounded-3xl border border-emerald-950/10 p-6 shadow-sm space-y-4">
            <div>
              <span className="px-3 py-1 bg-emerald-100 text-[#2E7D32] rounded-full text-xs font-bold uppercase tracking-wider">
                {type}
              </span>
              <h1 className="text-2xl font-extrabold text-gray-900 mt-2 font-heading">{title}</h1>
              <p className="text-xs text-gray-500 mt-1">📍 {cfg.getVillage(data) || 'Panchayat Area'}</p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-[#2E7D32] font-heading">
                  ₹{data.amount ? fmtAmount(data.amount) : 'Contact'}
                </span>
                <span className="text-xs text-gray-500 font-semibold ml-1">
                  {data.priceType ? `/ ${data.priceType}` : ''}
                </span>
              </div>
              {data.negotiable && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Negotiable Price
                </span>
              )}
            </div>

            {/* Seller Info Card */}
            <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-lg shadow">
                  {(data.ownerName || 'V')[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{data.ownerName || 'Village Seller'}</h4>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    ✓ Panchayat Verified User
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Contact CTAs */}
            {isSold ? (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-xs font-bold text-center">
                🚫 Inquiries disabled (Listing Sold Out)
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/91${data.mobileNumber}?text=Hi%20${encodeURIComponent(data.ownerName)},%20I%20am%20interested%20in%20your%20OoruMitra%20listing:%20${encodeURIComponent(title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm border border-emerald-500 active:scale-95"
                >
                  <span>💬</span>
                  <span>WhatsApp Seller Direct</span>
                </a>

                <a
                  href={`tel:${data.mobileNumber}`}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-extrabold py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm active:scale-95 shadow-xs"
                >
                  <span>📞</span>
                  <span>Call Seller ({data.mobileNumber})</span>
                </a>
              </div>
            )}

            {isOwner && !isSold && type === 'products' && (
              <button
                onClick={handleMarkAsSold}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-95 text-xs uppercase tracking-wider"
              >
                🤝 Mark as Sold Out
              </button>
            )}
          </div>

          {/* Location Map Preview Widget */}
          <div className="bg-white rounded-3xl border border-emerald-950/10 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-gray-900 text-sm font-heading flex items-center gap-1.5">
              <span>🗺️</span>
              <span>Location & Distance</span>
            </h4>
            
            {distance && (
              <div className="text-xs text-gray-600 font-medium">
                Distance from your location: <span className="font-extrabold text-[#2E7D32]">{distance} km</span>
              </div>
            )}

            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold py-2.5 px-4 rounded-xl border border-gray-200 text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open Google Maps Directions</span>
                <span>↗</span>
              </a>
            ) : (
              <p className="text-xs text-gray-400">GPS Coordinates not available</p>
            )}
          </div>

        </div>
      </div>

      {/* Lightbox Fullscreen Modal */}
      {showLightbox && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold hover:text-amber-400"
          >
            ×
          </button>
          <img src={images[photo]} alt="" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-left space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg">Share Listing</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
            </div>
            
            <p className="text-xs text-gray-500">Copy listing link or share with nearby villagers on WhatsApp:</p>
            
            <div className="p-3 bg-gray-50 rounded-xl border text-xs font-mono text-gray-700 truncate">
              {window.location.href}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.add('Link copied to clipboard!', 'success')
                  setShowShareModal(false)
                }}
                className="flex-1 btn-primary text-xs py-2.5"
              >
                Copy Link
              </button>
              
              <a
                href={`https://wa.me/?text=Check%20out%20this%20OoruMitra%20listing:%20${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 text-white font-bold rounded-xl text-xs py-2.5 text-center"
              >
                Share on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
