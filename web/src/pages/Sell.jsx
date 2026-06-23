import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productsApi, workersApi, transportApi, vehicleWorkApi } from '../api/client'
import { useAuth } from '../context/AuthContext'

const TYPES = [
  { key: 'PRODUCT', label: 'Product', icon: '🛒' },
  { key: 'WORKER', label: 'Worker', icon: '👤' },
  { key: 'TRANSPORT', label: 'Transport', icon: '🚛' },
  { key: 'VEHICLE_WORK', label: 'Vehicle Work', icon: '🚜' },
]

const PRODUCT_CATEGORIES = ['AGRICULTURE', 'HARDWARE', 'LIVESTOCK', 'VEHICLES', 'SEEDS', 'FRUITS', 'FLOWERS']
const PRICE_TYPES = ['PERSON', 'ACRE', 'HOUR']
const WORK_TYPES = ['HARVESTING', 'PLANTING', 'CONSTRUCTION', 'MASON_WORK', 'PAINTING', 'PLUMBING', 'ELECTRICAL', 'CARPENTER', 'BOREWELL_WORK', 'ROAD_WORK', 'CLEANING', 'LOADING_UNLOADING', 'AGRICULTURE_WORK', 'OTHERS']
const TRANSPORT_VEHICLE_TYPES = ['AUTO', 'TRACTOR', 'MINI_TRUCK', 'LORRY', 'BUS']
const VEHICLE_WORK_TYPES = ['TRACTOR', 'JCB', 'CRANE', 'BOREWELL_MACHINE', 'EXCAVATOR', 'HARVESTER']

const titleCase = (s) => s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ')

export default function Sell() {
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const [type, setType] = useState('PRODUCT')
  const [form, setForm] = useState(() => ({
    ownerName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
    mobileNumber: user?.mobileNumber ?? '',
  }))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isLoggedIn) {
    navigate('/login')
    return null
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const updateChecked = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.checked }))

  const switchType = (t) => {
    setType(t)
    setForm({ ownerName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(), mobileNumber: user?.mobileNumber ?? '' })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (type === 'PRODUCT') {
        await productsApi.create({
          productName: form.productName,
          category: form.category || 'AGRICULTURE',
          subCategory: form.subCategory,
          ownerName: form.ownerName,
          mobileNumber: form.mobileNumber,
          amount: Number(form.amount),
          negotiable: !!form.negotiable,
          location: form.location,
          availability: form.availability,
          description: form.description,
        })
      } else if (type === 'WORKER') {
        await workersApi.create({
          groupName: form.groupName,
          ownerName: form.ownerName,
          mobileNumber: form.mobileNumber,
          village: form.village,
          availableWorkers: Number(form.availableWorkers),
          priceType: form.priceType || 'HOUR',
          amount: Number(form.amount),
          workType: form.workType || 'OTHERS',
        })
      } else if (type === 'TRANSPORT') {
        await transportApi.create({
          vehicleType: form.vehicleType || 'AUTO',
          ownerName: form.ownerName,
          mobileNumber: form.mobileNumber,
          ratePerKm: form.ratePerKm ? Number(form.ratePerKm) : undefined,
          ratePerHour: form.ratePerHour ? Number(form.ratePerHour) : undefined,
          weightCapacity: form.weightCapacity,
          negotiable: !!form.negotiable,
          availability: form.availability,
        })
      } else {
        await vehicleWorkApi.create({
          vehicleType: form.vehicleType || 'TRACTOR',
          ownerName: form.ownerName,
          mobileNumber: form.mobileNumber,
          pricePerAcre: form.pricePerAcre ? Number(form.pricePerAcre) : undefined,
          pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : undefined,
          village: form.village,
          availableStatus: form.availableStatus ?? true,
        })
      }
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-3">✅</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Listing submitted!</h2>
        <p className="text-gray-500 mb-6">
          Your listing is now <span className="font-semibold text-amber-600">pending admin approval</span>.
          It'll appear publicly once approved.
        </p>
        <div className="flex gap-2 justify-center">
          <button className="btn-outline" onClick={() => { setSuccess(false); switchType(type) }}>Post Another</button>
          <button className="btn-primary" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Post a Listing 📢</h1>
      <p className="text-gray-500 text-sm mb-6">Sell a product or offer a service — listings go live after admin approval</p>

      <div className="flex gap-2 flex-wrap mb-6">
        {TYPES.map((t) => (
          <button
            key={t.key}
            onClick={() => switchType(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              type === t.key ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {type === 'PRODUCT' && (
          <>
            <Field label="Product Name"><input className="input" value={form.productName || ''} onChange={update('productName')} required /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select className="input" value={form.category || 'AGRICULTURE'} onChange={update('category')}>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{titleCase(c)}</option>)}
                </select>
              </Field>
              <Field label="Sub Category (optional)"><input className="input" value={form.subCategory || ''} onChange={update('subCategory')} /></Field>
            </div>
            <Field label="Description"><textarea className="input resize-none" rows={3} value={form.description || ''} onChange={update('description')} /></Field>
          </>
        )}

        {type === 'WORKER' && (
          <>
            <Field label="Group / Team Name"><input className="input" value={form.groupName || ''} onChange={update('groupName')} required /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Work Type">
                <select className="input" value={form.workType || 'OTHERS'} onChange={update('workType')}>
                  {WORK_TYPES.map((w) => <option key={w} value={w}>{titleCase(w)}</option>)}
                </select>
              </Field>
              <Field label="Available Workers"><input type="number" min="1" className="input" value={form.availableWorkers || ''} onChange={update('availableWorkers')} required /></Field>
            </div>
            <Field label="Village"><input className="input" value={form.village || ''} onChange={update('village')} required /></Field>
            <Field label="Price Type">
              <select className="input" value={form.priceType || 'HOUR'} onChange={update('priceType')}>
                {PRICE_TYPES.map((p) => <option key={p} value={p}>{titleCase(p)}</option>)}
              </select>
            </Field>
          </>
        )}

        {type === 'TRANSPORT' && (
          <>
            <Field label="Vehicle Type">
              <select className="input" value={form.vehicleType || 'AUTO'} onChange={update('vehicleType')}>
                {TRANSPORT_VEHICLE_TYPES.map((v) => <option key={v} value={v}>{titleCase(v)}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Rate per KM (₹, optional)"><input type="number" className="input" value={form.ratePerKm || ''} onChange={update('ratePerKm')} /></Field>
              <Field label="Rate per Hour (₹, optional)"><input type="number" className="input" value={form.ratePerHour || ''} onChange={update('ratePerHour')} /></Field>
            </div>
            <Field label="Weight Capacity (optional)"><input className="input" value={form.weightCapacity || ''} onChange={update('weightCapacity')} placeholder="e.g. 2 Tonnes" /></Field>
            <Field label="Availability (optional)"><input className="input" value={form.availability || ''} onChange={update('availability')} placeholder="e.g. Mon-Sat, 6AM-6PM" /></Field>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={!!form.negotiable} onChange={updateChecked('negotiable')} /> Negotiable
            </label>
          </>
        )}

        {type === 'VEHICLE_WORK' && (
          <>
            <Field label="Vehicle Type">
              <select className="input" value={form.vehicleType || 'TRACTOR'} onChange={update('vehicleType')}>
                {VEHICLE_WORK_TYPES.map((v) => <option key={v} value={v}>{titleCase(v)}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price per Acre (₹, optional)"><input type="number" className="input" value={form.pricePerAcre || ''} onChange={update('pricePerAcre')} /></Field>
              <Field label="Price per Hour (₹, optional)"><input type="number" className="input" value={form.pricePerHour || ''} onChange={update('pricePerHour')} /></Field>
            </div>
            <Field label="Village"><input className="input" value={form.village || ''} onChange={update('village')} required /></Field>
          </>
        )}

        {/* Shared fields */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Owner Name"><input className="input" value={form.ownerName || ''} onChange={update('ownerName')} required /></Field>
          <Field label="Mobile Number"><input className="input" maxLength={10} value={form.mobileNumber || ''} onChange={update('mobileNumber')} required /></Field>
        </div>
        {(type === 'PRODUCT') && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount (₹)"><input type="number" className="input" value={form.amount || ''} onChange={update('amount')} required /></Field>
            <Field label="Location (optional)"><input className="input" value={form.location || ''} onChange={update('location')} /></Field>
          </div>
        )}
        {type === 'PRODUCT' && (
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={!!form.negotiable} onChange={updateChecked('negotiable')} /> Negotiable
          </label>
        )}
        {type === 'WORKER' && (
          <Field label="Amount (₹)"><input type="number" className="input" value={form.amount || ''} onChange={update('amount')} required /></Field>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}
