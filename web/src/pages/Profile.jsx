import { useEffect, useState } from 'react'
import { userApi, productsApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { PageSpinner } from '../components/Spinner'
import { changeAppLanguage } from '../api/i18n'
import { useTranslation } from 'react-i18next'
import Toast, { useToast } from '../components/Toast'

export default function Profile() {
  const { isLoggedIn, user: authUser, login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const toast = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Seller dashboard tab states
  const [activeTab, setActiveTab] = useState('profile')
  const [myProducts, setMyProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productFilter, setProductFilter] = useState('ACTIVE')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    userApi.getProfile()
      .then((data) => { setProfile(data); setForm(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isLoggedIn])

  const fetchMyProducts = async () => {
    setProductsLoading(true)
    try {
      const res = await productsApi.getMy({ page: 0, size: 100 })
      setMyProducts(res.content || [])
    } catch (e) {
      console.error(e)
    } finally {
      setProductsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'products') {
      fetchMyProducts()
    }
  }, [activeTab])

  const toggleProductStatus = async (product) => {
    const newStatus = product.availabilityStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setActionLoading(product.id)
    try {
      const updated = await productsApi.updateAvailabilityStatus(product.id, newStatus)
      setMyProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
      toast.add(
        newStatus === 'ACTIVE'
          ? t('product.status.marked_active', 'Product marked as Active.')
          : t('product.status.marked_inactive', 'Product marked as Inactive.'),
        'success'
      )
    } catch (e) {
      toast.add(e.message, 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const fmtDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await userApi.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        gender: form.gender,
        village: form.village,
      })
      if (form.language && form.language !== profile.language) {
        await changeAppLanguage(form.language.toLowerCase())
      }
      setProfile({ ...profile, ...form })
      login({ ...authUser, firstName: form.firstName, lastName: form.lastName, language: form.language })
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <Toast toasts={toast.toasts} remove={toast.remove} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Profile & Seller Dashboard 👤</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your personal info and marketplace product availability status</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl self-stretch md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 md:flex-none px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'profile' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 md:flex-none px-5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'products' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            My Products
          </button>
        </div>
      </div>

      {activeTab === 'profile' ? (
        <div className="card p-6 max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-700">
              {profile?.firstName?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{profile?.firstName} {profile?.lastName}</p>
              <p className="text-gray-500 text-sm">{profile?.mobileNumber}</p>
              <span className="badge bg-primary-100 text-primary-700 mt-1">{profile?.role}</span>
            </div>
          </div>

          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm mb-4">
              ✓ Profile updated successfully
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input className="input" value={form.firstName || ''} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input className="input" value={form.lastName || ''} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="input" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                <input className="input" value={form.village || ''} onChange={(e) => setForm({ ...form, village: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select className="input" value={form.gender || ''} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                <select className="input" value={form.language || 'EN'} onChange={(e) => setForm({ ...form, language: e.target.value })}>
                  <option value="EN">English</option>
                  <option value="TE">తెలుగు (Telugu)</option>
                  <option value="TA">தமிழ் (Tamil)</option>
                  <option value="ML">മലയാളം (Malayalam)</option>
                  <option value="KN">ಕನ್ನಡ (Kannada)</option>
                  <option value="HI">हिन्दी (Hindi)</option>
                </select>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setEditing(false); setForm(profile) }} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-3">
                {[
                  ['Mobile', profile?.mobileNumber],
                  ['Email', profile?.email || '—'],
                  ['Village', profile?.village || '—'],
                  ['Gender', profile?.gender || '—'],
                  ['Language', profile?.language],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setEditing(true)} className="btn-primary w-full mt-6">Edit Profile</button>
            </>
          )}
        </div>
      ) : (
        <div className="card p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center border-b pb-4 mb-5 flex-wrap gap-3">
            <h3 className="text-lg font-bold text-gray-900">Products Listing Management</h3>
            
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setProductFilter('ACTIVE')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  productFilter === 'ACTIVE' ? 'bg-emerald-500 text-white shadow' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setProductFilter('INACTIVE')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  productFilter === 'INACTIVE' ? 'bg-rose-500 text-white shadow' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {productsLoading ? (
            <div className="py-12 text-center text-gray-400">Loading your products…</div>
          ) : (
            (() => {
              const filtered = myProducts.filter(p => p.availabilityStatus === productFilter)
              if (filtered.length === 0) {
                return (
                  <div className="py-12 text-center text-gray-400">
                    No {productFilter.toLowerCase()} products found.
                  </div>
                )
              }
              return (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Product Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Approval Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Created Date</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Last Updated</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Availability Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3.5 font-bold text-gray-900">{product.productName}</td>
                          <td className="px-4 py-3.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              product.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                              product.approvalStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {product.approvalStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-gray-500">{fmtDate(product.createdAt)}</td>
                          <td className="px-4 py-3.5 text-gray-500">{fmtDate(product.updatedAt)}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                role="switch"
                                aria-checked={product.availabilityStatus === 'ACTIVE'}
                                disabled={actionLoading === product.id}
                                onClick={() => toggleProductStatus(product)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                                  product.availabilityStatus === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'
                                } ${actionLoading === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                    product.availabilityStatus === 'ACTIVE' ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <span className="text-xs font-bold text-gray-700">
                                {product.availabilityStatus === 'ACTIVE' ? t('product.status.active', 'Active') : t('product.status.inactive', 'Inactive')}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })()
          )}
        </div>
      )}
    </div>
  )
}
