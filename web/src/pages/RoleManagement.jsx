import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { rolesApi } from '../api/client'
import Toast, { useToast } from '../components/Toast'

const STATUS_BADGE = { ACTIVE: 'bg-green-100 text-green-700', INACTIVE: 'bg-gray-100 text-gray-500' }
const ACTION_BADGE = {
  ROLE_CREATED: 'bg-green-100 text-green-700',
  ROLE_UPDATED: 'bg-blue-100 text-blue-700',
  ROLE_DELETED: 'bg-red-100 text-red-700',
  PERMISSIONS_UPDATED: 'bg-purple-100 text-purple-700',
}

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtDt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ── Permission Checkboxes ─────────────────────────────────────────────────────
function PermissionPanel({ allPerms, selected, onChange }) {
  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]
    onChange(next)
  }
  const toggleCat = (perms) => {
    const ids = perms.map(p => p.id)
    const allOn = ids.every(id => selected.includes(id))
    const next = allOn ? selected.filter(id => !ids.includes(id)) : [...new Set([...selected, ...ids])]
    onChange(next)
  }
  return (
    <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
      {allPerms.map(group => {
        const ids = group.permissions.map(p => p.id)
        const allOn = ids.every(id => selected.includes(id))
        const someOn = ids.some(id => selected.includes(id))
        return (
          <div key={group.category}>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer mb-1">
              <input
                type="checkbox"
                checked={allOn}
                ref={el => { if (el) el.indeterminate = someOn && !allOn }}
                onChange={() => toggleCat(group.permissions)}
                className="rounded"
              />
              {group.category}
            </label>
            <div className="ml-6 grid grid-cols-2 gap-x-4 gap-y-1">
              {group.permissions.map(p => (
                <label key={p.id} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggle(p.id)}
                    className="rounded"
                  />
                  {p.name.replace(/_/g, ' ')}
                </label>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function RoleModal({ role, allPerms, onClose, onSaved, toast }) {
  const editing = !!role
  const [name, setName] = useState(role?.name ?? '')
  const [desc, setDesc] = useState(role?.description ?? '')
  const [status, setStatus] = useState(role?.status ?? 'ACTIVE')
  const [selectedPerms, setSelectedPerms] = useState(role?.permissions?.map(p => p.id) ?? [])
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const save = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setErr('Role name is required'); return }
    setSaving(true); setErr('')
    try {
      const payload = { name: name.trim(), description: desc, status, permissionIds: selectedPerms }
      const saved = editing
        ? await rolesApi.update(role.id, payload)
        : await rolesApi.create(payload)
      toast.add(editing ? 'Role updated successfully' : 'Role created successfully', 'success')
      onSaved(saved)
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">{editing ? 'Edit Role' : 'Add New Role'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <form onSubmit={save} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={e => { setName(e.target.value); setErr('') }}
              placeholder="e.g. District Manager"
              maxLength={50}
              disabled={role?.isSystem}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="input resize-none"
              rows={2}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Optional description"
              maxLength={500}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {allPerms.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div className="border border-gray-200 rounded-lg p-3">
                <PermissionPanel allPerms={allPerms} selected={selectedPerms} onChange={setSelectedPerms} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{selectedPerms.length} permission(s) selected</p>
            </div>
          )}

          {err && <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{err}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary py-2">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary py-2">
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete Confirmation ───────────────────────────────────────────────────────
function DeleteDialog({ role, onClose, onDeleted, toast }) {
  const [deleting, setDeleting] = useState(false)
  const [err, setErr] = useState('')

  const confirm = async () => {
    setDeleting(true); setErr('')
    try {
      await rolesApi.delete(role.id)
      toast.add('Role deleted successfully', 'success')
      onDeleted(role.id)
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Role</h3>
        <p className="text-gray-600 text-sm mb-4">
          Are you sure you want to delete <strong>"{role.name}"</strong>? This action cannot be undone.
        </p>
        {err && <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3 mb-3">{err}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary py-2">Cancel</button>
          <button onClick={confirm} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition-colors">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RoleManagement() {
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

  const [tab, setTab] = useState('roles')

  // Roles state
  const [roles, setRoles] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)

  // Permissions catalogue
  const [allPerms, setAllPerms] = useState([])

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editRole, setEditRole] = useState(null)
  const [deleteRole, setDeleteRole] = useState(null)

  // Audit log
  const [auditLogs, setAuditLogs] = useState([])
  const [auditTotal, setAuditTotal] = useState(0)
  const [auditPage, setAuditPage] = useState(0)
  const [auditLoading, setAuditLoading] = useState(false)

  const loadRoles = useCallback(async () => {
    setLoading(true)
    try {
      const data = await rolesApi.list({ search: search || undefined, status: filterStatus || undefined, page, size: 10 })
      setRoles(data.content)
      setTotal(data.totalElements)
      setTotalPages(data.totalPages)
    } catch (ex) {
      toast.add(ex.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [search, filterStatus, page])

  const loadPerms = useCallback(async () => {
    try {
      const data = await rolesApi.getAllPermissions()
      setAllPerms(data)
    } catch {}
  }, [])

  const loadAudit = useCallback(async () => {
    setAuditLoading(true)
    try {
      const data = await rolesApi.getAuditLog({ page: auditPage, size: 20 })
      setAuditLogs(data.content)
      setAuditTotal(data.totalElements)
    } catch (ex) {
      toast.add(ex.message, 'error')
    } finally {
      setAuditLoading(false)
    }
  }, [auditPage])

  useEffect(() => { loadRoles() }, [loadRoles])
  useEffect(() => { loadPerms() }, [loadPerms])
  useEffect(() => { if (tab === 'audit') loadAudit() }, [tab, loadAudit])

  const handleSaved = (saved) => {
    setShowModal(false); setEditRole(null)
    loadRoles()
  }

  const handleDeleted = (id) => {
    setDeleteRole(null)
    setRoles(prev => prev.filter(r => r.id !== id))
    setTotal(prev => prev - 1)
  }

  const openEdit = async (role) => {
    try {
      const full = await rolesApi.get(role.id)
      setEditRole(full)
      setShowModal(true)
    } catch (ex) {
      toast.add(ex.message, 'error')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toast toasts={toast.toasts} remove={toast.remove} />

      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">Administration</p>
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {[['roles', 'Roles'], ['audit', 'Audit Log']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── ROLES TAB ── */}
      {tab === 'roles' && (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <div className="flex flex-wrap gap-3 flex-1">
              <input
                type="text"
                placeholder="Search by role name…"
                className="input max-w-xs"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0) }}
              />
              <select
                className="input max-w-[160px]"
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setPage(0) }}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <button
              onClick={() => { setEditRole(null); setShowModal(true) }}
              className="btn-primary px-4 py-2 whitespace-nowrap"
            >
              + Add New Role
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Role Name', 'Description', 'Status', 'Created Date', 'Updated Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">Loading…</td></tr>
                  ) : roles.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No roles found</td></tr>
                  ) : roles.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {r.name}
                        {r.isSystem && <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">System</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{r.description || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[r.status] ?? ''}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmt(r.createdAt)}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmt(r.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(r)}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            Edit
                          </button>
                          {!r.isSystem && (
                            <button
                              onClick={() => setDeleteRole(r)}
                              className="text-xs text-red-500 hover:underline font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span>{total} role{total !== 1 ? 's' : ''} found</span>
                <div className="flex gap-1">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`px-3 py-1 rounded-lg border ${i === page ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── AUDIT LOG TAB ── */}
      {tab === 'audit' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Action', 'Role Name', 'Performed By', 'Date & Time', 'Details'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {auditLoading ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading…</td></tr>
                ) : auditLogs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No audit records yet</td></tr>
                ) : auditLogs.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ACTION_BADGE[l.action] ?? 'bg-gray-100 text-gray-600'}`}>
                        {l.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{l.roleName}</td>
                    <td className="px-4 py-3 text-gray-500">{l.performedBy}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDt(l.performedAt)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{l.details || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {auditTotal > 20 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>{auditTotal} records</span>
              <div className="flex gap-1">
                <button disabled={auditPage === 0} onClick={() => setAuditPage(p => p - 1)}
                  className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">←</button>
                <button disabled={auditPage >= Math.ceil(auditTotal / 20) - 1} onClick={() => setAuditPage(p => p + 1)}
                  className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">→</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <RoleModal
          role={editRole}
          allPerms={allPerms}
          onClose={() => { setShowModal(false); setEditRole(null) }}
          onSaved={handleSaved}
          toast={toast}
        />
      )}
      {deleteRole && (
        <DeleteDialog
          role={deleteRole}
          onClose={() => setDeleteRole(null)}
          onDeleted={handleDeleted}
          toast={toast}
        />
      )}
    </div>
  )
}
