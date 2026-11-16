import React, { memo } from 'react';
import { View } from 'react-native';
import { AppButton, ConfirmationModal } from '../../../../../components';

interface LeaveGroupModalProps {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onLeave: () => void;
  styles: any;
}

export const LeaveGroupModal: React.FC<LeaveGroupModalProps> = memo(
  ({ visible, loading, onClose, onLeave, styles }) => {
    return (
      <ConfirmationModal
        visible={visible}
        onClose={loading ? () => {} : onClose}
        title="Leave this group?"
        message="You will lose access to this group’s activity and chat."
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
            title="Leave group"
            loading={loading}
            disabled={loading}
            onPress={onLeave}
            style={[styles.modalActionButton, styles.destructiveButton]}
          />
        </View>
      </ConfirmationModal>
    );
  },
);

export default LeaveGroupModal;
