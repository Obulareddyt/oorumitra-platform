import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';
import {store} from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import {userService} from './src/services/userService';
import {pingBackend} from './src/services/api';
import './src/i18n';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const AppContent: React.FC = () => {
  useEffect(() => {
    // Dismiss splash as soon as the first render is committed
    SplashScreen.hide();
    // Fire-and-forget: starts waking a cold Render backend the moment the
    // app opens, so it's more likely warm by the time a screen needs data.
    pingBackend();
  }, []);

  useEffect(() => {
    // Push notifications are optional. If Firebase isn't configured
    // (no google-services.json), skip FCM entirely instead of crashing.
    let unsubscribe: (() => void) | undefined;
    const setupFCM = async () => {
      try {
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
        unsubscribe = messaging().onTokenRefresh(async token => {
          try {await userService.updateFcmToken(token);} catch (_) {}
        });
      } catch (_) {
        // Firebase unavailable — continue without push notifications.
      }
    };
    setupFCM();

    return () => {
      if (unsubscribe) unsubscribe();
    };
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
