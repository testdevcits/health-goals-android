import React, { memo } from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../../../../components';
import type { AppTheme } from '../../../../theme';
import type { ChallengeTab } from '../data/challengesData';
import type { ChallengesStyles } from '../styles.Challenges';
import { CHALLENGE_TABS } from '../data/challengesData';

interface ChallengeTabsProps {
  activeTab: ChallengeTab;
  onSelectTab: (tab: ChallengeTab) => void;
  styles: ChallengesStyles;
  theme: AppTheme;
}

const ChallengeTabs: React.FC<ChallengeTabsProps> = ({
  activeTab,
  onSelectTab,
  styles,
  theme,
}) => (
  <View style={styles.tabs}>
    {CHALLENGE_TABS.map(tab => {
      const selected = activeTab === tab;

      return (
        <Pressable
          key={tab}
          accessibilityRole="tab"
          accessibilityState={{ selected }}
          onPress={() => onSelectTab(tab)}
          style={[styles.tab, selected && styles.activeTab]}
        >
          <AppText
            variant="label"
            style={{
              color: selected
                ? theme.colors.textPrimary
                : theme.colors.textSecondary,
            }}
            medium={selected}
          >
            {tab}
          </AppText>
        </Pressable>
      );
    })}
  </View>
);

export default memo(ChallengeTabs);
