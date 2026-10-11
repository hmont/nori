import { Platform } from 'react-native';

import { getReactorId } from '@/api/reactor';

// Set EXPO_PUBLIC_API_URL to point at the backend (needed on a physical device).
// 10.0.2.2 is how the Android emulator reaches the host machine's localhost.
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080');

/** The emojis people can react with, in display order. Must match the backend's list. */
export const REACTION_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🎉'] as const;

export type Reaction = {
  emoji: string;
  count: number;
  /** Whether this device has used this emoji on the post. */
  reacted: boolean;
};

export type Post = {
  id: number;
  name: string;
  content: string;
  /** ISO-8601 timestamp */
  postedAt: string;
  reactions: Reaction[];
};

export type PostsPage = {
  posts: Post[];
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type NewPost = {
  name: string;
  email: string;
  content: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new Error(`Couldn't reach the server at ${API_URL}.`);
  }
  if (!response.ok) {
    throw new Error(`The server responded with an error (${response.status}).`);
  }
  return response.json();
}

/** Fetches a page of posts, newest first. Pages are 1-based. */
export async function fetchPosts(page: number, pageSize = 20): Promise<PostsPage> {
  const reactorId = encodeURIComponent(await getReactorId());
  return request(`/api/posts/fetch?p=${page}&s=${pageSize}&r=${reactorId}`);
}

/** Adds this device's reaction to a post, or removes it if already there. Returns the post's reactions. */
export async function toggleReaction(postId: number, emoji: string): Promise<Reaction[]> {
  return request('/api/posts/react', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, emoji, reactorId: await getReactorId() }),
  });
}

export function createPost(post: NewPost): Promise<Post> {
  return request('/api/posts/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
}
