import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createTrendStyles } from '../styles.DailyActivityTrends';

const TrendInsight: React.FC<{ text: string }> = ({ text }) => {
  const { theme } = useTheme();
  const styles = createTrendStyles(theme);

  return (
    <View
      style={[styles.insightCard, { backgroundColor: theme.colors.surface }]}
    >
      <AppText variant="subtitle2" bold style={styles.insightHeading}>
        💡 Insight
      </AppText>
      <AppText variant="body2" secondary style={styles.insightText}>
        {text}
      </AppText>
    </View>
  );
};

export default TrendInsight;
