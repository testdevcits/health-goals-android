import { StyleSheet } from 'react-native';
import { spacing } from '../../../../../theme/spacing';
import { typography } from '../../../../../theme/typography';

export default StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    padding: spacing.lg,
    minHeight: 132,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.base - 1,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  groupIcon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    marginTop: spacing.xxs + 1,
  },
  bannerMemberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.ms,
  },
  bannerAvatar: {
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: spacing.xxs,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -7,
    overflow: 'hidden',
  },
  bannerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  bannerAvatarText: {
    fontSize: typography.caption.fontSize - 1,
  },
  bannerMoreMembers: {
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: spacing.xxs,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 1,
  },
  bannerMoreMembersText: {
    fontSize: typography.tabLabel.fontSize,
  },
  settingsButton: {
    position: 'absolute',
    top: spacing.base - 1,
    right: spacing.ml,
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 19,
  },
});
