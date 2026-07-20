import React, {useState, useEffect} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Share,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {workerService} from '../../services/listingService';
import {chatService} from '../../services/chatService';
import {favouriteService, ratingService} from '../../services/userService';
import {useAppSelector} from '../../store';
import {useRequireAuth} from '../../hooks/useRequireAuth';
import BookServiceModal from '../../components/BookServiceModal';
import {WorkerListing} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const PRICE_TYPE_LABEL: Record<string, string> = {
  PERSON: 'Per Person', ACRE: 'Per Acre', HOUR: 'Per Hour',
};

const WorkerDetailScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const {requireAuth} = useRequireAuth();
  const route = useRoute<any>();
  const {id} = route.params;
  const currentUser = useAppSelector(s => s.auth.user);

  const [worker, setWorker] = useState<WorkerListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const w = await workerService.getById(id);
        setWorker(w);
      } catch (_) {Alert.alert('Error', 'Failed to load')}
      setLoading(false);
    })();
  }, [id]);

  const handleChat = async () => {
    if (!worker) return;
    try {
      const convo = await chatService.startConversation({
        sellerId: worker.userId,
        listingType: 'WORKER',
        listingId: worker.id,
      });
      navigation.navigate('Chat', {conversationId: convo.id, otherUserName: `${worker.groupName}`});
    } catch (_) {Alert.alert('Error', 'Failed to start chat');}
  };

  const handleFavourite = async () => {
    if (!worker) return;
    try {
      if (isFav) {
        await favouriteService.remove('WORKER', worker.id);
      } else {
        await favouriteService.add({listingType: 'WORKER', listingId: worker.id});
      }
      setIsFav(!isFav);
    } catch (_) {}
  };

  const handleRate = () => {
    navigation.navigate('RateReview', {listingType: 'WORKER', listingId: id, title: worker?.groupName});
  };

  if (loading) return <ActivityIndicator style={styles.center} color={Colors.primary} size="large" />;
  if (!worker) return <View style={styles.center}><Text>Not found</Text></View>;

  const isOwner = currentUser?.id === worker.userId;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Icon name="account-hard-hat" size={64} color={Colors.primary} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{worker.groupName}</Text>
          <TouchableOpacity onPress={handleFavourite}>
            <Icon name={isFav ? 'heart' : 'heart-outline'} size={26} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <Text style={styles.workType}>{worker.workType?.replace(/_/g, ' ')}</Text>

        <View style={styles.infoRow}>
          <Icon name="map-marker" size={16} color={Colors.textHint} />
          <Text style={styles.infoText}>{worker.village}</Text>
        </View>

        {worker.averageRating != null && (
          <View style={styles.infoRow}>
            <Icon name="star" size={16} color={Colors.star} />
            <Text style={styles.infoText}>{Number(worker.averageRating).toFixed(1)} ({worker.ratingCount ?? 0} reviews)</Text>
          </View>
        )}

        <View style={styles.availRow}>
          <View style={[styles.availDot, {backgroundColor: worker.availableStatus ? Colors.success : Colors.error}]} />
          <Text style={styles.availText}>{worker.availableStatus ? 'Available' : 'Not Available'}</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Price{PRICE_TYPE_LABEL[worker.priceType] ? ` (${PRICE_TYPE_LABEL[worker.priceType]})` : ''}</Text>
          <Text style={styles.price}>₹{worker.amount}</Text>
        </View>

        {worker.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{worker.description}</Text>
          </View>
        ) : null}

        {/* Actions */}
        {!isOwner && (
          <>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.chatBtn} onPress={() => requireAuth(handleChat)}>
                <Icon name="chat" size={20} color={Colors.textOnPrimary} />
                <Text style={styles.btnText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rateBtn} onPress={handleRate}>
                <Icon name="star-outline" size={20} color={Colors.primary} />
                <Text style={[styles.btnText, {color: Colors.primary}]}>Rate</Text>
              </TouchableOpacity>
            </View>
            {worker.availableStatus && (
              <TouchableOpacity style={styles.bookBtn} onPress={() => requireAuth(() => setShowBooking(true))}>
                <Icon name="calendar-check" size={20} color={Colors.textOnPrimary} />
                <Text style={styles.btnText}>Book Service</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <BookServiceModal
        visible={showBooking}
        listingId={worker.id}
        listingType="WORKER"
        listingName={worker.groupName}
        onClose={() => setShowBooking(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  hero: {
    height: 200, backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center', alignItems: 'center',
  },
  body: {padding: Spacing.base},
  titleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm},
  title: {fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.text, flex: 1},
  workType: {fontSize: FontSize.base, color: Colors.primary, fontWeight: '600', marginBottom: Spacing.md},
  infoRow: {flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm},
  infoText: {fontSize: FontSize.base, color: Colors.textSecondary},
  availRow: {flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.base},
  availDot: {width: 10, height: 10, borderRadius: 5},
  availText: {fontSize: FontSize.base, color: Colors.textSecondary},
  priceCard: {
    backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.lg,
    padding: Spacing.base, marginBottom: Spacing.base, alignItems: 'center',
  },
  priceLabel: {fontSize: FontSize.sm, color: Colors.textSecondary},
  price: {fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.accent},
  section: {marginBottom: Spacing.base},
  sectionTitle: {fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm},
  description: {fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 22},
  actions: {flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md},
  chatBtn: {
    flex: 1, flexDirection: 'row', backgroundColor: Colors.primary,
    padding: Spacing.md, borderRadius: BorderRadius.xl,
    justifyContent: 'center', alignItems: 'center', gap: Spacing.sm,
  },
  rateBtn: {
    flex: 1, flexDirection: 'row', borderWidth: 2, borderColor: Colors.primary,
    padding: Spacing.md, borderRadius: BorderRadius.xl,
    justifyContent: 'center', alignItems: 'center', gap: Spacing.sm,
  },
  btnText: {fontSize: FontSize.base, fontWeight: '700', color: Colors.textOnPrimary},
  bookBtn: {
    flexDirection: 'row', backgroundColor: Colors.accent, marginTop: Spacing.md,
    padding: Spacing.md, borderRadius: BorderRadius.xl,
    justifyContent: 'center', alignItems: 'center', gap: Spacing.sm,
  },
});

export default WorkerDetailScreen;
