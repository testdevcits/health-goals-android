import React, { useRef, useState } from 'react';
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
import { TrendMetric, trendData as initialTrendData } from './trendData';
import { DailyActivityTrendsNavigation } from './types';
import { useIsFocused } from '@react-navigation/native';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { getCurrentUser } from '../../../services/profile';
import { apiErrorMessage } from '../../../services/api';
import { showAppToast } from '../../../utils/appToast';
import { istDateKey, recentIstDates } from '../../../utils/healthDates';
import { readStepsHistory } from '../../../services/healthConnect';

const metricTypes = {
  Steps: 'steps',
  Sleep: 'sleep',
  Heart: 'heart_rate',
  Stress: 'stress',
} as const;

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
  const goalValuesRef = useRef(goalValues);
  goalValuesRef.current = goalValues;
  const [goalDraft, setGoalDraft] = useState(goalValues.Steps);
  const [trendData, setTrendData] = useState(initialTrendData);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const data = trendData[activeMetric];
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (!isFocused) return;
    let active = true;
    setLoading(true);
    setLoadError('');
    setHasData(false);
    (async () => {
      try {
        const [recordsResult, goalResult] = await Promise.allSettled([
          activeMetric === 'Steps'
            ? readStepsHistory(7).then(history => ({
                records: history.map(item => ({
                  metricType: 'steps',
                  value: item.value,
                  unit: item.unit,
                  recordedAt: `${item.date}T12:00:00+05:30`,
                })),
              }))
            : activeMetric === 'Stress' ? Promise.reject(new Error('Stress readings are not available from the connected health sources.'))
            : authenticatedRequest<{history:Array<{date:string;value:number;unit:string}>}>(
                'GET', `/health/history?metricType=${metricTypes[activeMetric]}&from=${recentIstDates()[0]}&to=${istDateKey(new Date())}`,
              ).then(result => ({records:result.history.map(row=>({metricType:metricTypes[activeMetric],value:row.value,unit:row.unit,recordedAt:`${row.date}T12:00:00+05:30`}))})),
          getCurrentUser(),
        ]);
        if (!active) return;
        if (goalResult.status === 'fulfilled') {
          const saved =
            goalResult.value.healthGoals?.[metricTypes[activeMetric]];
          if (saved)
            setGoalValues(current => ({
              ...current,
              [activeMetric]: String(
                activeMetric === 'Sleep' ? saved / 60 : saved,
              ),
            }));
        }
        if (recordsResult.status === 'rejected') {
          setLoadError(apiErrorMessage(recordsResult.reason));
          return;
        }
        if (
          recordsResult.status === 'fulfilled' &&
          recordsResult.value.records?.length
        ) {
          const records = [...recordsResult.value.records].sort((a,b)=>Date.parse(a.recordedAt)-Date.parse(b.recordedAt));
          if (records.length) {
            const values = records.map(row => Number(row.value));
            const average = Math.round(
              values.reduce((sum, value) => sum + value, 0) / values.length,
            );
            const total = values.reduce((sum, value) => sum + value, 0);
            const savedGoal =
              goalResult.status === 'fulfilled'
                ? goalResult.value.healthGoals?.[metricTypes[activeMetric]]
                : undefined;
            const goal =
              Number(
                savedGoal ||
                  goalValuesRef.current[activeMetric].replace(/,/g, ''),
              ) * (activeMetric === 'Sleep' && !savedGoal ? 60 : 1);
            const byDate = new Map(records.map(row=>[istDateKey(row.recordedAt),Number(row.value)]));
            const bars = recentIstDates().map(date=>byDate.get(date)||0).map(value=>goal?Math.max(0,Math.min(100,Math.round(value/goal*100))):0);
            const averageLabel =
              activeMetric === 'Sleep'
                ? `${Math.floor(average / 60)}h ${Math.round(average % 60)}m`
                : `${average}${activeMetric === 'Heart' ? ' bpm' : ''}`;
            setTrendData(current => ({
              ...current,
              [activeMetric]: {
                ...current[activeMetric],
                bars,
                stats: activeMetric === 'Steps' ? [
                  {value:total.toLocaleString(),label:'Last 7 days'},
                  {value:String(average),label:'Daily avg'},
                  {value:String(values.filter(value=>value>=10000).length),label:'Days ≥10K'},
                  {value:goal?`${Math.round(values.filter(value=>value>=goal).length/7*100)}%`:'—',label:'Goal met'},
                ] : activeMetric === 'Sleep' ? [
                  {value:averageLabel,label:'Daily avg'},
                  {value:`${(Math.max(...values)/60).toFixed(1)}h`,label:'Longest day'},
                  {value:`${(Math.min(...values)/60).toFixed(1)}h`,label:'Shortest day'},
                  {value:String(records.length),label:'Days synced'},
                ] : [
                  {value:averageLabel,label:'Daily avg'},
                  {value:String(Math.max(...values)),label:'Highest daily avg'},
                  {value:String(Math.min(...values)),label:'Lowest daily avg'},
                  {value:String(records.length),label:'Days synced'},
                ],
                insight: `${
                  records.length
                } synced ${activeMetric.toLowerCase()} daily records in the last 7 days. Your average is ${averageLabel}.`,
              },
            }));
            setHasData(true);
          }
        }
      } catch (error) {
        if (active) setLoadError(apiErrorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    })().catch(error => {
      if (active) {
        setLoadError(apiErrorMessage(error));
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [activeMetric, isFocused, reloadKey]);

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
    const numericGoal = Number(normalizedGoal.replace(/,/g, ''));
    if (!Number.isFinite(numericGoal) || numericGoal <= 0) {
      Alert.alert('Invalid goal', 'Enter a number greater than zero.');
      return;
    }
    const storedTarget =
      activeMetric === 'Sleep' ? Math.round(numericGoal * 60) : numericGoal;
    authenticatedRequest<{ user: { healthGoals?: Record<string, number> } }>(
      'PATCH',
      '/auth/me/goals',
      { metricType: metricTypes[activeMetric], targetValue: storedTarget },
    )
      .then(() => {
        setGoalValues(current => ({
          ...current,
          [activeMetric]: normalizedGoal,
        }));
        setGoalModalVisible(false);
        showAppToast(
          'success',
          'Goal updated',
          'Your daily target has been saved.',
        );
      })
      .catch(error =>
        showAppToast('error', 'Could not save goal', apiErrorMessage(error)),
      );
  };

  return (
    <View style={[styles.screen]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />

      <AppHeader
        title={activeMetric === 'Heart' ? 'Heart Rate' : activeMetric}
        subtitle={'Your last 7 days'}
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
          <AppErrorView
            message={loadError}
            onRefresh={() => setReloadKey(value => value + 1)}
          />
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
