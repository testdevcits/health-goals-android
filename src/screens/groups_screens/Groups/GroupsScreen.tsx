
// import React, { useState } from 'react';
// import {
//   View,
//   ScrollView,
//   Pressable,
//   StyleSheet,
//   Modal,
//   TextInput,
//   Switch,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import {
//   Users,
//   Bell,
//   ChevronRight,
//   X,
//   LockKeyhole,
//   Heart,
//   MessageCircle,
//   Share2,
// } from 'lucide-react-native';

// import { useTheme } from '../../../theme/useTheme';
// import { AppText } from '../../../components';
// import createStyles from './styles.Groups';

// type GroupTab = 'My Groups' | 'Feed';

// interface Group {
//   id: string;
//   name: string;
//   description: string;
//   members: number;
//   rank?: string;
//   emoji: string;
//   avatars: string[];
//   private: boolean;
// }

// interface FeedPost {
//   id: string;
//   name: string;
//   initials: string;
//   group: string;
//   time: string;
//   message: string;
//   emoji: string;
//   color: string;
//   kudos: number;
//   comments: number;
// }

// const groupIcons = [
//   '🏃',
//   '🚶',
//   '🧘',
//   '💪',
//   '🚴',
//   '🏋️',
//   '🥗',
//   '🏊',
// ];

// const initialGroups: Group[] = [
//   {
//     id: '1',
//     name: 'Morning Runners',
//     description: 'Weekly step challenge',
//     members: 8,
//     emoji: '🏃',
//     avatars: ['S', 'M', 'A', 'P'],
//     private: false,
//   },
//   {
//     id: '2',
//     name: 'Office Warriors',
//     description: 'Company team',
//     members: 24,
//     rank: '#3 on company board',
//     emoji: '💼',
//     avatars: ['K', 'D', 'A', 'L'],
//     private: false,
//   },
//   {
//     id: '3',
//     name: 'Yoga Squad',
//     description: 'Accountability pod',
//     members: 5,
//     emoji: '🧘',
//     avatars: ['P', 'A', 'R', 'T'],
//     private: true,
//   },
// ];

// const initialPosts: FeedPost[] = [
//   {
//     id: '1',
//     name: 'Sarah Kim',
//     initials: 'S',
//     group: 'Morning Runners',
//     time: '32 min ago',
//     message:
//       "Just crushed a 12,450-step day and took the #1 spot! Who's catching me? 😎",
//     emoji: '🏃',
//     color: '#FF8278',
//     kudos: 24,
//     comments: 6,
//   },
//   {
//     id: '2',
//     name: 'Mike Chen',
//     initials: 'M',
//     group: 'Office Warriors',
//     time: '1h ago',
//     message:
//       "Completed the 30-Day Step Sprint week 2! Our team is now #3. Let's go! 🔥",
//     emoji: '💪',
//     color: '#579CF4',
//     kudos: 18,
//     comments: 4,
//   },
//   {
//     id: '3',
//     name: 'Priya Patel',
//     initials: 'P',
//     group: 'Yoga Squad',
//     time: '2h ago',
//     message:
//       'Day 5 of the Morning Yoga Streak done ✅. My back feels amazing. Anyone want to join tomorrow at 7 AM?',
//     emoji: '🧘',
//     color: '#8175F5',
//     kudos: 31,
//     comments: 9,
//   },
// ];

// const avatarColors = [
//   '#FF8278',
//   '#579CF4',
//   '#00BFA5',
//   '#FF9B38',
//   '#8175F5',
// ];

// const GroupsScreen: React.FC = () => {
//   const { theme } = useTheme();
//   const { colors, spacing, radius } = theme;
//   const insets = useSafeAreaInsets();

//   const [activeTab, setActiveTab] = useState<GroupTab>('My Groups');
//   const [groups, setGroups] = useState<Group[]>(initialGroups);
//   const [posts, setPosts] = useState<FeedPost[]>(initialPosts);

//   const [createModalVisible, setCreateModalVisible] =
//     useState(false);

//   const [groupName, setGroupName] = useState('');
//   const [selectedIcon, setSelectedIcon] = useState('🏃');
//   const [isPrivate, setIsPrivate] = useState(true);

//   const [likedPosts, setLikedPosts] = useState<string[]>([]);

//   const styles = createStyles(colors, spacing, radius);

//   const resetCreateForm = () => {
//     setGroupName('');
//     setSelectedIcon('🏃');
//     setIsPrivate(true);
//   };

//   const handleCreateGroup = () => {
//     const name = groupName.trim();

//     if (!name) {
//       Alert.alert('Group name required', 'Please enter a group name.');
//       return;
//     }

//     const newGroup: Group = {
//       id: `${Date.now()}`,
//       name,
//       description: 'Your new community',
//       members: 1,
//       emoji: selectedIcon,
//       avatars: ['A'],
//       private: isPrivate,
//     };

//     setGroups(previous => [newGroup, ...previous]);
//     setCreateModalVisible(false);
//     resetCreateForm();
//     setActiveTab('My Groups');
//   };

//   const toggleKudos = (postId: string) => {
//     setLikedPosts(previous =>
//       previous.includes(postId)
//         ? previous.filter(id => id !== postId)
//         : [...previous, postId],
//     );
//   };

//   const handleShare = (post: FeedPost) => {
//     Alert.alert(
//       'Share post',
//       `Share ${post.name}'s update with your friends.`,
//     );
//   };

//   return (
//     <View
//       style={[
//         styles.container,
//         { paddingTop: insets.top },
//       ]}
//     >
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerText}>
//           <AppText variant="h3">
//             Groups &amp; Community
//           </AppText>

//           <AppText variant="caption" secondary>
//             Your teams, friends, and accountability pods
//           </AppText>
//         </View>

//         <View style={styles.headerActions}>
//           <Pressable
//             accessibilityRole="button"
//             accessibilityLabel="Notifications"
//             style={styles.notificationButton}
//           >
//             <Bell size={20} color={colors.textPrimary} />
//           </Pressable>

//           <View style={styles.profileAvatar}>
//             <AppText variant="subtitle2" color="white" bold>
//               AJ
//             </AppText>
//           </View>
//         </View>
//       </View>

//       {/* My Groups / Feed selector */}
//       <View style={styles.tabs}>
//         {(['My Groups', 'Feed'] as GroupTab[]).map(tab => {
//           const selected = activeTab === tab;

//           return (
//             <Pressable
//               key={tab}
//               accessibilityRole="tab"
//               accessibilityState={{ selected }}
//               onPress={() => setActiveTab(tab)}
//               style={[
//                 styles.tab,
//                 selected && styles.activeTab,
//               ]}
//             >
//               <AppText
//                 variant="label"
//                 center
//                 style={
//                   selected
//                     ? { color: colors.textPrimary }
//                     : { color: colors.textSecondary }
//                 }
//                 medium={selected}
//               >
//                 {tab}
//               </AppText>
//             </Pressable>
//           );
//         })}
//       </View>

//       {/* Main content */}
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {activeTab === 'My Groups' ? (
//           <View style={styles.groupList}>
//             {groups.map(group => (
//               <Pressable
//                 key={group.id}
//                 accessibilityRole="button"
//                 onPress={() =>
//                   Alert.alert(
//                     group.name,
//                     `${group.members} members · ${group.description}`,
//                   )
//                 }
//                 style={styles.groupCard}
//               >
//                 <View
//                   style={[
//                     styles.groupIcon,
//                     {
//                       backgroundColor:
//                         group.emoji === '🏃'
//                           ? '#DDF8F3'
//                           : group.emoji === '💼'
//                             ? '#EFEBFF'
//                             : '#FFF1E3',
//                     },
//                   ]}
//                 >
//                   <AppText style={styles.groupEmoji}>
//                     {group.emoji}
//                   </AppText>
//                 </View>

//                 <View style={styles.groupInfo}>
//                   <AppText variant="subtitle2" numberOfLines={1}>
//                     {group.name}
//                   </AppText>

//                   <AppText variant="caption" secondary numberOfLines={2}>
//                     {group.description} · {group.members} members
//                     {group.rank ? ` · ${group.rank}` : ''}
//                   </AppText>

//                   <View style={styles.memberAvatars}>
//                     {group.avatars.slice(0, 4).map((initial, index) => (
//                       <View
//                         key={`${group.id}-${index}`}
//                         style={[
//                           styles.memberAvatar,
//                           {
//                             backgroundColor:
//                               avatarColors[index % avatarColors.length],
//                           },
//                         ]}
//                       >
//                         <AppText
//                           style={styles.memberAvatarText}
//                           color="white"
//                           bold
//                         >
//                           {initial}
//                         </AppText>
//                       </View>
//                     ))}

//                     {group.members > 4 && (
//                       <View style={styles.moreMembers}>
//                         <AppText
//                           style={styles.moreMembersText}
//                           color="white"
//                           bold
//                         >
//                           +{group.members - 4}
//                         </AppText>
//                       </View>
//                     )}
//                   </View>
//                 </View>

//                 <ChevronRight
//                   size={19}
//                   color={colors.textTertiary}
//                 />
//               </Pressable>
//             ))}

//             {/* Create group */}
//             <Pressable
//               accessibilityRole="button"
//               onPress={() => setCreateModalVisible(true)}
//               style={styles.createGroupButton}
//             >
//               <AppText variant="buttonSm" primary>
//                 + Create New Group
//               </AppText>
//             </Pressable>
//           </View>
//         ) : (
//           <View style={styles.feedList}>
//             {posts.map(post => {
//               const liked = likedPosts.includes(post.id);

//               return (
//                 <View key={post.id} style={styles.feedCard}>
//                   {/* Post author */}
//                   <View style={styles.postHeader}>
//                     <View
//                       style={[
//                         styles.postAvatar,
//                         { backgroundColor: post.color },
//                       ]}
//                     >
//                       <AppText
//                         variant="subtitle2"
//                         color="white"
//                         bold
//                       >
//                         {post.initials}
//                       </AppText>
//                     </View>

//                     <View style={styles.postAuthorInfo}>
//                       <AppText variant="label">
//                         {post.name}
//                       </AppText>

//                       <AppText variant="caption" secondary>
//                         {post.time} ago · {post.group}
//                       </AppText>
//                     </View>

//                     <AppText style={styles.postEmoji}>
//                       {post.emoji}
//                     </AppText>
//                   </View>

//                   {/* Post message */}
//                   <AppText
//                     variant="body2"
//                     style={styles.postMessage}
//                   >
//                     {post.message}
//                   </AppText>

//                   {/* Post actions */}
//                   <View style={styles.postActions}>
//                     <Pressable
//                       accessibilityRole="button"
//                       onPress={() => toggleKudos(post.id)}
//                       style={styles.postAction}
//                     >
//                       <Heart
//                         size={15}
//                         color={liked ? '#F87171' : colors.textSecondary}
//                         fill={liked ? '#F87171' : 'transparent'}
//                       />

//                       <AppText
//                         variant="caption"
//                         style={{ color: liked ? '#F87171' : colors.textSecondary }}
//                       >
//                         {liked ? post.kudos + 1 : post.kudos} Kudos
//                       </AppText>
//                     </Pressable>

//                     <Pressable
//                       accessibilityRole="button"
//                       onPress={() =>
//                         Alert.alert(
//                           'Comments',
//                           'Connect this action to your comments screen.',
//                         )
//                       }
//                       style={styles.postAction}
//                     >
//                       <MessageCircle
//                         size={15}
//                         color={colors.textSecondary}
//                       />

//                       <AppText variant="caption" secondary>
//                         {post.comments}
//                       </AppText>
//                     </Pressable>

//                     <Pressable
//                       accessibilityRole="button"
//                       onPress={() => handleShare(post)}
//                       style={styles.postAction}
//                     >
//                       <Share2
//                         size={15}
//                         color={colors.textSecondary}
//                       />

//                       <AppText variant="caption" secondary>
//                         Share
//                       </AppText>
//                     </Pressable>
//                   </View>
//                 </View>
//               );
//             })}
//           </View>
//         )}
//       </ScrollView>

//       {/* Create Group bottom sheet */}
//       <Modal
//         visible={createModalVisible}
//         transparent
//         animationType="slide"
//         statusBarTranslucent
//         onRequestClose={() => setCreateModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <Pressable
//             style={StyleSheet.absoluteFill}
//             onPress={() => setCreateModalVisible(false)}
//             accessibilityLabel="Close create group sheet"
//           />

//           <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//             style={styles.modalKeyboardContainer}
//           >
//             <View
//               style={[
//                 styles.bottomSheet,
//                 {
//                   paddingBottom: Math.max(
//                     insets.bottom,
//                     spacing.base,
//                   ),
//                 },
//               ]}
//             >
//               <View style={styles.sheetHandle} />

//               <View style={styles.sheetHeader}>
//                 <AppText variant="h3">
//                   Create New Group
//                 </AppText>

//                 <Pressable
//                   accessibilityRole="button"
//                   accessibilityLabel="Close"
//                   onPress={() => setCreateModalVisible(false)}
//                   style={styles.closeButton}
//                 >
//                   <X size={19} color={colors.textPrimary} />
//                 </Pressable>
//               </View>

//               {/* Group name */}
//               <AppText
//                 variant="label"
//                 secondary
//                 style={styles.fieldLabel}
//               >
//                 Group Name
//               </AppText>

//               <TextInput
//                 value={groupName}
//                 onChangeText={setGroupName}
//                 placeholder="e.g. Lunchtime Walkers"
//                 placeholderTextColor={colors.inputPlaceholder}
//                 style={styles.nameInput}
//                 maxLength={50}
//                 returnKeyType="done"
//               />

//               {/* Icon picker */}
//               <AppText
//                 variant="label"
//                 secondary
//                 style={styles.fieldLabel}
//               >
//                 Choose an Icon
//               </AppText>

//               <View style={styles.iconGrid}>
//                 {groupIcons.map(emoji => {
//                   const selected = selectedIcon === emoji;

//                   return (
//                     <Pressable
//                       key={emoji}
//                       accessibilityRole="button"
//                       accessibilityLabel={`Select ${emoji} group icon`}
//                       accessibilityState={{ selected }}
//                       onPress={() => setSelectedIcon(emoji)}
//                       style={[
//                         styles.iconOption,
//                         selected && styles.selectedIconOption,
//                       ]}
//                     >
//                       <AppText style={styles.iconEmoji}>
//                         {emoji}
//                       </AppText>
//                     </Pressable>
//                   );
//                 })}
//               </View>

//               {/* Private group toggle */}
//               <View style={styles.privateRow}>
//                 <View style={styles.lockIcon}>
//                   <LockKeyhole
//                     size={17}
//                     color={colors.primaryDark}
//                   />
//                 </View>

//                 <View style={styles.privateText}>
//                   <AppText variant="label">
//                     Private Group
//                   </AppText>

//                   <AppText variant="caption" secondary>
//                     Only people with an invite can join
//                   </AppText>
//                 </View>

//                 <Switch
//                   value={isPrivate}
//                   onValueChange={setIsPrivate}
//                   trackColor={{
//                     false: colors.border,
//                     true: colors.primary,
//                   }}
//                   thumbColor={colors.white}
//                 />
//               </View>

//               {/* Create */}
//               <Pressable
//                 accessibilityRole="button"
//                 onPress={handleCreateGroup}
//                 style={styles.submitButton}
//               >
//                 <AppText variant="button" color="white">
//                   Create Group
//                 </AppText>
//               </Pressable>
//             </View>
//           </KeyboardAvoidingView>
//         </View>
//       </Modal>
//     </View>
//   );
// };



// export default GroupsScreen;

import React from 'react';
import { StyleSheet, View } from 'react-native';

const GroupsScreen = () => {
  return (
    <View>

    </View>
  );
}

const styles = StyleSheet.create({})

export default GroupsScreen;
