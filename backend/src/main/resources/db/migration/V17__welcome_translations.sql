-- V17: Add welcome back translations for logged in user

INSERT INTO translation_entry (translation_key, language_code, translation_value) VALUES
('home.welcome_back', 'en', 'Welcome back, {{name}}!'),
('home.welcome_back', 'te', 'తిరిగి స్వాగతం, {{name}}!'),
('home.welcome_back', 'ta', 'மீண்டும் வருக, {{name}}!'),
('home.welcome_back', 'hi', 'स्वागत है, {{name}}!'),

('home.hero_subtitle_logged', 'en', 'Manage your products, hire tractor services, and find work opportunities near you.'),
('home.hero_subtitle_logged', 'te', 'మీ ఉత్పత్తులను నిర్వహించండి, ట్రాక్టర్ సేవలను అద్దెకు తీసుకోండి మరియు మీ సమీపంలో ఉన్న ఉపాధి అవకాశాలను కనుగొనండి.'),
('home.hero_subtitle_logged', 'ta', 'உங்கள் தயாரிப்புகளை நிர்வகிக்கவும், டிராக்டர் சேவைகளை வாடகைக்கு அமர்த்தவும் மற்றும் உங்களுக்கு அருகிலுள்ள வேலை வாய்ப்புகளை கண்டறியவும்.'),
('home.hero_subtitle_logged', 'hi', 'अपने उत्पादों का प्रबंधन करें, ट्रैक्टर सेवाएं किराए पर लें, और अपने आस-पास काम के अवसर खोजें।');
