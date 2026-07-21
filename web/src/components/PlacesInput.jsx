import { useEffect, useRef, useState } from 'react'

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY

let scriptPromise = null

function loadMapsScript() {
  if (scriptPromise) return scriptPromise
  if (window.google?.maps?.places) {
    scriptPromise = Promise.resolve()
    return scriptPromise
  }
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`
    s.async = true
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
  return scriptPromise
}

export default function PlacesInput({ value, onChange, required, className = 'input' }) {
  const inputRef = useRef(null)
  const acRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | failed
  const ready = status === 'ready'

  useEffect(() => {
    loadMapsScript()
      .then(() => setStatus('ready'))
      .catch(() => setStatus('failed'))
  }, [])

  useEffect(() => {
    if (!ready || !inputRef.current || acRef.current) return
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'in' },
      fields: ['formatted_address', 'geometry', 'name'],
    })
    acRef.current = ac
    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      const name = place.name || place.formatted_address || ''
      const lat = place.geometry?.location?.lat()
      const lng = place.geometry?.location?.lng()
      if (inputRef.current) inputRef.current.value = name
      onChange({ address: name, lat, lng })
    })
  }, [ready])

  // The Google widget writes into the input's DOM value directly, so this field is
  // kept uncontrolled while typing — otherwise React re-asserting `value` on every
  // keystroke fights the widget and the input stops accepting further characters.
  // Only push external updates (current-location button, place selection above) in,
  // and only while the user isn't actively typing in it.
  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.value = value || ''
    }
  }, [value])

  const handleChange = (e) => {
    onChange({ address: e.target.value, lat: null, lng: null })
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        className={className}
        defaultValue={value}
        onChange={handleChange}
        required={required}
        autoComplete="off"
      />
      {status === 'loading' && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">Loading…</span>
      )}
      {status === 'failed' && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-amber-500" title="Map search unavailable — you can still type your location manually">
          ✎ Manual entry
        </span>
      )}
    </div>
  )
}
