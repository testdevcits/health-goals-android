import React, { memo, useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppEmptyState, AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import AppIcon from '../../../../assets/appicon/AppIcon';
import createStyles from './styles.FeedTab';
import type { FeedPost } from '../data';
import {
  CreateFeedPostModal,
  type AvailableGroupItem,
  type FeedPostPayload,
} from '../components';
import { authenticatedRequest } from '../../../../services/authenticatedApi';
import { API_ENDPOINTS } from '../../../../constants';
import { apiErrorMessage } from '../../../../services/api';
import { showAppToast } from '../../../../utils/appToast';

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

export interface FeedTabProps {
  posts: FeedPost[];
  availableGroups?: AvailableGroupItem[];
  onPostCreated?: () => void;
}

const FeedTab: React.FC<FeedTabProps> = ({
  posts,
  availableGroups = [],
  onPostCreated,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createStyles(colors, spacing, radius);

  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreatePost = useCallback(
    async (payload: FeedPostPayload) => {
      setSubmitting(true);
      try {
        await authenticatedRequest(
          'POST',
          API_ENDPOINTS.COMMUNITY.FEED,
          payload,
        );
        showAppToast(
          'success',
          'Milestone Shared!',
          'Your post has been shared to the group feed.',
        );
        setCreatePostModalVisible(false);
        onPostCreated?.();
      } catch (error) {
        const message = apiErrorMessage(error);
        showAppToast('error', 'Could not share post', message);
      } finally {
        setSubmitting(false);
      }
    },
    [onPostCreated],
  );

  return (
    <View style={styles.container}>
      {posts.length > 0 ? (
        <View style={styles.feedList}>
          {posts.map(post => (
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
      ) : (
        <AppEmptyState
          title="Your feed is quiet"
          description="Be the first one to share a milestone with your group!"
          actionLabel="Share a Milestone"
          onAction={() => setCreatePostModalVisible(true)}
        />
      )}

      {/* Floating Action Button on bottom right side */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create milestone post"
        onPress={() => setCreatePostModalVisible(true)}
        style={styles.floatingButton}
      >
        <AppIcon name="Plus" size={26} color="#FFFFFF" strokeWidth={2.4} />
      </Pressable>

      {/* Create Feed Post Modal */}
      <CreateFeedPostModal
        visible={createPostModalVisible}
        onClose={() => setCreatePostModalVisible(false)}
        onSubmit={handleCreatePost}
        loading={submitting}
        availableGroups={availableGroups}
        defaultGroupId={availableGroups.length > 0 ? availableGroups[0].id : ''}
        initialActivity={{
          type: 'steps',
          value: 10000,
          unit: 'steps',
        }}
      />
    </View>
  );
};

export default memo(FeedTab);
