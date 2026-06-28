import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsApi, workersApi, transportApi, vehicleWorkApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'

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

const STATUS_BADGE = {
  PENDING:  'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

function Row({ label, value }) {
  if (!value && value !== 0 && value !== false) return null
  return (
    <div className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 text-sm w-36 shrink-0">{label}</span>
      <span className="text-gray-800 text-sm font-medium flex-1">{String(value)}</span>
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
      ['Price', d.amount != null ? `₹${d.amount}${d.negotiable ? ' (Negotiable)' : ''}` : null],
      ['Availability', d.availability],
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
      ['Price', d.amount != null ? `₹${d.amount} / ${d.priceType}` : null],
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
      ['Rate per KM', d.ratePerKm != null ? `₹${d.ratePerKm}` : null],
      ['Rate per Hour', d.ratePerHour != null ? `₹${d.ratePerHour}` : null],
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
      ['Price per Acre', d.pricePerAcre != null ? `₹${d.pricePerAcre}` : null],
      ['Price per Hour', d.pricePerHour != null ? `₹${d.pricePerHour}` : null],
      ['Village', d.village],
      ['Available Until', d.availableUntil],
      ['Description', d.description],
    ],
  },
}

export default function ListingDetail() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [photo, setPhoto] = useState(0)
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

  const images = data.imageUrls || []

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5">
        ← Back
      </button>

      <div className="card overflow-hidden">
        {/* Photo gallery */}
        {images.length > 0 ? (
          <div className="relative">
            <img
              src={images[photo]}
              alt={title}
              className="w-full h-72 object-cover"
              onError={e => { e.target.src = 'https://placehold.co/600x300?text=No+Image' }}
            />
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
                {images.map((url, i) => (
                  <img key={i} src={url} alt="" onClick={() => setPhoto(i)}
                    className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 transition-all ${i === photo ? 'border-primary-600' : 'border-transparent opacity-60'}`} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-300 text-5xl">📷</div>
        )}

        <div className="p-5 sm:p-6">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {cfg.getVillage(data) && (
                <p className="text-sm text-gray-500 mt-0.5">📍 {cfg.getVillage(data)}</p>
              )}
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ${STATUS_BADGE[data.approvalStatus] ?? ''}`}>
              {data.approvalStatus}
            </span>
          </div>

          {/* Details */}
          <div className="mb-5">
            {rows.map(([label, value]) => (
              <Row key={label} label={label} value={value} />
            ))}
            <Row label="Posted Date" value={fmt(data.createdAt)} />
          </div>

          {/* Contact */}
          <div className="bg-primary-50 rounded-xl p-4 mb-5">
            <p className="text-sm font-semibold text-gray-800 mb-2">Contact</p>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${data.mobileNumber}`}
                className="flex items-center gap-2 text-sm text-primary-700 font-medium hover:underline">
                📞 {data.mobileNumber}
              </a>
              {data.mobileNumber && (
                <a href={`https://wa.me/91${data.mobileNumber}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-700 font-medium hover:underline">
                  💬 WhatsApp
                </a>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{data.ownerName}</p>
          </div>

          {/* Distance + Map */}
          {(distance || mapsUrl) && (
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              {distance && (
                <p className="text-sm text-gray-700 mb-3">
                  📍 <span className="font-semibold">Distance from your location:</span>{' '}
                  <span className="text-primary-600 font-bold">{distance} KM</span>
                </p>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
                  🗺️ View on Google Maps
                </a>
              )}
            </div>
          )}

          {/* Admin remarks */}
          {data.adminRemarks && (
            <div className={`rounded-xl p-4 text-sm ${data.approvalStatus === 'REJECTED' ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
              <p className="font-semibold text-gray-700 mb-1">
                {data.approvalStatus === 'REJECTED' ? '❌ Rejection Reason' : '✅ Admin Remarks'}
              </p>
              <p className="text-gray-600">{data.adminRemarks}</p>
              {data.decidedBy && <p className="text-xs text-gray-400 mt-1">by {data.decidedBy} on {fmt(data.decidedAt)}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
