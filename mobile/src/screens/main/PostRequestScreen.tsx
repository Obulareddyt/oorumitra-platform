import React, {useEffect, useState} from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ticketService} from '../../services/userService';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import {useRequireAuth} from '../../hooks/useRequireAuth';
import {useAppSelector} from '../../store';

const PostRequestScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {isAuthenticated} = useRequireAuth();
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    if (!isAuthenticated) navigation.replace('Auth');
  }, [isAuthenticated, navigation]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await ticketService.create({
        title, description, location,
        mobileNumber: user?.mobileNumber ?? '',
        budget: budget ? Number(budget) : undefined,
      });
      Alert.alert('Posted!', 'Your request has been posted.', [{text: 'OK', onPress: () => navigation.goBack()}]);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to post request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Need harvester for 5 acres" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Location *</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Your village/town" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Budget (₹)</Text>
        <TextInput style={styles.input} value={budget} onChangeText={setBudget} keyboardType="numeric" placeholder="Optional budget" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription}
          multiline numberOfLines={5} textAlignVertical="top"
          placeholder="Describe what you need..." placeholderTextColor={Colors.textHint}
        />

        <TouchableOpacity style={[styles.submitBtn, isLoading && styles.btnDisabled]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={Colors.textOnPrimary} /> : <Text style={styles.submitText}>Post Request</Text>}
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
  textarea: {height: 120, paddingTop: Spacing.md},
  chipScroll: {marginBottom: Spacing.sm},
  chip: {paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, marginRight: Spacing.sm},
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText: {fontSize: FontSize.sm, color: Colors.textSecondary},
  chipTextActive: {color: Colors.textOnPrimary, fontWeight: '600'},
  submitBtn: {backgroundColor: Colors.primary, padding: Spacing.md + 2, borderRadius: BorderRadius.xl, alignItems: 'center', marginTop: Spacing.xl},
  btnDisabled: {opacity: 0.6},
  submitText: {color: Colors.textOnPrimary, fontSize: FontSize.md, fontWeight: 'bold'},
});

export default PostRequestScreen;
