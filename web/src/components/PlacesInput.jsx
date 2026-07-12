import { useEffect, useRef, useState } from 'react'
import { autocompletePlaces } from '../api/geo'

export default function PlacesInput({ value, onChange, placeholder = 'Type village or area…', required, className = 'input' }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef(null)
  const debounceRef = useRef(null)

  // Debounced Geoapify autocomplete lookup.
  useEffect(() => {
    if (!open) return
    const text = value?.trim() || ''
    if (text.length < 2) { setSuggestions([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        setSuggestions(await autocompletePlaces(text))
      } catch {
        setSuggestions([])
      }
      setLoading(false)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [value, open])

  // Close the dropdown when clicking outside.
  useEffect(() => {
    const handler = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (e) => {
    onChange({ address: e.target.value, lat: null, lng: null })
    setOpen(true)
  }

  const pick = (s) => {
    onChange({ address: s.address, lat: s.lat, lng: s.lng })
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div className="relative" ref={boxRef}>
      <input
        type="text"
        className={className}
        value={value}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {loading && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">…</span>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((s, i) => (
            <li
              key={`${s.lat}-${s.lng}-${i}`}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              onMouseDown={(e) => { e.preventDefault(); pick(s) }}
            >
              {s.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
