import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {transportService} from '../../services/listingService';
import {TransportListing, TransportVehicleType} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const VEHICLE_TYPES: {label: string; value: TransportVehicleType | undefined; icon: string}[] = [
  {label: 'All', value: undefined, icon: 'truck'},
  {label: 'Auto', value: 'AUTO', icon: 'rickshaw'},
  {label: 'Tractor', value: 'TRACTOR', icon: 'tractor'},
  {label: 'Mini Truck', value: 'MINI_TRUCK', icon: 'truck'},
  {label: 'Lorry', value: 'LORRY', icon: 'truck-flatbed'},
  {label: 'Bus', value: 'BUS', icon: 'bus'},
];

const TransportCard: React.FC<{item: TransportListing; onPress: () => void}> = ({item, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.iconBox}>
      <Icon name="truck" size={28} color={Colors.livestock} />
    </View>
    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={1}>{item.ownerName ?? item.vehicleType?.replace(/_/g, ' ')}</Text>
      <Text style={styles.subType}>{item.vehicleType?.replace(/_/g, ' ')}</Text>
      <View style={styles.row}>
        <Icon name="map-marker" size={13} color={Colors.textHint} />
        <Text style={styles.village}>{item.village}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.price}>₹{item.ratePerKm}<Text style={styles.unit}>/km</Text></Text>
        {item.weightCapacity && <Text style={styles.cap}>{item.weightCapacity}</Text>}
      </View>
    </View>
  </TouchableOpacity>
);

const TransportScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<TransportListing[]>([]);
  const [selected, setSelected] = useState<TransportVehicleType | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (reset = false) => {
    if (isLoading) return;
    const p = reset ? 0 : page;
    if (!reset && p >= totalPages) return;
    setIsLoading(true);
    try {
      const res = await transportService.getAll({vehicleType: selected, page: p, size: 20});
      setItems(prev => reset ? res.content : [...prev, ...res.content]);
      setTotalPages(res.totalPages);
      setPage(p + 1);
    } catch (_) {}
    setIsLoading(false);
  }, [isLoading, page, totalPages, selected]);

  useEffect(() => {setPage(0); setItems([]); load(true);}, [selected]);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal data={VEHICLE_TYPES} keyExtractor={i => i.label}
        showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.chip, selected === item.value && styles.chipActive]}
            onPress={() => setSelected(item.value)}>
            <Icon name={item.icon} size={14} color={selected === item.value ? Colors.textOnPrimary : Colors.textSecondary} />
            <Text style={[styles.chipText, selected === item.value && styles.chipTextActive]}>{' '}{item.label}</Text>
          </TouchableOpacity>
        )}
      />
      <FlatList
        data={items} keyExtractor={i => i.id.toString()}
        renderItem={({item}) => <TransportCard item={item} onPress={() => navigation.navigate('TransportDetail', {id: item.id})} />}
        contentContainerStyle={styles.list}
        onEndReached={() => load()} onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {setRefreshing(true); setPage(0); await load(true); setRefreshing(false);}} colors={[Colors.primary]} />}
        ListFooterComponent={isLoading ? <ActivityIndicator color={Colors.primary} style={styles.loader} /> : null}
        ListEmptyComponent={!isLoading ? <View style={styles.empty}><Icon name="truck-off" size={56} color={Colors.textHint} /><Text style={styles.emptyText}>{t('common.noData')}</Text></View> : null}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTransport')}>
        <Icon name="plus" size={26} color={Colors.textOnPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  chips: {padding: Spacing.base, paddingBottom: Spacing.sm, gap: Spacing.sm},
  chip: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface},
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText: {fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500'},
  chipTextActive: {color: Colors.textOnPrimary},
  list: {paddingHorizontal: Spacing.base, paddingBottom: 100},
  card: {flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, elevation: 2, padding: Spacing.md},
  iconBox: {width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.livestock + '15', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md},
  info: {flex: 1},
  title: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text},
  subType: {fontSize: FontSize.sm, color: Colors.livestock, fontWeight: '600', marginTop: 2},
  row: {flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2},
  village: {fontSize: FontSize.xs, color: Colors.textHint},
  footer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6},
  price: {fontSize: FontSize.md, fontWeight: '700', color: Colors.accent},
  unit: {fontSize: FontSize.xs, fontWeight: '400', color: Colors.textSecondary},
  cap: {fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600'},
  loader: {marginVertical: Spacing.xl},
  empty: {alignItems: 'center', marginTop: Spacing.xxxl * 2},
  emptyText: {color: Colors.textHint, fontSize: FontSize.md, marginTop: Spacing.md},
  fab: {position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 6},
});

export default TransportScreen;
