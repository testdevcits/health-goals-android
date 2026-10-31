import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    padding: 20,
    minHeight: 132,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 15,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  groupIcon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    marginTop: 3,
  },
  bannerMemberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  bannerAvatar: {
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -7,
  },
  bannerAvatarText: {
    fontSize: 11,
  },
  bannerMoreMembers: {
    width: 29,
    height: 29,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 1,
  },
  bannerMoreMembersText: {
    fontSize: 10,
  },
  settingsButton: {
    position: 'absolute',
    top: 15,
    right: 14,
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
