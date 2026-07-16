import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../store';

/**
 * Mirrors the web app's inline `if (!isLoggedIn) ...` checks (e.g. Sell.jsx)
 * for restricted actions: posting, messaging, contacting sellers. Home and
 * browsing stay public; only these call sites gate on auth.
 */
export const useRequireAuth = () => {
  const navigation = useNavigation<any>();
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);

  const requireAuth = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      navigation.navigate('Auth');
    }
  };

  return {isAuthenticated, requireAuth};
};
