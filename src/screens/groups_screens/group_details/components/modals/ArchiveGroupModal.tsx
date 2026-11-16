import React, { memo } from 'react';
import { View } from 'react-native';
import { AppButton, ConfirmationModal } from '../../../../../components';

interface ArchiveGroupModalProps {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onArchive: () => void;
  styles: any;
}

export const ArchiveGroupModal: React.FC<ArchiveGroupModalProps> = memo(
  ({ visible, loading, onClose, onArchive, styles }) => {
    return (
      <ConfirmationModal
        visible={visible}
        onClose={loading ? () => {} : onClose}
        title="Archive this group?"
        message="The group will disappear from active groups, Discover, feeds, and leaderboards. Its messages and challenges will be retained, but the group cannot be restored in the app."
        position="bottom"
      >
        <View style={styles.modalActions}>
          <AppButton
            title="Cancel"
            variant="ghost"
            disabled={loading}
            onPress={onClose}
            style={styles.modalActionButton}
          />
          <AppButton
            title="Exit group"
            loading={loading}
            disabled={loading}
            onPress={onArchive}
            style={[styles.modalActionButton, styles.destructiveButton]}
          />
        </View>
      </ConfirmationModal>
    );
  },
);

export default ArchiveGroupModal;
