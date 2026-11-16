import React, { memo } from 'react';
import { View } from 'react-native';
import { AppButton, ConfirmationModal } from '../../../../../components';
import type { GroupUserSearchResult } from '../../useGroupDetail';

interface InviteMemberModalProps {
  user: GroupUserSearchResult | null;
  groupName: string;
  loading: boolean;
  onClose: () => void;
  onInvite: () => void;
  styles: any;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = memo(
  ({ user, groupName, loading, onClose, onInvite, styles }) => {
    return (
      <ConfirmationModal
        visible={user !== null}
        onClose={loading ? () => {} : onClose}
        title="Invite this member?"
        message={
          user
            ? `Add ${user.name} (${user.publicId}) to ${groupName}?`
            : ''
        }
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
            title="Invite member"
            loading={loading}
            disabled={loading || !user}
            onPress={onInvite}
            style={styles.modalActionButton}
          />
        </View>
      </ConfirmationModal>
    );
  },
);

export default InviteMemberModal;
