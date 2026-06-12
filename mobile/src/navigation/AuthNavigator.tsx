import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/auth/SplashScreen';
import RegistrationScreen from '../screens/auth/RegistrationScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';

const Auth = createNativeStackNavigator();

const AuthNavigator: React.FC = () => (
  <Auth.Navigator screenOptions={{headerShown: false}}>
    <Auth.Screen name="Splash" component={SplashScreen} />
    <Auth.Screen name="Registration" component={RegistrationScreen} />
    <Auth.Screen name="OtpVerification" component={OtpVerificationScreen} />
  </Auth.Navigator>
);

export default AuthNavigator;
