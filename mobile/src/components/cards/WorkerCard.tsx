import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import {WorkerListing} from '../../types';

interface Props {
  item: WorkerListing;
  onPress: () => void;
}

const PRICE_TYPE_UNIT: Record<string, string> = {
  PERSON: '/person',
  ACRE: '/acre',
  HOUR: '/hour',
};

const WorkerCard: React.FC<Props> = ({item, onPress}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.avatar}>
      <Icon name="account-hard-hat" size={30} color={Colors.primary} />
    </View>
    <View style={styles.content}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>{item.groupName}</Text>
        {item.availableStatus && (
          <View style={styles.availBadge}>
            <Text style={styles.availText}>Available</Text>
          </View>
        )}
      </View>
      <Text style={styles.workType}>{item.workType?.replace(/_/g, ' ')}</Text>
      <View style={styles.row}>
        <Icon name="map-marker" size={13} color={Colors.textHint} />
        <Text style={styles.village}>{item.village}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.price}>₹{item.amount}<Text style={styles.unit}>{PRICE_TYPE_UNIT[item.priceType] ?? ''}</Text></Text>
        {item.averageRating != null && (
          <View style={styles.ratingRow}>
            <Icon name="star" size={13} color={Colors.star} />
            <Text style={styles.rating}>{Number(item.averageRating).toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({item.ratingCount ?? 0})</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, marginBottom: Spacing.sm,
    elevation: 2, shadowOpacity: 0.08, shadowRadius: 4, padding: Spacing.md,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.surfaceVariant, justifyContent: 'center',
    alignItems: 'center', marginRight: Spacing.md,
  },
  content: {flex: 1},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  title: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text, flex: 1},
  availBadge: {
    backgroundColor: Colors.success + '20', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  availText: {fontSize: FontSize.xs, color: Colors.success, fontWeight: '600'},
  workType: {fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2},
  row: {flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2},
  village: {fontSize: FontSize.xs, color: Colors.textHint},
  footer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6},
  price: {fontSize: FontSize.md, fontWeight: '700', color: Colors.accent},
  unit: {fontSize: FontSize.xs, fontWeight: '400', color: Colors.textSecondary},
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 3},
  rating: {fontSize: FontSize.sm, color: Colors.text, fontWeight: '600'},
  ratingCount: {fontSize: FontSize.xs, color: Colors.textHint},
});

export default WorkerCard;
