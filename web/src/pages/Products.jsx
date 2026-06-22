import { useEffect, useState } from 'react'
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

export default function Products() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('ALL')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    setLoading(true)
    productsApi
      .getAll({ category: category === 'ALL' ? undefined : category, page, size: 12 })
      .then((data) => {
        setItems(data.content ?? [])
        setTotalPages(data.totalPages ?? 1)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [category, page])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products for Sale 🛒</h1>
          <p className="text-gray-500 text-sm mt-0.5">Buy agricultural goods, hardware, livestock & vehicles</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(0) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <PageSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon="🛒" title="No products found" description="No listings match the selected filter." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} onBook={() => setBooking(product)} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {booking && (
        <BookingModal
          listing={booking}
          listingType="PRODUCT"
          onClose={() => setBooking(null)}
        />
      )}
    </div>
  )
}

function ProductCard({ product, onBook }) {
  return (
    <div className="card flex flex-col">
      {/* Image */}
      <div className="h-40 bg-gray-100 flex items-center justify-center text-4xl overflow-hidden">
        {product.imageUrls?.length > 0 ? (
          <img src={product.imageUrls[0]} alt={product.productName} className="w-full h-full object-cover" />
        ) : (
          <span>📦</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-gray-800 leading-tight line-clamp-1">{product.productName}</p>
          <span className={`badge shrink-0 ${categoryColor[product.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {product.category}
          </span>
        </div>
        <p className="text-xl font-bold text-primary-600 mb-1">
          ₹{product.amount?.toLocaleString('en-IN')}
          {product.negotiable && <span className="text-xs font-normal text-gray-400 ml-1">(Negotiable)</span>}
        </p>
        <p className="text-sm text-gray-500 mb-1">📍 {product.location || '—'}</p>
        <p className="text-sm text-gray-500 mb-3">👤 {product.ownerName}</p>
        {product.averageRating > 0 && (
          <p className="text-xs text-amber-600 mb-2">⭐ {product.averageRating?.toFixed(1)} ({product.ratingCount})</p>
        )}
        <div className="mt-auto flex gap-2">
          <a href={`tel:${product.mobileNumber}`} className="btn-outline text-xs py-1.5 flex-1 text-center">
            📞 Call
          </a>
          <button onClick={onBook} className="btn-primary text-xs py-1.5 flex-1">
            Book
          </button>
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
