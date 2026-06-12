import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

interface GovtService {
  name: string;
  desc: string;
  icon: string;
  color: string;
  url?: string;
}

const GOVT_SERVICES: GovtService[] = [
  {name: 'PM-KISAN', desc: 'Income support for farmers', icon: 'sprout', color: '#2E7D32', url: 'https://pmkisan.gov.in'},
  {name: 'e-NAM', desc: 'National agriculture market', icon: 'store', color: '#1565C0', url: 'https://enam.gov.in'},
  {name: 'Fasal Bima', desc: 'Pradhan Mantri Fasal Bima Yojana', icon: 'shield-check', color: '#E65100', url: 'https://pmfby.gov.in'},
  {name: 'Soil Health Card', desc: 'Soil testing and advisory', icon: 'flower', color: '#6D4C41', url: 'https://soilhealth.dac.gov.in'},
  {name: 'Kisan Call Center', desc: 'Farmer helpline 1800-180-1551', icon: 'phone', color: '#7B1FA2'},
  {name: 'MNREGA', desc: 'Rural employment guarantee', icon: 'account-group', color: '#AD1457'},
  {name: 'Agri Clinics', desc: 'Agricultural extension services', icon: 'hospital', color: '#00695C'},
  {name: 'Aadhaar Seeding', desc: 'Link Aadhaar with bank account', icon: 'card-account-details', color: '#546E7A'},
];

const GovernmentServicesScreen: React.FC = () => {
  const open = (url?: string) => {
    if (url) Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="bank" size={32} color={Colors.info} />
        <View>
          <Text style={styles.headerTitle}>Government Services</Text>
          <Text style={styles.headerSub}>Schemes & portals for farmers</Text>
        </View>
      </View>
      <FlatList
        data={GOVT_SERVICES}
        keyExtractor={i => i.name}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.card} onPress={() => open(item.url)} activeOpacity={0.85}>
            <View style={[styles.iconBox, {backgroundColor: item.color + '20'}]}>
              <Icon name={item.icon} size={28} color={item.color} />
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.desc} numberOfLines={2}>{item.desc}</Text>
            {item.url && <Text style={styles.link}>Open Portal →</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.divider},
  headerTitle: {fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.text},
  headerSub: {fontSize: FontSize.sm, color: Colors.textSecondary},
  list: {padding: Spacing.sm, paddingBottom: Spacing.xl},
  row: {gap: Spacing.sm, marginBottom: Spacing.sm},
  card: {flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, elevation: 2, alignItems: 'center'},
  iconBox: {width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm},
  name: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text, textAlign: 'center'},
  desc: {fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', marginTop: 4},
  link: {fontSize: FontSize.xs, color: Colors.info, marginTop: Spacing.sm, fontWeight: '600'},
});

export default GovernmentServicesScreen;
