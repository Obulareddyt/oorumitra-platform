import { useEffect, useState } from 'react'
import { userApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { PageSpinner } from '../components/Spinner'

export default function Profile() {
  const { isLoggedIn, user: authUser, login } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    userApi.getProfile()
      .then((data) => { setProfile(data); setForm(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isLoggedIn])

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
      setProfile({ ...profile, ...form })
      login({ ...authUser, firstName: form.firstName, lastName: form.lastName })
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile 👤</h1>

      <div className="card p-6">
        {/* Avatar */}
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
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
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
    </div>
  )
}
