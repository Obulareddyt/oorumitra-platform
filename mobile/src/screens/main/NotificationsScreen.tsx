import React, {useState, useEffect, useCallback} from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {notificationService} from '../../services/userService';
import {Notification} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

// Must match backend NotificationType enum exactly.
const NOTIF_ICONS: Record<string, string> = {
  NEW_REQUEST: 'ticket-outline',
  BOOKING_UPDATE: 'calendar-check',
  PRODUCT_AVAILABILITY: 'shopping-outline',
  CHAT_MESSAGE: 'chat',
  RATING_REMINDER: 'star',
  TICKET_RESPONSE: 'ticket',
  ANNOUNCEMENT: 'bullhorn-outline',
};

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (reset = false) => {
    if (isLoading) return;
    const p = reset ? 0 : page;
    if (!reset && p >= totalPages) return;
    setIsLoading(true);
    try {
      const res = await notificationService.getAll({page: p, size: 30});
      setNotifications(prev => reset ? res.content : [...prev, ...res.content]);
      setTotalPages(res.totalPages);
      setPage(p + 1);
    } catch (_) {}
    setIsLoading(false);
  }, [isLoading, page, totalPages]);

  useEffect(() => {load(true);}, []);

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    } catch (_) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markAll}>Mark all read</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={styles.list}
        onEndReached={() => load()} onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {setRefreshing(true); setPage(0); await load(true); setRefreshing(false);}} colors={[Colors.primary]} />}
        ListFooterComponent={isLoading ? <ActivityIndicator color={Colors.primary} style={styles.loader} /> : null}
        ListEmptyComponent={!isLoading ? (
          <View style={styles.empty}>
            <Icon name="bell-off" size={56} color={Colors.textHint} />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        ) : null}
        renderItem={({item}) => (
          <View style={[styles.item, !item.isRead && styles.itemUnread]}>
            <View style={[styles.iconBox, {backgroundColor: Colors.primary + '20'}]}>
              <Icon name={NOTIF_ICONS[item.type] ?? 'bell'} size={22} color={Colors.primary} />
            </View>
            <View style={styles.body}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body2} numberOfLines={2}>{item.body}</Text>
            </View>
            {!item.isRead && <View style={styles.dot} />}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.divider},
  headerTitle: {fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.text},
  markAll: {fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600'},
  list: {paddingBottom: Spacing.xl, flexGrow: 1},
  item: {flexDirection: 'row', alignItems: 'flex-start', padding: Spacing.base, backgroundColor: Colors.surface},
  itemUnread: {backgroundColor: Colors.surfaceVariant},
  iconBox: {width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md},
  body: {flex: 1},
  title: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text},
  body2: {fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 6},
  sep: {height: 1, backgroundColor: Colors.divider},
  loader: {marginVertical: Spacing.xl},
  empty: {alignItems: 'center', marginTop: Spacing.xxxl * 2},
  emptyText: {color: Colors.textHint, fontSize: FontSize.md, marginTop: Spacing.md},
});

export default NotificationsScreen;
