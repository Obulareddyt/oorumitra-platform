import React, {useState, useEffect, useCallback} from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {workerService} from '../../services/listingService';
import {WorkerListing, WorkType} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import WorkerCard from '../../components/cards/WorkerCard';

const WORK_TYPES: {label: string; value: WorkType | undefined}[] = [
  {label: 'All', value: undefined},
  {label: 'Harvesting', value: 'HARVESTING'},
  {label: 'Mason', value: 'MASON_WORK'},
  {label: 'Electrical', value: 'ELECTRICAL'},
  {label: 'Borewell', value: 'BOREWELL_WORK'},
  {label: 'Painting', value: 'PAINTING'},
  {label: 'Plumbing', value: 'PLUMBING'},
];

const WorkerServicesScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const [workers, setWorkers] = useState<WorkerListing[]>([]);
  const [selectedType, setSelectedType] = useState<WorkType | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (reset = false) => {
    if (isLoading) return;
    const currentPage = reset ? 0 : page;
    if (!reset && currentPage >= totalPages) return;
    setIsLoading(true);
    try {
      const result = await workerService.getAll({workType: selectedType, page: currentPage, size: 20});
      setWorkers(prev => reset ? result.content : [...prev, ...result.content]);
      setTotalPages(result.totalPages);
      setPage(currentPage + 1);
    } catch (_) {}
    setIsLoading(false);
  }, [isLoading, page, totalPages, selectedType]);

  useEffect(() => {setPage(0); setWorkers([]); load(true);}, [selectedType]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(0);
    await load(true);
    setRefreshing(false);
  }, [load]);

  return (
    <View style={styles.container}>
      {/* Filter chips */}
      <FlatList
        horizontal
        data={WORK_TYPES}
        keyExtractor={i => i.label}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.chip, selectedType === item.value && styles.chipActive]}
            onPress={() => setSelectedType(item.value)}>
            <Text style={[styles.chipText, selectedType === item.value && styles.chipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* List */}
      <FlatList
        data={workers}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <WorkerCard
            item={item}
            onPress={() => navigation.navigate('WorkerDetail', {id: item.id})}
          />
        )}
        contentContainerStyle={styles.list}
        onEndReached={() => load()}
        onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        ListFooterComponent={isLoading ? <ActivityIndicator color={Colors.primary} style={styles.loader} /> : null}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Icon name="account-off" size={56} color={Colors.textHint} />
              <Text style={styles.emptyText}>{t('common.noData')}</Text>
            </View>
          ) : null
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddWorkerService')}>
        <Icon name="plus" size={26} color={Colors.textOnPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  chips: {padding: Spacing.base, paddingBottom: Spacing.sm, gap: Spacing.sm},
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText: {fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500'},
  chipTextActive: {color: Colors.textOnPrimary},
  list: {paddingHorizontal: Spacing.base, paddingBottom: 100},
  loader: {marginVertical: Spacing.xl},
  empty: {alignItems: 'center', marginTop: Spacing.xxxl * 2},
  emptyText: {color: Colors.textHint, fontSize: FontSize.md, marginTop: Spacing.md},
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, justifyContent: 'center',
    alignItems: 'center', elevation: 6,
  },
});

export default WorkerServicesScreen;
