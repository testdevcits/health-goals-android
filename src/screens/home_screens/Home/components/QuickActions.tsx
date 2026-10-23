import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { QUICK_ACTIONS } from '../const';
import { createHomeStyles } from '../styles.Home';

const QuickActions: React.FC = () => {
  const styles = createHomeStyles(useTheme().theme);

  return (
    <>
      <View style={styles.sectionHeader}>
        <AppText variant="h3">Quick Actions</AppText>
      </View>
      <View style={styles.quickActionsRow}>
        {QUICK_ACTIONS.map(action => (
          <TouchableOpacity
            key={action.id}
            activeOpacity={0.85}
            style={styles.quickActionCard}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <View
              style={[
                styles.quickActionIconBox,
                { backgroundColor: action.bg },
              ]}
            >
              <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
            </View>
            <AppText variant="subtitle2" bold center>
              {action.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default QuickActions;
