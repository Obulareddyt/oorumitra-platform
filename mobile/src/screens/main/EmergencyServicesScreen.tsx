import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {emergencyService} from '../../services/userService';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

interface EmergencyService {
  name: string;
  number: string;
  icon: string;
  color: string;
}

const FALLBACK_SERVICES: EmergencyService[] = [
  {name: 'Police', number: '100', icon: 'shield-account', color: '#1565C0'},
  {name: 'Ambulance', number: '108', icon: 'ambulance', color: Colors.error},
  {name: 'Fire Department', number: '101', icon: 'fire-truck', color: '#E65100'},
  {name: 'NDRF Disaster', number: '1078', icon: 'weather-lightning', color: '#7B1FA2'},
  {name: 'Women Helpline', number: '1091', icon: 'human-female', color: '#AD1457'},
];

const EmergencyServicesScreen: React.FC = () => {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await emergencyService.getAll();
        setServices(data.length ? data : FALLBACK_SERVICES);
      } catch (_) {
        setServices(FALLBACK_SERVICES);
      }
      setLoading(false);
    })();
  }, []);

  const call = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  if (loading) return <ActivityIndicator style={styles.center} color={Colors.primary} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Icon name="alert-circle" size={36} color={Colors.textOnPrimary} />
        <Text style={styles.bannerText}>Emergency Contacts</Text>
        <Text style={styles.bannerSub}>Tap to call immediately</Text>
      </View>
      <FlatList
        data={services}
        keyExtractor={i => i.number}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.card} onPress={() => call(item.number)} activeOpacity={0.8}>
            <View style={[styles.iconBox, {backgroundColor: item.color + '20'}]}>
              <Icon name={item.icon} size={28} color={item.color} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.number}>{item.number}</Text>
            </View>
            <View style={[styles.callBtn, {backgroundColor: item.color}]}>
              <Icon name="phone" size={20} color={Colors.textOnPrimary} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  banner: {backgroundColor: Colors.error, padding: Spacing.xl, alignItems: 'center', gap: 4},
  bannerText: {fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textOnPrimary},
  bannerSub: {fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)'},
  list: {padding: Spacing.base, gap: Spacing.sm},
  card: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, elevation: 2},
  iconBox: {width: 54, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md},
  info: {flex: 1},
  name: {fontSize: FontSize.md, fontWeight: '700', color: Colors.text},
  number: {fontSize: FontSize.base, color: Colors.textSecondary, marginTop: 2},
  callBtn: {width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center'},
});

export default EmergencyServicesScreen;
