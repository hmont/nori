import { useCallback, useRef, useState } from 'react';

import { fetchPosts, type Post } from '@/api/posts';

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

  return { posts, loading, refreshing, loadingMore, error, refresh, loadMore };
}
