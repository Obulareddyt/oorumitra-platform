import React, {useState} from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, Switch, KeyboardAvoidingView, Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {workerService} from '../../services/listingService';
import {WorkType} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const WORK_TYPES: WorkType[] = [
  'HARVESTING', 'PLANTING', 'WEEDING', 'IRRIGATION', 'SPRAYING',
  'MASON_WORK', 'CARPENTRY', 'ELECTRICAL', 'PLUMBING', 'PAINTING',
  'BOREWELL_WORK', 'CLEANING', 'DRIVING', 'OTHER',
];

const AddWorkerServiceScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workType, setWorkType] = useState<WorkType>('HARVESTING');
  const [village, setVillage] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [experience, setExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !village.trim() || !pricePerDay) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await workerService.create({
        title, description, workType, village,
        pricePerDay: Number(pricePerDay), isAvailable,
        experienceYears: experience ? Number(experience) : 0,
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

        <Text style={styles.label}>Price Per Day (₹) *</Text>
        <TextInput style={styles.input} value={pricePerDay} onChangeText={setPricePerDay} placeholder="e.g. 500" keyboardType="numeric" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Experience (years)</Text>
        <TextInput style={styles.input} value={experience} onChangeText={setExperience} placeholder="e.g. 5" keyboardType="numeric" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription}
          placeholder="Describe your skills and experience..." multiline numberOfLines={4}
          textAlignVertical="top" placeholderTextColor={Colors.textHint}
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Available Now</Text>
          <Switch value={isAvailable} onValueChange={setIsAvailable} trackColor={{true: Colors.primary}} />
        </View>

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
