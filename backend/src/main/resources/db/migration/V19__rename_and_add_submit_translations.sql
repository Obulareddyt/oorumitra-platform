-- V19: Rename Post Advertisement to Create Post and add Submit translations
UPDATE translation_entry 
SET translation_value = 'Create Post' 
WHERE translation_key = 'action.post_ad' AND language_code = 'en';

UPDATE translation_entry 
SET translation_value = 'పోస్ట్ సృష్టించు' 
WHERE translation_key = 'action.post_ad' AND language_code = 'te';

UPDATE translation_entry 
SET translation_value = 'இடுகையை உருவாக்கு' 
WHERE translation_key = 'action.post_ad' AND language_code = 'ta';

UPDATE translation_entry 
SET translation_value = 'പോസ്റ്റ് സൃഷ്ടിക്കുക' 
WHERE translation_key = 'action.post_ad' AND language_code = 'ml';

UPDATE translation_entry 
SET translation_value = 'ಪೋಸ್ಟ್ ರಚಿಸಿ' 
WHERE translation_key = 'action.post_ad' AND language_code = 'kn';

UPDATE translation_entry 
SET translation_value = 'पोस्ट बनाएं' 
WHERE translation_key = 'action.post_ad' AND language_code = 'hi';

INSERT INTO translation_entry (translation_key, language_code, translation_value) VALUES
('action.submit', 'en', 'Submit'),
('action.submit', 'te', 'సమర్పించు'),
('action.submit', 'ta', 'சமர்ப்பிக்கவும்'),
('action.submit', 'ml', 'സമർപ്പിക്കുക'),
('action.submit', 'kn', 'ಸಲ್ಲಿಸಿ'),
('action.submit', 'hi', 'जма करें')
ON DUPLICATE KEY UPDATE translation_value = VALUES(translation_value);

