import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { userMgmtApi, villageApi } from '../api/client'
import Toast, { useToast } from '../components/Toast'

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Village Admin',
  MODERATOR: 'Moderator',
  BUYER: 'Member',
  FARMER: 'Farmer',
  SELLER: 'Vendor',
  SERVICE_PROVIDER: 'Service Provider',
}

const ASSIGNABLE_ROLES = [
  { value: 'SUPER_ADMIN',      label: 'Super Admin' },
  { value: 'ADMIN',            label: 'Village Admin' },
  { value: 'MODERATOR',        label: 'Moderator' },
  { value: 'BUYER',            label: 'Member' },
  { value: 'FARMER',           label: 'Farmer' },
  { value: 'SELLER',           label: 'Vendor' },
  { value: 'SERVICE_PROVIDER', label: 'Service Provider' },
]

const ROLE_BADGE = {
  SUPER_ADMIN:      'bg-purple-100 text-purple-700',
  ADMIN:            'bg-blue-100 text-blue-700',
  MODERATOR:        'bg-indigo-100 text-indigo-700',
  BUYER:            'bg-gray-100 text-gray-600',
  FARMER:           'bg-green-100 text-green-700',
  SELLER:           'bg-amber-100 text-amber-700',
  SERVICE_PROVIDER: 'bg-teal-100 text-teal-700',
}

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Assign Role Modal ──────────────────────────────────────────────────────────
function AssignRoleModal({ user, villages, onClose, onSaved, toast }) {
  const [selectedVillage, setSelectedVillage] = useState(user.villageId ?? '')
  const [selectedRole, setSelectedRole] = useState(user.role ?? 'BUYER')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const save = async () => {
    if (selectedRole !== 'SUPER_ADMIN' && !selectedVillage) {
      setErr('Village must be selected before assigning a role.'); return
    }
    setSaving(true); setErr('')
    try {
      const result = await userMgmtApi.assignRole(user.id, {
        villageId: selectedVillage || null,
        role: selectedRole,
      })
      toast.add(`Role assigned to ${user.firstName}`, 'success')
      onSaved(result)
    } catch (ex) { setErr(ex.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Assign Role</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-6 space-y-4">
          {/* User info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
            <p><span className="text-gray-500">Name:</span> <span className="font-medium">{user.firstName} {user.lastName}</span></p>
            {user.username && <p><span className="text-gray-500">Username:</span> <span className="font-medium">@{user.username}</span></p>}
            <p><span className="text-gray-500">Mobile:</span> <span className="font-medium">{user.mobileNumber}</span></p>
            <p><span className="text-gray-500">Current Role:</span>{' '}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </p>
          </div>

          {/* Village selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Village <span className="text-red-500">*</span>
            </label>
            <select className="input" value={selectedVillage} onChange={e => setSelectedVillage(e.target.value)}>
              <option value="">— Select Village —</option>
              {villages.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.district})</option>
              ))}
            </select>
            {selectedRole === 'SUPER_ADMIN' && (
              <p className="text-xs text-gray-400 mt-1">Village not required for Super Admin.</p>
            )}
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select className="input" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
              {ASSIGNABLE_ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {err && <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{err}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 btn-secondary py-2">Cancel</button>
            <button onClick={save} disabled={saving} className="flex-1 btn-primary py-2">
              {saving ? 'Saving…' : 'Assign Role'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function UserManagement() {
  const { user: authUser } = useAuth()
  const toast = useToast()
  const isSuperAdmin = authUser?.role === 'SUPER_ADMIN'

  if (!isSuperAdmin && authUser?.role !== 'ADMIN') {
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

  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [filterVillage, setFilterVillage] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [villages, setVillages] = useState([])
  const [assignUser, setAssignUser] = useState(null)

  const loadVillages = useCallback(async () => {
    try { setVillages(await villageApi.getAll()) } catch {}
  }, [])

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await userMgmtApi.list({
        search: search || undefined,
        villageId: filterVillage || undefined,
        role: filterRole || undefined,
        status: filterStatus || undefined,
        page,
        size: 15,
      })
      setUsers(data.content)
      setTotal(data.totalElements)
      setTotalPages(data.totalPages)
    } catch (ex) { toast.add(ex.message, 'error') }
    finally { setLoading(false) }
  }, [search, filterVillage, filterRole, filterStatus, page])

  useEffect(() => { loadVillages() }, [loadVillages])
  useEffect(() => { loadUsers() }, [loadUsers])

  const toggleActive = async (u) => {
    try {
      const updated = await userMgmtApi.toggleActive(u.id)
      toast.add(`User ${updated.isActive ? 'activated' : 'deactivated'}`, 'success')
      setUsers(prev => prev.map(x => x.id === updated.id ? updated : x))
    } catch (ex) { toast.add(ex.message, 'error') }
  }

  const handleRoleAssigned = (updated) => {
    setAssignUser(null)
    setUsers(prev => prev.map(x => x.id === updated.id ? updated : x))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toast toasts={toast.toasts} remove={toast.remove} />

      <div className="mb-6">
        <p className="text-sm text-gray-500">Administration</p>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <input
          type="text"
          placeholder="Search name, username, mobile…"
          className="input max-w-xs"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0) }}
        />
        {isSuperAdmin && (
          <select className="input max-w-[180px]" value={filterVillage}
            onChange={e => { setFilterVillage(e.target.value); setPage(0) }}>
            <option value="">All Villages</option>
            {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        )}
        <select className="input max-w-[180px]" value={filterRole}
          onChange={e => { setFilterRole(e.target.value); setPage(0) }}>
          <option value="">All Roles</option>
          {ASSIGNABLE_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <select className="input max-w-[140px]" value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(0) }}>
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['First Name', 'Last Name', 'Username', 'Mobile', 'Village', 'Role', 'Status', 'Registered', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.firstName}</td>
                  <td className="px-4 py-3 text-gray-700">{u.lastName}</td>
                  <td className="px-4 py-3 text-gray-500">{u.username ? `@${u.username}` : '—'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.mobileNumber}</td>
                  <td className="px-4 py-3 text-gray-500">{u.villageName || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmt(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {isSuperAdmin && (
                        <button onClick={() => setAssignUser(u)} className="text-xs text-blue-600 hover:underline font-medium whitespace-nowrap">
                          Assign Role
                        </button>
                      )}
                      {isSuperAdmin && (
                        <button onClick={() => toggleActive(u)}
                          className={`text-xs font-medium hover:underline whitespace-nowrap ${u.isActive ? 'text-orange-500' : 'text-green-600'}`}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>{total} user{total !== 1 ? 's' : ''} found</span>
            <div className="flex gap-1">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">←</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
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

      {assignUser && (
        <AssignRoleModal
          user={assignUser}
          villages={villages}
          onClose={() => setAssignUser(null)}
          onSaved={handleRoleAssigned}
          toast={toast}
        />
      )}
    </div>
  )
}
