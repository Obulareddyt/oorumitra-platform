-- V15: Multi-Language Support Schema & Master Seeding

CREATE TABLE language_master (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL UNIQUE,
    language_name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    active_status BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_language_preference (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    language_code VARCHAR(10) NOT NULL,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_lang_pref FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE translation_entry (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    translation_key VARCHAR(255) NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    translation_value TEXT NOT NULL,
    UNIQUE KEY uq_key_lang (translation_key, language_code)
);

-- Seed Language Master
INSERT INTO language_master (language_code, language_name, native_name, active_status) VALUES
('en', 'English', 'English', 1),
('te', 'Telugu', 'తెలుగు', 1),
('ta', 'Tamil', 'தமிழ்', 1),
('ml', 'Malayalam', 'മലയാളം', 1),
('kn', 'Kannada', 'ಕನ್ನಡ', 1),
('hi', 'Hindi', 'हिन्दी', 1);

-- Seed Core Translations (Authentication)
INSERT INTO translation_entry (translation_key, language_code, translation_value) VALUES
('login.title', 'en', 'Login'),
('login.title', 'te', 'లాగిన్'),
('login.title', 'ta', 'உள்நுழைய'),
('login.title', 'ml', 'ലോഗിൻ'),
('login.title', 'kn', 'ಲಾಗಿನ್'),
('login.title', 'hi', 'लॉगिन'),

('register.title', 'en', 'Register'),
('register.title', 'te', 'నమోదు'),
('register.title', 'ta', 'பதிவு'),
('register.title', 'ml', 'രജിസ്റ്റർ'),
('register.title', 'kn', 'ನೋಂದಣಿ'),
('register.title', 'hi', 'रजिस्टर'),

('forgot.password', 'en', 'Forgot Password'),
('forgot.password', 'te', 'పాస్‌వర్డ్ మర్చిపోయారా?'),
('forgot.password', 'ta', 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?'),
('forgot.password', 'ml', 'പാസ്‌വേഡ് മറന്നുപോയോ?'),
('forgot.password', 'kn', 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ?'),
('forgot.password', 'hi', 'पासवर्ड भूल गए?'),

-- Core Navigation Categories
('cat.products', 'en', 'Products'),
('cat.products', 'te', 'ఉత్పత్తులు'),
('cat.products', 'ta', 'தயாரிப்புகள்'),
('cat.products', 'ml', 'ഉൽപ്പന്നങ്ങൾ'),
('cat.products', 'kn', 'ಉತ್ಪನ್ನಗಳು'),
('cat.products', 'hi', 'उत्पाद'),

('cat.services', 'en', 'Services'),
('cat.services', 'te', 'సేవలు'),
('cat.services', 'ta', 'சேவைகள்'),
('cat.services', 'ml', 'സേവനങ്ങൾ'),
('cat.services', 'kn', 'ಸೇವೆಗಳು'),
('cat.services', 'hi', 'सेवाएं'),

('cat.workers', 'en', 'Workers'),
('cat.workers', 'te', 'కార్మికులు'),
('cat.workers', 'ta', 'தொழிலாளர்கள்'),
('cat.workers', 'ml', 'തൊഴിലാളികൾ'),
('cat.workers', 'kn', 'ಕಾರ್ಮಿಕರು'),
('cat.workers', 'hi', 'श्रमिक'),

('cat.vehicles', 'en', 'Vehicles'),
('cat.vehicles', 'te', 'వాహనాలు'),
('cat.vehicles', 'ta', 'வாகனங்கள்'),
('cat.vehicles', 'ml', 'വാഹനങ്ങൾ'),
('cat.vehicles', 'kn', 'ವಾಹನಗಳು'),
('cat.vehicles', 'hi', 'वाहन'),

('cat.transport', 'en', 'Transport'),
('cat.transport', 'te', 'రవాణా'),
('cat.transport', 'ta', 'போக்குவரத்து'),
('cat.transport', 'ml', 'ഗതാഗതം'),
('cat.transport', 'kn', 'ಸಾರಿಗೆ'),
('cat.transport', 'hi', 'परिवहन'),

('cat.rentals', 'en', 'Rentals'),
('cat.rentals', 'te', 'అద్దెలు'),
('cat.rentals', 'ta', 'வாடகைகள்'),
('cat.rentals', 'ml', 'വാടകയ്ക്ക്'),
('cat.rentals', 'kn', 'ಬಾಡಿಗೆಗಳು'),
('cat.rentals', 'hi', 'किराये'),

('cat.jobs', 'en', 'Jobs'),
('cat.jobs', 'te', 'ఉద్యోగాలు'),
('cat.jobs', 'ta', 'வேலைகள்'),
('cat.jobs', 'ml', 'ജോലികൾ'),
('cat.jobs', 'kn', 'ಉದ್ಯೋಗಗಳು'),
('cat.jobs', 'hi', 'नौकरियां'),

('cat.emergency', 'en', 'Emergency'),
('cat.emergency', 'te', 'అత్యవసర సేవలు'),
('cat.emergency', 'ta', 'அவசர சேவைகள்'),
('cat.emergency', 'ml', 'അടിയന്തിര സേവനങ്ങൾ'),
('cat.emergency', 'kn', 'ತುರ್ತು ಸೇವೆಗಳು'),
('cat.emergency', 'hi', 'आपातकालीन'),

('cat.events', 'en', 'Events'),
('cat.events', 'te', 'ఈవెంట్స్'),
('cat.events', 'ta', 'நிகழ்வுகள்'),
('cat.events', 'ml', 'സംഭവങ്ങൾ'),
('cat.events', 'kn', 'ಘಟನೆಗಳು'),
('cat.events', 'hi', 'कार्यक्रम'),

('cat.news', 'en', 'News'),
('cat.news', 'te', 'వార్తలు'),
('cat.news', 'ta', 'செய்திகள்'),
('cat.news', 'ml', 'വാർത്തകൾ'),
('cat.news', 'kn', 'ಸುದ್ದಿ'),
('cat.news', 'hi', 'समाचार'),

-- Standard actions & fields
('action.search', 'en', 'Search'),
('action.search', 'te', 'వెతకండి'),
('action.search', 'ta', 'தேடல்'),
('action.search', 'ml', 'തിരയുക'),
('action.search', 'kn', 'ಹುಡುಕಿ'),
('action.search', 'hi', 'खोजें'),

('profile.settings', 'en', 'Settings'),
('profile.settings', 'te', 'సెట్టింగులు'),
('profile.settings', 'ta', 'அமைப்புகள்'),
('profile.settings', 'ml', 'ക്രമീകരണങ്ങൾ'),
('profile.settings', 'kn', 'ಸೆಟ್ಟಿಂಗ್ಗಳು'),
('profile.settings', 'hi', 'सेटिंग्स'),

('profile.logout', 'en', 'Logout'),
('profile.logout', 'te', 'లాగౌట్'),
('profile.logout', 'ta', 'வெளியேறு'),
('profile.logout', 'ml', 'ലോഗൗട്ട്'),
('profile.logout', 'kn', 'ಲಾಗ್ ಔಟ್'),
('profile.logout', 'hi', 'लॉगआउट'),

('action.post_ad', 'en', 'Post Advertisement'),
('action.post_ad', 'te', 'ప్రకటన పోస్ట్ చేయి'),
('action.post_ad', 'ta', 'விளம்பரம் இடுகையிடவும்'),
('action.post_ad', 'ml', 'പരസ്യം നൽകുക'),
('action.post_ad', 'kn', 'ಜಾಹೀరాತು ಸಲ್ಲಿಸಿ'),
('action.post_ad', 'hi', 'विज्ञापन पोस्ट करें');
