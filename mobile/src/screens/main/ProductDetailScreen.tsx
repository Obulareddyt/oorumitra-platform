import React, {useState, useEffect} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Image, Dimensions,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {productService} from '../../services/listingService';
import {chatService} from '../../services/chatService';
import {bookingService} from '../../services/bookingService';
import {favouriteService} from '../../services/userService';
import {useAppSelector} from '../../store';
import {useRequireAuth} from '../../hooks/useRequireAuth';
import {Product} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const {width} = Dimensions.get('window');

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {requireAuth} = useRequireAuth();
  const route = useRoute<any>();
  const {id} = route.params;
  const currentUser = useAppSelector(s => s.auth.user);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [interestState, setInterestState] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    (async () => {
      try {
        const p = await productService.getById(id);
        setProduct(p);
      } catch (_) {}
      setLoading(false);
    })();
  }, [id]);

  const handleChat = async () => {
    if (!product) return;
    try {
      const convo = await chatService.startConversation({
        sellerId: product.userId, listingType: 'PRODUCT', listingId: product.id,
      });
      navigation.navigate('Chat', {conversationId: convo.id, otherUserName: product.productName});
    } catch (_) {Alert.alert('Error', 'Failed to start chat');}
  };

  const handleInterested = async () => {
    if (!product) return;
    setInterestState('sending');
    try {
      await bookingService.create({listingId: product.id, listingType: 'PRODUCT'});
      setInterestState('sent');
    } catch (err: any) {
      setInterestState('idle');
      Alert.alert('Error', err?.message ?? 'Failed to send interest');
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} color={Colors.primary} size="large" />;
  if (!product) return <View style={styles.center}><Text>Not found</Text></View>;

  const isOwner = currentUser?.id === product.userId;

  return (
    <ScrollView style={styles.container}>
      {/* Images */}
      {product.imageUrls?.length > 0 ? (
        <View>
          <Image source={{uri: product.imageUrls[activeImg]}} style={styles.mainImage} />
          {product.imageUrls.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow}>
              {product.imageUrls.map((url, i) => (
                <TouchableOpacity key={i} onPress={() => setActiveImg(i)}>
                  <Image source={{uri: url}} style={[styles.thumb, activeImg === i && styles.thumbActive]} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Icon name="shopping" size={72} color={Colors.textHint} />
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.productName}</Text>
          <TouchableOpacity onPress={() => setIsFav(!isFav)}>
            <Icon name={isFav ? 'heart' : 'heart-outline'} size={26} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <Text style={styles.category}>{product.category?.replace(/_/g, ' ')}</Text>

        <View style={styles.metaRow}>
          <Icon name="map-marker" size={15} color={Colors.textHint} />
          <Text style={styles.metaText}>{product.location}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.availDot, {backgroundColor: product.availabilityStatus === 'ACTIVE' ? Colors.success : Colors.error}]} />
          <Text style={styles.metaText}>{product.availabilityStatus === 'ACTIVE' ? 'Active' : 'Inactive'}</Text>
        </View>

        {product.averageRating != null && (
          <View style={styles.metaRow}>
            <Icon name="star" size={15} color={Colors.star} />
            <Text style={styles.metaText}>{Number(product.averageRating).toFixed(1)} ({product.ratingCount ?? 0})</Text>
          </View>
        )}

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>₹{product.amount}</Text>
          <Text style={styles.priceType}>{product.negotiable ? 'Negotiable' : 'Fixed Price'}</Text>
        </View>

        {product.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.desc}>{product.description}</Text>
          </View>
        ) : null}

        {!isOwner && (
          <>
            <TouchableOpacity style={styles.chatBtn} onPress={() => requireAuth(handleChat)}>
              <Icon name="chat" size={20} color={Colors.textOnPrimary} />
              <Text style={styles.chatBtnText}>Chat with Seller</Text>
            </TouchableOpacity>

            {product.availabilityStatus === 'ACTIVE' && (
              <TouchableOpacity
                style={[styles.interestBtn, interestState === 'sent' && styles.interestBtnSent]}
                disabled={interestState !== 'idle'}
                onPress={() => requireAuth(handleInterested)}>
                <Icon name={interestState === 'sent' ? 'check' : 'heart-outline'} size={20} color={Colors.primary} />
                <Text style={styles.interestBtnText}>
                  {interestState === 'sent' ? 'Interest Sent' : interestState === 'sending' ? 'Sending…' : 'Interested'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  mainImage: {width, height: 280},
  imagePlaceholder: {width, height: 280, backgroundColor: Colors.surfaceVariant, justifyContent: 'center', alignItems: 'center'},
  thumbRow: {padding: Spacing.sm, backgroundColor: Colors.surface},
  thumb: {width: 64, height: 64, borderRadius: BorderRadius.sm, marginRight: Spacing.sm, borderWidth: 2, borderColor: 'transparent'},
  thumbActive: {borderColor: Colors.primary},
  body: {padding: Spacing.base},
  titleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm},
  title: {fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.text, flex: 1},
  category: {fontSize: FontSize.base, color: Colors.primary, fontWeight: '600', marginBottom: Spacing.md},
  metaRow: {flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm},
  metaText: {fontSize: FontSize.base, color: Colors.textSecondary},
  availDot: {width: 10, height: 10, borderRadius: 5},
  priceCard: {
    backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.lg,
    padding: Spacing.base, marginVertical: Spacing.base, alignItems: 'center',
  },
  priceLabel: {fontSize: FontSize.sm, color: Colors.textSecondary},
  price: {fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.accent},
  priceType: {fontSize: FontSize.xs, color: Colors.textHint},
  section: {marginBottom: Spacing.base},
  sectionTitle: {fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm},
  desc: {fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 22},
  chatBtn: {
    backgroundColor: Colors.primary, flexDirection: 'row', padding: Spacing.md + 2,
    borderRadius: BorderRadius.xl, justifyContent: 'center', alignItems: 'center',
    gap: Spacing.sm, marginTop: Spacing.md,
  },
  chatBtnText: {fontSize: FontSize.md, fontWeight: '700', color: Colors.textOnPrimary},
  interestBtn: {
    backgroundColor: Colors.surface, flexDirection: 'row', padding: Spacing.md + 2,
    borderRadius: BorderRadius.xl, justifyContent: 'center', alignItems: 'center',
    gap: Spacing.sm, marginTop: Spacing.sm, borderWidth: 1.5, borderColor: Colors.primary,
  },
  interestBtnSent: {borderColor: Colors.border, backgroundColor: Colors.surfaceVariant},
  interestBtnText: {fontSize: FontSize.md, fontWeight: '700', color: Colors.primary},
});

export default ProductDetailScreen;
