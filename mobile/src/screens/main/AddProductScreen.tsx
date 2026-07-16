import React, {useEffect, useState} from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image, Switch,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {productService} from '../../services/listingService';
import {ProductCategory} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRequireAuth} from '../../hooks/useRequireAuth';
import {useAppSelector} from '../../store';

// Must match backend ProductCategory enum exactly.
const CATEGORIES: ProductCategory[] = ['AGRICULTURE', 'HARDWARE', 'LIVESTOCK', 'VEHICLES', 'SEEDS', 'FRUITS', 'FLOWERS'];

const AddProductScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {isAuthenticated} = useRequireAuth();
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => {
    if (!isAuthenticated) navigation.replace('Auth');
  }, [isAuthenticated, navigation]);

  const [title, setTitle] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('AGRICULTURE');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [village, setVillage] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [availableStatus, setAvailableStatus] = useState(true);
  const [images, setImages] = useState<{uri: string; type: string; name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pickImages = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', selectionLimit: 5});
    if (result.assets) {
      setImages(result.assets.map(a => ({uri: a.uri!, type: a.type ?? 'image/jpeg', name: a.fileName ?? 'photo.jpg'})));
    }
  };

  if (!isAuthenticated) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !price || !village.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setIsLoading(true);
    try {
      await productService.create({
        productName: title,
        category,
        subCategory: subCategory.trim() || undefined,
        ownerName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        mobileNumber: user?.mobileNumber ?? '',
        amount: Number(price),
        negotiable,
        location: village,
        quantity: quantity ? Number(quantity) : undefined,
        description,
        availabilityStatus: availableStatus ? 'ACTIVE' : 'INACTIVE',
      }, images);
      Alert.alert('Success', 'Product listed!', [{text: 'OK', onPress: () => navigation.goBack()}]);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to list product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Fresh Tomatoes" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map(c => (
            <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c.replace(/_/g, ' ')}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Sub Category</Text>
        <TextInput style={styles.input} value={subCategory} onChangeText={setSubCategory} placeholder="optional" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Price (₹) *</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="e.g. 50" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Quantity</Text>
        <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="optional" placeholderTextColor={Colors.textHint} />

        <Text style={styles.label}>Village *</Text>
        <TextInput style={styles.input} value={village} onChangeText={setVillage} placeholder="Your village/town" placeholderTextColor={Colors.textHint} />

        <TouchableOpacity style={styles.switchRow} onPress={() => setNegotiable(v => !v)}>
          <Text style={styles.label}>Negotiable</Text>
          <Switch value={negotiable} onValueChange={setNegotiable} trackColor={{true: Colors.primary}} />
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.label}>{availableStatus ? 'Active' : 'Inactive'}</Text>
          <Switch value={availableStatus} onValueChange={setAvailableStatus} trackColor={{true: Colors.primary}} />
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription}
          multiline numberOfLines={4} textAlignVertical="top"
          placeholder="Describe your product..." placeholderTextColor={Colors.textHint}
        />

        <Text style={styles.label}>Images</Text>
        <TouchableOpacity style={styles.imgPicker} onPress={pickImages}>
          <Icon name="camera-plus" size={28} color={Colors.primary} />
          <Text style={styles.imgPickerText}>Add Photos (max 5)</Text>
        </TouchableOpacity>
        {images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewRow}>
            {images.map((img, i) => (
              <Image key={i} source={{uri: img.uri}} style={styles.preview} />
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={[styles.submitBtn, isLoading && styles.btnDisabled]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={Colors.textOnPrimary} /> : <Text style={styles.submitText}>List Product</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {padding: Spacing.base, paddingBottom: Spacing.xxxl},
  label: {fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.xs, marginTop: Spacing.md},
  input: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.base, color: Colors.text,
  },
  textarea: {height: 100, paddingTop: Spacing.md},
  switchRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md},
  catScroll: {marginBottom: Spacing.sm},
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface, marginRight: Spacing.sm,
  },
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipText: {fontSize: FontSize.sm, color: Colors.textSecondary},
  chipTextActive: {color: Colors.textOnPrimary, fontWeight: '600'},
  imgPicker: {
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm,
  },
  imgPickerText: {fontSize: FontSize.base, color: Colors.primary, fontWeight: '500'},
  previewRow: {marginTop: Spacing.sm},
  preview: {width: 80, height: 80, borderRadius: BorderRadius.md, marginRight: Spacing.sm},
  submitBtn: {
    backgroundColor: Colors.primary, padding: Spacing.md + 2,
    borderRadius: BorderRadius.xl, alignItems: 'center', marginTop: Spacing.xl,
  },
  btnDisabled: {opacity: 0.6},
  submitText: {color: Colors.textOnPrimary, fontSize: FontSize.md, fontWeight: 'bold'},
});

export default AddProductScreen;
