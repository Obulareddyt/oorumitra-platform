import React, {useState, useCallback} from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {workerService, productService, vehicleWorkService, transportService} from '../../services/listingService';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

type ResultType = 'WORKER' | 'PRODUCT' | 'VEHICLE_WORK' | 'TRANSPORT';

const TABS: {label: string; type: ResultType}[] = [
  {label: 'Workers', type: 'WORKER'},
  {label: 'Products', type: 'PRODUCT'},
  {label: 'Vehicles', type: 'VEHICLE_WORK'},
  {label: 'Transport', type: 'TRANSPORT'},
];

const SearchScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState(route.params?.query ?? '');
  const [tab, setTab] = useState<ResultType>('WORKER');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string, t: ResultType) => {
    if (!q.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      let res: any;
      switch (t) {
        case 'WORKER': res = await workerService.getAll({keyword: q, page: 0, size: 20}); break;
        case 'PRODUCT': res = await productService.getAll({keyword: q, page: 0, size: 20}); break;
        case 'VEHICLE_WORK': res = await vehicleWorkService.getAll({keyword: q, page: 0, size: 20}); break;
        case 'TRANSPORT': res = await transportService.getAll({keyword: q, page: 0, size: 20}); break;
      }
      setResults(res?.content ?? []);
    } catch (_) {}
    setLoading(false);
  }, []);

  const handleSearch = () => search(query, tab);
  const handleTabChange = (t: ResultType) => {setTab(t); if (query) search(query, t);};

  const DETAIL_SCREENS: Record<ResultType, string> = {
    WORKER: 'WorkerDetail', PRODUCT: 'ProductDetail',
    VEHICLE_WORK: 'VehicleWorkDetail', TRANSPORT: 'TransportDetail',
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="magnify" size={22} color={Colors.textHint} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholder="Search workers, products..."
          placeholderTextColor={Colors.textHint}
          returnKeyType="search"
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => {setQuery(''); setResults([]);}}>
            <Icon name="close-circle" size={20} color={Colors.textHint} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t.type} style={[styles.tab, tab === t.type && styles.tabActive]} onPress={() => handleTabChange(t.type)}>
            <Text style={[styles.tabText, tab === t.type && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={Colors.primary} size="large" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => navigation.navigate(DETAIL_SCREENS[tab], {id: item.id})}>
              <View style={styles.resultIcon}>
                <Icon name={tab === 'WORKER' ? 'account-hard-hat' : tab === 'PRODUCT' ? 'shopping' : tab === 'VEHICLE_WORK' ? 'tractor' : 'truck'} size={24} color={Colors.primary} />
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{item.title ?? item.name}</Text>
                <View style={styles.resultRow}>
                  <Icon name="map-marker" size={12} color={Colors.textHint} />
                  <Text style={styles.resultSub}>{item.village}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color={Colors.textHint} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query ? (
              <View style={styles.empty}>
                <Icon name="magnify-close" size={48} color={Colors.textHint} />
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    margin: Spacing.base, borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.md,
    elevation: 3,
  },
  searchIcon: {marginRight: Spacing.sm},
  input: {flex: 1, fontSize: FontSize.base, color: Colors.text, paddingVertical: Spacing.md},
  tabs: {flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.divider},
  tab: {flex: 1, paddingVertical: Spacing.md, alignItems: 'center'},
  tabActive: {borderBottomWidth: 2, borderBottomColor: Colors.primary},
  tabText: {fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500'},
  tabTextActive: {color: Colors.primary, fontWeight: '700'},
  loader: {marginTop: Spacing.xxxl},
  list: {padding: Spacing.base, flexGrow: 1},
  resultItem: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, padding: Spacing.md, elevation: 1},
  resultIcon: {width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceVariant, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md},
  resultInfo: {flex: 1},
  resultTitle: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text},
  resultRow: {flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2},
  resultSub: {fontSize: FontSize.xs, color: Colors.textHint},
  empty: {alignItems: 'center', marginTop: Spacing.xxxl},
  emptyText: {color: Colors.textHint, fontSize: FontSize.base, marginTop: Spacing.md},
});

export default SearchScreen;
