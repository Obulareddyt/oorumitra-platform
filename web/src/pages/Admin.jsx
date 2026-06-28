import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { PageSpinner } from '../components/Spinner'
import Toast, { useToast } from '../components/Toast'

const STATUS_BADGE = {
  PENDING:  'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

const TABS = ['Dashboard', 'Products', 'Workers', 'Transport', 'Vehicle Work']
const TYPE_KEYS = ['products', 'workers', 'transport', 'vehicleWork']

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function StatCard({ label, value, color = 'text-gray-800' }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value ?? 0}</p>
    </div>
  )
}

function RemarksModal({ item, action, listingName, onClose, onConfirm }) {
  const [remarks, setRemarks] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    if (!remarks.trim()) { setErr('Remarks are required before you can proceed.'); return }
    setSaving(true); setErr('')
    try { await onConfirm(item.id, remarks); onClose() }
    catch (e) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className={`flex items-center justify-between p-5 border-b rounded-t-2xl ${action === 'approve' ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className="text-lg font-bold text-gray-800">
            {action === 'approve' ? '✅ Approve' : '❌ Reject'} Listing
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
            <span className="font-medium">{listingName}</span>
            {item.ownerName && <span className="text-gray-500"> · {item.ownerName}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input resize-none"
              rows={4}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder={action === 'approve'
                ? 'e.g. Verified — listing looks good, contact info confirmed.'
                : 'e.g. Incomplete information provided, please resubmit with photos.'}
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">This will be sent to the user via SMS.</p>
          </div>
          {err && <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{err}</p>}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 btn-secondary py-2">Cancel</button>
            <button
              onClick={submit}
              disabled={saving}
              className={`flex-1 py-2 rounded-xl font-semibold text-white transition-colors ${
                action === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {saving ? 'Saving…' : action === 'approve' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ListingsTable({ items, loading, onApprove, onReject, getName, getVillage, getCategory }) {
  if (loading) return <div className="py-12 text-center text-gray-400">Loading…</div>
  if (!items?.length) return <div className="py-12 text-center text-gray-400">No listings found</div>
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {['Name / Type', 'Owner', 'Mobile', 'Village', 'Category', 'Posted', 'Status', 'Admin Remarks', 'Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">{getName(item)}</td>
              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{item.ownerName}</td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.mobileNumber}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{getVillage(item) || '—'}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{getCategory(item) || '—'}</td>
              <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(item.createdAt)}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[item.approvalStatus] ?? ''}`}>
                  {item.approvalStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 max-w-[180px]">
                {item.adminRemarks
                  ? <span title={item.adminRemarks} className="line-clamp-2 text-xs">{item.adminRemarks}</span>
                  : <span className="text-gray-300">—</span>}
              </td>
              <td className="px-4 py-3">
                {item.approvalStatus === 'PENDING' && (
                  <div className="flex gap-2">
                    <button onClick={() => onApprove(item)} className="text-xs text-green-600 hover:underline font-medium whitespace-nowrap">Approve</button>
                    <button onClick={() => onReject(item)} className="text-xs text-red-600 hover:underline font-medium whitespace-nowrap">Reject</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null
  return (
    <div className="px-4 py-3 border-t border-gray-100 flex gap-1 justify-end">
      <button disabled={page === 0} onClick={() => onPage(page - 1)}
        className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-sm">←</button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
        <button key={i} onClick={() => onPage(i)}
          className={`px-3 py-1 rounded-lg border text-sm ${i === page ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 hover:bg-gray-50'}`}>
          {i + 1}
        </button>
      ))}
      <button disabled={page >= totalPages - 1} onClick={() => onPage(page + 1)}
        className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-sm">→</button>
    </div>
  )
}

export default function Admin() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [tab, setTab] = useState('Dashboard')
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 1, totalElements: 0 })
  const [loading, setLoading] = useState(false)

  const [modal, setModal] = useState(null) // { item, action, getName, apiApprove, apiReject }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) { navigate('/'); return }
    adminApi.getStats().then(setStats).catch(() => {}).finally(() => setStatsLoading(false))
  }, [isLoggedIn, user])

  const tabConfig = {
    'Products':     { fetch: adminApi.getProducts,     getName: i => i.productName,  getVillage: i => i.location, getCategory: i => i.category },
    'Workers':      { fetch: adminApi.getWorkers,      getName: i => i.groupName,    getVillage: i => i.village,  getCategory: i => i.workType },
    'Transport':    { fetch: adminApi.getTransport,    getName: i => i.vehicleType,  getVillage: i => i.village,  getCategory: i => i.vehicleType },
    'Vehicle Work': { fetch: adminApi.getVehicleWork,  getName: i => i.vehicleType,  getVillage: i => i.village,  getCategory: i => i.vehicleType },
  }

  const loadTab = useCallback(async () => {
    if (tab === 'Dashboard') return
    const cfg = tabConfig[tab]
    if (!cfg) return
    setLoading(true)
    try {
      const res = await cfg.fetch({ status: statusFilter || undefined, page, size: 15 })
      setData(res)
    } catch (e) { toast.add(e.message, 'error') }
    finally { setLoading(false) }
  }, [tab, statusFilter, page])

  useEffect(() => { loadTab() }, [loadTab])

  const switchTab = (t) => { setTab(t); setPage(0); setStatusFilter('') }

  const handleDecide = async (item, action) => {
    const cfg = tabConfig[tab]
    const apiCall = action === 'approve'
      ? (tab === 'Products' ? adminApi.approveProduct
         : tab === 'Workers' ? adminApi.approveWorker
         : tab === 'Transport' ? adminApi.approveTransport
         : adminApi.approveVehicleWork)
      : (tab === 'Products' ? adminApi.rejectProduct
         : tab === 'Workers' ? adminApi.rejectWorker
         : tab === 'Transport' ? adminApi.rejectTransport
         : adminApi.rejectVehicleWork)

    try {
      const updated = await apiCall(item.id, { remarks: modal.remarks })
      toast.add(`Listing ${action === 'approve' ? 'approved' : 'rejected'}`, action === 'approve' ? 'success' : 'error')
      setData(prev => ({ ...prev, content: prev.content.map(x => x.id === updated.id ? updated : x) }))
      adminApi.getStats().then(setStats).catch(() => {})
    } catch (e) { throw e }
  }

  const openModal = (item, action) => {
    setModal({ item, action, listingName: tabConfig[tab]?.getName(item) || '' })
  }

  const confirmModal = async (id, remarks) => {
    const cfg = tabConfig[tab]
    if (!cfg) return
    const apiCall = modal.action === 'approve'
      ? (tab === 'Products' ? adminApi.approveProduct
         : tab === 'Workers' ? adminApi.approveWorker
         : tab === 'Transport' ? adminApi.approveTransport
         : adminApi.approveVehicleWork)
      : (tab === 'Products' ? adminApi.rejectProduct
         : tab === 'Workers' ? adminApi.rejectWorker
         : tab === 'Transport' ? adminApi.rejectTransport
         : adminApi.rejectVehicleWork)

    const updated = await apiCall(id, { remarks })
    toast.add(`Listing ${modal.action === 'approve' ? 'approved' : 'rejected'}`, modal.action === 'approve' ? 'success' : 'error')
    setData(prev => ({ ...prev, content: prev.content.map(x => x.id === updated.id ? updated : x) }))
    adminApi.getStats().then(setStats).catch(() => {})
  }

  if (!isLoggedIn || !isAdmin) return null

  const cfg = tabConfig[tab]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toast toasts={toast.toasts} remove={toast.remove} />

      <div className="mb-6">
        <p className="text-sm text-gray-500">Administration</p>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel 🛡️</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => switchTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              tab === t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'Dashboard' && (
        statsLoading ? <PageSpinner /> : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Posts"    value={stats?.totalPosts}    />
              <StatCard label="Pending"        value={stats?.totalPending}  color="text-amber-600" />
              <StatCard label="Approved"       value={stats?.totalApproved} color="text-green-600" />
              <StatCard label="Rejected"       value={stats?.totalRejected} color="text-red-600"   />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Products',     total: stats?.totalProducts,    pending: stats?.pendingProducts,    approved: stats?.approvedProducts,    rejected: stats?.rejectedProducts    },
                { label: 'Workers',      total: stats?.totalWorkers,     pending: stats?.pendingWorkers,     approved: stats?.approvedWorkers,     rejected: stats?.rejectedWorkers     },
                { label: 'Transport',    total: stats?.totalTransport,   pending: stats?.pendingTransport,   approved: stats?.approvedTransport,   rejected: stats?.rejectedTransport   },
                { label: 'Vehicle Work', total: stats?.totalVehicleWork, pending: stats?.pendingVehicleWork, approved: stats?.approvedVehicleWork, rejected: stats?.rejectedVehicleWork },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="font-semibold text-gray-800 mb-3">{s.label}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-medium">{s.total ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-amber-600">Pending</span><span className="font-medium text-amber-600">{s.pending ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-green-600">Approved</span><span className="font-medium text-green-600">{s.approved ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-red-500">Rejected</span><span className="font-medium text-red-500">{s.rejected ?? 0}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Listing tabs */}
      {tab !== 'Dashboard' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <select
              className="input max-w-[160px] text-sm"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(0) }}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <span className="text-sm text-gray-400">{data.totalElements} listing{data.totalElements !== 1 ? 's' : ''}</span>
          </div>

          <ListingsTable
            items={data.content}
            loading={loading}
            onApprove={item => openModal(item, 'approve')}
            onReject={item => openModal(item, 'reject')}
            getName={cfg?.getName || (i => i.id)}
            getVillage={cfg?.getVillage || (() => '')}
            getCategory={cfg?.getCategory || (() => '')}
          />

          <Pagination page={page} totalPages={data.totalPages} onPage={setPage} />
        </div>
      )}

      {modal && (
        <RemarksModal
          item={modal.item}
          action={modal.action}
          listingName={modal.listingName}
          onClose={() => setModal(null)}
          onConfirm={confirmModal}
        />
      )}
    </div>
  )
}
