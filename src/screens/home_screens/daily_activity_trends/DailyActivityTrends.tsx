import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { AppButton, AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { createTrendStyles } from './styles.DailyActivityTrends';
import TrendChart from './components/TrendChart';
import TrendHeader from './components/TrendHeader';
import TrendInsight from './components/TrendInsight';
import TrendStats from './components/TrendStats';
import TrendTabs from './components/TrendTabs';
import { TrendMetric, trendData } from './trendData';
import { DailyActivityTrendsNavigation } from './types';

const DailyActivityTrends: React.FC<{
  navigation: DailyActivityTrendsNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createTrendStyles(theme);
  const [activeMetric, setActiveMetric] = useState<TrendMetric>('Steps');
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalValues, setGoalValues] = useState<Record<TrendMetric, string>>({
    Steps: '10,000',
    Sleep: '8',
    Heart: '60',
    Stress: '3',
  });
  const [goalDraft, setGoalDraft] = useState(goalValues.Steps);
  const data = trendData[activeMetric];

  const openGoalEditor = () => {
    setGoalDraft(goalValues[activeMetric]);
    setGoalModalVisible(true);
  };

  const saveGoal = () => {
    const normalizedGoal = goalDraft.trim();
    if (!normalizedGoal || !/\d/.test(normalizedGoal)) {
      Alert.alert('Invalid goal', 'Enter a goal that includes a number.');
      return;
    }
    setGoalValues(current => ({ ...current, [activeMetric]: normalizedGoal }));
    setGoalModalVisible(false);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <TrendHeader
        metric={activeMetric}
        onBack={navigation.goBack}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}>
        <TrendTabs
          activeMetric={activeMetric}
          onSelect={setActiveMetric}
        />
        <TrendChart metric={activeMetric} data={data} />
        <TrendStats metric={activeMetric} stats={data.stats} />
        <TrendInsight text={data.insight} />
        <AppButton
          title="Adjust Goal"
          onPress={openGoalEditor}
          style={styles.adjustButton}
        />
      </ScrollView>
      <Modal
        visible={goalModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setGoalModalVisible(false)}>
        <Pressable
          style={styles.backdrop}
          onPress={() => setGoalModalVisible(false)}>
          <Pressable
            style={[
              styles.goalSheet,
              {
                backgroundColor: theme.colors.surface,
                paddingBottom: Math.max(insets.bottom, 24),
              },
            ]}
            onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <AppText variant="subtitle1" bold>
                Adjust {activeMetric} Goal
              </AppText>
              <Pressable
                onPress={() => setGoalModalVisible(false)}
                style={[
                  styles.closeButton,
                  { backgroundColor: theme.colors.backgroundSecondary },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Close goal editor">
                <X size={18} color={theme.colors.textSecondary} />
              </Pressable>
            </View>
            <AppText variant="caption" secondary style={styles.goalHelp}>
              Set a daily target that feels right for you.
            </AppText>
            <View
              style={[
                styles.goalInputWrap,
                {
                  backgroundColor: theme.colors.inputBg,
                  borderColor: theme.colors.inputBorder,
                },
              ]}>
              <TextInput
                value={goalDraft}
                onChangeText={setGoalDraft}
                keyboardType="decimal-pad"
                selectTextOnFocus
                style={[
                  styles.goalInput,
                  {
                    color: theme.colors.textPrimary,
                    fontFamily: theme.fonts.medium,
                  },
                ]}
                accessibilityLabel={`${activeMetric} goal`}
              />
              <AppText variant="body2" secondary>
                {data.goalUnit}
              </AppText>
            </View>
            <AppButton
              title="Save Goal"
              onPress={saveGoal}
              style={styles.saveButton}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DailyActivityTrends;
