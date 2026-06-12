export const Colors = {
  primary: '#2E7D32',       // Deep green — agriculture
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',
  accent: '#FF6F00',        // Amber — warm rural tone
  accentLight: '#FFB300',

  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceVariant: '#E8F5E9',

  text: '#212121',
  textSecondary: '#616161',
  textHint: '#9E9E9E',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',

  border: '#E0E0E0',
  divider: '#EEEEEE',

  success: '#43A047',
  warning: '#FB8C00',
  error: '#E53935',
  info: '#1E88E5',

  star: '#FDD835',
  unread: '#F44336',

  // Category chips
  agriculture: '#558B2F',
  hardware: '#546E7A',
  livestock: '#6D4C41',
  vehicles: '#1565C0',

  // Status
  pending: '#FF6F00',
  confirmed: '#2E7D32',
  completed: '#1565C0',
  cancelled: '#E53935',

  overlay: 'rgba(0,0,0,0.5)',
  skeleton: '#E0E0E0',
} as const;

export type ColorKeys = keyof typeof Colors;
