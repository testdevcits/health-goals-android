import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { AppText, SectionHeader } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { createHomeStyles } from '../styles.Home';

const DailySummary: React.FC<{ onViewDetails: () => void }> = ({
  onViewDetails,
}) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);

  return (
    <>
      <SectionHeader
        sectionTitle="Today's Summary"
        rightText="View Details"
        onRightPress={onViewDetails}
      />
      <TouchableOpacity
        onPress={onViewDetails}
        activeOpacity={0.85}
        style={styles.summaryCard}
        accessibilityRole="button"
        accessibilityLabel="Daily activity: 2,038 steps and 21 active minutes"
      >
        <View style={styles.summaryIconBox}>
          <Text style={styles.summaryEmoji}>❤️</Text>
        </View>
        <View style={styles.summaryText}>
          <AppText variant="subtitle2" bold mb={2}>
            Daily Activity
          </AppText>
          <AppText variant="caption" secondary>
            2,038 steps · 21 active mins
          </AppText>
        </View>
        <ChevronRight size={18} color={theme.colors.textTertiary} />
      </TouchableOpacity>
    </>
  );
};

export default DailySummary;
