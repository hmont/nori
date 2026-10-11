import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

import { createPost } from '@/api/posts';
import { NoriLogo } from '@/components/nori-logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useContentInsets } from '@/hooks/use-content-insets';
import { useTheme } from '@/hooks/use-theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewPostScreen() {
  const theme = useTheme();
  const { insets, padding } = useContentInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const post = { name: name.trim(), email: email.trim(), content: content.trim() };
    if (!post.name || !post.email || !post.content) {
      setError('Please fill in your name, email and message.');
      return;
    }
    if (!EMAIL_PATTERN.test(post.email)) {
      setError("That email address doesn't look right.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await createPost(post);
      setContent('');
      router.navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = [styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentInset={insets}
        contentContainerStyle={[styles.content, padding]}
        keyboardShouldPersistTaps="handled">
        <ThemedView style={styles.hero}>
          <NoriLogo size={48} />
          <ThemedText type="subtitle" style={{ color: theme.seaweed }}>
            New post
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.field}>
          <ThemedText type="smallBold">Name</ThemedText>
          <TextInput
            style={inputStyle}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="words"
            autoComplete="name"
            editable={!submitting}
          />
        </ThemedView>

        <ThemedView style={styles.field}>
          <ThemedText type="smallBold">Email</ThemedText>
          <TextInput
            style={inputStyle}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!submitting}
          />
          <ThemedText type="small" themeColor="textSecondary">
            Never shown publicly.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.field}>
          <ThemedText type="smallBold">Message</ThemedText>
          <TextInput
            style={[inputStyle, styles.multiline]}
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind? ✿"
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
            editable={!submitting}
          />
        </ThemedView>

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Pressable
          onPress={submit}
          disabled={submitting}
          style={({ pressed }) => [styles.button, (pressed || submitting) && styles.pressed]}>
          {submitting ? (
            <ActivityIndicator color="#3B2F2F" />
          ) : (
            <ThemedText style={styles.buttonText}>Post it! ♡</ThemedText>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  content: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderRadius: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.one,
    fontSize: 16,
    boxShadow: '0 2px 8px rgba(120, 80, 70, 0.08)',
  },
  multiline: {
    minHeight: 140,
  },
  error: {
    color: '#d92d20',
  },
  button: {
    backgroundColor: '#FF8FA8',
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonText: {
    color: '#3B2F2F',
    fontWeight: 700,
  },
  pressed: {
    opacity: 0.7,
  },
});
