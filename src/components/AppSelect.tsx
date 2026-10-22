// src/components/AppSelect.tsx
import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';

export interface SelectOption {
  label: string;
  value: string;
}

interface AppSelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const AppSelect: React.FC<AppSelectProps> = ({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Select...',
  error,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find(o => o.value === value)?.label;
  const borderColor = error
    ? colors.error
    : visible
      ? colors.inputFocusBorder
      : colors.inputBorder;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <AppText variant="label" secondary mb={6}>
          {label}
        </AppText>
      ) : null}

      {/* Trigger */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
        style={[
          styles.trigger,
          {
            backgroundColor: colors.inputBg,
            borderColor,
            borderRadius: radius.md,
            paddingHorizontal: spacing.base,
            paddingVertical: spacing.md,
          },
        ]}>
        <AppText
          variant="body1"
          color={selectedLabel ? 'textPrimary' : 'inputPlaceholder'}
          style={{ flex: 1 }}>
          {selectedLabel ?? placeholder}
        </AppText>
        <ChevronDown size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {error ? (
        <AppText variant="caption" error mt={4}>
          {error}
        </AppText>
      ) : null}

      {/* Bottom-sheet Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setVisible(false)}>
        <Pressable
          style={styles.backdrop}
          onPress={() => setVisible(false)}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                borderTopLeftRadius: radius.xxl,
                borderTopRightRadius: radius.xxl,
                paddingBottom: spacing.xxl,
              },
            ]}
            onPress={() => {}}>
            {/* Handle */}
            <View
              style={[styles.handle, { backgroundColor: colors.border }]}
            />

            {label ? (
              <AppText
                variant="subtitle1"
                bold
                style={{
                  paddingHorizontal: spacing.xl,
                  paddingBottom: spacing.md,
                }}>
                {label}
              </AppText>
            ) : null}

            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item.value);
                      setVisible(false);
                    }}
                    style={[
                      styles.option,
                      {
                        paddingHorizontal: spacing.xl,
                        paddingVertical: spacing.base,
                        backgroundColor: isSelected
                          ? colors.primaryLight
                          : 'transparent',
                      },
                    ]}>
                    <AppText
                      variant="body1"
                      color={isSelected ? 'primary' : 'textPrimary'}>
                      {item.label}
                    </AppText>
                    {isSelected ? (
                      <Check size={18} color={colors.primary} />
                    ) : null}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    gap: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingTop: 12,
    maxHeight: '55%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default AppSelect;
