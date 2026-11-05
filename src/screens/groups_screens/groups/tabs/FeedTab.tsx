import { View } from 'react-native';
import React, { memo } from 'react';
import { AppText } from '../../../../components';

import { useTheme } from '../../../../theme/useTheme';
import createStyles from './styles.FeedTab';
import type { FeedPost } from '../data';

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
                {post.time} ago · {post.group}
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
