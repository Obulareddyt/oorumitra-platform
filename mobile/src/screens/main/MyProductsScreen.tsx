import React, {useState, useEffect, useCallback} from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl, Image, Switch, Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {productService} from '../../services/listingService';
import {Product} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const ProductRow: React.FC<{
  item: Product;
  busy: boolean;
  onPress: () => void;
  onToggle: () => void;
}> = ({item, busy, onPress, onToggle}) => {
  const isActive = item.availabilityStatus === 'ACTIVE';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {item.imageUrls?.[0] ? (
        <Image source={{uri: item.imageUrls[0]}} style={styles.cardImage} />
      ) : (
        <View style={styles.cardImagePlaceholder}>
          <Icon name="shopping" size={28} color={Colors.textHint} />
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.productName}</Text>
        <Text style={styles.cardPrice}>₹{item.amount}</Text>
      </View>
      <View style={styles.toggleCol}>
        {busy ? (
          <ActivityIndicator color={Colors.primary} size="small" />
        ) : (
          <Switch
            value={isActive}
            onValueChange={onToggle}
            trackColor={{false: Colors.border, true: Colors.success}}
            thumbColor={Colors.surface}
          />
        )}
        <Text style={[styles.statusText, {color: isActive ? Colors.success : Colors.error}]}>
          {isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const MyProductsScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productService.getMyProducts(0, 100);
      setProducts(res.content);
    } catch (_) {}
    setIsLoading(false);
  }, []);

  useEffect(() => {load();}, [load]);

  const onRefresh = async () => {setRefreshing(true); await load(); setRefreshing(false);};

  const handleToggle = async (product: Product) => {
    const newStatus = product.availabilityStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setTogglingId(product.id);
    try {
      const updated = await productService.updateAvailabilityStatus(product.id, newStatus);
      setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to update availability');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products} keyExtractor={i => i.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <ProductRow
            item={item}
            busy={togglingId === item.id}
            onPress={() => navigation.navigate('ProductDetail', {id: item.id})}
            onToggle={() => handleToggle(item)}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        ListEmptyComponent={!isLoading ? (
          <View style={styles.empty}>
            <Icon name="shopping-off" size={56} color={Colors.textHint} />
            <Text style={styles.emptyText}>{t('common.noData')}</Text>
          </View>
        ) : (
          <ActivityIndicator color={Colors.primary} style={styles.loader} />
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddProduct')}>
        <Icon name="plus" size={26} color={Colors.textOnPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  list: {padding: Spacing.base, paddingBottom: 100},
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, padding: Spacing.sm, marginBottom: Spacing.sm, elevation: 2,
  },
  cardImage: {width: 56, height: 56, borderRadius: BorderRadius.md},
  cardImagePlaceholder: {
    width: 56, height: 56, borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceVariant, justifyContent: 'center', alignItems: 'center',
  },
  cardBody: {flex: 1, marginLeft: Spacing.sm},
  cardTitle: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text},
  cardPrice: {fontSize: FontSize.sm, color: Colors.accent, marginTop: 2, fontWeight: '600'},
  toggleCol: {alignItems: 'center', gap: 2, minWidth: 60},
  statusText: {fontSize: FontSize.xs, fontWeight: '700'},
  loader: {marginVertical: Spacing.xl},
  empty: {alignItems: 'center', marginTop: Spacing.xxxl * 2},
  emptyText: {color: Colors.textHint, fontSize: FontSize.md, marginTop: Spacing.md},
  fab: {
    position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', elevation: 6,
  },
});

export default MyProductsScreen;
