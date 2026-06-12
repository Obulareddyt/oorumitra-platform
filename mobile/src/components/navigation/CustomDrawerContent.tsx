import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Alert} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../store';
import {logout} from '../../store/slices/authSlice';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const MENU_ITEMS = [
  {icon: 'home', label: 'home', screen: 'HomeTab'},
  {icon: 'account-hard-hat', label: 'workerServices', screen: 'WorkerServices'},
  {icon: 'shopping', label: 'productSales', screen: 'ProductSales'},
  {icon: 'tractor', label: 'vehicleWork', screen: 'VehicleWork'},
  {icon: 'truck', label: 'transport', screen: 'Transport'},
  {icon: 'ticket', label: 'requests', screen: 'RequestTickets'},
  {icon: 'star', label: 'myBookings', screen: 'MyBookings'},
  {icon: 'bell', label: 'notifications', screen: 'Notifications'},
  {icon: 'ambulance', label: 'emergency', screen: 'EmergencyServices'},
  {icon: 'bank', label: 'government', screen: 'GovernmentServices'},
  {icon: 'translate', label: 'language', screen: 'LanguageVoice'},
];

const CustomDrawerContent: React.FC<any> = (props) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);

  const handleLogout = () => {
    Alert.alert(
      t('common.logout'),
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: t('common.logout'), style: 'destructive', onPress: () => dispatch(logout())},
      ],
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* Profile section */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Icon name="account" size={36} color={Colors.textOnPrimary} />
        </View>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.mobile}>+91 {user?.mobileNumber}</Text>
        <Text style={styles.village}>
          <Icon name="map-marker" size={12} color="rgba(255,255,255,0.8)" />
          {' '}{user?.village ?? 'Village'}
        </Text>
      </View>

      {/* Menu items */}
      <View style={styles.menu}>
        {MENU_ITEMS.map(item => (
          <TouchableOpacity
            key={item.screen}
            style={styles.menuItem}
            onPress={() => props.navigation.navigate(item.screen)}>
            <Icon name={item.icon} size={22} color={Colors.textSecondary} />
            <Text style={styles.menuLabel}>{t(`common.${item.label}`) ?? item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Icon name="logout" size={22} color={Colors.error} />
        <Text style={styles.logoutText}>{t('common.logout')}</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {paddingBottom: Spacing.xl},
  profile: {
    backgroundColor: Colors.primary, padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  name: {fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textOnPrimary},
  mobile: {fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)', marginTop: 2},
  village: {fontSize: FontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 4},
  menu: {paddingTop: Spacing.sm},
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl, gap: Spacing.base,
  },
  menuLabel: {fontSize: FontSize.base, color: Colors.text, fontWeight: '500'},
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.base,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  logoutText: {fontSize: FontSize.base, color: Colors.error, fontWeight: '600'},
});

export default CustomDrawerContent;
