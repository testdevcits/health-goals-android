import React, { memo } from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../../../../components';
import {
  challengeCategories,
  type ChallengeCategory,
} from '../useAllChallenges';

interface ChallengeCategoryFilterProps {
  selectedCategory: ChallengeCategory;
  onSelectCategory: (category: ChallengeCategory) => void;
  styles: any;
  colors: any;
}

export const ChallengeCategoryFilter: React.FC<ChallengeCategoryFilterProps> =
  memo(({ selectedCategory, onSelectCategory, styles, colors }) => {
    return (
      <View style={styles.categoryContainer}>
        {challengeCategories.map(category => {
          const isSelected = selectedCategory === category;

          return (
            <Pressable
              key={category}
              onPress={() => onSelectCategory(category)}
              accessibilityRole="tab"
              accessibilityState={{
                selected: isSelected,
              }}
              style={[
                styles.categoryTab,
                isSelected && styles.selectedCategoryTab,
              ]}
            >
              <AppText
                variant="label"
                center
                style={{
                  color: isSelected ? colors.textPrimary : colors.textSecondary,
                }}
                medium={isSelected}
              >
                {category}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    );
  });

export default ChallengeCategoryFilter;
