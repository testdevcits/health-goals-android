import { View } from 'react-native';
import React, { memo } from 'react';
import { AppText } from '../../../../components';

import { useTheme } from '../../../../theme/useTheme';
import createStyles from './styles.FeedTab';
import type { FeedPost } from '../data';

const formatFeedTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const elapsedMs = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(elapsedMs / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const FeedTab = ({ posts }: { posts: FeedPost[] }) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors, spacing, radius);

  return (
    <View style={styles.feedList}>
      {posts.map(post => (
        <View key={post.id} style={styles.feedCard}>
          {/* Post author */}
          <View style={styles.postHeader}>
            <View style={[styles.postAvatar, { backgroundColor: post.color }]}>
              <AppText variant="subtitle2" color="white" bold>
                {post.initials}
              </AppText>
            </View>

            <View style={styles.postAuthorInfo}>
              <AppText variant="label">{post.name}</AppText>

              <AppText variant="caption" secondary>
                {formatFeedTime(post.time)} · {post.group}
              </AppText>
            </View>

            <AppText style={styles.postEmoji}>{post.emoji}</AppText>
          </View>

          {/* Post message */}
          <AppText variant="body2" style={styles.postMessage}>
            {post.message}
          </AppText>
        </View>
      ))}
    </View>
  );
};

export default memo(FeedTab);
