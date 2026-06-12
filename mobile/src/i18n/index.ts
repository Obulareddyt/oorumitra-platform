import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './translations/en';
import te from './translations/te';
import hi from './translations/hi';
import ta from './translations/ta';
import kn from './translations/kn';

const resources = {
  en: {translation: en},
  te: {translation: te},
  hi: {translation: hi},
  ta: {translation: ta},
  kn: {translation: kn},
};

const findBestAvailableLanguage = () => {
  const result = RNLocalize.findBestLanguageTag(Object.keys(resources));
  return result?.languageTag ?? 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: findBestAvailableLanguage(),
    fallbackLng: 'en',
    interpolation: {escapeValue: false},
    compatibilityJSON: 'v3',
  });

export default i18n;
export const changeLanguage = (lang: string) => i18n.changeLanguage(lang);
