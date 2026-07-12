// Geoapify-backed geocoding helpers (migrated from Google Maps).
// Get an API key at https://myprojects.geoapify.com and set VITE_GEOAPIFY_KEY.

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY

// Pick the most human-friendly locality name from a Geoapify feature's properties.
function localityName(props = {}) {
  return (
    props.village ||
    props.hamlet ||
    props.suburb ||
    props.neighbourhood ||
    props.town ||
    props.city ||
    props.municipality ||
    props.county ||
    props.district ||
    (props.formatted ? props.formatted.split(',')[0] : '') ||
    ''
  )
}

// Reverse geocode a coordinate to a locality name. Returns '' on failure.
export async function reverseGeocode(lat, lng) {
  if (!GEOAPIFY_KEY) return ''
  const url =
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}` +
    `&type=city&lang=en&apiKey=${GEOAPIFY_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  return localityName(data.features?.[0]?.properties)
}

// Autocomplete place search (India-restricted). Returns an array of
// { address, lat, lng } suggestions.
export async function autocompletePlaces(text, { limit = 5 } = {}) {
  if (!GEOAPIFY_KEY || !text?.trim()) return []
  const url =
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}` +
    `&filter=countrycode:in&limit=${limit}&lang=en&apiKey=${GEOAPIFY_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  return (data.features || []).map((f) => ({
    address: f.properties.formatted,
    lat: f.properties.lat,
    lng: f.properties.lon,
  }))
}

export { localityName }
