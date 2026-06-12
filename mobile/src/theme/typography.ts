import {Platform} from 'react-native';

export const FontFamily = {
  regular: Platform.select({ios: 'System', android: 'Roboto'}),
  medium: Platform.select({ios: 'System', android: 'Roboto-Medium'}),
  bold: Platform.select({ios: 'System', android: 'Roboto-Bold'}),
};

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 34,
};

export const LineHeight = {
  xs: 16,
  sm: 18,
  base: 20,
  md: 24,
  lg: 28,
  xl: 32,
};
