import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {vehicleWorkService} from '../../services/listingService';
import {VehicleWorkType} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import {useRequireAuth} from '../../hooks/useRequireAuth';
import {useAppSelector} from '../../store';

// Must match backend VehicleWorkType enum exactly.
const TYPES: VehicleWorkType[] = ['TRACTOR', 'JCB', 'CRANE', 'BOREWELL_MACHINE', 'EXCAVATOR', 'HARVESTER'];

const AddVehicleWorkScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {isAuthenticated} = useRequireAuth();
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    if (!isAuthenticated) navigation.replace('Auth');
  }, [isAuthenticated, navigation]);

  const [description, setDescription] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleWorkType>('TRACTOR');
  const [village, setVillage] = useState('');
  const [pricePerAcre, setPricePerAcre] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [availableStatus, setAvailableStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) return null;

  const handleSubmit = async () => {
    if (!village.trim() || (!pricePerAcre && !pricePerHour)) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await vehicleWorkService.create({
        vehicleType,
        ownerName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        mobileNumber: user?.mobileNumber ?? '',
        description, village,
        pricePerAcre: pricePerAcre ? Number(pricePerAcre) : undefined,
        pricePerHour: pricePerHour ? Number(pricePerHour) : undefined,
        availableStatus,
      });
      Alert.alert('Success', 'Vehicle work listing created!', [{text: 'OK', onPress: () => navigation.goBack()}]);
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
          {TYPES.map(vt => (
            <TouchableOpacity key={vt} style={[styles.chip, vehicleType === vt && styles.chipActive]} onPress={() => setVehicleType(vt)}>
              <Text style={[styles.chipText, vehicleType === vt && styles.chipTextActive]}>{vt.replace(/_/g, ' ')}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Village *</Text>
        <TextInput style={styles.input} value={village} onChangeText={setVillage} placeholder="Your village/town" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Price Per Acre (₹)</Text>
        <TextInput style={styles.input} value={pricePerAcre} onChangeText={setPricePerAcre} keyboardType="numeric" placeholder="e.g. 1500" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Price Per Hour (₹)</Text>
        <TextInput style={styles.input} value={pricePerHour} onChangeText={setPricePerHour} keyboardType="numeric" placeholder="e.g. 300" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" placeholder="Tractor type, additional details..." placeholderTextColor={Colors.textHint} />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Available Now</Text>
          <Switch value={availableStatus} onValueChange={setAvailableStatus} trackColor={{true: Colors.primary}} />
        </View>

        <TouchableOpacity style={[styles.submitBtn, isLoading && styles.btnDisabled]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={Colors.textOnPrimary} /> : <Text style={styles.submitText}>List Vehicle Work</Text>}
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
  chip: {paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, marginRight: Spacing.sm},
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText: {fontSize: FontSize.sm, color: Colors.textSecondary},
  chipTextActive: {color: Colors.textOnPrimary, fontWeight: '600'},
  switchRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md},
  submitBtn: {backgroundColor: Colors.primary, padding: Spacing.md + 2, borderRadius: BorderRadius.xl, alignItems: 'center', marginTop: Spacing.xl},
  btnDisabled: {opacity: 0.6},
  submitText: {color: Colors.textOnPrimary, fontSize: FontSize.md, fontWeight: 'bold'},
});

export default AddVehicleWorkScreen;
