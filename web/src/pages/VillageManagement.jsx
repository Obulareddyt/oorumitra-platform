import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { villageApi, userMgmtApi } from '../api/client'
import Toast, { useToast } from '../components/Toast'

const STATUS_BADGE = { ACTIVE: 'bg-green-100 text-green-700', INACTIVE: 'bg-gray-100 text-gray-500' }

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Village Modal ──────────────────────────────────────────────────────────────
function VillageModal({ village, onClose, onSaved, toast }) {
  const [form, setForm] = useState({
    name: village?.name ?? '',
    mandal: village?.mandal ?? '',
    district: village?.district ?? '',
    state: village?.state ?? '',
    pincode: village?.pincode ?? '',
    status: village?.status ?? 'ACTIVE',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setErr('Village name is required'); return }
    if (!form.district.trim()) { setErr('District is required'); return }
    if (!form.state.trim()) { setErr('State is required'); return }
    setSaving(true); setErr('')
    try {
      const result = village
        ? await villageApi.update(village.id, form)
        : await villageApi.create(form)
      toast.add(village ? 'Village updated' : 'Village created', 'success')
      onSaved(result)
    } catch (ex) { setErr(ex.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">{village ? 'Edit Village' : 'Add Village'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <form onSubmit={save} className="p-6 space-y-4">
          {[
            ['name', 'Village Name', true],
            ['mandal', 'Mandal / Taluk', false],
            ['district', 'District', true],
            ['state', 'State', true],
            ['pincode', 'Pincode', false],
          ].map(([key, label, req]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {req && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                className="input"
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                maxLength={key === 'pincode' ? 10 : 100}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          {err && <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary py-2">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary py-2">
              {saving ? 'Saving…' : village ? 'Save Changes' : 'Create Village'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Assign Admin Modal ─────────────────────────────────────────────────────────
function AssignAdminModal({ village, onClose, onSaved, toast }) {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userMgmtApi.list({ search: search || undefined, size: 20 })
        setUsers(data.content)
      } catch {}
    }
    load()
  }, [search])

  const assign = async () => {
    if (!selectedUser) { setErr('Select a user to assign'); return }
    setSaving(true); setErr('')
    try {
      const result = await villageApi.assignAdmin(village.id, selectedUser.id)
      toast.add(`${selectedUser.firstName} assigned as Village Admin`, 'success')
      onSaved(result)
    } catch (ex) { setErr(ex.message) }
    finally { setSaving(false) }
  }

  const remove = async (userId) => {
    try {
      const result = await villageApi.removeAdmin(village.id, userId)
      toast.add('Admin removed', 'success')
      onSaved(result)
    } catch (ex) { toast.add(ex.message, 'error') }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Village Admins — {village.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-6 space-y-4">
          {village.admins?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Current Admins</p>
              {village.admins.map(a => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-700">{a.firstName} {a.lastName} ({a.mobileNumber})</span>
                  <button onClick={() => remove(a.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
              ))}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Assign New Admin</p>
            <input
              type="text"
              className="input mb-2"
              placeholder="Search users by name or mobile…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              {users.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUser(u)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-50 ${selectedUser?.id === u.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}`}
                >
                  {u.firstName} {u.lastName} — {u.mobileNumber}
                </button>
              ))}
            </div>
          </div>
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 btn-secondary py-2">Close</button>
            <button onClick={assign} disabled={saving || !selectedUser} className="flex-1 btn-primary py-2">
              {saving ? 'Assigning…' : 'Assign Admin'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function VillageManagement() {
  const { user } = useAuth()
  const toast = useToast()

  if (user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500">You do not have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const [villages, setVillages] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editVillage, setEditVillage] = useState(null)
  const [adminVillage, setAdminVillage] = useState(null)

  const [tab, setTab] = useState('villages')
  const [report, setReport] = useState([])
  const [reportLoading, setReportLoading] = useState(false)

  const loadVillages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await villageApi.list({
        search: search || undefined,
        status: filterStatus || undefined,
        page, size: 10
      })
      setVillages(data.content)
      setTotal(data.totalElements)
      setTotalPages(data.totalPages)
    } catch (ex) { toast.add(ex.message, 'error') }
    finally { setLoading(false) }
  }, [search, filterStatus, page])

  const loadReport = useCallback(async () => {
    setReportLoading(true)
    try { setReport(await villageApi.summaryReport()) }
    catch (ex) { toast.add(ex.message, 'error') }
    finally { setReportLoading(false) }
  }, [])

  useEffect(() => { loadVillages() }, [loadVillages])
  useEffect(() => { if (tab === 'report') loadReport() }, [tab, loadReport])

  const toggle = async (v) => {
    try {
      const updated = await villageApi.toggleStatus(v.id)
      toast.add(`Village ${updated.status === 'ACTIVE' ? 'activated' : 'deactivated'}`, 'success')
      setVillages(prev => prev.map(x => x.id === updated.id ? updated : x))
    } catch (ex) { toast.add(ex.message, 'error') }
  }

  const openEdit = async (v) => {
    try {
      const full = await villageApi.get(v.id)
      setEditVillage(full); setShowModal(true)
    } catch (ex) { toast.add(ex.message, 'error') }
  }

  const openAdmins = async (v) => {
    try {
      const full = await villageApi.get(v.id)
      setAdminVillage(full)
    } catch (ex) { toast.add(ex.message, 'error') }
  }

  const handleSaved = (saved) => {
    setShowModal(false); setEditVillage(null); loadVillages()
  }

  const handleAdminSaved = (saved) => {
    setAdminVillage(saved)
    setVillages(prev => prev.map(x => x.id === saved.id ? { ...x, ...saved } : x))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toast toasts={toast.toasts} remove={toast.remove} />

      <div className="mb-6">
        <p className="text-sm text-gray-500">Administration</p>
        <h1 className="text-2xl font-bold text-gray-900">Village Management</h1>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {[['villages', 'Villages'], ['report', 'Summary Report']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'villages' && (
        <>
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <div className="flex flex-wrap gap-3 flex-1">
              <input type="text" placeholder="Search village or district…" className="input max-w-xs"
                value={search} onChange={e => { setSearch(e.target.value); setPage(0) }} />
              <select className="input max-w-[160px]" value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setPage(0) }}>
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <button onClick={() => { setEditVillage(null); setShowModal(true) }} className="btn-primary px-4 py-2 whitespace-nowrap">
              + Add Village
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Village Name', 'Mandal/Taluk', 'District', 'State', 'Status', 'Total Users', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading…</td></tr>
                  ) : villages.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">No villages found</td></tr>
                  ) : villages.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{v.name}</td>
                      <td className="px-4 py-3 text-gray-500">{v.mandal || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{v.district}</td>
                      <td className="px-4 py-3 text-gray-600">{v.state}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[v.status] ?? ''}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-medium">{v.totalUsers}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => openEdit(v)} className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
                          <button onClick={() => openAdmins(v)} className="text-xs text-purple-600 hover:underline font-medium">Admins</button>
                          <button onClick={() => toggle(v)}
                            className={`text-xs font-medium hover:underline ${v.status === 'ACTIVE' ? 'text-orange-500' : 'text-green-600'}`}>
                            {v.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span>{total} village{total !== 1 ? 's' : ''}</span>
                <div className="flex gap-1">
                  <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">←</button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i)}
                      className={`px-3 py-1 rounded-lg border ${i === page ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">→</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'report' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Village', 'District', 'Total Users', 'Farmers', 'Vendors', 'Service Providers', 'Village Admins', 'Members', 'Moderators'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reportLoading ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-400">Loading…</td></tr>
                ) : report.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-400">No data yet</td></tr>
                ) : report.map(r => (
                  <tr key={r.villageId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.villageName}</td>
                    <td className="px-4 py-3 text-gray-500">{r.district}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{r.totalUsers}</td>
                    <td className="px-4 py-3 text-gray-600">{r.farmers}</td>
                    <td className="px-4 py-3 text-gray-600">{r.vendors}</td>
                    <td className="px-4 py-3 text-gray-600">{r.serviceProviders}</td>
                    <td className="px-4 py-3 text-gray-600">{r.villageAdmins}</td>
                    <td className="px-4 py-3 text-gray-600">{r.members}</td>
                    <td className="px-4 py-3 text-gray-600">{r.moderators}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <VillageModal village={editVillage} onClose={() => { setShowModal(false); setEditVillage(null) }}
          onSaved={handleSaved} toast={toast} />
      )}
      {adminVillage && (
        <AssignAdminModal village={adminVillage} onClose={() => setAdminVillage(null)}
          onSaved={handleAdminSaved} toast={toast} />
      )}
    </div>
  )
}
