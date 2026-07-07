import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { productsApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import BookingModal from '../components/BookingModal'

const CATEGORIES = ['ALL', 'AGRICULTURE', 'HARDWARE', 'LIVESTOCK', 'VEHICLES', 'SEEDS', 'FRUITS', 'FLOWERS']

const categoryColor = {
  AGRICULTURE: 'bg-green-100 text-green-700',
  HARDWARE: 'bg-blue-100 text-blue-700',
  LIVESTOCK: 'bg-amber-100 text-amber-700',
  VEHICLES: 'bg-purple-100 text-purple-700',
  SEEDS: 'bg-lime-100 text-lime-700',
  FRUITS: 'bg-orange-100 text-orange-700',
  FLOWERS: 'bg-pink-100 text-pink-700',
}

function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function Products() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('ALL')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [userCoords, setUserCoords] = useState(null)

  // Fetch user location for distance calculations
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          })
        },
        () => {},
        { timeout: 8000 }
      )
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    productsApi
      .getAll({ category: category === 'ALL' ? undefined : category, page, size: 12 })
      .then((data) => {
        // Filter out SOLD products from public browse view, keeping PENDING/REJECTED filtered
        // but only show APPROVED listings. (Owner can view sold in profile listings).
        const activeListings = (data.content ?? []).filter(item => item.approvalStatus === 'APPROVED')
        setItems(activeListings)
        setTotalPages(data.totalPages ?? 1)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [category, page])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-left">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t('products.title', 'Products for Sale 🛒')}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{t('products.subtitle', 'Buy agricultural goods, hardware, livestock & vehicles directly from local producers')}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(0) }}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors tracking-wide uppercase ${
              category === cat
                ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {cat === 'ALL' ? t('products.filter.all', 'All') : t('products.filter.' + cat.toLowerCase(), cat.charAt(0) + cat.slice(1).toLowerCase())}
          </button>
        ))}
      </div>

      {loading ? (
        <PageSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon="🛒" title={t('products.empty_title', 'No products found')} description={t('products.empty_desc', 'No active listings match the selected filters.')} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product, i) => (
              <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
                <ProductCard product={product} userCoords={userCoords} />
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}

function ProductCard({ product, userCoords }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isSold = product.approvalStatus === 'SOLD'

  const getDistanceText = () => {
    if (!userCoords || !product.latitude || !product.longitude) return null
    const dist = getHaversineDistance(
      userCoords.lat,
      userCoords.lng,
      Number(product.latitude),
      Number(product.longitude)
    )
    if (isNaN(dist)) return null
    return `${dist.toFixed(1)} ${t('products.km_away', 'km away')}`
  }

  const distanceText = getDistanceText()

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative" 
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Category Tag Overlay */}
      <span className={`absolute top-3 left-3 z-10 badge shadow-sm font-extrabold text-[10px] tracking-wider uppercase ${categoryColor[product.category] ?? 'bg-gray-100 text-gray-600'}`}>
        {product.category}
      </span>

      {/* Image Area */}
      <div className="h-44 bg-gray-50 flex items-center justify-center text-5xl overflow-hidden relative">
        {product.imageUrls?.length > 0 ? (
          <img src={product.imageUrls[0]} alt={product.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="opacity-80">📦</span>
        )}

        {/* Sold Badge Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="border-4 border-red-500 text-red-500 font-black tracking-widest text-xl uppercase px-4 py-1.5 rounded-xl rotate-[-8deg] shadow-lg">
              {t('products.sold_out', 'SOLD OUT')}
            </span>
          </div>
        )}
      </div>

      {/* Content details */}
      <div className="p-5 flex flex-col flex-1 text-left">
        <h3 className="font-extrabold text-gray-800 text-md leading-snug tracking-tight line-clamp-1 group-hover:text-primary-600 transition-colors">
          {product.productName}
        </h3>
        
        <p className="text-2xl font-black text-primary-600 mt-1 tracking-tight">
          ₹{product.amount?.toLocaleString('en-IN')}
          {product.negotiable && <span className="text-xs font-bold text-gray-400 ml-1.5 uppercase tracking-wide">({t('products.negotiable', 'Negotiable')})</span>}
        </p>

        {/* Location & Distance metrics */}
        <div className="mt-3 space-y-1.5 text-xs text-gray-500 font-medium">
          <p className="flex items-center gap-1.5">
            <span className="text-sm">📍</span> 
            <span className="line-clamp-1">{product.location || '—'}</span>
          </p>
          {distanceText && (
            <p className="flex items-center gap-1.5 text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded-lg w-max text-[10px] tracking-wide">
              <span>⚡</span> {distanceText}
            </p>
          )}
          <p className="flex items-center gap-1.5">
            <span className="text-sm">👤</span> 
            <span>{product.ownerName}</span>
          </p>
        </div>

        {product.averageRating > 0 && (
          <p className="text-xs text-amber-600 font-bold mt-2.5 flex items-center gap-1">
            <span>⭐</span> {product.averageRating?.toFixed(1)} <span className="text-gray-400 font-normal">({product.ratingCount} reviews)</span>
          </p>
        )}

        {/* Action button cluster */}
        <div className="mt-5 flex gap-2 w-full pt-1.5 border-t border-gray-100">
          <a 
            href={`tel:${product.mobileNumber}`} 
            onClick={e => e.stopPropagation()} 
            className="btn-outline text-xs py-2 px-3 flex-1 text-center font-bold tracking-wider uppercase flex items-center justify-center gap-1"
          >
            📞 {t('products.call_seller', 'Call Seller')}
          </a>
          
          <a 
            href={isSold ? '#' : `https://wa.me/91${product.mobileNumber}`}
            target="_blank" 
            rel="noopener noreferrer"
            onClick={e => {
              e.stopPropagation()
              if (isSold) e.preventDefault()
            }} 
            className={`btn-primary text-xs py-2 px-3 flex-1 text-center font-bold tracking-wider uppercase flex items-center justify-center gap-1 shadow-sm ${
              isSold 
                ? 'bg-gray-200 text-gray-400 border-transparent cursor-not-allowed hover:bg-gray-200' 
                : 'bg-green-600 hover:bg-green-700 text-white border-transparent'
            }`}
          >
            💬 {t('products.whatsapp', 'WhatsApp')}
          </a>
        </div>
      </div>
    </div>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex justify-center gap-2 mt-10">
      <button disabled={page === 0} onClick={() => onChange(page - 1)} className="btn-outline px-4 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-40">← Prev</button>
      <span className="px-5 py-2 text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center">Page {page + 1} of {totalPages}</span>
      <button disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)} className="btn-outline px-4 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-40">Next →</button>
    </div>
  )
}
