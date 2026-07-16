import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppSelector, useAppDispatch} from '../store';
import {loadAuthState} from '../store/slices/authSlice';
import {Colors} from '../theme';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/auth/SplashScreen';

// Detail screens
import WorkerDetailScreen from '../screens/main/WorkerDetailScreen';
import ProductDetailScreen from '../screens/main/ProductDetailScreen';
import VehicleWorkDetailScreen from '../screens/main/VehicleWorkDetailScreen';
import TransportDetailScreen from '../screens/main/TransportDetailScreen';
import TicketDetailScreen from '../screens/main/TicketDetailScreen';
import ChatScreen from '../screens/main/ChatScreen';
import NearbyMapScreen from '../screens/main/NearbyMapScreen';
import RateReviewScreen from '../screens/main/RateReviewScreen';
import AddWorkerServiceScreen from '../screens/main/AddWorkerServiceScreen';
import AddProductScreen from '../screens/main/AddProductScreen';
import AddVehicleWorkScreen from '../screens/main/AddVehicleWorkScreen';
import AddTransportScreen from '../screens/main/AddTransportScreen';
import MyProductsScreen from '../screens/main/MyProductsScreen';
import PostRequestScreen from '../screens/main/PostRequestScreen';
import FilterSortScreen from '../screens/main/FilterSortScreen';
import SearchScreen from '../screens/main/SearchScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';

const Root = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const {isLoading} = useAppSelector(s => s.auth);

  useEffect(() => {
    dispatch(loadAuthState());
  }, [dispatch]);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Root.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: Colors.primary},
          headerTintColor: Colors.textOnPrimary,
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        {/* Home/browsing is public. Only Auth is gated behind restricted actions
            (posting, messaging, contacting sellers) — see useRequireAuth. */}
        <Root.Screen name="Main" component={MainNavigator} options={{headerShown: false}} />
        <Root.Screen name="WorkerDetail" component={WorkerDetailScreen} options={{title: 'Worker Service'}} />
        <Root.Screen name="ProductDetail" component={ProductDetailScreen} options={{title: 'Product Details'}} />
        <Root.Screen name="VehicleWorkDetail" component={VehicleWorkDetailScreen} options={{title: 'Vehicle Work'}} />
        <Root.Screen name="TransportDetail" component={TransportDetailScreen} options={{title: 'Transport'}} />
        <Root.Screen name="TicketDetail" component={TicketDetailScreen} options={{title: 'Request Ticket'}} />
        <Root.Screen name="Chat" component={ChatScreen} options={({route}: any) => ({title: route.params.otherUserName})} />
        <Root.Screen name="NearbyMap" component={NearbyMapScreen} options={{title: 'Nearby Services'}} />
        <Root.Screen name="RateReview" component={RateReviewScreen} options={{title: 'Rate & Review'}} />
        <Root.Screen name="AddWorkerService" component={AddWorkerServiceScreen} options={{title: 'Add Worker Service'}} />
        <Root.Screen name="AddProduct" component={AddProductScreen} options={{title: 'Add Product'}} />
        <Root.Screen name="AddVehicleWork" component={AddVehicleWorkScreen} options={{title: 'Add Vehicle Work'}} />
        <Root.Screen name="AddTransport" component={AddTransportScreen} options={{title: 'Add Transport'}} />
        <Root.Screen name="MyProducts" component={MyProductsScreen} options={{title: 'My Products'}} />
        <Root.Screen name="PostRequest" component={PostRequestScreen} options={{title: 'Post Request'}} />
        <Root.Screen name="FilterSort" component={FilterSortScreen} options={{title: 'Filter & Sort'}} />
        <Root.Screen name="Search" component={SearchScreen} options={{title: 'Search'}} />
        <Root.Screen name="Notifications" component={NotificationsScreen} options={{title: 'Notifications'}} />
        <Root.Screen name="Auth" component={AuthNavigator} options={{headerShown: false, presentation: 'modal'}} />
      </Root.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
