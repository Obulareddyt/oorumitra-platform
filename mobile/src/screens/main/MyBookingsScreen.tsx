import React, {useState, useEffect} from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import api from '../../services/api';
import {Booking} from '../../types';

const STATUS_COLORS: Record<string, string> = {
  PENDING: Colors.warning, CONFIRMED: Colors.success, COMPLETED: Colors.info, CANCELLED: Colors.error,
};

const STATUS_ICONS: Record<string, string> = {
  PENDING: 'clock-outline', CONFIRMED: 'check-circle', COMPLETED: 'check-all', CANCELLED: 'close-circle',
};

const MyBookingsScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'buyer' | 'seller'>('buyer');

  const load = async () => {
    try {
      const res = await api.get('/bookings/my', {params: {role: tab}});
      setBookings(res.data.data ?? []);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {setLoading(true); load();}, [tab]);

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
            return (
              <View style={styles.card}>
                <View style={[styles.statusIcon, {backgroundColor: color + '20'}]}>
                  <Icon name={icon} size={24} color={color} />
                </View>
                <View style={styles.info}>
                  <Text style={styles.listingType}>{item.listingType?.replace(/_/g, ' ')}</Text>
                  <Text style={styles.date}>
                    {item.requiredDate ? new Date(item.requiredDate).toLocaleDateString() : 'Date TBD'}
                  </Text>
                  {item.amount != null && <Text style={styles.amount}>₹{item.amount}</Text>}
                </View>
                <View style={[styles.badge, {backgroundColor: color + '20'}]}>
                  <Text style={[styles.badgeText, {color}]}>{item.status}</Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Icon name="calendar-blank" size={56} color={Colors.textHint} />
              <Text style={styles.emptyText}>No bookings yet</Text>
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
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, padding: Spacing.md, elevation: 2,
  },
  statusIcon: {width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md},
  info: {flex: 1},
  listingType: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text},
  date: {fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2},
  amount: {fontSize: FontSize.md, fontWeight: '700', color: Colors.accent, marginTop: 2},
  badge: {paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full},
  badgeText: {fontSize: FontSize.xs, fontWeight: '700'},
  empty: {alignItems: 'center', marginTop: Spacing.xxxl * 2},
  emptyText: {color: Colors.textHint, fontSize: FontSize.md, marginTop: Spacing.md},
});

export default MyBookingsScreen;
