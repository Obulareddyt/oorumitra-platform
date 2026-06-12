import React, {useState, useEffect, useCallback} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, RefreshControl, FlatList,
} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppSelector} from '../../store';
import {workerService, productService, vehicleWorkService, transportService} from '../../services/listingService';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import ServiceCard from '../../components/cards/ServiceCard';

interface Category {
  key: string; label: string; icon: string; screen: string; color: string;
}

const CATEGORIES: Category[] = [
  {key: 'workers', label: 'Workers', icon: 'account-hard-hat', screen: 'WorkerServices', color: Colors.agriculture},
  {key: 'products', label: 'Products', icon: 'shopping', screen: 'ProductSales', color: Colors.hardware},
  {key: 'vehicleWork', label: 'Vehicle Work', icon: 'tractor', screen: 'VehicleWork', color: Colors.vehicles},
  {key: 'transport', label: 'Transport', icon: 'truck', screen: 'Transport', color: Colors.livestock},
  {key: 'requests', label: 'Requests', icon: 'ticket', screen: 'RequestTickets', color: '#7B1FA2'},
  {key: 'emergency', label: 'Emergency', icon: 'ambulance', screen: 'EmergencyServices', color: Colors.error},
  {key: 'government', label: 'Govt', icon: 'bank', screen: 'GovernmentServices', color: Colors.info},
  {key: 'map', label: 'Nearby Map', icon: 'map-marker-radius', screen: 'NearbyMap', color: Colors.success},
];

const HomeDashboardScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const user = useAppSelector(s => s.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyItems, setNearbyItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNearby = useCallback(async () => {
    try {
      const [workers, products] = await Promise.all([
        workerService.getNearby(17.3850, 78.4867, 50, 5),
        productService.getNearby(17.3850, 78.4867, 50, 5),
      ]);
      setNearbyItems([
        ...workers.map(w => ({...w, _type: 'WORKER'})),
        ...products.map(p => ({...p, _type: 'PRODUCT'})),
      ].slice(0, 10));
    } catch (_) {}
  }, []);

  useEffect(() => {loadNearby();}, [loadNearby]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNearby();
    setRefreshing(false);
  }, [loadNearby]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Search', {query: searchQuery});
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('home.greeting')}, {user?.firstName}!</Text>
          <Text style={styles.location}>
            <Icon name="map-marker" size={14} color={Colors.textOnPrimary} />
            {' '}{user?.village ?? 'Location'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Icon name="bell-outline" size={26} color={Colors.textOnPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" size={26} color={Colors.textOnPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('home.search')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          placeholderTextColor={Colors.textHint}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Icon name="magnify" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.voiceBtn} onPress={() => navigation.navigate('LanguageVoice')}>
          <Icon name="microphone" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={styles.categoryItem}
              onPress={() => navigation.navigate(cat.screen)}>
              <View style={[styles.categoryIcon, {backgroundColor: cat.color + '20'}]}>
                <Icon name={cat.icon} size={28} color={cat.color} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Nearby Services */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.nearbyServices')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NearbyMap')}>
            <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
          </TouchableOpacity>
        </View>
        {nearbyItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="map-search" size={48} color={Colors.textHint} />
            <Text style={styles.emptyText}>No services found nearby</Text>
          </View>
        ) : (
          nearbyItems.map((item, i) => (
            <ServiceCard
              key={`${item._type}-${item.id}`}
              item={item}
              type={item._type}
              onPress={() => {
                const screen = item._type === 'WORKER' ? 'WorkerDetail' : 'ProductDetail';
                navigation.navigate(screen, {id: item.id});
              }}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    backgroundColor: Colors.primary, padding: Spacing.xl,
    paddingTop: Spacing.xl + 20, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'flex-start',
  },
  greeting: {fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textOnPrimary},
  location: {fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2},
  headerActions: {flexDirection: 'row', gap: Spacing.md, alignItems: 'center'},
  menuBtn: {marginLeft: Spacing.sm},
  searchContainer: {
    flexDirection: 'row', margin: Spacing.base,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    elevation: 4, shadowOpacity: 0.1, shadowRadius: 4,
  },
  searchInput: {
    flex: 1, padding: Spacing.md, fontSize: FontSize.base,
    color: Colors.text, paddingLeft: Spacing.base,
  },
  searchBtn: {padding: Spacing.md},
  voiceBtn: {padding: Spacing.md},
  section: {padding: Spacing.base},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md},
  sectionTitle: {fontSize: FontSize.md, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.md},
  seeAll: {fontSize: FontSize.base, color: Colors.primary, fontWeight: '600'},
  categoriesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
  },
  categoryItem: {
    width: '22%', alignItems: 'center', marginBottom: Spacing.md,
  },
  categoryIcon: {
    width: 56, height: 56, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  categoryLabel: {fontSize: FontSize.xs, color: Colors.text, textAlign: 'center', fontWeight: '500'},
  emptyState: {alignItems: 'center', padding: Spacing.xxxl},
  emptyText: {color: Colors.textHint, marginTop: Spacing.md, fontSize: FontSize.base},
});

export default HomeDashboardScreen;
