import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';
import AppButton from './AppButton';
import AppIcon from '../assets/appicon/AppIcon';

export interface ScrollableValuePickerModalProps {
  visible: boolean;
  title: string;
  unit: string;
  value: string;
  min: number;
  max: number;
  step?: number;
  presets?: number[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

const ITEM_HEIGHT = 46;

const ScrollableValuePickerModal: React.FC<ScrollableValuePickerModalProps> = ({
  visible,
  title,
  unit,
  value,
  min,
  max,
  step = 1,
  presets = [],
  onSelect,
  onClose,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const flatListRef = useRef<FlatList<number>>(null);

  const getDefaultValue = useCallback(() => {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
      return parsed;
    }
    if (unit === 'cm') return 170;
    if (unit === 'kg') return 70;
    return Math.round((min + max) / 2);
  }, [value, min, max, unit]);

  const [currentVal, setCurrentVal] = useState<number>(getDefaultValue);

  useEffect(() => {
    if (visible) {
      const defaultVal = getDefaultValue();
      setCurrentVal(defaultVal);
      const targetIndex = Math.max(0, Math.min(defaultVal - min, max - min));
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: targetIndex,
          animated: false,
          viewPosition: 0.5,
        });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [visible, getDefaultValue, min, max]);

  const data = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

  const scrollToIndex = (val: number) => {
    const idx = Math.max(0, Math.min(val - min, max - min));
    flatListRef.current?.scrollToIndex({
      index: idx,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const handleSelectVal = (val: number) => {
    setCurrentVal(val);
    scrollToIndex(val);
  };

  const handleIncrement = () => {
    const next = Math.min(max, currentVal + step);
    setCurrentVal(next);
    scrollToIndex(next);
  };

  const handleDecrement = () => {
    const prev = Math.max(min, currentVal - step);
    setCurrentVal(prev);
    scrollToIndex(prev);
  };

  const handleConfirm = () => {
    onSelect(String(currentVal));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.xxl,
              borderTopRightRadius: radius.xxl,
            },
          ]}
        >
          {/* Top Handle */}
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {/* Header */}
          <View style={styles.headerRow}>
            <AppText variant="h3" bold>
              {title}
            </AppText>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={[
                styles.closeButton,
                { backgroundColor: colors.backgroundSecondary },
              ]}
              accessibilityLabel="Close picker"
            >
              <AppIcon name="X" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Value Stepper Hero Card */}
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: colors.backgroundSecondary,
                borderRadius: radius.lg,
              },
            ]}
          >
            <Pressable
              onPress={handleDecrement}
              disabled={currentVal <= min}
              style={[
                styles.stepperButton,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.md,
                  opacity: currentVal <= min ? 0.4 : 1,
                },
              ]}
              accessibilityLabel={`Decrease ${unit}`}
            >
              <AppIcon name="Minus" size={20} color={colors.textPrimary} />
            </Pressable>

            <View style={styles.valueDisplay}>
              <AppText variant="h1" bold color="primary">
                {currentVal}
              </AppText>
              <AppText variant="subtitle1" secondary style={{ marginLeft: 6 }}>
                {unit}
              </AppText>
            </View>

            <Pressable
              onPress={handleIncrement}
              disabled={currentVal >= max}
              style={[
                styles.stepperButton,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.md,
                  opacity: currentVal >= max ? 0.4 : 1,
                },
              ]}
              accessibilityLabel={`Increase ${unit}`}
            >
              <AppIcon name="Plus" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Presets Row */}
          {presets.length > 0 && (
            <View style={styles.presetsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.presetsList}
              >
                {presets.map(p => {
                  const isSelected = p === currentVal;
                  return (
                    <Pressable
                      key={p}
                      onPress={() => handleSelectVal(p)}
                      style={[
                        styles.presetChip,
                        {
                          backgroundColor: isSelected
                            ? colors.primary
                            : colors.inputBg,
                          borderColor: isSelected
                            ? colors.primary
                            : colors.border,
                          borderRadius: radius.full,
                        },
                      ]}
                    >
                      <AppText
                        variant="caption"
                        bold={isSelected}
                        style={{
                          color: isSelected ? colors.white : colors.textPrimary,
                        }}
                      >
                        {p} {unit}
                      </AppText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Scrollable Numbers List */}
          <View
            style={[
              styles.listContainer,
              {
                borderColor: colors.border,
                borderRadius: radius.lg,
                backgroundColor: colors.inputBg,
              },
            ]}
          >
            <FlatList
              ref={flatListRef}
              data={data}
              keyExtractor={item => String(item)}
              showsVerticalScrollIndicator
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              onScrollToIndexFailed={info => {
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                    viewPosition: 0.5,
                  });
                }, 100);
              }}
              renderItem={({ item }) => {
                const isSelected = item === currentVal;
                return (
                  <Pressable
                    onPress={() => handleSelectVal(item)}
                    style={[
                      styles.listItem,
                      {
                        height: ITEM_HEIGHT,
                        backgroundColor: isSelected
                          ? colors.primaryLight
                          : 'transparent',
                        borderRadius: radius.sm,
                      },
                    ]}
                  >
                    <AppText
                      variant="body1"
                      bold={isSelected}
                      color={isSelected ? 'primary' : 'textPrimary'}
                    >
                      {item} {unit}
                    </AppText>
                    {isSelected ? (
                      <AppIcon name="Check" size={18} color={colors.primary} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>

          {/* Bottom Actions */}
          <View style={[styles.footerRow, { gap: spacing.md }]}>
            <AppButton
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={styles.actionButton}
            />
            <AppButton
              title="Done"
              variant="primary"
              onPress={handleConfirm}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  stepperButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  valueDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  presetsContainer: {
    marginBottom: 12,
  },
  presetsList: {
    gap: 8,
    paddingVertical: 2,
  },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  listContainer: {
    height: 200,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  footerRow: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
  },
});

export default memo(ScrollableValuePickerModal);
