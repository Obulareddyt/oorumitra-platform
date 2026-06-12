import React, {useState} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ratingService} from '../../services/userService';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const RateReviewScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {listingType, listingId, title} = route.params;

  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (stars === 0) {Alert.alert('Error', 'Please select a star rating'); return;}
    setIsLoading(true);
    try {
      await ratingService.submit({listingType, listingId, stars, comment});
      Alert.alert('Thanks!', 'Your rating has been submitted.', [{text: 'OK', onPress: () => navigation.goBack()}]);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to submit rating');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Icon name="star" size={48} color={Colors.star} />
        <Text style={styles.title}>Rate & Review</Text>
        <Text style={styles.subtitle}>{title}</Text>
      </View>

      <Text style={styles.label}>Your Rating</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(s => (
          <TouchableOpacity key={s} onPress={() => setStars(s)}>
            <Icon
              name={s <= stars ? 'star' : 'star-outline'}
              size={48}
              color={s <= stars ? Colors.star : Colors.border}
            />
          </TouchableOpacity>
        ))}
      </View>

      {stars > 0 && (
        <Text style={styles.ratingLabel}>
          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][stars]}
        </Text>
      )}

      <Text style={styles.label}>Comment (optional)</Text>
      <TextInput
        style={styles.textarea}
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        placeholder="Share your experience..."
        placeholderTextColor={Colors.textHint}
      />

      <TouchableOpacity
        style={[styles.submitBtn, (isLoading || stars === 0) && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={isLoading || stars === 0}>
        {isLoading
          ? <ActivityIndicator color={Colors.textOnPrimary} />
          : <Text style={styles.submitText}>Submit Review</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {padding: Spacing.xl, alignItems: 'center'},
  header: {alignItems: 'center', marginBottom: Spacing.xxxl},
  title: {fontSize: FontSize.xxl, fontWeight: 'bold', color: Colors.text, marginTop: Spacing.md},
  subtitle: {fontSize: FontSize.base, color: Colors.textSecondary, marginTop: 4, textAlign: 'center'},
  label: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text, alignSelf: 'flex-start', marginBottom: Spacing.sm},
  starsRow: {flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md},
  ratingLabel: {fontSize: FontSize.lg, fontWeight: '700', color: Colors.star, marginBottom: Spacing.xl},
  textarea: {
    width: '100%', height: 120, backgroundColor: Colors.surface,
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.lg,
    padding: Spacing.md, fontSize: FontSize.base, color: Colors.text,
    marginBottom: Spacing.xl,
  },
  submitBtn: {width: '100%', backgroundColor: Colors.primary, padding: Spacing.md + 2, borderRadius: BorderRadius.xl, alignItems: 'center'},
  btnDisabled: {opacity: 0.5},
  submitText: {color: Colors.textOnPrimary, fontSize: FontSize.md, fontWeight: 'bold'},
});

export default RateReviewScreen;
