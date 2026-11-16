import React, { memo } from 'react';
import { Modal, View } from 'react-native';
import { AppButton, AppInput, AppText } from '../../../../components';

interface CreateStepChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  onChangeTitle: (text: string) => void;
  description: string;
  onChangeDescription: (text: string) => void;
  target: string;
  onChangeTarget: (text: string) => void;
  creating: boolean;
  onSubmit: () => void;
  styles: any;
}

export const CreateStepChallengeModal: React.FC<CreateStepChallengeModalProps> = memo(
  ({
    visible,
    onClose,
    title,
    onChangeTitle,
    description,
    onChangeDescription,
    target,
    onChangeTarget,
    creating,
    onSubmit,
    styles,
  }) => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.createModalOverlay}>
          <View style={styles.createModalSheet}>
            <AppText variant="h3" bold mb={12}>
              Create a steps challenge
            </AppText>
            <AppInput
              label="Title"
              value={title}
              onChangeText={onChangeTitle}
              maxLength={80}
            />
            <AppInput
              label="Description"
              value={description}
              onChangeText={onChangeDescription}
              maxLength={240}
            />
            <AppInput
              label="Target steps"
              value={target}
              onChangeText={onChangeTarget}
              keyboardType="number-pad"
            />
            <AppButton
              title={creating ? 'Creating…' : 'Create challenge'}
              onPress={onSubmit}
              disabled={creating}
              style={styles.submitCreateButton}
            />
            <AppButton
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={styles.cancelCreateButton}
            />
          </View>
        </View>
      </Modal>
    );
  },
);

export default CreateStepChallengeModal;
