import React, { memo } from 'react';
import { View, Pressable } from 'react-native';
import { AppText } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import { DetailTab, DETAIL_TABS } from '../../constants';
import createGroupTabsStyles from './styles.GroupTabs';

interface Props {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
}

export const GroupTabs: React.FC<Props> = memo(({ activeTab, onTabChange }) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const styles = createGroupTabsStyles(colors, spacing, radius);

  return (
    <View style={styles.tabs}>
      {DETAIL_TABS.map(tab => {
        const selected = activeTab === tab;
        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onTabChange(tab)}
            style={[styles.tab, selected && styles.activeTab]}
          >
            <AppText
              variant="label"
              center
              style={{
                color: selected ? colors.textPrimary : colors.textSecondary,
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
});
