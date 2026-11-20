import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/useTheme';

import AppText from '../AppText';
import AppButton from '../AppButton';
import AppIcon from '../../../assets/appicon/AppIcon';
import FitnessAvatar from '../FitnessAvatar';
import { createStyles } from './styles.AestheticRulerPickerModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TICK_SPACING = 14;
const VERTICAL_RULER_HEIGHT = 380;
const VERTICAL_CENTER_Y = VERTICAL_RULER_HEIGHT / 2;
const HORIZONTAL_CENTER_X = SCREEN_WIDTH / 2;

export interface AestheticRulerPickerModalProps {
  visible: boolean;
  mode: 'height' | 'weight';
  value: string;
  min?: number;
  max?: number;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const AestheticRulerPickerModal: React.FC<AestheticRulerPickerModalProps> = ({
  visible,
  mode,
  value,
  min: customMin,
  max: customMax,
  onSelect,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { colors, radius, spacing: themeSpacing } = theme;
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isHeight = mode === 'height';
  const min = customMin ?? (isHeight ? 50 : 30);
  const max = customMax ?? (isHeight ? 250 : 200);
  const unit = isHeight ? 'cm' : 'Kg';
  const title = isHeight ? 'Choose Height' : 'Choose Weight';

  const verticalFlatListRef = useRef<FlatList<number>>(null);
  const horizontalFlatListRef = useRef<FlatList<number>>(null);

  const getDefaultVal = useCallback(() => {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
      return parsed;
    }
    return isHeight ? 170 : 74;
  }, [value, min, max, isHeight]);

  const [currentVal, setCurrentVal] = useState<number>(getDefaultVal);

  // Height ruler data: Top to Bottom (max down to min)
  const heightData = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => max - i),
    [min, max],
  );

  // Weight ruler data: Left to Right (min up to max)
  const weightData = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

  useEffect(() => {
    if (visible) {
      const initial = getDefaultVal();
      setCurrentVal(initial);

      const timer = setTimeout(() => {
        if (isHeight) {
          const offset = (max - initial) * TICK_SPACING;
          verticalFlatListRef.current?.scrollToOffset({
            offset,
            animated: false,
          });
        } else {
          const offset = (initial - min) * TICK_SPACING;
          horizontalFlatListRef.current?.scrollToOffset({
            offset,
            animated: false,
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [visible, isHeight, min, max, getDefaultVal]);

  const handleVerticalScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const computed = max - Math.round(y / TICK_SPACING);
    const clamped = Math.max(min, Math.min(max, computed));
    if (clamped !== currentVal) {
      setCurrentVal(clamped);
    }
  };

  const handleHorizontalScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const x = e.nativeEvent.contentOffset.x;
    const computed = min + Math.round(x / TICK_SPACING);
    const clamped = Math.max(min, Math.min(max, computed));
    if (clamped !== currentVal) {
      setCurrentVal(clamped);
    }
  };

  const handleConfirm = () => {
    onSelect(String(currentVal));
    onClose();
  };

  const renderVerticalTick = ({ item }: { item: number }) => {
    const isMajor = item % 10 === 0;
    const isMid = item % 5 === 0 && !isMajor;
    const isSelected = item === currentVal;

    return (
      <View style={[styles.verticalTickRow, { height: TICK_SPACING }]}>
        <View
          style={[
            styles.verticalTickLine,
            {
              width: isMajor ? 32 : isMid ? 22 : 12,
              backgroundColor: isSelected
                ? colors.error
                : isMajor
                ? colors.textPrimary
                : colors.border,
              height: isMajor ? 2 : 1.5,
            },
          ]}
        />
        {isMajor ? (
          <AppText
            variant="caption"
            bold={isSelected}
            style={[
              styles.verticalTickLabel,
              {
                color: isSelected ? colors.error : colors.textSecondary,
              },
            ]}
          >
            {item}
          </AppText>
        ) : null}
      </View>
    );
  };

  const renderHorizontalTick = ({ item }: { item: number }) => {
    const isMajor = item % 5 === 0;
    const isSelected = item === currentVal;

    return (
      <View style={[styles.horizontalTickCol, { width: TICK_SPACING }]}>
        <View
          style={[
            styles.horizontalTickLine,
            {
              height: isMajor ? 28 : 14,
              backgroundColor: isSelected
                ? colors.error
                : isMajor
                ? colors.textPrimary
                : colors.border,
              width: isMajor ? 2 : 1.5,
            },
          ]}
        />
        {isMajor ? (
          <AppText
            variant="caption"
            bold={isSelected}
            style={[
              styles.horizontalTickLabel,
              {
                color: isSelected ? colors.error : colors.textSecondary,
              },
            ]}
          >
            {item}
          </AppText>
        ) : null}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        {/* Top Navigation Bar */}
        <View style={styles.navBar}>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={styles.backButton}
            accessibilityLabel="Close"
          >
            <AppIcon name="ArrowLeft" size={22} color={colors.textPrimary} />
          </Pressable>

          <AppText variant="h3" bold style={styles.navTitle}>
            {title}
          </AppText>

          <View style={{ width: 36 }} />
        </View>

        {/* Subtle Decorative Progress Line */}
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: isHeight ? '40%' : '75%',
              },
            ]}
          />
        </View>

        {/* Content Area */}
        {isHeight ? (
          /* ================= HEIGHT SCREEN ================= */
          <View style={styles.heightContentRow}>
            {/* Left: Value & Avatar */}
            <View style={styles.heightLeftCol}>
              <View style={styles.heightValueBox}>
                <AppText variant="h1" bold color="textPrimary">
                  {currentVal}{' '}
                  <AppText variant="h3" secondary>
                    {unit}
                  </AppText>
                </AppText>
              </View>

              {/* Dashed Indicator Line pointing to ruler */}
              <View style={styles.dashedLine} />

              {/* Character Avatar */}
              <View style={styles.avatarWrap}>
                <FitnessAvatar height={250} width={135} />
              </View>
            </View>

            {/* Right: Vertical Ruler */}
            <View style={styles.heightRulerWrap}>
              {/* Red Pointer Indicator (Fixed at vertical center) */}
              <View
                style={[
                  styles.redPointerHorizontal,
                  { top: VERTICAL_CENTER_Y - 1 },
                ]}
                pointerEvents="none"
              >
                <View style={styles.redDot} />
                <View style={styles.redLineHorizontal} />
              </View>

              <FlatList
                ref={verticalFlatListRef}
                data={heightData}
                keyExtractor={item => String(item)}
                renderItem={renderVerticalTick}
                showsVerticalScrollIndicator={false}
                snapToInterval={TICK_SPACING}
                decelerationRate="fast"
                onScroll={handleVerticalScroll}
                scrollEventThrottle={16}
                getItemLayout={(_, index) => ({
                  length: TICK_SPACING,
                  offset: TICK_SPACING * index,
                  index,
                })}
                contentContainerStyle={{
                  paddingTop: VERTICAL_CENTER_Y,
                  paddingBottom: VERTICAL_CENTER_Y,
                }}
              />
            </View>
          </View>
        ) : (
          /* ================= WEIGHT SCREEN ================= */
          <View style={styles.weightContentCol}>
            {/* Top: Avatar */}
            <View style={styles.weightAvatarWrap}>
              <FitnessAvatar height={260} width={140} />
            </View>

            {/* Middle: Horizontal Ruler */}
            <View style={styles.weightRulerWrap}>
              {/* Red Pointer Indicator (Fixed at horizontal center) */}
              <View
                style={[
                  styles.redPointerVertical,
                  { left: HORIZONTAL_CENTER_X - 6 },
                ]}
                pointerEvents="none"
              >
                <View style={styles.redLineVertical} />
                <View style={styles.redDot} />
              </View>

              <FlatList
                ref={horizontalFlatListRef}
                data={weightData}
                horizontal
                keyExtractor={item => String(item)}
                renderItem={renderHorizontalTick}
                showsHorizontalScrollIndicator={false}
                snapToInterval={TICK_SPACING}
                decelerationRate="fast"
                onScroll={handleHorizontalScroll}
                scrollEventThrottle={16}
                getItemLayout={(_, index) => ({
                  length: TICK_SPACING,
                  offset: TICK_SPACING * index,
                  index,
                })}
                contentContainerStyle={{
                  paddingHorizontal: HORIZONTAL_CENTER_X - TICK_SPACING / 2,
                }}
              />
            </View>

            {/* Bottom: Big Weight Display */}
            <View style={styles.weightValueBox}>
              <AppText variant="h1" bold color="textPrimary">
                {currentVal}{' '}
                <AppText variant="h3" secondary>
                  {unit}
                </AppText>
              </AppText>
            </View>
          </View>
        )}

        {/* Continue Button */}
        <View
          style={[styles.bottomBar, { paddingHorizontal: themeSpacing.lg }]}
        >
          <AppButton
            title="Continue"
            variant="primary"
            onPress={handleConfirm}
            style={[styles.continueButton, { borderRadius: radius.full }]}
          />
        </View>
      </View>
    </Modal>
  );
};
export default memo(AestheticRulerPickerModal);
