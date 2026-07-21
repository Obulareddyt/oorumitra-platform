export const Colors = {
  primary: '#2E7D32',       // Primary Village Green
  primaryDark: '#1c4d1e',
  primaryLight: '#c2e7c4',
  secondary: '#FFB300',     // Secondary Harvest Gold
  secondaryDark: '#e6a100',
  accent: '#1565C0',        // Trust Blue
  accentLight: '#bfdbfe',

  background: '#F8FAF5',    // Light Canvas
  surface: '#FFFFFF',
  surfaceVariant: '#e1f3e2',

  text: '#212121',
  textSecondary: '#616161',
  textHint: '#9E9E9E',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#000000',

  border: '#E0E0E0',
  divider: '#EEEEEE',

  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#1565C0',

  star: '#FFB300',
  unread: '#F44336',

  // Category chips
  agriculture: '#2E7D32',
  hardware: '#546E7A',
  livestock: '#6D4C41',
  vehicles: '#1565C0',

  // Status
  pending: '#FF9800',
  confirmed: '#2E7D32',
  completed: '#1565C0',
  cancelled: '#F44336',

  overlay: 'rgba(0,0,0,0.5)',
  skeleton: '#E0E0E0',
} as const;

export type ColorKeys = keyof typeof Colors;
