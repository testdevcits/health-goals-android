import { Alert, Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { AppText } from '../../../../components';

import { useTheme } from '../../../../theme/useTheme';
import createStyles from './styles.FeedTab';

const FeedTab = ({
  posts,
  likedPosts,
  toggleKudos,
  handleShare,
}: {
  posts: any[];
  likedPosts: string[];
  toggleKudos: (id: string) => void;
  handleShare: (post: any) => void;
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors, spacing, radius);

  return (
    <View style={styles.feedList}>
      {posts.map(post => {
        const liked = likedPosts.includes(post.id);

        return (
          <View key={post.id} style={styles.feedCard}>
            {/* Post author */}
            <View style={styles.postHeader}>
              <View
                style={[styles.postAvatar, { backgroundColor: post.color }]}
              >
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

            {/* Post actions */}
            {/* <View style={styles.postActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => toggleKudos(post.id)}
                style={styles.postAction}
              >
                <Heart
                  size={15}
                  color={liked ? colors.error : colors.textSecondary}
                  fill={liked ? colors.error : 'transparent'}
                />

                <AppText
                  variant="caption"
                  style={{
                    color: liked ? colors.error : colors.textSecondary,
                  }}
                >
                  {liked ? post.kudos + 1 : post.kudos} Kudos
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  Alert.alert(
                    'Comments',
                    'Connect this action to your comments screen.',
                  )
                }
                style={styles.postAction}
              >
                <MessageCircle size={15} color={colors.textSecondary} />

                <AppText variant="caption" secondary>
                  {post.comments}
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => handleShare(post)}
                style={styles.postAction}
              >
                <Share2 size={15} color={colors.textSecondary} />

                <AppText variant="caption" secondary>
                  Share
                </AppText>
              </Pressable>
            </View> */}
          </View>
        );
      })}
    </View>
  );
};

export default memo(FeedTab);

 
