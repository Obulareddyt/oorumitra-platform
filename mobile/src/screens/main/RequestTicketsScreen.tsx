import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ticketService} from '../../services/userService';
import {RequestTicket} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const STATUS_COLORS: Record<string, string> = {
  OPEN: Colors.success, IN_PROGRESS: Colors.warning, CLOSED: Colors.textHint,
};

const TicketCard: React.FC<{item: RequestTicket; onPress: () => void}> = ({item, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.cardLeft}>
      <Icon name="ticket" size={24} color={Colors.primary} />
    </View>
    <View style={styles.cardBody}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.statusBadge, {backgroundColor: STATUS_COLORS[item.status] + '20'}]}>
          <Text style={[styles.statusText, {color: STATUS_COLORS[item.status]}]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
      <View style={styles.row}>
        <Icon name="map-marker" size={12} color={Colors.textHint} />
        <Text style={styles.village}>{item.village}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.type}>{item.workType?.replace(/_/g, ' ')}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const RequestTicketsScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const [tickets, setTickets] = useState<RequestTicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tab, setTab] = useState<'all' | 'mine'>('all');

  const load = useCallback(async (reset = false) => {
    if (isLoading) return;
    const p = reset ? 0 : page;
    if (!reset && p >= totalPages) return;
    setIsLoading(true);
    try {
      const res = tab === 'mine'
        ? await ticketService.getMyTickets({page: p, size: 20})
        : await ticketService.getAll({page: p, size: 20});
      setTickets(prev => reset ? res.content : [...prev, ...res.content]);
      setTotalPages(res.totalPages);
      setPage(p + 1);
    } catch (_) {}
    setIsLoading(false);
  }, [isLoading, page, totalPages, tab]);

  useEffect(() => {setPage(0); setTickets([]); load(true);}, [tab]);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {['all', 'mine'].map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t as any)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'all' ? 'All Requests' : 'My Requests'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={tickets} keyExtractor={i => i.id.toString()}
        renderItem={({item}) => <TicketCard item={item} onPress={() => navigation.navigate('TicketDetail', {id: item.id})} />}
        contentContainerStyle={styles.list}
        onEndReached={() => load()} onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {setRefreshing(true); setPage(0); await load(true); setRefreshing(false);}} colors={[Colors.primary]} />}
        ListFooterComponent={isLoading ? <ActivityIndicator color={Colors.primary} style={styles.loader} /> : null}
        ListEmptyComponent={!isLoading ? <View style={styles.empty}><Icon name="ticket-off" size={56} color={Colors.textHint} /><Text style={styles.emptyText}>{t('common.noData')}</Text></View> : null}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PostRequest')}>
        <Icon name="plus" size={26} color={Colors.textOnPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  tabs: {flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.divider},
  tab: {flex: 1, paddingVertical: Spacing.md, alignItems: 'center'},
  tabActive: {borderBottomWidth: 2, borderBottomColor: Colors.primary},
  tabText: {fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: '500'},
  tabTextActive: {color: Colors.primary, fontWeight: '700'},
  list: {padding: Spacing.base, paddingBottom: 100},
  card: {flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, elevation: 2, overflow: 'hidden'},
  cardLeft: {width: 56, backgroundColor: Colors.surfaceVariant, justifyContent: 'center', alignItems: 'center'},
  cardBody: {flex: 1, padding: Spacing.md},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4},
  title: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text, flex: 1},
  statusBadge: {paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full},
  statusText: {fontSize: FontSize.xs, fontWeight: '700'},
  desc: {fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4},
  row: {flexDirection: 'row', alignItems: 'center', gap: 4},
  village: {fontSize: FontSize.xs, color: Colors.textHint},
  dot: {color: Colors.textHint},
  type: {fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600'},
  loader: {marginVertical: Spacing.xl},
  empty: {alignItems: 'center', marginTop: Spacing.xxxl * 2},
  emptyText: {color: Colors.textHint, fontSize: FontSize.md, marginTop: Spacing.md},
  fab: {position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 6},
});

export default RequestTicketsScreen;
