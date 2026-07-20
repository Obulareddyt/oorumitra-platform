import React, {useState, useEffect, useCallback} from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl, Linking, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import {bookingService} from '../../services/bookingService';
import {Booking, BookingStatus} from '../../types';

const STATUS_COLORS: Record<string, string> = {
  INTERESTED: Colors.warning, CONTACTED: Colors.info, PURCHASED: Colors.success,
  PENDING: Colors.warning, ACCEPTED: Colors.info, IN_PROGRESS: Colors.info, COMPLETED: Colors.success,
  CANCELLED: Colors.error,
};

const STATUS_ICONS: Record<string, string> = {
  INTERESTED: 'heart-outline', CONTACTED: 'phone-outline', PURCHASED: 'check-all',
  PENDING: 'clock-outline', ACCEPTED: 'check-circle', IN_PROGRESS: 'progress-clock', COMPLETED: 'check-all',
  CANCELLED: 'close-circle',
};

// Mirrors the backend's forward-only flow (BookingService.PRODUCT_FLOW / SERVICE_FLOW).
const NEXT_STATUS: Record<string, BookingStatus> = {
  INTERESTED: 'CONTACTED', CONTACTED: 'PURCHASED',
  PENDING: 'ACCEPTED', ACCEPTED: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED',
};
const TERMINAL = new Set(['PURCHASED', 'COMPLETED', 'CANCELLED']);

const MyBookingsScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'buyer' | 'seller'>('buyer');
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = tab === 'seller'
        ? await bookingService.getOwner(0, 100)
        : await bookingService.getMy(0, 100);
      setBookings(res.content ?? []);
    } catch (_) {}
    setLoading(false);
  }, [tab]);

  useEffect(() => {setLoading(true); load();}, [load]);

  const advance = async (id: number, status: BookingStatus) => {
    setUpdating(id);
    try {
      const updated = await bookingService.updateStatus(id, status);
      setBookings(prev => prev.map(b => (b.id === id ? updated : b)));
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const confirmCancel = (id: number) => {
    Alert.alert('Cancel booking', 'Are you sure?', [
      {text: 'No', style: 'cancel'},
      {text: 'Yes, cancel', style: 'destructive', onPress: () => advance(id, 'CANCELLED')},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['buyer', 'seller'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'buyer' ? 'My Bookings' : 'Received Bookings'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.center} color={Colors.primary} size="large" />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {setRefreshing(true); await load(); setRefreshing(false);}} colors={[Colors.primary]} />}
          renderItem={({item}) => {
            const color = STATUS_COLORS[item.status] ?? Colors.textHint;
            const icon = STATUS_ICONS[item.status] ?? 'calendar';
            const contactName = tab === 'seller' ? item.customerName : item.ownerName;
            const contactMobile = tab === 'seller' ? item.customerMobile : item.ownerMobile;
            const next = tab === 'seller' ? NEXT_STATUS[item.status] : undefined;
            const isTerminal = TERMINAL.has(item.status);
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.statusIcon, {backgroundColor: color + '20'}]}>
                    <Icon name={icon} size={24} color={color} />
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.listingType}>{item.listingName || item.listingType?.replace(/_/g, ' ')}</Text>
                    {!!contactName && <Text style={styles.date}>{tab === 'seller' ? 'Customer' : 'Owner'}: {contactName}</Text>}
                    <Text style={styles.date}>
                      {item.requiredDate ? new Date(item.requiredDate).toLocaleDateString() : 'Booked ' + new Date(item.createdAt).toLocaleDateString()}
                      {item.serviceTime ? ` at ${item.serviceTime}` : ''}
                    </Text>
                  </View>
                  <View style={[styles.badge, {backgroundColor: color + '20'}]}>
                    <Text style={[styles.badgeText, {color}]}>{item.status?.replace(/_/g, ' ')}</Text>
                  </View>
                </View>

                {!!contactMobile && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${contactMobile}`)}>
                      <Icon name="phone" size={16} color={Colors.primary} />
                      <Text style={styles.actionText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.whatsappBtn]} onPress={() => Linking.openURL(`https://wa.me/91${contactMobile}`)}>
                      <Icon name="whatsapp" size={16} color={Colors.textOnPrimary} />
                      <Text style={[styles.actionText, {color: Colors.textOnPrimary}]}>WhatsApp</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {tab === 'seller' && !isTerminal && (
                  <View style={styles.actionsRow}>
                    {next && (
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.advanceBtn]}
                        disabled={updating === item.id}
                        onPress={() => advance(item.id, next)}>
                        <Text style={styles.advanceText}>
                          {updating === item.id ? 'Updating…' : `Mark as ${next.replace(/_/g, ' ')}`}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.actionBtn}
                      disabled={updating === item.id}
                      onPress={() => confirmCancel(item.id)}>
                      <Text style={[styles.actionText, {color: Colors.error}]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Icon name="calendar-blank" size={56} color={Colors.textHint} />
              <Text style={styles.emptyText}>{tab === 'seller' ? 'No interested customers yet' : 'No bookings yet'}</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  tabs: {flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.divider},
  tab: {flex: 1, paddingVertical: Spacing.md, alignItems: 'center'},
  tabActive: {borderBottomWidth: 2, borderBottomColor: Colors.primary},
  tabText: {fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500'},
  tabTextActive: {color: Colors.primary, fontWeight: '700'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  list: {padding: Spacing.base, paddingBottom: Spacing.xl, flexGrow: 1},
  card: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm, padding: Spacing.md, elevation: 2,
  },
  cardTop: {flexDirection: 'row', alignItems: 'center'},
  statusIcon: {width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md},
  info: {flex: 1},
  listingType: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text},
  date: {fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2},
  badge: {paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full},
  badgeText: {fontSize: FontSize.xs, fontWeight: '700'},
  actionsRow: {flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm},
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
  },
  whatsappBtn: {backgroundColor: '#25D366', borderColor: '#25D366'},
  actionText: {fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary},
  advanceBtn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  advanceText: {fontSize: FontSize.xs, fontWeight: '700', color: Colors.textOnPrimary},
  empty: {alignItems: 'center', marginTop: Spacing.xxxl * 2},
  emptyText: {color: Colors.textHint, fontSize: FontSize.md, marginTop: Spacing.md},
});

export default MyBookingsScreen;
