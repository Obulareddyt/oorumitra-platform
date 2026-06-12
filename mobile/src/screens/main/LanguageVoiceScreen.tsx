import React, {useState} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import Voice from '@react-native-voice/voice';
import {changeLanguage} from '../../i18n';
import {userService} from '../../services/userService';
import {useAppDispatch, useAppSelector} from '../../store';
import {setUser} from '../../store/slices/authSlice';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const LANGUAGES = [
  {code: 'en', label: 'English', native: 'English'},
  {code: 'te', label: 'Telugu', native: 'తెలుగు'},
  {code: 'hi', label: 'Hindi', native: 'हिंदी'},
  {code: 'ta', label: 'Tamil', native: 'தமிழ்'},
  {code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ'},
];

const LanguageVoiceScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const [selected, setSelected] = useState(i18n.language.substring(0, 2) || 'en');
  const [saving, setSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  const applyLanguage = async (code: string) => {
    setSelected(code);
    await changeLanguage(code);
    setSaving(true);
    try {
      const updated = await userService.updateLanguage(code.toUpperCase() as import('../../types').Language);
      dispatch(setUser(updated));
    } catch (_) {}
    setSaving(false);
  };

  const startVoice = async () => {
    try {
      setVoiceText('');
      setIsListening(true);
      Voice.onSpeechResults = (e) => {
        setVoiceText(e.value?.[0] ?? '');
        setIsListening(false);
      };
      Voice.onSpeechError = () => setIsListening(false);
      await Voice.start(selected === 'te' ? 'te-IN' : selected === 'hi' ? 'hi-IN' : selected === 'ta' ? 'ta-IN' : selected === 'kn' ? 'kn-IN' : 'en-IN');
    } catch (e) {
      setIsListening(false);
      Alert.alert('Voice Error', 'Could not start voice recognition');
    }
  };

  const stopVoice = async () => {
    await Voice.stop();
    setIsListening(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Language</Text>
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.langRow, selected === lang.code && styles.langRowActive]}
            onPress={() => applyLanguage(lang.code)}>
            <View style={styles.langInfo}>
              <Text style={styles.langLabel}>{lang.native}</Text>
              <Text style={styles.langSub}>{lang.label}</Text>
            </View>
            {selected === lang.code && (
              saving ? <ActivityIndicator size="small" color={Colors.primary} /> :
              <Icon name="check-circle" size={22} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Search</Text>
        <Text style={styles.voiceDesc}>
          Speak to search for services near you. Works best in your selected language.
        </Text>
        <TouchableOpacity
          style={[styles.voiceBtn, isListening && styles.voiceBtnActive]}
          onPress={isListening ? stopVoice : startVoice}>
          <Icon name={isListening ? 'microphone-off' : 'microphone'} size={36} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        {isListening && <Text style={styles.listening}>Listening...</Text>}
        {voiceText ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>You said:</Text>
            <Text style={styles.resultText}>{voiceText}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background, padding: Spacing.base},
  section: {backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.base, marginBottom: Spacing.base, elevation: 1},
  sectionTitle: {fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md},
  langRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider},
  langRowActive: {backgroundColor: Colors.surfaceVariant, marginHorizontal: -Spacing.base, paddingHorizontal: Spacing.base},
  langInfo: {},
  langLabel: {fontSize: FontSize.lg, fontWeight: '600', color: Colors.text},
  langSub: {fontSize: FontSize.sm, color: Colors.textSecondary},
  voiceDesc: {fontSize: FontSize.base, color: Colors.textSecondary, marginBottom: Spacing.xl, lineHeight: 22},
  voiceBtn: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary, justifyContent: 'center',
    alignItems: 'center', alignSelf: 'center', elevation: 4,
  },
  voiceBtnActive: {backgroundColor: Colors.error},
  listening: {textAlign: 'center', color: Colors.primary, fontSize: FontSize.base, marginTop: Spacing.md, fontWeight: '600'},
  resultBox: {marginTop: Spacing.md, backgroundColor: Colors.background, borderRadius: BorderRadius.md, padding: Spacing.md},
  resultLabel: {fontSize: FontSize.xs, color: Colors.textHint, fontWeight: '600'},
  resultText: {fontSize: FontSize.md, color: Colors.text, marginTop: 4},
});

export default LanguageVoiceScreen;
