import { useState, useRef, useCallback } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { productsApi, workersApi, transportApi, vehicleWorkApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import PlacesInput from '../components/PlacesInput'

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

const Req = () => <span className="text-red-500 ml-0.5">*</span>
const titleCase = (s) => s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ')

export default function Sell() {
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()

  const [type, setType] = useState('PRODUCT')
  const [form, setForm] = useState(() => ({
    ownerName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
    mobileNumber: user?.mobileNumber ?? '',
    whatsappNumber: '',
    availability: '',
    fromDate: '',
    toDate: '',
  }))
  const [images, setImages] = useState([])
  const [locationFetching, setLocationFetching] = useState(false)

  // Voice recording
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const timerRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isLoggedIn) return <Navigate to="/login" replace />

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const updateChecked = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.checked }))

  const switchType = (t) => {
    setType(t)
    setForm({
      ownerName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
      mobileNumber: user?.mobileNumber ?? '',
      whatsappNumber: '',
      availability: '',
      fromDate: '',
      toDate: '',
    })
    setImages([])
    setAudioBlob(null)
    setAudioUrl(null)
    setError('')
  }

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files].slice(0, 6))
    e.target.value = ''
  }

  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i))

  const fetchCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) { setError('Location not supported by your browser'); return }
    setLocationFetching(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}&result_type=locality|sublocality`
          )
          const data = await res.json()
          const name = data.results?.[0]?.address_components?.find(c =>
            c.types.some(t => ['locality','sublocality','sublocality_level_1'].includes(t))
          )?.long_name || data.results?.[0]?.formatted_address?.split(',')[0] || ''
          setForm((f) => ({ ...f, village: name, location: name, latitude: lat, longitude: lng }))
        } catch {
          setForm((f) => ({ ...f, latitude: lat, longitude: lng }))
        }
        setLocationFetching(false)
      },
      () => { setError('Could not get your location. Please enter it manually.'); setLocationFetching(false) },
      { timeout: 8000 }
    )
  }, [])

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      audioChunksRef.current = []
      mr.ondataavailable = (e) => audioChunksRef.current.push(e.data)
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        if (audioUrl) URL.revokeObjectURL(audioUrl)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      setIsRecording(true)
      setRecordingSeconds(0)
      timerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000)
    } catch {
      setError('Microphone access denied. Please allow microphone permission.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    clearInterval(timerRef.current)
  }

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingSeconds(0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.location && !form.village) { setError('Location is required. Please enter or use your current location.'); return }
    setLoading(true)
    setError('')
    try {
      const base = {
        ownerName: form.ownerName,
        mobileNumber: form.mobileNumber,
        whatsappNumber: form.whatsappNumber || undefined,
        latitude: form.latitude ?? undefined,
        longitude: form.longitude ?? undefined,
        description: form.description || undefined,
      }
      if (type === 'PRODUCT') {
        await productsApi.create({
          ...base,
          productName: form.productName,
          category: form.category || 'AGRICULTURE',
          subCategory: form.subCategory,
          amount: Number(form.amount),
          negotiable: !!form.negotiable,
          location: form.location,
          availability: form.availability || undefined,
        }, images, audioBlob)
      } else if (type === 'WORKER') {
        await workersApi.create({
          ...base,
          groupName: form.groupName,
          village: form.village,
          availableWorkers: Number(form.availableWorkers),
          priceType: form.priceType || 'HOUR',
          amount: Number(form.amount),
          workType: form.workType || 'OTHERS',
          description: `Available: ${form.fromDate} to ${form.toDate}\n\n${form.description || ''}`,
        }, images, audioBlob)
      } else if (type === 'TRANSPORT') {
        await transportApi.create({
          ...base,
          vehicleType: form.vehicleType || 'AUTO',
          ratePerKm: form.ratePerKm ? Number(form.ratePerKm) : undefined,
          ratePerHour: form.ratePerHour ? Number(form.ratePerHour) : undefined,
          weightCapacity: form.weightCapacity,
          negotiable: !!form.negotiable,
          availability: `From ${form.fromDate} to ${form.toDate}`,
          village: form.village,
          description: form.description || undefined,
        }, images, audioBlob)
      } else {
        await vehicleWorkApi.create({
          ...base,
          vehicleType: form.vehicleType || 'TRACTOR',
          pricePerAcre: form.pricePerAcre ? Number(form.pricePerAcre) : undefined,
          pricePerHour: form.pricePerHour ? Number(form.pricePerHour) : undefined,
          village: form.village,
          availableStatus: form.availableStatus ?? true,
          availableUntil: form.toDate,
          description: `Available: ${form.fromDate} to ${form.toDate}\n\n${form.description || ''}`,
        }, images, audioBlob)
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
          Your listing is <span className="font-semibold text-amber-600">pending admin approval</span> and will appear publicly once approved.
        </p>
        <div className="flex gap-2 justify-center">
          <button className="btn-outline" onClick={() => { setSuccess(false); switchType(type) }}>Post Another</button>
          <button className="btn-primary" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Post a Listing 📢</h1>
      <p className="text-gray-500 text-sm mb-6">Sell a product or offer a service — listings go live after admin approval</p>

      {/* Type tabs */}
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

      <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-4">

        {/* PRODUCT fields */}
        {type === 'PRODUCT' && (
          <>
            <Field label={<>Product Name<Req /></>}>
              <input className="input" value={form.productName || ''} onChange={update('productName')} required placeholder="e.g. Fresh Tomatoes" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select className="input" value={form.category || 'AGRICULTURE'} onChange={update('category')}>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{titleCase(c)}</option>)}
                </select>
              </Field>
              <Field label="Sub Category">
                <input className="input" value={form.subCategory || ''} onChange={update('subCategory')} placeholder="optional" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label={<>Amount (₹)<Req /></>}>
                <input type="number" className="input" value={form.amount || ''} onChange={update('amount')} required placeholder="0" />
              </Field>
              <Field label="Availability">
                <input className="input" value={form.availability || ''} onChange={update('availability')} placeholder="e.g. In Stock" />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={!!form.negotiable} onChange={updateChecked('negotiable')} /> Negotiable
            </label>
          </>
        )}

        {/* WORKER fields */}
        {type === 'WORKER' && (
          <>
            <Field label={<>Group / Team Name<Req /></>}>
              <input className="input" value={form.groupName || ''} onChange={update('groupName')} required placeholder="e.g. Kumar Harvesting Group" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Work Type">
                <select className="input" value={form.workType || 'OTHERS'} onChange={update('workType')}>
                  {WORK_TYPES.map((w) => <option key={w} value={w}>{titleCase(w)}</option>)}
                </select>
              </Field>
              <Field label={<>Available Workers<Req /></>}>
                <input type="number" min="1" className="input" value={form.availableWorkers || ''} onChange={update('availableWorkers')} required placeholder="1" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price Type">
                <select className="input" value={form.priceType || 'HOUR'} onChange={update('priceType')}>
                  {PRICE_TYPES.map((p) => <option key={p} value={p}>{titleCase(p)}</option>)}
                </select>
              </Field>
              <Field label={<>Amount (₹)<Req /></>}>
                <input type="number" className="input" value={form.amount || ''} onChange={update('amount')} required placeholder="0" />
              </Field>
            </div>
            <div className="flex flex-col gap-1 w-full text-left mt-2">
              <label className="text-xs font-bold text-gray-700">Available Date Range (From - To)<Req /></label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">📅</span>
                  <input type="date" className="input pl-8" value={form.fromDate || ''} onChange={update('fromDate')} required />
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">📅</span>
                  <input type="date" className="input pl-8" value={form.toDate || ''} onChange={update('toDate')} required />
                </div>
              </div>
            </div>
          </>
        )}

        {/* TRANSPORT fields */}
        {type === 'TRANSPORT' && (
          <>
            <Field label="Vehicle Type">
              <select className="input" value={form.vehicleType || 'AUTO'} onChange={update('vehicleType')}>
                {TRANSPORT_VEHICLE_TYPES.map((v) => <option key={v} value={v}>{titleCase(v)}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Rate per KM (₹)">
                <input type="number" className="input" value={form.ratePerKm || ''} onChange={update('ratePerKm')} placeholder="optional" />
              </Field>
              <Field label="Rate per Hour (₹)">
                <input type="number" className="input" value={form.ratePerHour || ''} onChange={update('ratePerHour')} placeholder="optional" />
              </Field>
            </div>
            <Field label="Weight Capacity">
              <input className="input" value={form.weightCapacity || ''} onChange={update('weightCapacity')} placeholder="e.g. 2 Tonnes" />
            </Field>
            <div className="flex flex-col gap-1 w-full text-left mb-2">
              <label className="text-xs font-bold text-gray-700">Available Date Range (From - To)<Req /></label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">📅</span>
                  <input type="date" className="input pl-8" value={form.fromDate || ''} onChange={update('fromDate')} required />
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">📅</span>
                  <input type="date" className="input pl-8" value={form.toDate || ''} onChange={update('toDate')} required />
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={!!form.negotiable} onChange={updateChecked('negotiable')} /> Negotiable
            </label>
          </>
        )}

        {/* VEHICLE_WORK fields */}
        {type === 'VEHICLE_WORK' && (
          <>
            <Field label="Vehicle Type">
              <select className="input" value={form.vehicleType || 'TRACTOR'} onChange={update('vehicleType')}>
                {VEHICLE_WORK_TYPES.map((v) => <option key={v} value={v}>{titleCase(v)}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price per Acre (₹)">
                <input type="number" className="input" value={form.pricePerAcre || ''} onChange={update('pricePerAcre')} placeholder="optional" />
              </Field>
              <Field label="Price per Hour (₹)">
                <input type="number" className="input" value={form.pricePerHour || ''} onChange={update('pricePerHour')} placeholder="optional" />
              </Field>
            </div>
            <div className="flex flex-col gap-1 w-full text-left mt-2">
              <label className="text-xs font-bold text-gray-700">Available Date Range (From - To)<Req /></label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">📅</span>
                  <input type="date" className="input pl-8" value={form.fromDate || ''} onChange={update('fromDate')} required />
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">📅</span>
                  <input type="date" className="input pl-8" value={form.toDate || ''} onChange={update('toDate')} required />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Description — all types */}
        <Field label="Description">
          <textarea
            className="input resize-none"
            rows={3}
            value={form.description || ''}
            onChange={update('description')}
            placeholder="Describe your listing in detail…"
          />
        </Field>

        {/* Location — mandatory */}
        <Field label={<>Location<Req /></>}>
          <div className="space-y-2">
            <PlacesInput
              value={form.village || form.location || ''}
              onChange={({ address, lat, lng }) => setForm((f) => ({
                ...f,
                village: address,
                location: address,
                latitude: lat ?? f.latitude,
                longitude: lng ?? f.longitude,
              }))}
              placeholder="Type village or area name…"
            />
            <button
              type="button"
              onClick={fetchCurrentLocation}
              disabled={locationFetching}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400 px-3 py-1.5 rounded-lg transition-colors bg-primary-50 hover:bg-primary-100 w-full justify-center"
            >
              <svg className={`w-4 h-4 ${locationFetching ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {locationFetching ? 'Getting location…' : 'Use my current location'}
            </button>
          </div>
        </Field>

        {/* Shared fields */}
        <div className="grid grid-cols-2 gap-4">
          <Field label={<>Owner Name<Req /></>}>
            <input className="input bg-gray-50 text-gray-600 cursor-not-allowed" value={form.ownerName} disabled />
          </Field>
          <Field label={<>Mobile Number<Req /></>}>
            <input className="input bg-gray-50 text-gray-600 cursor-not-allowed" value={form.mobileNumber} disabled />
          </Field>
        </div>
        <Field label="WhatsApp Number">
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm">+91</span>
            <input
              type="tel"
              maxLength={10}
              className="input rounded-l-none"
              placeholder="optional"
              value={form.whatsappNumber || ''}
              onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
            />
          </div>
        </Field>

        {/* Photos — Only for Product Listings */}
        {type === 'PRODUCT' && (
          <Field label={<>Photos <span className="text-gray-400 font-normal text-xs">(optional, up to 6)</span></>}>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >×</button>
                </div>
              ))}
              {images.length < 6 && (
                <div className="flex flex-col gap-2">
                  {/* Gallery picker */}
                  <label className="w-20 h-9 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary-400 flex items-center justify-center text-xl cursor-pointer transition-colors"
                    title="Choose from gallery">
                    🖼
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddImages} />
                  </label>
                  {/* Camera capture */}
                  <label className="w-20 h-9 rounded-lg border-2 border-dashed border-blue-300 text-blue-400 hover:border-blue-500 flex items-center justify-center text-xl cursor-pointer transition-colors"
                    title="Take a photo">
                    📷
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleAddImages} />
                  </label>
                </div>
              )}
            </div>
            {images.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">No photos added — you can add up to 6</p>
            )}
          </Field>
        )}

        {/* Voice note */}
        <Field label="Voice Note (optional)">
          <div className="space-y-2">
            {!isRecording && !audioUrl && (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                🎙 Record voice note
              </button>
            )}
            {isRecording && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  Recording {recordingSeconds}s
                </span>
                <button type="button" onClick={stopRecording} className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                  Stop
                </button>
              </div>
            )}
            {audioUrl && !isRecording && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <audio src={audioUrl} controls className="flex-1 h-8" style={{minWidth:0}} />
                <button type="button" onClick={deleteRecording} className="text-red-500 hover:text-red-700 text-sm flex-shrink-0">
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        </Field>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? 'Submitting…' : 'Submit for Approval'}
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
