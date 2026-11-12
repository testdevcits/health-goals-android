import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { AppInput, AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import type { GroupUserSearchResult } from '../../useGroupDetail';
import AppIcon from '../../../../../assets/appicon/AppIcon';

interface MemberSearchModalProps {
  visible: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading: boolean;
  searchResults: GroupUserSearchResult[];
  onSelectUser: (user: GroupUserSearchResult) => void;
}

export const MemberSearchModal: React.FC<MemberSearchModalProps> = ({
  visible,
  onClose,
  searchQuery,
  onSearchChange,
  loading,
  searchResults,
  onSelectUser,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close member search"
        />
        <View
          style={[styles.modalSheet, { backgroundColor: colors.surface }]}
        >
          {/* Header with Title and Cancel Close Icon */}
          <View style={styles.header}>
            <AppText variant="h3" bold>
              Add a group member
            </AppText>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              style={[
                styles.closeButton,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <AppIcon name="X" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <AppInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search by name or public ID"
            autoCapitalize="none"
          />

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null}

          <ScrollView keyboardShouldPersistTaps="handled">
            {searchResults.map(user => (
              <Pressable
                key={user.id}
                onPress={() => onSelectUser(user)}
                style={[styles.userRow, { borderBottomColor: colors.border }]}
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <AppIcon name="User" size={18} color={colors.primary} />
                </View>
                <View style={styles.userInfo}>
                  <AppText variant="subtitle2" bold>
                    {user.name}
                  </AppText>
                  <AppText variant="caption" secondary>
                    {user.publicId}
                  </AppText>
                </View>
              </Pressable>
            ))}
            {searchQuery.trim().length >= 2 &&
            !loading &&
            searchResults.length === 0 ? (
              <AppText variant="body2" secondary style={styles.emptyText}>
                No matching users found.
              </AppText>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    height: '50%',
    maxHeight: '75%',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  loaderContainer: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  emptyText: {
    paddingVertical: 16,
    textAlign: 'center',
  },
});
