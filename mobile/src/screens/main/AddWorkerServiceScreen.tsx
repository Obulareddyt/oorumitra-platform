import React, {useEffect, useState} from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {workerService} from '../../services/listingService';
import {WorkType, PriceType} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import {useRequireAuth} from '../../hooks/useRequireAuth';
import {useAppSelector} from '../../store';

// Must match backend WorkType enum exactly.
const WORK_TYPES: WorkType[] = [
  'HARVESTING', 'PLANTING', 'CONSTRUCTION', 'MASON_WORK', 'PAINTING',
  'PLUMBING', 'ELECTRICAL', 'CARPENTER', 'BOREWELL_WORK', 'ROAD_WORK',
  'CLEANING', 'LOADING_UNLOADING', 'AGRICULTURE_WORK', 'OTHERS',
];
const PRICE_TYPES: PriceType[] = ['PERSON', 'ACRE', 'HOUR'];

const AddWorkerServiceScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const {isAuthenticated} = useRequireAuth();
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    if (!isAuthenticated) navigation.replace('Auth');
  }, [isAuthenticated, navigation]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workType, setWorkType] = useState<WorkType>('HARVESTING');
  const [village, setVillage] = useState('');
  const [availableWorkers, setAvailableWorkers] = useState('1');
  const [priceType, setPriceType] = useState<PriceType>('PERSON');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !village.trim() || !amount) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await workerService.create({
        groupName: title,
        ownerName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        mobileNumber: user?.mobileNumber ?? '',
        description, workType, village,
        availableWorkers: Number(availableWorkers) || 1,
        priceType,
        amount: Number(amount),
      });
      Alert.alert('Success', 'Service listed successfully!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Experienced Harvester" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Work Type *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
          {WORK_TYPES.map(wt => (
            <TouchableOpacity
              key={wt}
              style={[styles.typeChip, workType === wt && styles.typeChipActive]}
              onPress={() => setWorkType(wt)}>
              <Text style={[styles.typeText, workType === wt && styles.typeTextActive]}>
                {wt.replace(/_/g, ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Village / Location *</Text>
        <TextInput style={styles.input} value={village} onChangeText={setVillage} placeholder="Your village or town" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Available Workers *</Text>
        <TextInput style={styles.input} value={availableWorkers} onChangeText={setAvailableWorkers} placeholder="e.g. 1" keyboardType="numeric" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Price Type *</Text>
        <View style={[styles.typeScroll, styles.priceTypeRow]}>
          {PRICE_TYPES.map(pt => (
            <TouchableOpacity key={pt} style={[styles.typeChip, priceType === pt && styles.typeChipActive]} onPress={() => setPriceType(pt)}>
              <Text style={[styles.typeText, priceType === pt && styles.typeTextActive]}>{pt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Amount (₹) *</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="e.g. 500" keyboardType="numeric" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription}
          placeholder="Describe your skills and experience..." multiline numberOfLines={4}
          textAlignVertical="top" placeholderTextColor={Colors.textHint}
        />

        <TouchableOpacity style={[styles.submitBtn, isLoading && styles.btnDisabled]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={Colors.textOnPrimary} /> : <Text style={styles.submitText}>Post Service</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {padding: Spacing.base, paddingBottom: Spacing.xxxl},
  label: {fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.xs, marginTop: Spacing.md},
  input: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.base,
    color: Colors.text,
  },
  textarea: {height: 100, paddingTop: Spacing.md},
  typeScroll: {marginBottom: Spacing.sm},
  priceTypeRow: {flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm},
  typeChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface, marginRight: Spacing.sm,
  },
  typeChipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  typeText: {fontSize: FontSize.sm, color: Colors.textSecondary},
  typeTextActive: {color: Colors.textOnPrimary, fontWeight: '600'},
  switchRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md},
  submitBtn: {
    backgroundColor: Colors.primary, padding: Spacing.md + 2,
    borderRadius: BorderRadius.xl, alignItems: 'center', marginTop: Spacing.xl,
  },
  btnDisabled: {opacity: 0.6},
  submitText: {color: Colors.textOnPrimary, fontSize: FontSize.md, fontWeight: 'bold'},
});

export default AddWorkerServiceScreen;
