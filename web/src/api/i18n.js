import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { translationsApi, userApi } from './client'

const DEFAULT_LANG = 'en'

// Backend can be cold (Render free-tier spin-down can take minutes to wake up),
// so the initial fetch is capped short — the app must render immediately
// with fallback/cached strings rather than block on a slow network call.
const INIT_FETCH_TIMEOUT_MS = 6000
const CACHE_KEY_PREFIX = 'translations_cache_'

// Core fallback values so the app works even with no cache and no network.
const HARDCODED_FALLBACK = {
  'login.title': 'Login',
  'register.title': 'Register',
  'forgot.password': 'Forgot Password',
  'cat.products': 'Products',
  'cat.services': 'Services',
  'cat.workers': 'Workers',
  'cat.vehicles': 'Vehicles',
  'cat.transport': 'Transport',
  'cat.rentals': 'Rentals',
  'cat.jobs': 'Jobs',
  'cat.emergency': 'Emergency',
  'cat.events': 'Events',
  'cat.news': 'News',
  'action.search': 'Search',
  'profile.settings': 'Settings',
  'profile.logout': 'Logout',
  'action.post_ad': 'Create Post',
  'action.submit': 'Submit'
}

// Helper to get saved language
export function getSavedLanguage() {
  return localStorage.getItem('language_preference') || DEFAULT_LANG
}

function readCachedTranslations(langCode) {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + langCode)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCachedTranslations(langCode, map) {
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + langCode, JSON.stringify(map))
  } catch {
    // Ignore quota/serialization errors — caching is a best-effort optimization
  }
}

// Function to fetch translations and initialize. Renders immediately from
// cache (or hardcoded fallback) and refreshes from the network in the
// background — never blocks the initial paint on a slow/cold backend.
export async function initializeI18n() {
  const selectedLang = getSavedLanguage()
  const cached = readCachedTranslations(selectedLang)
  const resources = {
    [selectedLang]: { translation: cached || HARDCODED_FALLBACK }
  }

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: selectedLang,
      fallbackLng: DEFAULT_LANG,
      interpolation: { escapeValue: false }
    })

  // Refresh from the network in the background — updates the live i18n
  // resources and the cache once it resolves, without delaying app render.
  translationsApi.getMap(selectedLang, { timeout: INIT_FETCH_TIMEOUT_MS })
    .then((translationMap) => {
      i18n.addResourceBundle(selectedLang, 'translation', translationMap, true, true)
      writeCachedTranslations(selectedLang, translationMap)
    })
    .catch((err) => {
      console.error('[WARN] Failed to refresh remote translations, using cached/fallback strings:', err.message)
    })
}

// Custom change language handler to pull translations dynamically
export async function changeAppLanguage(langCode) {
  try {
    // 1. Fetch new resources
    const translationMap = await translationsApi.getMap(langCode)
    
    // 2. Add resource bundle dynamically
    i18n.addResourceBundle(langCode, 'translation', translationMap, true, true)
    
    // 3. Switch language in i18next
    await i18n.changeLanguage(langCode)

    // 4. Save to localStorage
    localStorage.setItem('language_preference', langCode)

    // 5. If logged in, save to backend db
    const token = localStorage.getItem('token')
    if (token) {
      await userApi.updateLanguage(langCode.toUpperCase())
    }
  } catch (err) {
    console.error('[ERROR] Failed to switch app language:', err.message)
    // Switch state locally anyway
    await i18n.changeLanguage(langCode)
    localStorage.setItem('language_preference', langCode)
  }
}

export default i18n
