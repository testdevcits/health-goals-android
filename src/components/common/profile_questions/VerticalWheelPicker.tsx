import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import AppText from '../AppText';
import { useTheme } from '../../../theme/useTheme';

export interface VerticalWheelPickerProps {
  value: string | number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  badgeText?: string;
  onChange: (value: string) => void;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS; // 220px

export const VerticalWheelPicker: React.FC<VerticalWheelPickerProps> = ({
  value,
  min,
  max,
  step = 1,
  unit,
  badgeText,
  onChange,
}) => {
  const { theme } = useTheme();
  const { colors, fonts } = theme;
  const flatListRef = useRef<FlatList<number>>(null);
  const isUserScrollingRef = useRef(false);

  const numbers = useMemo(() => {
    const list: number[] = [];
    for (let i = min; i <= max; i += step) {
      list.push(i);
    }
    return list;
  }, [min, max, step]);

  const numVal = useMemo(() => {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
      return parsed;
    }
    return Math.round((min + max) / 2);
  }, [value, min, max]);

  // Set default initial value if none provided
  useEffect(() => {
    if (!value || !Number.isFinite(Number(value))) {
      onChange(String(numVal));
    }
  }, [value, numVal, onChange]);

  const initialIndex = useMemo(() => {
    const idx = numbers.indexOf(numVal);
    return idx >= 0 ? idx : Math.floor(numbers.length / 2);
  }, [numbers, numVal]);

  // Initial scroll to position
  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: initialIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [initialIndex]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, numbers.length - 1));
      const selectedNumber = numbers[clampedIndex];
      if (selectedNumber !== undefined) {
        onChange(String(selectedNumber));
      }
      isUserScrollingRef.current = false;
    },
    [numbers, onChange],
  );

  const handleScrollBeginDrag = useCallback(() => {
    isUserScrollingRef.current = true;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: number }) => {
      const isSelected = item === Number(value);
      return (
        <View style={styles.itemWrapper}>
          <AppText
            style={[
              styles.itemText,
              {
                color: isSelected ? colors.primary : colors.textTertiary,
                fontFamily: isSelected ? fonts.bold : fonts.regular,
                fontSize: isSelected ? 30 : 20,
                opacity: isSelected ? 1 : 0.35,
              },
            ]}
          >
            {item}
          </AppText>
        </View>
      );
    },
    [value, colors, fonts],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  // Top and bottom spacer to center the selected item in the middle (slot 3 of 5)
  const paddingVertical = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

  return (
    <View style={styles.container}>
      {/* Left side pill / speech bubble tag if badgeText provided */}
      {Boolean(badgeText) && (
        <View
          style={[
            styles.badgeBubble,
            {
              backgroundColor:
                colors.primaryLight ?? 'rgba(59, 130, 246, 0.12)',
              borderColor: colors.primary,
            },
          ]}
        >
          <AppText
            style={[
              styles.badgeText,
              { color: colors.primary, fontFamily: fonts.medium },
            ]}
          >
            {badgeText}
          </AppText>
          <View
            style={[
              styles.badgeArrow,
              {
                borderLeftColor:
                  colors.primaryLight ?? 'rgba(59, 130, 246, 0.12)',
              },
            ]}
          />
        </View>
      )}

      {/* Vertical Wheel Center Column */}
      <View style={styles.wheelWrapper}>
        {/* Unit label placed to the right of the center row */}
        <View
          pointerEvents="none"
          style={[
            styles.centerHighlight,
            { borderColor: colors.primary + '25' },
          ]}
        >
          <AppText
            style={[
              styles.unitLabel,
              { color: colors.primary, fontFamily: fonts.semiBold },
            ]}
          >
            {unit}
          </AppText>
        </View>

        <FlatList
          ref={flatListRef}
          data={numbers}
          keyExtractor={item => String(item)}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={{
            paddingTop: paddingVertical,
            paddingBottom: paddingVertical,
          }}
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          initialScrollIndex={initialIndex}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  badgeBubble: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 16,
    maxWidth: 130,
    position: 'relative',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  badgeArrow: {
    position: 'absolute',
    right: -7,
    top: '50%',
    marginTop: -6,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  wheelWrapper: {
    height: CONTAINER_HEIGHT,
    width: 140,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHighlight: {
    position: 'absolute',
    top: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 6,
    zIndex: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  unitLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  itemWrapper: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    textAlign: 'center',
  },
});

export default memo(VerticalWheelPicker);
