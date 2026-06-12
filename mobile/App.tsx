import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';
import {store} from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import {userService} from './src/services/userService';
import './src/i18n';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const AppContent: React.FC = () => {
  useEffect(() => {
    // Dismiss splash as soon as the first render is committed
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const setupFCM = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED
        || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        const token = await messaging().getToken();
        if (token) {
          try {
            await userService.updateFcmToken(token);
          } catch (_) {}
        }
      }
    };
    setupFCM();

    return messaging().onTokenRefresh(async token => {
      try {await userService.updateFcmToken(token);} catch (_) {}
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      <AppNavigator />
    </>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
