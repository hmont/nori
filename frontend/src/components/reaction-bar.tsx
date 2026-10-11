import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { REACTION_EMOJIS, type Reaction } from '@/api/posts';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  reactions: Reaction[];
  onToggle: (emoji: string) => void;
};

/** The emoji reactions on a post, plus a button that opens a picker for adding one. */
export function ReactionBar({ reactions, onToggle }: Props) {
  const theme = useTheme();
  const [picking, setPicking] = useState(false);

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedView type="backgroundElement" style={styles.row}>
        {reactions.map((reaction) => (
          <Pressable
            key={reaction.emoji}
            onPress={() => onToggle(reaction.emoji)}
            accessibilityRole="button"
            accessibilityState={{ selected: reaction.reacted }}
            accessibilityLabel={`${reaction.emoji} ${reaction.count}`}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: reaction.reacted ? theme.backgroundSelected : theme.background,
                borderColor: reaction.reacted ? theme.accent : 'transparent',
              },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="small">{reaction.emoji}</ThemedText>
            <ThemedText type="smallBold">{reaction.count}</ThemedText>
          </Pressable>
        ))}

        <Pressable
          onPress={() => setPicking((open) => !open)}
          accessibilityRole="button"
          accessibilityLabel="Add a reaction"
          style={({ pressed }) => [
            styles.chip,
            { backgroundColor: theme.background, borderColor: 'transparent' },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="small" themeColor="textSecondary">
            {picking ? '✕' : '☺ +'}
          </ThemedText>
        </Pressable>
      </ThemedView>

      {picking && (
        <ThemedView style={[styles.row, styles.picker]}>
          {REACTION_EMOJIS.map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => {
                onToggle(emoji);
                setPicking(false);
              }}
              accessibilityRole="button"
              accessibilityLabel={`React with ${emoji}`}
              style={({ pressed }) => [styles.pickerItem, pressed && styles.pressed]}>
              <ThemedText style={styles.pickerEmoji}>{emoji}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.four,
    borderWidth: 1.5,
  },
  picker: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.four,
  },
  pickerItem: {
    padding: Spacing.one,
  },
  pickerEmoji: {
    fontSize: 24,
    lineHeight: 32,
  },
  pressed: {
    opacity: 0.6,
  },
});
