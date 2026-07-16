import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegistrationScreen from '../screens/auth/RegistrationScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';

const Auth = createNativeStackNavigator();

const AuthNavigator: React.FC = () => (
  <Auth.Navigator initialRouteName="Registration" screenOptions={{headerShown: false}}>
    <Auth.Screen name="Registration" component={RegistrationScreen} />
    <Auth.Screen name="OtpVerification" component={OtpVerificationScreen} />
  </Auth.Navigator>
);

export default AuthNavigator;
