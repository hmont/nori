import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';

import { NoriLogo } from '@/components/nori-logo';
import { PostCard } from '@/components/post-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useContentInsets } from '@/hooks/use-content-insets';
import { usePosts } from '@/hooks/use-posts';
import { useTheme } from '@/hooks/use-theme';

export default function PostsScreen() {
  const theme = useTheme();
  const { insets, padding } = useContentInsets();
  const { posts, loading, refreshing, loadingMore, error, refresh, loadMore } = usePosts();

  // Reload whenever the tab is shown, so a post made on the other tab appears right away.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const errorView = error && (
    <ThemedView style={styles.status}>
      <ThemedText themeColor="textSecondary" style={styles.centered}>
        {error}
      </ThemedText>
      <Pressable onPress={() => refresh()}>
        <ThemedText type="linkPrimary" style={{ color: theme.accent }}>
          Try again
        </ThemedText>
      </Pressable>
    </ThemedView>
  );

  const empty =
    errorView ||
    (loading || refreshing ? (
      <ActivityIndicator style={styles.status} color={theme.accent} />
    ) : (
      <ThemedView style={styles.status}>
        <NoriLogo size={120} />
        <ThemedText themeColor="textSecondary" style={styles.centered}>
          {"It's quiet in here... be the first to say hi! ✿"}
        </ThemedText>
      </ThemedView>
    ));

  return (
    <ThemedView style={styles.container}>
      <FlatList
        style={styles.list}
        data={posts}
        keyExtractor={(post) => String(post.id)}
        renderItem={({ item }) => <PostCard post={item} />}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <ThemedView style={styles.hero}>
            <NoriLogo size={64} />
            <ThemedView>
              <ThemedText type="subtitle" style={styles.title}>
                Nori
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                a cozy little board for little thoughts
              </ThemedText>
            </ThemedView>
          </ThemedView>
        }
        ListEmptyComponent={empty}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footer} color={theme.accent} />
          ) : (
            posts.length > 0 ? errorView || null : null
          )
        }
        contentInset={insets}
        contentContainerStyle={[styles.content, padding]}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onRefresh={() => refresh(true)}
        refreshing={refreshing}
      />
    </ThemedView>
  );
}

function Separator() {
  return <ThemedView style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  content: {
    paddingHorizontal: Spacing.three,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    color: '#3F7D63',
  },
  separator: {
    height: Spacing.three,
  },
  status: {
    paddingVertical: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  footer: {
    paddingVertical: Spacing.three,
  },
  centered: {
    textAlign: 'center',
  },
});
