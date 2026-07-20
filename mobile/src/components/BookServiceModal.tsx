import React, {useState} from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {bookingService} from '../services/bookingService';
import {ListingType} from '../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../theme';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

interface Props {
  visible: boolean;
  listingId: number;
  listingType: ListingType;
  listingName: string;
  onClose: () => void;
}

const BookServiceModal: React.FC<Props> = ({visible, listingId, listingType, listingName, onClose}) => {
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setServiceDate(''); setServiceTime(''); setNotes(''); setError(''); setSuccess(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (serviceDate && !DATE_RE.test(serviceDate)) { setError('Enter date as YYYY-MM-DD'); return; }
    if (serviceTime && !TIME_RE.test(serviceTime)) { setError('Enter time as HH:MM (24-hour)'); return; }
    setLoading(true);
    setError('');
    try {
      await bookingService.create({
        listingId, listingType,
        serviceDate: serviceDate || undefined,
        serviceTime: serviceTime ? `${serviceTime}:00` : undefined,
        notes: notes || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to book service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {success ? (
            <View style={styles.successBox}>
              <Icon name="check-circle" size={48} color={Colors.success} />
              <Text style={styles.successTitle}>Booking Confirmed!</Text>
              <Text style={styles.successDesc}>The owner has been notified and will contact you.</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleClose}>
                <Text style={styles.primaryBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Book Service</Text>
                <TouchableOpacity onPress={handleClose}>
                  <Icon name="close" size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.listingName}>{listingName}</Text>

              <Text style={styles.label}>Service Date</Text>
              <TextInput
                style={styles.input} value={serviceDate} onChangeText={setServiceDate}
                keyboardType="numbers-and-punctuation" maxLength={10}
                placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textHint}
              />

              <Text style={styles.label}>Service Time</Text>
              <TextInput
                style={styles.input} value={serviceTime} onChangeText={setServiceTime}
                keyboardType="numbers-and-punctuation" maxLength={5}
                placeholder="HH:MM (24-hour)" placeholderTextColor={Colors.textHint}
              />

              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.notesInput]} value={notes} onChangeText={setNotes}
                multiline numberOfLines={3} placeholderTextColor={Colors.textHint}
              />

              {!!error && <Text style={styles.error}>{error}</Text>}

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.outlineBtn} onPress={handleClose}>
                  <Text style={styles.outlineBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit} disabled={loading}>
                  {loading ? <ActivityIndicator color={Colors.textOnPrimary} /> : <Text style={styles.primaryBtnText}>Confirm Booking</Text>}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: Spacing.xl},
  card: {backgroundColor: Colors.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm},
  title: {fontSize: FontSize.lg, fontWeight: '700', color: Colors.text},
  listingName: {fontSize: FontSize.base, color: Colors.textSecondary, marginBottom: Spacing.md},
  label: {fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginTop: Spacing.sm, marginBottom: 4},
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md,
    padding: Spacing.sm, fontSize: FontSize.base, color: Colors.text, backgroundColor: Colors.background,
  },
  notesInput: {height: 80, textAlignVertical: 'top'},
  error: {color: Colors.error, fontSize: FontSize.sm, marginTop: Spacing.sm},
  actionsRow: {flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg},
  outlineBtn: {
    flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.xl,
    padding: Spacing.md, alignItems: 'center',
  },
  outlineBtnText: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text},
  primaryBtn: {flex: 1, backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, padding: Spacing.md, alignItems: 'center'},
  primaryBtnText: {fontSize: FontSize.base, fontWeight: '700', color: Colors.textOnPrimary},
  successBox: {alignItems: 'center', paddingVertical: Spacing.md},
  successTitle: {fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginTop: Spacing.sm},
  successDesc: {fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.lg, textAlign: 'center'},
});

export default BookServiceModal;
