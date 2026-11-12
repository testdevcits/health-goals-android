import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AppHeader } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import { localDateKey } from '../../../utils/healthDates';
import { ProfileScreenNavigation } from '../components/ProfileScreenLayout';
import createStyles from './styles.HealthReport';
import useHealthReports from './useHealthReports';
import {
  ActivityRewardsCard,
  HealthAllTimeSummaryCard,
  MetricReportCard,
  ReportDatePickerModal,
  SyncedRecordsCard,
} from './components';

const calendarStringToDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
};

const HealthReportsScreen: React.FC<{
  navigation: ProfileScreenNavigation;
}> = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = createStyles(colors);
  const {
    activeTab,
    setActiveTab,
    history,
    loading,
    error,
    refresh,
    dailyCoins,
    activityRecords,
    activityRecordsLoading,
    activityRecordsLoadingMore,
    activityRecordsError,
    hasMoreActivityRecords,
    loadMoreActivityRecords,
    healthSummary,
    healthSummaryLoading,
    healthSummaryError,
    from,
    to,
    setFrom,
    setTo,
    shareReport,
    totalCoins,
  } = useHealthReports();

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const [selectingEnd, setSelectingEnd] = useState(false);

  const openDatePicker = () => {
    setDraftFrom(localDateKey(from));
    setDraftTo(localDateKey(to));
    setSelectingEnd(false);
    setDatePickerVisible(true);
  };

  const markedDates: Record<
    string,
    {
      startingDay?: boolean;
      endingDay?: boolean;
      color?: string;
      textColor?: string;
      selected?: boolean;
      selectedColor?: string;
    }
  > = {};

  if (draftFrom && draftTo) {
    const cursor = new Date(`${draftFrom}T00:00:00.000Z`);
    const lastDate = new Date(`${draftTo}T00:00:00.000Z`);
    while (cursor <= lastDate) {
      const dateString = cursor.toISOString().slice(0, 10);
      markedDates[dateString] = {
        startingDay: dateString === draftFrom,
        endingDay: dateString === draftTo,
        color: colors.primaryLight,
        textColor: colors.textPrimary,
      };
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    markedDates[draftFrom] = {
      ...markedDates[draftFrom],
      startingDay: true,
      selected: true,
      selectedColor: colors.primary,
      textColor: colors.white,
    };
    markedDates[draftTo] = {
      ...markedDates[draftTo],
      endingDay: true,
      selected: true,
      selectedColor: colors.primary,
      textColor: colors.white,
    };
  } else if (draftFrom) {
    markedDates[draftFrom] = {
      selected: true,
      selectedColor: colors.primary,
      textColor: colors.white,
    };
  }

  const handleApplyDateRange = () => {
    if (!draftFrom || !draftTo) return;
    setFrom(calendarStringToDate(draftFrom));
    setTo(calendarStringToDate(draftTo));
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Health Reports"
        subtitle="Your weekly and monthly summaries"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >
        <MetricReportCard
          from={from}
          to={to}
          openDatePicker={openDatePicker}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loading={loading}
          error={error}
          refresh={refresh}
          history={history}
          totalCoins={totalCoins}
          shareReport={shareReport}
        />

        <HealthAllTimeSummaryCard
          activeTab={activeTab}
          loading={healthSummaryLoading}
          error={healthSummaryError}
          refresh={refresh}
          healthSummary={healthSummary}
        />

        <SyncedRecordsCard
          activeTab={activeTab}
          activityRecords={activityRecords}
          loading={activityRecordsLoading}
          loadingMore={activityRecordsLoadingMore}
          error={activityRecordsError}
          hasMore={hasMoreActivityRecords}
          loadMore={loadMoreActivityRecords}
          refresh={refresh}
        />

        <ActivityRewardsCard
          from={from}
          to={to}
          loading={loading}
          error={error}
          refresh={refresh}
          dailyCoins={dailyCoins}
          totalCoins={totalCoins}
          shareReport={shareReport}
        />
      </ScrollView>

      <ReportDatePickerModal
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        draftFrom={draftFrom}
        setDraftFrom={setDraftFrom}
        draftTo={draftTo}
        setDraftTo={setDraftTo}
        selectingEnd={selectingEnd}
        setSelectingEnd={setSelectingEnd}
        markedDates={markedDates}
        onApply={handleApplyDateRange}
        currentDate={draftFrom || localDateKey(to)}
      />
    </View>
  );
};

export default HealthReportsScreen;
