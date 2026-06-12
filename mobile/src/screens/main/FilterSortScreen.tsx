import React, {useState} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const SORT_OPTIONS = [
  {label: 'Price: Low to High', value: 'price_asc'},
  {label: 'Price: High to Low', value: 'price_desc'},
  {label: 'Highest Rated', value: 'rating'},
  {label: 'Newest First', value: 'latest'},
];

const FilterSortScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {onApply, initialFilters = {}} = route.params ?? {};

  const [sortBy, setSortBy] = useState(initialFilters.sortBy ?? '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice ?? '');
  const [availableOnly, setAvailableOnly] = useState(initialFilters.availableOnly ?? false);

  const handleApply = () => {
    onApply?.({sortBy, minPrice: minPrice ? Number(minPrice) : undefined, maxPrice: maxPrice ? Number(maxPrice) : undefined, availableOnly});
    navigation.goBack();
  };

  const handleReset = () => {
    setSortBy('');
    setMinPrice('');
    setMaxPrice('');
    setAvailableOnly(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Sort By</Text>
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity key={opt.value} style={styles.radioRow} onPress={() => setSortBy(sortBy === opt.value ? '' : opt.value)}>
            <Icon name={sortBy === opt.value ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={sortBy === opt.value ? Colors.primary : Colors.textHint} />
            <Text style={[styles.radioLabel, sortBy === opt.value && styles.radioLabelActive]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Availability</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Available Now Only</Text>
          <Switch value={availableOnly} onValueChange={setAvailableOnly} trackColor={{true: Colors.primary}} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  scroll: {flex: 1},
  content: {padding: Spacing.base},
  sectionTitle: {fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.md},
  radioRow: {flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider},
  radioLabel: {fontSize: FontSize.base, color: Colors.textSecondary},
  radioLabelActive: {color: Colors.primary, fontWeight: '600'},
  divider: {height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.md},
  switchRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md},
  switchLabel: {fontSize: FontSize.base, color: Colors.text},
  footer: {flexDirection: 'row', padding: Spacing.base, gap: Spacing.md, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.divider},
  resetBtn: {flex: 1, padding: Spacing.md, borderRadius: BorderRadius.xl, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center'},
  resetText: {fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: '600'},
  applyBtn: {flex: 2, padding: Spacing.md, borderRadius: BorderRadius.xl, backgroundColor: Colors.primary, alignItems: 'center'},
  applyText: {fontSize: FontSize.base, color: Colors.textOnPrimary, fontWeight: '700'},
});

export default FilterSortScreen;
