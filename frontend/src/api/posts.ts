import { Platform } from 'react-native';

// Set EXPO_PUBLIC_API_URL to point at the backend (needed on a physical device).
// 10.0.2.2 is how the Android emulator reaches the host machine's localhost.
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080');

export type Post = {
  id: number;
  name: string;
  content: string;
  /** ISO-8601 timestamp */
  postedAt: string;
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
export function fetchPosts(page: number, pageSize = 20): Promise<PostsPage> {
  return request(`/api/posts/fetch?p=${page}&s=${pageSize}`);
}

export function createPost(post: NewPost): Promise<Post> {
  return request('/api/posts/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
}
