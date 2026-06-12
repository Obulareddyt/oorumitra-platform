import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../theme';

import HomeDashboardScreen from '../screens/main/HomeDashboardScreen';
import WorkerServicesScreen from '../screens/main/WorkerServicesScreen';
import ProductSalesScreen from '../screens/main/ProductSalesScreen';
import VehicleWorkServiceScreen from '../screens/main/VehicleWorkScreen';
import TransportVehiclesScreen from '../screens/main/TransportScreen';
import RequestTicketsScreen from '../screens/main/RequestTicketsScreen';
import MyBookingsScreen from '../screens/main/MyBookingsScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import EmergencyServicesScreen from '../screens/main/EmergencyServicesScreen';
import GovernmentServicesScreen from '../screens/main/GovernmentServicesScreen';
import LanguageVoiceScreen from '../screens/main/LanguageVoiceScreen';
import ConversationsListScreen from '../screens/main/ConversationsScreen';
import SearchScreen from '../screens/main/SearchScreen';
import CustomDrawerContent from '../components/navigation/CustomDrawerContent';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
      tabBarStyle: {elevation: 8, shadowOpacity: 0.1},
      headerShown: false,
      tabBarIcon: ({color, size}) => {
        const icons: Record<string, string> = {
          Home: 'home', Search: 'magnify', Requests: 'ticket-outline',
          Chats: 'chat-outline', Profile: 'account-outline',
        };
        return <Icon name={icons[route.name] ?? 'circle'} size={size} color={color} />;
      },
    })}>
    <Tab.Screen name="Home" component={HomeDashboardScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Requests" component={RequestTicketsScreen} />
    <Tab.Screen name="Chats" component={ConversationsListScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const MainNavigator: React.FC = () => (
  <Drawer.Navigator
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerStyle: {backgroundColor: Colors.primary},
      headerTintColor: Colors.textOnPrimary,
      drawerActiveTintColor: Colors.primary,
      drawerInactiveTintColor: Colors.textSecondary,
    }}>
    <Drawer.Screen name="HomeTab" component={BottomTabNavigator} options={{title: 'Home', drawerIcon: ({color}) => <Icon name="home" size={22} color={color} />}} />
    <Drawer.Screen name="WorkerServices" component={WorkerServicesScreen} options={{drawerIcon: ({color}) => <Icon name="account-hard-hat" size={22} color={color} />}} />
    <Drawer.Screen name="ProductSales" component={ProductSalesScreen} options={{title: 'Product Sales', drawerIcon: ({color}) => <Icon name="shopping" size={22} color={color} />}} />
    <Drawer.Screen name="VehicleWork" component={VehicleWorkServiceScreen} options={{title: 'Vehicle Work', drawerIcon: ({color}) => <Icon name="tractor" size={22} color={color} />}} />
    <Drawer.Screen name="Transport" component={TransportVehiclesScreen} options={{title: 'Transport', drawerIcon: ({color}) => <Icon name="truck" size={22} color={color} />}} />
    <Drawer.Screen name="RequestTickets" component={RequestTicketsScreen} options={{title: 'Requests', drawerIcon: ({color}) => <Icon name="ticket" size={22} color={color} />}} />
    <Drawer.Screen name="MyBookings" component={MyBookingsScreen} options={{title: 'My Bookings', drawerIcon: ({color}) => <Icon name="calendar-check" size={22} color={color} />}} />
    <Drawer.Screen name="Notifications" component={NotificationsScreen} options={{drawerIcon: ({color}) => <Icon name="bell-outline" size={22} color={color} />}} />
    <Drawer.Screen name="EmergencyServices" component={EmergencyServicesScreen} options={{title: 'Emergency', drawerIcon: ({color}) => <Icon name="ambulance" size={22} color={color} />}} />
    <Drawer.Screen name="GovernmentServices" component={GovernmentServicesScreen} options={{title: 'Govt Services', drawerIcon: ({color}) => <Icon name="bank" size={22} color={color} />}} />
    <Drawer.Screen name="LanguageVoice" component={LanguageVoiceScreen} options={{title: 'Language', drawerIcon: ({color}) => <Icon name="translate" size={22} color={color} />}} />
  </Drawer.Navigator>
);

export default MainNavigator;
