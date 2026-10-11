import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Post } from '@/api/posts';

// Soft pastels; each poster gets a consistent one based on their name.
const AVATAR_COLORS = ['#FFC9D4', '#FFE0A8', '#C9EBD4', '#C5DDF8', '#E3D2F7', '#FFD3B8'];

function avatarColor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export const PostCard = memo(function PostCard({ post }: { post: Post }) {
  const initial = Array.from(post.name.trim())[0]?.toUpperCase() ?? '?';

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView type="backgroundElement" style={styles.header}>
        <ThemedView style={[styles.avatar, { backgroundColor: avatarColor(post.name) }]}>
          <ThemedText type="smallBold" style={styles.initial}>
            {initial}
          </ThemedText>
        </ThemedView>
        <ThemedView type="backgroundElement" style={styles.who}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {post.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatDate(post.postedAt)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedText>{post.content}</ThemedText>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.three,
    // a soft shadow lifts the card off the cream background
    boxShadow: '0 2px 10px rgba(120, 80, 70, 0.10)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#3B2F2F',
    fontSize: 16,
  },
  who: {
    flexShrink: 1,
  },
});
