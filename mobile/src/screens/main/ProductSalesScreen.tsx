import React, {useState, useEffect, useCallback} from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl, Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {productService} from '../../services/listingService';
import {Product, ProductCategory} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const CATEGORIES: {label: string; value: ProductCategory | undefined}[] = [
  {label: 'All', value: undefined},
  {label: 'Seeds', value: 'SEEDS'},
  {label: 'Fertilizers', value: 'FERTILIZERS'},
  {label: 'Tools', value: 'TOOLS'},
  {label: 'Equipment', value: 'EQUIPMENT'},
  {label: 'Livestock', value: 'LIVESTOCK'},
  {label: 'Dairy', value: 'DAIRY'},
  {label: 'Vegetables', value: 'VEGETABLES'},
  {label: 'Fruits', value: 'FRUITS'},
  {label: 'Grains', value: 'GRAINS'},
];

const ProductCard: React.FC<{item: Product; onPress: () => void}> = ({item, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    {item.imageUrls?.[0] ? (
      <Image source={{uri: item.imageUrls[0]}} style={styles.cardImage} />
    ) : (
      <View style={styles.cardImagePlaceholder}>
        <Icon name="shopping" size={32} color={Colors.textHint} />
      </View>
    )}
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardCategory}>{item.category?.replace(/_/g, ' ')}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>₹{item.price}</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={12} color={Colors.star} />
          <Text style={styles.rating}>{Number(item.averageRating ?? 0).toFixed(1)}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const ProductSalesScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCat, setSelectedCat] = useState<ProductCategory | undefined>(undefined);
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
      const res = await productService.getAll({category: selectedCat, page: p, size: 20});
      setProducts(prev => reset ? res.content : [...prev, ...res.content]);
      setTotalPages(res.totalPages);
      setPage(p + 1);
    } catch (_) {}
    setIsLoading(false);
  }, [isLoading, page, totalPages, selectedCat]);

  useEffect(() => {setPage(0); setProducts([]); load(true);}, [selectedCat]);

  const onRefresh = async () => {setRefreshing(true); setPage(0); await load(true); setRefreshing(false);};

  return (
    <View style={styles.container}>
      <FlatList
        horizontal data={CATEGORIES} keyExtractor={i => i.label}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[styles.chip, selectedCat === item.value && styles.chipActive]}
            onPress={() => setSelectedCat(item.value)}>
            <Text style={[styles.chipText, selectedCat === item.value && styles.chipTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
      <FlatList
        data={products} keyExtractor={i => i.id.toString()}
        numColumns={2} columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <ProductCard item={item} onPress={() => navigation.navigate('ProductDetail', {id: item.id})} />
        )}
        onEndReached={() => load()} onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        ListFooterComponent={isLoading ? <ActivityIndicator color={Colors.primary} style={styles.loader} /> : null}
        ListEmptyComponent={!isLoading ? (
          <View style={styles.empty}>
            <Icon name="shopping-off" size={56} color={Colors.textHint} />
            <Text style={styles.emptyText}>{t('common.noData')}</Text>
          </View>
        ) : null}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddProduct')}>
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
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText: {fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500'},
  chipTextActive: {color: Colors.textOnPrimary},
  list: {padding: Spacing.sm, paddingBottom: 100},
  row: {gap: Spacing.sm, marginBottom: Spacing.sm},
  card: {flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, overflow: 'hidden', elevation: 2},
  cardImage: {width: '100%', height: 130},
  cardImagePlaceholder: {width: '100%', height: 130, backgroundColor: Colors.surfaceVariant, justifyContent: 'center', alignItems: 'center'},
  cardBody: {padding: Spacing.sm},
  cardTitle: {fontSize: FontSize.sm, fontWeight: '700', color: Colors.text},
  cardCategory: {fontSize: FontSize.xs, color: Colors.textHint, marginTop: 2},
  cardFooter: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4},
  cardPrice: {fontSize: FontSize.md, fontWeight: '700', color: Colors.accent},
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 2},
  rating: {fontSize: FontSize.xs, color: Colors.textSecondary},
  loader: {marginVertical: Spacing.xl},
  empty: {alignItems: 'center', marginTop: Spacing.xxxl * 2},
  emptyText: {color: Colors.textHint, fontSize: FontSize.md, marginTop: Spacing.md},
  fab: {
    position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', elevation: 6,
  },
});

export default ProductSalesScreen;
