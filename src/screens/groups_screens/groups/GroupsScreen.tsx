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
// import { AppHeader, AppText } from '../../../components';
// import createStyles from './styles.Groups';
// import CreateGroupModal from './components/CreateGroupModal';
// import FeedTab from './tabs/FeedTab';
// import MyGroups from './tabs/MyGroups';

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

// const avatarColors = ['#FF8278', '#579CF4', '#00BFA5', '#FF9B38', '#8175F5'];

// const GroupsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
//   const { theme } = useTheme();
//   const { colors, spacing, radius } = theme;
//   const insets = useSafeAreaInsets();

//   const [activeTab, setActiveTab] = useState<GroupTab>('My Groups');
//   const [groups, setGroups] = useState<Group[]>(initialGroups);
//   const [posts, setPosts] = useState<FeedPost[]>(initialPosts);

//   const [createModalVisible, setCreateModalVisible] = useState(false);

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
//     Alert.alert('Share post', `Share ${post.name}'s update with your friends.`);
//   };

//   return (
//     <View style={[styles.container, ,]}>
//       {/* Header */}

//       <AppHeader
//         title="Groups & Community"
//         subtitle={'Your teams, friends, and accountability pods'}
//         isBack={false}
//       />

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
//               style={[styles.tab, selected && styles.activeTab]}
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
//           <MyGroups
//             groups={groups}
//             avatarColors={avatarColors}
//             setCreateModalVisible={setCreateModalVisible}
//           />
//         ) : (
//           <FeedTab
//             posts={posts}
//             likedPosts={likedPosts}
//             toggleKudos={toggleKudos}
//             handleShare={handleShare}
//           />
//         )}
//       </ScrollView>

//       {/* Create Group bottom sheet */}

//       <CreateGroupModal
//         createModalVisible={createModalVisible}
//         setCreateModalVisible={setCreateModalVisible}
//         groupName={groupName}
//         setGroupName={setGroupName}
//         selectedIcon={selectedIcon}
//         setSelectedIcon={setSelectedIcon}
//         isPrivate={isPrivate}
//         setIsPrivate={setIsPrivate}
//         handleCreateGroup={handleCreateGroup}
//       />
//     </View>
//   );
// };

// export default GroupsScreen;

import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const GroupsScreen = () => {
  return (
    <View>
      <Text>GroupsScreen</Text>
    </View>
  );
};

export default GroupsScreen;
