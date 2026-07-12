import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import MapLibreGL, {MapView, Camera, PointAnnotation} from '@maplibre/maplibre-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {workerService, productService, vehicleWorkService, transportService} from '../../services/listingService';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

// Geoapify map tiles + style (migrated from Google Maps).
// Get a key at https://myprojects.geoapify.com
const GEOAPIFY_KEY = '5218746485524164aaec184315a66a43';
const GEOAPIFY_STYLE = `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${GEOAPIFY_KEY}`;

// MapLibre needs no access token when using a third-party style URL.
MapLibreGL.setAccessToken(null);

type ListingType = 'WORKER' | 'PRODUCT' | 'VEHICLE_WORK' | 'TRANSPORT';

const FILTER_TYPES: {label: string; type: ListingType; icon: string; color: string}[] = [
  {label: 'Workers', type: 'WORKER', icon: 'account-hard-hat', color: Colors.agriculture},
  {label: 'Products', type: 'PRODUCT', icon: 'shopping', color: Colors.hardware},
  {label: 'Vehicles', type: 'VEHICLE_WORK', icon: 'tractor', color: Colors.vehicles},
  {label: 'Transport', type: 'TRANSPORT', icon: 'truck', color: Colors.livestock},
];

// [longitude, latitude] — MapLibre uses lng,lat order.
const DEFAULT_CENTER: [number, number] = [78.4867, 17.3850];
const DEFAULT_ZOOM = 9;

const NearbyMapScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTypes, setActiveTypes] = useState<Set<ListingType>>(new Set(['WORKER', 'PRODUCT']));
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNearby();
  }, [activeTypes]);

  const loadNearby = async () => {
    setLoading(true);
    const lat = DEFAULT_CENTER[1];
    const lng = DEFAULT_CENTER[0];
    const all: any[] = [];
    try {
      const promises = [];
      if (activeTypes.has('WORKER')) promises.push(workerService.getNearby(lat, lng, 50, 20).then(r => r.map((i: any) => ({...i, _type: 'WORKER'}))));
      if (activeTypes.has('PRODUCT')) promises.push(productService.getNearby(lat, lng, 50, 20).then(r => r.map((i: any) => ({...i, _type: 'PRODUCT'}))));
      if (activeTypes.has('VEHICLE_WORK')) promises.push(vehicleWorkService.getNearby(lat, lng, 50, 20).then(r => r.map((i: any) => ({...i, _type: 'VEHICLE_WORK'}))));
      if (activeTypes.has('TRANSPORT')) promises.push(transportService.getNearby(lat, lng, 50, 20).then(r => r.map((i: any) => ({...i, _type: 'TRANSPORT'}))));
      const results = await Promise.allSettled(promises);
      results.forEach(r => {if (r.status === 'fulfilled') all.push(...r.value);});
    } catch (_) {}
    setMarkers(all.filter(m => m.latitude && m.longitude));
    setLoading(false);
  };

  const toggleType = (type: ListingType) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const DETAIL_SCREENS: Record<ListingType, string> = {
    WORKER: 'WorkerDetail', PRODUCT: 'ProductDetail',
    VEHICLE_WORK: 'VehicleWorkDetail', TRANSPORT: 'TransportDetail',
  };

  const getPinColor = (type: ListingType) => FILTER_TYPES.find(f => f.type === type)?.color ?? Colors.primary;

  return (
    <View style={styles.container}>
      {/* Filter bar */}
      <View style={styles.filterBar}>
        {FILTER_TYPES.map(f => (
          <TouchableOpacity
            key={f.type}
            style={[styles.filterChip, activeTypes.has(f.type) && {backgroundColor: f.color}]}
            onPress={() => toggleType(f.type)}>
            <Icon name={f.icon} size={14} color={activeTypes.has(f.type) ? Colors.textOnPrimary : f.color} />
            <Text style={[styles.filterText, activeTypes.has(f.type) && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <ActivityIndicator style={styles.loader} color={Colors.primary} />}

      <MapView style={styles.map} mapStyle={GEOAPIFY_STYLE}>
        <Camera
          defaultSettings={{centerCoordinate: DEFAULT_CENTER, zoomLevel: DEFAULT_ZOOM}}
        />
        {markers.map((item) => (
          <PointAnnotation
            key={`${item._type}-${item.id}`}
            id={`${item._type}-${item.id}`}
            coordinate={[item.longitude, item.latitude]}
            title={item.title ?? item.name}
            onSelected={() => navigation.navigate(DETAIL_SCREENS[item._type as ListingType], {id: item.id})}>
            <View style={[styles.pin, {backgroundColor: getPinColor(item._type)}]} />
          </PointAnnotation>
        ))}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>{markers.length} services nearby</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  filterBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', padding: Spacing.sm, gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterText: {fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600'},
  filterTextActive: {color: Colors.textOnPrimary},
  map: {flex: 1, marginTop: 50},
  loader: {position: 'absolute', top: '50%', left: '50%', zIndex: 20},
  pin: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: '#fff',
  },
  legend: {
    position: 'absolute', bottom: 24, left: Spacing.base, right: Spacing.base,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    padding: Spacing.md, elevation: 4, alignItems: 'center',
  },
  legendTitle: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text},
});

export default NearbyMapScreen;
