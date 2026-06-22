import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { PageSpinner } from '../components/Spinner'
import EmptyState from '../components/EmptyState'

const SECTIONS = [
  { key: 'products', label: 'Products', icon: '🛒', nameField: 'productName', approve: adminApi.approveProduct, reject: adminApi.rejectProduct },
  { key: 'workers', label: 'Workers', icon: '👤', nameField: 'groupName', approve: adminApi.approveWorker, reject: adminApi.rejectWorker },
  { key: 'transport', label: 'Transport', icon: '🚛', nameField: 'vehicleType', approve: adminApi.approveTransport, reject: adminApi.rejectTransport },
  { key: 'vehicleWork', label: 'Vehicle Work', icon: '🚜', nameField: 'vehicleType', approve: adminApi.approveVehicleWork, reject: adminApi.rejectVehicleWork },
]

export default function Admin() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [pending, setPending] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'ADMIN') { navigate('/'); return }
    adminApi.getPending()
      .then(setPending)
      .catch(() => setPending({ products: [], workers: [], transport: [], vehicleWork: [] }))
      .finally(() => setLoading(false))
  }, [isLoggedIn, user])

  const handleDecide = async (section, id, action) => {
    setBusyId(id)
    try {
      await action(id)
      setPending((prev) => ({ ...prev, [section.key]: prev[section.key].filter((item) => item.id !== id) }))
    } catch {
      // leave the item in the list if the request fails
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <PageSpinner />

  const totalPending = SECTIONS.reduce((sum, s) => sum + (pending?.[s.key]?.length ?? 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Panel 🛡️</h1>
      <p className="text-gray-500 text-sm mb-6">Review and approve listings before they go public</p>

      {totalPending === 0 ? (
        <EmptyState icon="✅" title="Nothing pending" description="All listings have been reviewed." />
      ) : (
        SECTIONS.map((section) => {
          const items = pending?.[section.key] ?? []
          if (items.length === 0) return null
          return (
            <div key={section.key} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                {section.icon} {section.label} <span className="text-sm font-normal text-gray-400">({items.length})</span>
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="card p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">{item[section.nameField]}</p>
                      <p className="text-sm text-gray-500">{item.ownerName} · 📞 {item.mobileNumber}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        disabled={busyId === item.id}
                        onClick={() => handleDecide(section, item.id, section.reject)}
                        className="btn-outline text-xs py-1.5 px-3 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Reject
                      </button>
                      <button
                        disabled={busyId === item.id}
                        onClick={() => handleDecide(section, item.id, section.approve)}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
