import React, {useState} from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '../../store';
import {sendOtp} from '../../store/slices/authSlice';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Gender = 'Male' | 'Female' | 'Other';

const RegistrationScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleSendOtp = async () => {
    if (!mobileNumber.match(/^[6-9]\d{9}$/)) {
      Alert.alert('Error', t('auth.enterMobile'));
      return;
    }
    if (!isLogin && (!firstName.trim() || !lastName.trim())) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    setIsLoading(true);
    try {
      await dispatch(sendOtp(mobileNumber)).unwrap();
      navigation.navigate('OtpVerification', {
        mobileNumber,
        isNewUser: !isLogin,
        firstName, lastName, gender, email, village,
      });
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = [styles.input];

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Icon name="map-marker-radius" size={48} color={Colors.primary} />
          <Text style={styles.title}>{t('common.appName')}</Text>
          <Text style={styles.subtitle}>{isLogin ? t('auth.login') : t('auth.register')}</Text>
        </View>

        {!isLogin && (
          <>
            <View style={styles.row}>
              <TextInput
                style={[inputStyle[0], styles.half]}
                placeholder={t('auth.firstName')}
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor={Colors.textHint}
              />
              <TextInput
                style={[inputStyle[0], styles.half]}
                placeholder={t('auth.lastName')}
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={Colors.textHint}
              />
            </View>

            <Text style={styles.label}>{t('auth.gender')}</Text>
            <View style={styles.genderRow}>
              {(['Male', 'Female', 'Other'] as Gender[]).map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, gender === g && styles.genderSelected]}
                  onPress={() => setGender(g)}>
                  <Text style={[styles.genderText, gender === g && styles.genderTextSelected]}>
                    {t(`auth.${g.toLowerCase()}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder={t('auth.village')}
              value={village}
              onChangeText={setVillage}
              placeholderTextColor={Colors.textHint}
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={Colors.textHint}
            />
          </>
        )}

        <View style={styles.mobileRow}>
          <View style={styles.prefix}>
            <Text style={styles.prefixText}>+91</Text>
          </View>
          <TextInput
            style={styles.mobileInput}
            placeholder={t('auth.mobileNumber')}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor={Colors.textHint}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSendOtp}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Colors.textOnPrimary} />
          ) : (
            <Text style={styles.buttonText}>{t('auth.sendOtp')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchBtn} onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? t('auth.register') : t('auth.loginHere')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {flex: 1, backgroundColor: Colors.background},
  container: {flexGrow: 1, padding: Spacing.xl, justifyContent: 'center'},
  header: {alignItems: 'center', marginBottom: Spacing.xxxl},
  title: {fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.primary, marginTop: Spacing.sm},
  subtitle: {fontSize: FontSize.lg, color: Colors.textSecondary, marginTop: 4},
  row: {flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md},
  half: {flex: 1},
  label: {fontSize: FontSize.base, color: Colors.text, marginBottom: Spacing.sm, fontWeight: '500'},
  genderRow: {flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md},
  genderBtn: {
    flex: 1, padding: Spacing.sm, borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  genderSelected: {borderColor: Colors.primary, backgroundColor: Colors.surfaceVariant},
  genderText: {fontSize: FontSize.base, color: Colors.textSecondary},
  genderTextSelected: {color: Colors.primary, fontWeight: '600'},
  mobileRow: {flexDirection: 'row', marginBottom: Spacing.md},
  prefix: {
    backgroundColor: Colors.surfaceVariant, paddingHorizontal: Spacing.md,
    justifyContent: 'center', borderRadius: BorderRadius.md, marginRight: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  prefixText: {fontSize: FontSize.md, color: Colors.text, fontWeight: '600'},
  mobileInput: {
    flex: 1, backgroundColor: Colors.surface, padding: Spacing.md,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
    fontSize: FontSize.md, color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface, padding: Spacing.md,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
    fontSize: FontSize.base, color: Colors.text, marginBottom: Spacing.md,
  },
  button: {
    backgroundColor: Colors.primary, padding: Spacing.md + 2,
    borderRadius: BorderRadius.xl, alignItems: 'center', marginTop: Spacing.sm,
  },
  buttonDisabled: {opacity: 0.7},
  buttonText: {color: Colors.textOnPrimary, fontSize: FontSize.md, fontWeight: 'bold'},
  switchBtn: {alignItems: 'center', marginTop: Spacing.xl},
  switchText: {color: Colors.primary, fontSize: FontSize.base, fontWeight: '500'},
});

export default RegistrationScreen;
