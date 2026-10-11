import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, Spacing } from '@/constants/theme';

/** Insets that keep scrollable content clear of the status bar and the tab bar. */
export function useContentInsets() {
  const safeArea = useSafeAreaInsets();
  const insets = {
    ...safeArea,
    bottom: safeArea.bottom + BottomTabInset + Spacing.three,
  };

  // On iOS the scroll view's contentInset handles it; Android and web need padding.
  const padding = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return { insets, padding };
}
