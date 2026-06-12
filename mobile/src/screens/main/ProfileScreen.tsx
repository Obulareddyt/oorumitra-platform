import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppDispatch, useAppSelector} from '../../store';
import {logout, setUser} from '../../store/slices/authSlice';
import {userService} from '../../services/userService';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const ProfileScreen: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const user = useAppSelector(s => s.auth.user);

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [village, setVillage] = useState(user?.village ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await userService.updateProfile({firstName, lastName, village, email});
      dispatch(setUser(updated));
      setEditing(false);
      Alert.alert('Saved', 'Profile updated successfully');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const MENU_ROWS = [
    {icon: 'ticket', label: 'My Requests', onPress: () => navigation.navigate('RequestTickets')},
    {icon: 'star', label: 'My Bookings', onPress: () => navigation.navigate('MyBookings')},
    {icon: 'translate', label: 'Language', onPress: () => navigation.navigate('LanguageVoice')},
    {icon: 'account-hard-hat', label: 'My Listings', onPress: () => navigation.navigate('WorkerServices')},
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Icon name="account" size={48} color={Colors.textOnPrimary} />
        </View>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.mobile}>+91 {user?.mobileNumber}</Text>
      </View>

      {/* Edit form */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Personal Info</Text>
          <TouchableOpacity onPress={() => editing ? handleSave() : setEditing(true)}>
            {saving ? <ActivityIndicator color={Colors.primary} size="small" /> : (
              <Icon name={editing ? 'check' : 'pencil'} size={22} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.fieldLabel}>First Name</Text>
            <TextInput
              style={[styles.field, !editing && styles.fieldReadonly]}
              value={firstName} onChangeText={setFirstName} editable={editing}
              placeholderTextColor={Colors.textHint}
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.fieldLabel}>Last Name</Text>
            <TextInput
              style={[styles.field, !editing && styles.fieldReadonly]}
              value={lastName} onChangeText={setLastName} editable={editing}
              placeholderTextColor={Colors.textHint}
            />
          </View>
        </View>

        <Text style={styles.fieldLabel}>Village</Text>
        <TextInput style={[styles.field, !editing && styles.fieldReadonly]} value={village} onChangeText={setVillage} editable={editing} placeholderTextColor={Colors.textHint} />

        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput style={[styles.field, !editing && styles.fieldReadonly]} value={email} onChangeText={setEmail} editable={editing} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.textHint} />
      </View>

      {/* Menu */}
      <View style={styles.card}>
        {MENU_ROWS.map(row => (
          <TouchableOpacity key={row.label} style={styles.menuItem} onPress={row.onPress}>
            <Icon name={row.icon} size={22} color={Colors.textSecondary} />
            <Text style={styles.menuLabel}>{row.label}</Text>
            <Icon name="chevron-right" size={22} color={Colors.textHint} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => Alert.alert('Logout', 'Are you sure?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Logout', style: 'destructive', onPress: () => dispatch(logout())},
        ])}>
        <Icon name="logout" size={22} color={Colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  hero: {backgroundColor: Colors.primary, padding: Spacing.xxxl, alignItems: 'center'},
  avatar: {width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md},
  name: {fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textOnPrimary},
  mobile: {fontSize: FontSize.base, color: 'rgba(255,255,255,0.8)', marginTop: 4},
  card: {backgroundColor: Colors.surface, margin: Spacing.base, borderRadius: BorderRadius.lg, padding: Spacing.base, elevation: 1},
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md},
  cardTitle: {fontSize: FontSize.md, fontWeight: '700', color: Colors.text},
  row: {flexDirection: 'row', gap: Spacing.sm},
  half: {flex: 1},
  fieldLabel: {fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 4, marginTop: Spacing.sm, fontWeight: '600'},
  field: {borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, padding: Spacing.sm, fontSize: FontSize.base, color: Colors.text, backgroundColor: Colors.background},
  fieldReadonly: {borderColor: 'transparent', backgroundColor: 'transparent', paddingLeft: 0},
  menuItem: {flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.md},
  menuLabel: {flex: 1, fontSize: FontSize.base, color: Colors.text},
  logoutBtn: {flexDirection: 'row', alignItems: 'center', gap: Spacing.md, margin: Spacing.base, padding: Spacing.base, backgroundColor: Colors.error + '10', borderRadius: BorderRadius.lg},
  logoutText: {fontSize: FontSize.base, color: Colors.error, fontWeight: '700'},
});

export default ProfileScreen;
