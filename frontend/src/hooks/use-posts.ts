import { useCallback, useRef, useState } from 'react';

import { fetchPosts, REACTION_EMOJIS, toggleReaction, type Post, type Reaction } from '@/api/posts';

/** The reactions list after the viewer toggles `emoji`, without waiting for the server. */
function withToggled(reactions: Reaction[], emoji: string): Reaction[] {
  const existing = reactions.find((r) => r.emoji === emoji);
  if (!existing) {
    const added = [...reactions, { emoji, count: 1, reacted: true }];
    const order = (e: string) => REACTION_EMOJIS.indexOf(e as (typeof REACTION_EMOJIS)[number]);
    return added.sort((a, b) => order(a.emoji) - order(b.emoji));
  }
  if (existing.reacted && existing.count <= 1) return reactions.filter((r) => r !== existing);
  const changed = { ...existing, count: existing.count + (existing.reacted ? -1 : 1), reacted: !existing.reacted };
  return reactions.map((r) => (r === existing ? changed : r));
}

/** Paginated, newest-first list of posts with refresh and load-more. */
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const nextPage = useRef(1);
  const busy = useRef(false);

  const load = useCallback(async (reset: boolean, pulled: boolean) => {
    if (busy.current) return;
    busy.current = true;
    setError(null);
    if (!reset) setLoadingMore(true);
    else if (pulled) setRefreshing(true);
    else setLoading(true);

    try {
      const result = await fetchPosts(reset ? 1 : nextPage.current);
      nextPage.current = result.page + 1;
      setHasMore(result.hasMore);
      setPosts((current) => {
        if (reset) return result.posts;
        // New posts can shift page boundaries, so drop anything already shown.
        const seen = new Set(current.map((post) => post.id));
        return [...current, ...result.posts.filter((post) => !seen.has(post.id))];
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      busy.current = false;
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  /** Reloads from the first page. `pulled` is true for a user-initiated pull-to-refresh. */
  const refresh = useCallback((pulled = false) => load(true, pulled), [load]);
  const loadMore = useCallback(() => {
    if (hasMore && !error) load(false, false);
  }, [hasMore, error, load]);

  /** Toggles the viewer's reaction right away, then syncs with the server (undoing it on failure). */
  const react = useCallback(async (postId: number, emoji: string) => {
    const update = (change: (reactions: Reaction[]) => Reaction[]) =>
      setPosts((current) =>
        current.map((post) => (post.id === postId ? { ...post, reactions: change(post.reactions) } : post)),
      );

    update((reactions) => withToggled(reactions, emoji));
    try {
      const reactions = await toggleReaction(postId, emoji);
      update(() => reactions);
    } catch {
      update((reactions) => withToggled(reactions, emoji));
    }
  }, []);

  return { posts, loading, refreshing, loadingMore, error, refresh, loadMore, react };
}
