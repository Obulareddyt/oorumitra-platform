import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {transportService} from '../../services/listingService';
import {TransportVehicleType, PriceType} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import {useRequireAuth} from '../../hooks/useRequireAuth';
import {useAppSelector} from '../../store';

// Must match backend TransportVehicleType enum exactly.
const VEHICLE_TYPES: TransportVehicleType[] = ['AUTO', 'TRACTOR', 'MINI_TRUCK', 'LORRY', 'BUS'];
const PRICE_TYPES: PriceType[] = ['HOUR', 'DAY', 'KM'];

const AddTransportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {isAuthenticated} = useRequireAuth();
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    if (!isAuthenticated) navigation.replace('Auth');
  }, [isAuthenticated, navigation]);

  const [description, setDescription] = useState('');
  const [vehicleType, setVehicleType] = useState<TransportVehicleType | null>(null);
  const [village, setVillage] = useState('');
  const [priceType, setPriceType] = useState<PriceType | null>(null);
  const [amount, setAmount] = useState('');
  const [weightCapacity, setWeightCapacity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) return null;

  const handleSubmit = async () => {
    if (!vehicleType || !village.trim() || !priceType || !amount) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await transportService.create({
        vehicleType,
        ownerName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        mobileNumber: user?.mobileNumber ?? '',
        description, village,
        priceType,
        amount: Number(amount),
        weightCapacity: weightCapacity.trim() || undefined,
      });
      Alert.alert('Success', 'Transport listed!', [{text: 'OK', onPress: () => navigation.goBack()}]);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to create');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Vehicle Type *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {VEHICLE_TYPES.map(vt => (
            <TouchableOpacity key={vt} style={[styles.chip, vehicleType === vt && styles.chipActive]} onPress={() => setVehicleType(vt)}>
              <Text style={[styles.chipText, vehicleType === vt && styles.chipTextActive]}>{vt.replace(/_/g, ' ')}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Village *</Text>
        <TextInput style={styles.input} value={village} onChangeText={setVillage} placeholder="Your village/town" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Price Type *</Text>
        <View style={styles.chipRow}>
          {PRICE_TYPES.map(pt => (
            <TouchableOpacity key={pt} style={[styles.chip, priceType === pt && styles.chipActive]} onPress={() => setPriceType(pt)}>
              <Text style={[styles.chipText, priceType === pt && styles.chipTextActive]}>{pt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Amount (₹) *</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="e.g. 25" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Weight Capacity</Text>
        <TextInput style={styles.input} value={weightCapacity} onChangeText={setWeightCapacity} placeholder="e.g. 2.5 tons" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" placeholder="Additional details about your vehicle..." placeholderTextColor={Colors.textHint} />

        <TouchableOpacity style={[styles.submitBtn, isLoading && styles.btnDisabled]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={Colors.textOnPrimary} /> : <Text style={styles.submitText}>List Transport</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {padding: Spacing.base, paddingBottom: Spacing.xxxl},
  label: {fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.xs, marginTop: Spacing.md},
  input: {backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.base, color: Colors.text},
  textarea: {height: 100, paddingTop: Spacing.md},
  chipScroll: {marginBottom: Spacing.sm},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm},
  chip: {paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, marginRight: Spacing.sm},
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText: {fontSize: FontSize.sm, color: Colors.textSecondary},
  chipTextActive: {color: Colors.textOnPrimary, fontWeight: '600'},
  submitBtn: {backgroundColor: Colors.primary, padding: Spacing.md + 2, borderRadius: BorderRadius.xl, alignItems: 'center', marginTop: Spacing.xl},
  btnDisabled: {opacity: 0.6},
  submitText: {color: Colors.textOnPrimary, fontSize: FontSize.md, fontWeight: 'bold'},
});

export default AddTransportScreen;
