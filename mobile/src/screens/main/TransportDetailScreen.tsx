import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {transportService} from '../../services/listingService';
import {chatService} from '../../services/chatService';
import {useRequireAuth} from '../../hooks/useRequireAuth';
import BookServiceModal from '../../components/BookServiceModal';
import {useAppSelector} from '../../store';
import {TransportListing} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const TransportDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {requireAuth} = useRequireAuth();
  const {id} = useRoute<any>().params;
  const currentUser = useAppSelector(s => s.auth.user);
  const [item, setItem] = useState<TransportListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    (async () => {
      try {setItem(await transportService.getById(id));} catch (_) {}
      setLoading(false);
    })();
  }, [id]);

  const handleChat = async () => {
    if (!item) return;
    try {
      const c = await chatService.startConversation({sellerId: item.userId, listingType: 'TRANSPORT', listingId: item.id});
      navigation.navigate('Chat', {conversationId: c.id, otherUserName: item.ownerName ?? item.vehicleType});
    } catch (_) {Alert.alert('Error', 'Failed to start chat');}
  };

  if (loading) return <ActivityIndicator style={styles.center} color={Colors.primary} size="large" />;
  if (!item) return <View style={styles.center}><Text>Not found</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Icon name="truck" size={64} color={Colors.livestock} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{item.ownerName ?? item.vehicleType?.replace(/_/g, ' ')}</Text>
        <Text style={styles.type}>{item.vehicleType?.replace(/_/g, ' ')}</Text>

        <View style={styles.row}><Icon name="map-marker" size={16} color={Colors.textHint} /><Text style={styles.info}>{item.village}</Text></View>
        {item.weightCapacity && <View style={styles.row}><Icon name="weight" size={16} color={Colors.textHint} /><Text style={styles.info}>Capacity: {item.weightCapacity}</Text></View>}

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Price{item.priceType ? ` (Per ${item.priceType})` : ''}</Text>
          <Text style={styles.price}>₹{item.amount}</Text>
        </View>

        {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}

        {currentUser?.id !== item.userId && (
          <>
            <TouchableOpacity style={styles.chatBtn} onPress={() => requireAuth(handleChat)}>
              <Icon name="chat" size={20} color={Colors.textOnPrimary} />
              <Text style={styles.chatText}>Contact Driver</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookBtn} onPress={() => requireAuth(() => setShowBooking(true))}>
              <Icon name="calendar-check" size={20} color={Colors.textOnPrimary} />
              <Text style={styles.chatText}>Book Service</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <BookServiceModal
        visible={showBooking}
        listingId={item.id}
        listingType="TRANSPORT"
        listingName={item.ownerName ?? item.vehicleType}
        onClose={() => setShowBooking(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  hero: {height: 200, backgroundColor: Colors.livestock + '15', justifyContent: 'center', alignItems: 'center'},
  body: {padding: Spacing.base},
  title: {fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.text, marginBottom: 4},
  type: {fontSize: FontSize.base, color: Colors.livestock, fontWeight: '600', marginBottom: Spacing.md},
  row: {flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm},
  info: {fontSize: FontSize.base, color: Colors.textSecondary},
  priceCard: {backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.lg, padding: Spacing.base, marginVertical: Spacing.base, alignItems: 'center'},
  priceLabel: {fontSize: FontSize.sm, color: Colors.textSecondary},
  price: {fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.accent},
  desc: {fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.base},
  chatBtn: {backgroundColor: Colors.primary, flexDirection: 'row', padding: Spacing.md + 2, borderRadius: BorderRadius.xl, justifyContent: 'center', alignItems: 'center', gap: Spacing.sm},
  bookBtn: {backgroundColor: Colors.accent, flexDirection: 'row', padding: Spacing.md + 2, borderRadius: BorderRadius.xl, justifyContent: 'center', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm},
  chatText: {color: Colors.textOnPrimary, fontWeight: '700', fontSize: FontSize.base},
});

export default TransportDetailScreen;
