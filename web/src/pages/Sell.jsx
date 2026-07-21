import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { productsApi, workersApi, transportApi, vehicleWorkApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import PlacesInput from '../components/PlacesInput'
import { useTranslation } from 'react-i18next'

const TYPES = [
  { key: 'PRODUCT', label: 'Product / Goods', icon: '🛒', desc: 'Sell crops, seeds, livestock, equipment & village items' },
  { key: 'WORKER', label: 'Worker / Labor Service', icon: '👤', desc: 'Offer farm work, construction, painting or skilled labor' },
  { key: 'TRANSPORT', label: 'Transport / Mini Truck', icon: '🚛', desc: 'Rent out auto, mini truck, tractor trolley or lorry' },
  { key: 'VEHICLE_WORK', label: 'Vehicle / Machine Work', icon: '🚜', desc: 'Provide tractor ploughing, JCB excavator or harvester' },
]

const PRODUCT_CATEGORIES = ['AGRICULTURE', 'HARDWARE', 'LIVESTOCK', 'VEHICLES', 'SEEDS', 'FRUITS', 'FLOWERS']
const PRICE_TYPES = ['PERSON', 'ACRE', 'DAY']
const WORK_TYPES = ['HARVESTING', 'PLANTING', 'CONSTRUCTION', 'MASON_WORK', 'PAINTING', 'PLUMBING', 'ELECTRICAL', 'CARPENTER', 'BOREWELL_WORK', 'ROAD_WORK', 'CLEANING', 'LOADING_UNLOADING', 'AGRICULTURE_WORK', 'OTHERS']
const TRANSPORT_VEHICLE_TYPES = ['AUTO', 'TRACTOR', 'MINI_TRUCK', 'LORRY', 'BUS']
const VEHICLE_WORK_TYPES = ['TRACTOR', 'JCB', 'CRANE', 'BOREWELL_MACHINE', 'EXCAVATOR', 'HARVESTER']
const TRANSPORT_PRICE_TYPES = ['HOUR', 'DAY', 'KM']
const VEHICLE_WORK_PRICE_TYPES = ['HOUR', 'DAY', 'ACRE']

const Req = () => <span className="text-red-500 ml-0.5">*</span>

export default function Sell() {
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  // 5-Step Wizard State
  const [currentStep, setCurrentStep] = useState(1) // 1: Category, 2: Details, 3: Photos, 4: Location, 5: Review
  const [type, setType] = useState('PRODUCT')

  const [form, setForm] = useState(() => {
    // Try restoring draft from localStorage
    const savedDraft = localStorage.getItem('oorumitra_post_draft')
    if (savedDraft) {
      try { return JSON.parse(savedDraft) } catch {}
    }
    return {
      ownerName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
      mobileNumber: user?.mobileNumber ?? '',
      whatsappNumber: '',
      availableStatus: true,
      fromDate: '',
      toDate: '',
      productName: '',
      category: '',
      subCategory: '',
      amount: '',
      negotiable: false,
      groupName: '',
      availableWorkers: '1',
      priceType: '',
      workType: '',
      vehicleType: '',
      weightCapacity: '',
      village: '',
      location: '',
      description: '',
    }
  })

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

  // Auto-save draft into LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('oorumitra_post_draft', JSON.stringify(form))
    } catch {}
  }, [form])

  if (!isLoggedIn) return <Navigate to="/login" replace />

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const updateChecked = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.checked }))

  const switchType = (t) => {
    setType(t)
    setForm((f) => ({
      ...f,
      category: '',
      subCategory: '',
      workType: '',
      vehicleType: '',
      priceType: '',
      amount: '',
    }))
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
        let name = ''
        try {
          if (MAPS_KEY) {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}&result_type=locality|sublocality`
            )
            const data = await res.json()
            if (data.status === 'OK' && data.results?.[0]) {
              name = data.results[0]?.address_components?.find(c =>
                c.types.some(t => ['locality','sublocality','sublocality_level_1'].includes(t))
              )?.long_name || data.results[0]?.formatted_address?.split(',')[0] || ''
            }
          }
        } catch {}

        // Fallback to OpenStreetMap Nominatim if Google Maps Geocoding API returns REQUEST_DENIED or fails
        if (!name) {
          try {
            const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            const nomData = await nomRes.json()
            name = nomData.address?.village || nomData.address?.suburb || nomData.address?.town || nomData.address?.city || nomData.display_name?.split(',')[0] || ''
          } catch {}
        }

        if (name) {
          setForm((f) => ({ ...f, village: name, location: name, latitude: lat, longitude: lng }))
        } else {
          setForm((f) => ({ ...f, latitude: lat, longitude: lng }))
        }
        setLocationFetching(false)
      },
      () => { setError('Could not get your location. Please enter it manually.'); setLocationFetching(false) },
      { timeout: 8000 }
    )
  }, [])

  // Voice Recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      let mimeType = 'audio/webm'
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mimeType = 'audio/webm;codecs=opus'
      else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4'
      else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg'

      const mr = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mr
      audioChunksRef.current = []
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType })
        setAudioBlob(blob)
        if (audioUrl) URL.revokeObjectURL(audioUrl)
        setAudioUrl(URL.createObjectURL(blob))

        // Convert audio recording to Base64 Data URL for persistent voice notes
        const reader = new FileReader()
        reader.onloadend = () => {
          setForm((f) => ({ ...f, voiceNoteUrl: reader.result }))
        }
        reader.readAsDataURL(blob)

        stream.getTracks().forEach(t => t.stop())
      }
      mr.start(100)
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

  const nextStep = () => {
    setError('')
    if (currentStep === 1 && !type) { setError('Please select a category type.'); return }
    if (currentStep === 2) {
      if (type === 'PRODUCT' && (!form.productName || !form.category || !form.amount)) {
        setError('Please fill in title, category, and price.')
        return
      }
      if (type === 'WORKER' && (!form.groupName || !form.workType || !form.priceType || !form.amount)) {
        setError('Please fill in group name, work type, price type, and amount.')
        return
      }
      if ((type === 'TRANSPORT' || type === 'VEHICLE_WORK') && (!form.vehicleType || !form.priceType || !form.amount)) {
        setError('Please fill in vehicle type, price type, and amount.')
        return
      }
    }
    if (currentStep === 4 && (!form.location && !form.village)) {
      setError('Please provide your village/area location.')
      return
    }
    setCurrentStep((s) => Math.min(s + 1, 5))
  }

  const prevStep = () => {
    setError('')
    setCurrentStep((s) => Math.max(s - 1, 1))
  }

  const handleSubmit = async () => {
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
        voiceNoteUrl: form.voiceNoteUrl || undefined,
      }

      if (type === 'PRODUCT') {
        await productsApi.create({
          ...base,
          productName: form.productName,
          category: form.category,
          subCategory: form.subCategory,
          amount: Number(form.amount),
          negotiable: !!form.negotiable,
          location: form.location || form.village,
          availabilityStatus: form.availableStatus === false ? 'INACTIVE' : 'ACTIVE',
        }, images, audioBlob)
      } else if (type === 'WORKER') {
        await workersApi.create({
          ...base,
          groupName: form.groupName,
          village: form.village || form.location,
          availableWorkers: Number(form.availableWorkers || 1),
          priceType: form.priceType,
          amount: Number(form.amount),
          workType: form.workType,
          description: `Available: ${form.fromDate} to ${form.toDate}\n\n${form.description || ''}`,
        }, images, audioBlob)
      } else if (type === 'TRANSPORT') {
        await transportApi.create({
          ...base,
          vehicleType: form.vehicleType,
          priceType: form.priceType,
          amount: Number(form.amount),
          weightCapacity: form.weightCapacity,
          negotiable: !!form.negotiable,
          availability: `From ${form.fromDate} to ${form.toDate}`,
          village: form.village || form.location,
          description: form.description || undefined,
        }, images, audioBlob)
      } else {
        await vehicleWorkApi.create({
          ...base,
          vehicleType: form.vehicleType,
          priceType: form.priceType,
          amount: Number(form.amount),
          village: form.village || form.location,
          availableStatus: form.availableStatus ?? true,
          availableUntil: form.toDate,
          description: `Available: ${form.fromDate} to ${form.toDate}\n\n${form.description || ''}`,
        }, images, audioBlob)
      }

      // Clear draft on successful submit
      localStorage.removeItem('oorumitra_post_draft')
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg">
          ✅
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2 font-heading">Listing Submitted Successfully!</h2>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Your listing has been submitted to your local Gram Panchayat moderator and will go live once verified.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="btn-secondary" onClick={() => { setSuccess(false); setCurrentStep(1) }}>
            Post Another Listing
          </button>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            View Marketplace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      
      {/* Header Title */}
      <div>
        <span className="text-xs uppercase font-extrabold text-[#2E7D32] tracking-wider">Multi-Step Posting Wizard</span>
        <h1 className="text-3xl font-extrabold text-gray-900 font-heading">Post New Listing 📢</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-body">
          Connect directly with nearby villagers, farmers, and local buyers with zero brokerage.
        </p>
      </div>

      {/* 5-Step Visual Progress Bar */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-950/10 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-gray-600">
          <span className={currentStep >= 1 ? 'text-[#2E7D32]' : ''}>1. Category</span>
          <span className={currentStep >= 2 ? 'text-[#2E7D32]' : ''}>2. Details</span>
          <span className={currentStep >= 3 ? 'text-[#2E7D32]' : ''}>3. Photos</span>
          <span className={currentStep >= 4 ? 'text-[#2E7D32]' : ''}>4. Location</span>
          <span className={currentStep >= 5 ? 'text-[#2E7D32]' : ''}>5. Review</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2E7D32] to-[#FFB300] transition-all duration-500"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-bold animate-fadeIn flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="text-red-900">×</button>
        </div>
      )}

      {/* STEP 1: CATEGORY TYPE SELECTION */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-5 animate-fadeIn">
          <h3 className="text-lg font-bold text-gray-900 font-heading">Step 1: Select What You Want to Post</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TYPES.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => switchType(item.key)}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
                  type === item.key
                    ? 'border-[#2E7D32] bg-emerald-50/60 shadow-md scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl p-2 bg-white rounded-2xl shadow-xs">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm font-heading">{item.label}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: DETAILS & PRICING */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-5 animate-fadeIn">
          <h3 className="text-lg font-bold text-gray-900 font-heading">Step 2: Enter Details & Pricing</h3>

          <div className="space-y-4">
            {type === 'PRODUCT' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Product Title <Req />
                  </label>
                  <input
                    type="text"
                    value={form.productName || ''}
                    onChange={update('productName')}
                    placeholder="e.g. Fresh Organic Sona Masoori Paddy (50 Qtl)"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Category <Req />
                    </label>
                    <select value={form.category || ''} onChange={update('category')} className="input">
                      <option value="">Select Category</option>
                      {PRODUCT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Price (₹) <Req />
                    </label>
                    <input
                      type="number"
                      value={form.amount || ''}
                      onChange={update('amount')}
                      placeholder="e.g. 3200"
                      className="input"
                    />
                  </div>
                </div>
              </>
            )}

            {type === 'WORKER' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Group / Provider Name <Req />
                  </label>
                  <input
                    type="text"
                    value={form.groupName || ''}
                    onChange={update('groupName')}
                    placeholder="e.g. Ramesh Sugarcane Harvest Crew"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Work Type <Req />
                    </label>
                    <select value={form.workType || ''} onChange={update('workType')} className="input">
                      <option value="">Select Work Type</option>
                      {WORK_TYPES.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Price Type <Req />
                    </label>
                    <select value={form.priceType || ''} onChange={update('priceType')} className="input">
                      <option value="">Select Price Type</option>
                      {PRICE_TYPES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Amount (₹) <Req />
                  </label>
                  <input
                    type="number"
                    value={form.amount || ''}
                    onChange={update('amount')}
                    placeholder="e.g. 750"
                    className="input"
                  />
                </div>
              </>
            )}

            {(type === 'TRANSPORT' || type === 'VEHICLE_WORK') && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Vehicle / Machine Type <Req />
                    </label>
                    <select value={form.vehicleType || ''} onChange={update('vehicleType')} className="input">
                      <option value="">Select Vehicle</option>
                      {(type === 'TRANSPORT' ? TRANSPORT_VEHICLE_TYPES : VEHICLE_WORK_TYPES).map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Rate / Price Type <Req />
                    </label>
                    <select value={form.priceType || ''} onChange={update('priceType')} className="input">
                      <option value="">Select Rate Type</option>
                      {(type === 'TRANSPORT' ? TRANSPORT_PRICE_TYPES : VEHICLE_WORK_PRICE_TYPES).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Price Amount (₹) <Req />
                  </label>
                  <input
                    type="number"
                    value={form.amount || ''}
                    onChange={update('amount')}
                    placeholder="e.g. 950"
                    className="input"
                  />
                </div>
              </>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Description / Notes
              </label>
              <textarea
                value={form.description || ''}
                onChange={update('description')}
                rows={3}
                placeholder="Provide additional details about condition, availability schedule, or terms..."
                className="input"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PHOTOS & VOICE RECORDING */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-5 animate-fadeIn">
          <h3 className="text-lg font-bold text-gray-900 font-heading">Step 3: Upload Photos & Voice Description</h3>

          {/* Photo Upload Zone */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Product / Service Images (Up to 6)
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 group">
                  <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow"
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.length < 6 && (
                <label className="aspect-video rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#2E7D32] bg-gray-50 hover:bg-emerald-50/40 flex flex-col items-center justify-center cursor-pointer transition-all">
                  <span className="text-2xl">📸</span>
                  <span className="text-xs font-bold text-gray-600 mt-1">Upload Photo</span>
                  <input type="file" accept="image/*" multiple onChange={handleAddImages} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Voice Note Recording */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
            <label className="block text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              🎙️ Record Voice Description (Optional)
            </label>
            <p className="text-xs text-gray-600">
              Speak in your local language to explain your product or service to buyers.
            </p>

            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <span>🎙️ Start Recording</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow animate-pulse"
                >
                  <span>⏹️ Stop ({recordingSeconds}s)</span>
                </button>
              )}

              {audioUrl && (
                <audio src={audioUrl} controls className="h-9 flex-1" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: LOCATION & CONTACT */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-5 animate-fadeIn">
          <h3 className="text-lg font-bold text-gray-900 font-heading">Step 4: Village Location & Contact Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Village / Panchayat Name <Req />
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.village || form.location || ''}
                  onChange={(e) => setForm((f) => ({ ...f, village: e.target.value, location: e.target.value }))}
                  placeholder="e.g. Malkajgiri Panchayat"
                  className="input flex-1"
                />

                <button
                  type="button"
                  onClick={fetchCurrentLocation}
                  disabled={locationFetching}
                  className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-[#2E7D32] font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
                >
                  <span>📍</span>
                  <span>{locationFetching ? 'Locating...' : 'GPS Auto-Detect'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Contact Owner Name <Req />
                </label>
                <input
                  type="text"
                  value={form.ownerName || ''}
                  onChange={update('ownerName')}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Phone Number <Req />
                </label>
                <input
                  type="text"
                  value={form.mobileNumber || ''}
                  onChange={update('mobileNumber')}
                  placeholder="e.g. 9876543210"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                WhatsApp Number (Optional)
              </label>
              <input
                type="text"
                value={form.whatsappNumber || ''}
                onChange={update('whatsappNumber')}
                placeholder="Same as mobile or separate WhatsApp number"
                className="input"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & SUBMIT */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-950/10 shadow-sm space-y-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-gray-900 font-heading">Step 5: Review & Submit Listing</h3>

          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-xs text-gray-500 font-bold uppercase">Listing Type</span>
              <span className="text-xs font-extrabold text-[#2E7D32]">{type}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-xs text-gray-500 font-bold uppercase">Title / Name</span>
              <span className="text-xs font-bold text-gray-900">{form.productName || form.groupName || form.vehicleType}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-xs text-gray-500 font-bold uppercase">Price</span>
              <span className="text-sm font-extrabold text-[#2E7D32]">₹{form.amount} {form.priceType ? `/ ${form.priceType}` : ''}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-xs text-gray-500 font-bold uppercase">Location</span>
              <span className="text-xs font-bold text-gray-900">📍 {form.village || form.location}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-bold uppercase">Attached Photos</span>
              <span className="text-xs font-bold text-gray-900">{images.length} Image(s) Uploaded</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 font-medium">
            ✓ Your draft has been automatically saved. Click "Submit Listing" to send your post to your Gram Panchayat moderator.
          </div>
        </div>
      )}

      {/* Navigation Buttons (Back & Next / Submit) */}
      <div className="flex items-center justify-between pt-4">
        {currentStep > 1 ? (
          <button type="button" onClick={prevStep} className="btn-secondary text-xs">
            ← Previous Step
          </button>
        ) : <div />}

        {currentStep < 5 ? (
          <button type="button" onClick={nextStep} className="btn-primary text-xs">
            Next Step →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-gold text-xs px-8 py-3 font-bold"
          >
            {loading ? 'Submitting Listing...' : 'Submit Listing Now 🚀'}
          </button>
        )}
      </div>

    </div>
  )
}
