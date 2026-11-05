import { Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';
import { AppText } from '../../../../components';
import { ArrowRight } from 'lucide-react-native';
import { spacing } from '../../../../theme/spacing';
import { radius } from '../../../../theme/radius';
import { useTheme } from '../../../../theme/useTheme';
import { programs } from '../const';

const RecommandedCard = ({
  openProgram,
  item,
  index,
}: {
  openProgram: (program: any) => void;
  item: any;
  index: number;
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  return (
    <Pressable
      key={item?.title}
      onPress={() => openProgram(programs[index === 0 ? 0 : 3])}
      style={[
        styles.recommendationCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.recommendationAccent,
          { backgroundColor: colors.primary },
        ]}
      />

      <View style={styles.recommendationContent}>
        <View style={styles.recommendationHeading}>
          <AppText variant="subtitle2" bold>
            {item?.emoji} {item?.title}
          </AppText>

          <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
            <AppText variant="caption" style={{ color: colors.primary }} bold>
              {item?.tag}
            </AppText>
          </View>
        </View>

        <AppText variant="caption" secondary>
          {item?.subtitle}
        </AppText>

        <View style={styles.recommendationFooter}>
          <AppText variant="buttonSm" primary>
            Explore
          </AppText>
          <ArrowRight size={16} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
};

export default memo(RecommandedCard);

const styles = StyleSheet.create({
  recommendationCard: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.md,
  },

  recommendationAccent: {
    width: 4,
  },

  recommendationContent: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },

  recommendationHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },

  recommendationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
