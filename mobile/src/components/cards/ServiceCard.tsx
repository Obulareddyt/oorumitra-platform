import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

interface Props {
  item: any;
  type: 'WORKER' | 'PRODUCT' | 'VEHICLE_WORK' | 'TRANSPORT';
  onPress: () => void;
}

const TYPE_ICONS: Record<string, string> = {
  WORKER: 'account-hard-hat',
  PRODUCT: 'shopping',
  VEHICLE_WORK: 'tractor',
  TRANSPORT: 'truck',
};

const ServiceCard: React.FC<Props> = ({item, type, onPress}) => {
  const icon = TYPE_ICONS[type] ?? 'storefront';
  const title = item.productName ?? item.groupName ?? item.vehicleType ?? 'Service';
  const subtitle = item.village ?? item.location ?? '';
  const price = item.amount ?? item.pricePerAcre ?? item.pricePerHour ?? item.ratePerKm ?? item.ratePerHour ?? null;
  const rating = item.averageRating;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {item.imageUrls?.[0] ? (
        <Image source={{uri: item.imageUrls[0]}} style={styles.image} />
      ) : (
        <View style={styles.iconBox}>
          <Icon name={icon} size={28} color={Colors.primary} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <View style={styles.row}>
            <Icon name="map-marker" size={12} color={Colors.textHint} />
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          </View>
        ) : null}
        <View style={styles.footer}>
          {rating != null && (
            <View style={styles.ratingRow}>
              <Icon name="star" size={13} color={Colors.star} />
              <Text style={styles.rating}>{Number(rating).toFixed(1)}</Text>
            </View>
          )}
          {price != null && (
            <Text style={styles.price}>₹{price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, marginBottom: Spacing.sm,
    elevation: 2, shadowOpacity: 0.08, shadowRadius: 4, overflow: 'hidden',
  },
  image: {width: 84, height: 84},
  iconBox: {
    width: 84, height: 84, backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center', alignItems: 'center',
  },
  info: {flex: 1, padding: Spacing.md, justifyContent: 'space-between'},
  title: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text},
  row: {flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2},
  subtitle: {fontSize: FontSize.xs, color: Colors.textHint, flex: 1},
  footer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4},
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 2},
  rating: {fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600'},
  price: {fontSize: FontSize.sm, fontWeight: '700', color: Colors.accent},
});

export default ServiceCard;
