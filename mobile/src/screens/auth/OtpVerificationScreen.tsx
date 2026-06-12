import React, {useState, useEffect, useRef} from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '../../store';
import {loginUser, registerUser, sendOtp} from '../../store/slices/authSlice';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const OTP_LENGTH = 6;

const OtpVerificationScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const {mobileNumber, isNewUser, firstName, lastName, gender, email, village} = route.params;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
    if (!value && index > 0) inputs.current[index - 1]?.focus();
    if (newOtp.every(d => d !== '') && newOtp.join('').length === OTP_LENGTH) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    try {
      if (isNewUser) {
        await dispatch(registerUser({firstName, lastName, mobileNumber, otp: code, email, gender, village})).unwrap();
      } else {
        await dispatch(loginUser({mobileNumber, otp: code})).unwrap();
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Invalid OTP');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setCountdown(60);
    try {
      await dispatch(sendOtp(mobileNumber)).unwrap();
    } catch (e) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.enterOtp')}</Text>
      <Text style={styles.subtitle}>
        {t('auth.otpSent')} +91 {mobileNumber}
      </Text>

      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={el => {if (el) inputs.current[i] = el;}}
            style={[styles.otpBox, digit && styles.otpBoxFilled]}
            value={digit}
            onChangeText={v => handleChange(v.slice(-1), i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={() => handleVerify(otp.join(''))}
        disabled={isLoading || otp.join('').length < OTP_LENGTH}>
        {isLoading ? (
          <ActivityIndicator color={Colors.textOnPrimary} />
        ) : (
          <Text style={styles.buttonText}>{t('auth.verify')}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend} disabled={countdown > 0}>
        <Text style={[styles.resend, countdown > 0 && styles.resendDisabled]}>
          {countdown > 0
            ? `${t('auth.resendIn')} ${countdown}s`
            : t('auth.resendOtp')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Change mobile number</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background, padding: Spacing.xl, justifyContent: 'center'},
  title: {fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm},
  subtitle: {fontSize: FontSize.base, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxxl},
  otpRow: {flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.xl},
  otpBox: {
    width: 48, height: 56, borderWidth: 2, borderColor: Colors.border,
    borderRadius: BorderRadius.md, fontSize: FontSize.xl, fontWeight: 'bold',
    color: Colors.text, backgroundColor: Colors.surface,
  },
  otpBoxFilled: {borderColor: Colors.primary, backgroundColor: Colors.surfaceVariant},
  button: {
    backgroundColor: Colors.primary, padding: Spacing.md + 2,
    borderRadius: BorderRadius.xl, alignItems: 'center', marginBottom: Spacing.xl,
  },
  buttonDisabled: {opacity: 0.5},
  buttonText: {color: Colors.textOnPrimary, fontSize: FontSize.md, fontWeight: 'bold'},
  resend: {textAlign: 'center', color: Colors.primary, fontSize: FontSize.base, fontWeight: '500'},
  resendDisabled: {color: Colors.textHint},
  back: {alignItems: 'center', marginTop: Spacing.xl},
  backText: {color: Colors.textSecondary, fontSize: FontSize.base, textDecorationLine: 'underline'},
});

export default OtpVerificationScreen;
