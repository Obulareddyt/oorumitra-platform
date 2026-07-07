import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { workersApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import BookingModal from '../components/BookingModal'

const WORK_TYPES = [
  'ALL', 'HARVESTING', 'PLANTING', 'CONSTRUCTION', 'MASON_WORK', 'PAINTING',
  'PLUMBING', 'ELECTRICAL', 'CARPENTER', 'BOREWELL_WORK', 'ROAD_WORK',
  'CLEANING', 'LOADING_UNLOADING', 'AGRICULTURE_WORK', 'OTHERS',
]

const workTypeLabel = (t) => t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

const workTypeIcon = {
  HARVESTING: '🌾', PLANTING: '🌱', CONSTRUCTION: '🏗️', MASON_WORK: '🧱',
  PAINTING: '🎨', PLUMBING: '🔧', ELECTRICAL: '⚡', CARPENTER: '🪚',
  BOREWELL_WORK: '⛏️', ROAD_WORK: '🛣️', CLEANING: '🧹',
  LOADING_UNLOADING: '📦', AGRICULTURE_WORK: '🚜', OTHERS: '👷',
}

export default function Workers() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [workType, setWorkType] = useState('ALL')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    setLoading(true)
    workersApi
      .getAll({ workType: workType === 'ALL' ? undefined : workType, page, size: 12 })
      .then((data) => {
        setItems(data.content ?? [])
        setTotalPages(data.totalPages ?? 1)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [workType, page])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('workers.title', 'Worker Services 👷')}</h1>
        <p className="text-gray-500 text-sm mt-0.5">{t('workers.subtitle', 'Find skilled labour for farming, construction & more')}</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {WORK_TYPES.slice(0, 8).map((tVal) => (
          <button
            key={tVal}
            onClick={() => { setWorkType(tVal); setPage(0) }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              workType === tVal
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {tVal === 'ALL' ? t('workers.filter.all', 'All Types') : workTypeIcon[tVal] + ' ' + t('workers.filter.' + tVal.toLowerCase(), workTypeLabel(tVal))}
          </button>
        ))}
      </div>

      {loading ? (
        <PageSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon="👷" title={t('workers.empty_title', 'No workers found')} description={t('workers.empty_desc', 'No listings match the selected filter.')} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((w, i) => (
              <div key={w.id} className="animate-fadeInUp" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
                <WorkerCard worker={w} onBook={() => setBooking(w)} />
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {booking && (
        <BookingModal listing={booking} listingType="WORKER" onClose={() => setBooking(null)} />
      )}
    </div>
  )
}

function WorkerCard({ worker, onBook }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="card flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/workers/${worker.id}`)}>
      {worker.imageUrls?.length > 0 && (
        <div className="h-32 bg-gray-100 overflow-hidden">
          <img src={worker.imageUrls[0]} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl shrink-0">
            {workTypeIcon[worker.workType] ?? '👷'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 leading-tight">{worker.groupName || worker.ownerName}</p>
            <span className="badge bg-blue-100 text-blue-700 mt-1">{t('workers.filter.' + worker.workType?.toLowerCase(), workTypeLabel(worker.workType))}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>👤 {worker.ownerName} · {worker.availableWorkers} {t('workers.workers_count', 'workers')}</p>
          <p>📍 {worker.village || '—'}</p>
          <p className="font-semibold text-gray-800">
            ₹{worker.amount?.toLocaleString('en-IN')}
            <span className="text-gray-400 font-normal ml-1 text-xs">/{worker.priceType?.toLowerCase()}</span>
          </p>
        </div>
        {worker.averageRating > 0 && (
          <p className="text-xs text-amber-600">⭐ {worker.averageRating?.toFixed(1)} ({worker.ratingCount} reviews)</p>
        )}
        <div className="flex gap-2 mt-auto">
          <a href={`tel:${worker.mobileNumber}`} className="btn-outline text-xs py-1.5 flex-1 text-center">📞 {t('products.call_seller', 'Call')}</a>
          <button onClick={onBook} className="btn-primary text-xs py-1.5 flex-1">{t('vehicles.book', 'Book')}</button>
        </div>
      </div>
    </div>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex justify-center gap-2 mt-8">
      <button disabled={page === 0} onClick={() => onChange(page - 1)} className="btn-outline px-3 py-1.5 text-sm disabled:opacity-40">← Prev</button>
      <span className="px-4 py-1.5 text-sm text-gray-600 font-medium">Page {page + 1} of {totalPages}</span>
      <button disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)} className="btn-outline px-3 py-1.5 text-sm disabled:opacity-40">Next →</button>
    </div>
  )
}
