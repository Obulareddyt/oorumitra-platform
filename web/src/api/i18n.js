import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { translationsApi, userApi } from './client'

const DEFAULT_LANG = 'en'

// Helper to get saved language
export function getSavedLanguage() {
  return localStorage.getItem('language_preference') || DEFAULT_LANG
}

// Function to fetch translations and initialize
export async function initializeI18n() {
  const selectedLang = getSavedLanguage()
  let resources = {}

  try {
    const translationMap = await translationsApi.getMap(selectedLang)
    resources[selectedLang] = { translation: translationMap }
  } catch (err) {
    console.error('[WARN] Failed to fetch remote translations, falling back to default:', err.message)
    // Core fallback values to ensure app works offline
    resources[selectedLang] = {
      translation: {
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
    }
  }

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: selectedLang,
      fallbackLng: DEFAULT_LANG,
      interpolation: { escapeValue: false }
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
