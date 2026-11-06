import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import {
  AppButton,
  AppEmptyState,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
} from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { createTrendStyles } from './styles.DailyActivityTrends';
import TrendChart from './components/TrendChart';
import TrendInsight from './components/TrendInsight';
import TrendStats from './components/TrendStats';
import TrendTabs from './components/TrendTabs';
import type { DailyActivityTrendsNavigation } from './types';
import useDailyActivityTrends from './useDailyActivityTrends';

const DailyActivityTrends: React.FC<{
  navigation: DailyActivityTrendsNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createTrendStyles(theme);
  const {
    activeMetric,
    setActiveMetric,
    goalModalVisible,
    setGoalModalVisible,
    goalDraft,
    setGoalDraft,
    data,
    loading,
    hasData,
    loadError,
    refresh,
    openGoalEditor,
    saveGoal,
  } = useDailyActivityTrends();

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <AppHeader
        title={activeMetric === 'Heart' ? 'Heart Rate' : activeMetric}
        subtitle="Your last 7 days"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <TrendTabs activeMetric={activeMetric} onSelect={setActiveMetric} />
        {loading ? (
          <AppLoader
            message={`Loading ${activeMetric.toLowerCase()} trends…`}
          />
        ) : loadError ? (
          <AppErrorView message={loadError} onRefresh={refresh} />
        ) : !hasData ? (
          <AppEmptyState
            title={`No ${activeMetric.toLowerCase()} data yet`}
            description="Health records from the last 7 days will appear here after they sync."
          />
        ) : (
          <>
            <TrendChart metric={activeMetric} data={data} />
            <TrendStats metric={activeMetric} stats={data.stats} />
            <TrendInsight text={data.insight} />
          </>
        )}
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
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setGoalModalVisible(false)}
        >
          <Pressable
            style={[
              styles.goalSheet,
              {
                backgroundColor: theme.colors.surface,
                paddingBottom: Math.max(insets.bottom, 24),
              },
            ]}
            onPress={() => {}}
          >
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
                accessibilityLabel="Close goal editor"
              >
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
              ]}
            >
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
