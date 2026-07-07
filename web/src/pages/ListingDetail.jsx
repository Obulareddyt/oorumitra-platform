import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsApi, workersApi, transportApi, vehicleWorkApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import Toast, { useToast } from '../components/Toast'

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
  SOLD:     'bg-red-600 text-white font-extrabold uppercase shadow-sm',
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
  const { user } = useAuth()
  const { t } = useTranslation()
  const toast = useToast()
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

  const handleMarkAsSold = async () => {
    const confirm = window.confirm("Are you sure you want to mark this product as sold?")
    if (!confirm) return
    try {
      setLoading(true)
      const updated = await productsApi.markAsSold(id)
      setData(updated)
    } catch (err) {
      alert(err.message || "Failed to mark product as sold.")
    } finally {
      setLoading(false)
    }
  }

  const formatAvailability = (val) => {
    if (!val) return '—'
    if (val.includes(' @ ')) {
      const [d, t] = val.split(' @ ')
      try {
        const formattedDate = new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' })
        return `${formattedDate} at ${t}`
      } catch {
        return val
      }
    }
    return val
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

  const extractDateRange = () => {
    if (!data) return null
    if (data.availability && data.availability.includes('From ') && data.availability.includes(' to ')) {
      const parts = data.availability.replace('From ', '').split(' to ')
      if (parts.length === 2) return { from: parts[0], to: parts[1] }
    }
    if (data.description) {
      const match = data.description.match(/Available:?\s*([0-9-]{10})\s*to\s*([0-9-]{10})/)
      if (match) return { from: match[1], to: match[2] }
    }
    return null
  }

  const range = extractDateRange()

  const mapsUrl = userLoc && sellerLat && sellerLng
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${sellerLat},${sellerLng}`
    : sellerLat
    ? `https://www.google.com/maps/search/?api=1&query=${sellerLat},${sellerLng}`
    : null

  const images = data.imageUrls || []
  const isSold = data.approvalStatus === 'SOLD'
  const isOwner = user && data && Number(user.userId || user.id) === Number(data.userId)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Toast toasts={toast.toasts} remove={toast.remove} />
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
            
            {/* Sold Tag Overlay */}
            {isSold && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <span className="border-4 border-red-500 text-red-500 font-black tracking-widest text-2xl uppercase px-5 py-2.5 rounded-xl rotate-[-8deg] shadow-lg">
                  SOLD OUT
                </span>
              </div>
            )}

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
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-300 text-5xl relative">
            📷
            {isSold && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <span className="border-4 border-red-500 text-red-500 font-black tracking-widest text-2xl uppercase px-5 py-2.5 rounded-xl rotate-[-8deg] shadow-lg">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-5 sm:p-6 text-left">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold transition-all duration-300 ${
                  (type === 'products' ? data.availabilityStatus === 'ACTIVE' : data.availableStatus)
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${(type === 'products' ? data.availabilityStatus === 'ACTIVE' : data.availableStatus) ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  {(type === 'products' ? data.availabilityStatus === 'ACTIVE' : data.availableStatus) ? t('product.status.active', 'Active') : t('product.status.inactive', 'Inactive')}
                </span>
                {cfg.getVillage(data) && (
                  <span className="text-xs text-gray-500 font-medium">📍 {cfg.getVillage(data)}</span>
                )}
              </div>
            </div>
            {/* Customer-facing: Hide APPROVED label on product detail, but show for owner/admin. Or simply only render if not APPROVED */}
            {data.approvalStatus !== 'APPROVED' && (
              <span className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ${STATUS_BADGE[data.approvalStatus] ?? ''}`}>
                {data.approvalStatus}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="mb-5">
            {rows.map(([label, value]) => (
              <Row key={label} label={label} value={value} />
            ))}
            <Row label="Posted Date" value={fmt(data.createdAt)} />
          </div>

          {/* Voice description audio note player */}
          {data.voiceNoteUrl && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-4 mb-5 border border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🎙️</span> Seller's Voice Description
              </p>
              <audio src={data.voiceNoteUrl} controls className="w-full mt-1 h-10" />
            </div>
          )}

          {/* Availability schedule */}
          {type === 'products' && data.availability && (
            <div className="bg-amber-50/40 rounded-2xl p-4 mb-5 border border-amber-100 text-left">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>📅</span> Availability Status
              </p>
              <p className="text-sm text-gray-700 font-extrabold">{data.availability}</p>
            </div>
          )}

          {range && type !== 'products' && (
            <div className="bg-amber-50/40 rounded-2xl p-4 mb-5 border border-amber-100 text-left">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>📅</span> Available Date Range
              </p>
              <p className="text-sm text-gray-700 font-extrabold">
                {new Date(range.from).toLocaleDateString('en-IN', { dateStyle: 'medium' })} — {new Date(range.to).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </p>
            </div>
          )}

          {/* Contact Details */}
          {isSold ? (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-5">
              <p className="text-sm font-bold text-gray-800 mb-2">Seller Contact Info</p>
              <div className="text-gray-600 font-bold text-sm">👤 {data.ownerName}</div>
              <div className="mt-3 bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-xs font-semibold flex items-center gap-1.5">
                <span>🚫</span> Call and WhatsApp inquiries are disabled because this product has been sold out.
              </div>
            </div>
          ) : (
            <div className="bg-primary-50 rounded-2xl p-5 mb-5">
              <p className="text-sm font-black text-gray-800 mb-3">Contact Seller</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a href={`tel:${data.mobileNumber}`}
                  className="flex-1 btn-outline py-2.5 px-4 text-center font-bold tracking-wider uppercase flex items-center justify-center gap-2 bg-white">
                  📞 Call Seller ({data.mobileNumber})
                </a>
                <a href={`https://wa.me/91${data.mobileNumber}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 btn-primary py-2.5 px-4 text-center font-bold tracking-wider uppercase flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white border-transparent">
                  💬 WhatsApp Chat
                </a>
              </div>
              <p className="text-xs text-gray-500 font-bold mt-3">Listed by: <span className="text-gray-700 font-black">{data.ownerName}</span></p>
            </div>
          )}

          {/* Availability Status Management Dropdown / Toggle Switch */}
          {isOwner && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5 text-left shadow-xs">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                {type === 'products' ? t('products.availability_status_label', 'Availability Status') : '🟢 Availability Status'}
              </label>
              {type === 'products' ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={data.availabilityStatus === 'ACTIVE'}
                    disabled={loading}
                    onClick={async () => {
                      const nextStatus = data.availabilityStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
                      try {
                        setLoading(true);
                        const updated = await productsApi.updateAvailabilityStatus(id, nextStatus);
                        setData(updated);
                        toast.add(
                          nextStatus === 'ACTIVE'
                            ? t('product.status.marked_active', 'Product marked as Active.')
                            : t('product.status.marked_inactive', 'Product marked as Inactive.'),
                          'success'
                        );
                      } catch (err) {
                        toast.add(err.message || 'Failed to update availability status.', 'error');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      data.availabilityStatus === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        data.availabilityStatus === 'ACTIVE' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-bold text-gray-700">
                    {data.availabilityStatus === 'ACTIVE' ? t('product.status.active', 'Active') : t('product.status.inactive', 'Inactive')}
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={data.availableStatus ? 'ACTIVE' : 'INACTIVE'}
                    onChange={async (e) => {
                      const nextVal = e.target.value === 'ACTIVE';
                      try {
                        setLoading(true);
                        const updated = await cfg.api.updateAvailability(id, nextVal);
                        setData(updated);
                        toast.add(
                          nextVal
                            ? t('product.status.marked_active', 'Status marked as Active.')
                            : t('product.status.marked_inactive', 'Status marked as Inactive.'),
                          'success'
                        );
                      } catch (err) {
                        toast.add(err.message || "Failed to update availability status.", 'error');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-700 font-extrabold text-sm rounded-xl px-3 py-2.5 focus:ring-primary-500 focus:border-primary-500 transition-all hover:bg-gray-100/80 cursor-pointer"
                  >
                    <option value="ACTIVE" className="text-green-600 font-bold">🟢 Active (Visible in public searches)</option>
                    <option value="INACTIVE" className="text-gray-500 font-bold">⚫ Inactive (Hidden from public searches)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Mark as Sold action button */}
          {isOwner && !isSold && type === 'products' && (
            <button 
              onClick={handleMarkAsSold}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold tracking-widest uppercase rounded-2xl shadow-md transition-all active:scale-95 mb-5 flex items-center justify-center gap-2"
            >
              🤝 Mark as Sold
            </button>
          )}

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


        </div>
      </div>
    </div>
  )
}
