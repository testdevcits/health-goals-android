import React, { memo } from 'react';
import { View, Pressable } from 'react-native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../../../../components';

interface Props {
  groupName: string;
  groupDescription: string;
  memberCount: number;
  colors: any;
  styles: any;
}

export const GroupHeader: React.FC<Props> = memo(({
  groupName,
  groupDescription,
  memberCount,
  colors,
  styles,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <ArrowLeft size={20} color={colors.textPrimary} />
      </Pressable>

      <View style={styles.headerText}>
        <AppText variant="h3" numberOfLines={1}>{groupName}</AppText>
        <AppText variant="caption" secondary numberOfLines={1}>
          {groupDescription} · {memberCount} members
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        style={styles.headerIconButton}
      >
        <Bell size={19} color={colors.textPrimary} />
      </Pressable>

      <View style={styles.profileAvatar}>
        <AppText variant="subtitle2" color="white" bold>AJ</AppText>
      </View>
    </View>
  );
});
