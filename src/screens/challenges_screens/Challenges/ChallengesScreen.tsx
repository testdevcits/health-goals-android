import React, { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AppEmptyState,
  AppErrorView,
  AppHeader,
  AppLoader,
  AppText,
} from '../../../components';
import type { ChallengesStackParamList } from '../../../navigations/ChallengesStack';
import { useTheme } from '../../../theme/useTheme';
import ChallengeTabs from './components/ChallengeTabs';
import BadgesTab from './tabs/BadgesTab';
import ChallengesTab from './tabs/ChallengesTab';
import createStyles from './styles.Challenges';
import useChallenges from './useChallenges';

type Props = NativeStackScreenProps<ChallengesStackParamList, 'Challenges'>;

const ChallengesScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    activeTab,
    setActiveTab,
    challenges,
    ruleChallenges,
    badges,
    competitions,
    loading,
    loadError,
    walletPoints,
    unreadNotifications,
    refresh,
    joinChallenge,
  } = useChallenges();
  const visibleChallenges = useMemo(
    () => [...challenges, ...ruleChallenges],
    [challenges, ruleChallenges],
  );
  const browseAllChallenges = useCallback(
    () => navigation.navigate('AllChallenges'),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Challenges & Leaderboard"
        subtitle="Compete, earn badges, stay motivated"
        isBack={false}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: theme.spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ChallengeTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          styles={styles}
          theme={theme}
        />

        <View style={styles.competitionEntry}>
          <AppText variant="caption" secondary>
            Available points:{' '}
            {walletPoints === null ? '—' : walletPoints.toLocaleString()}
            {unreadNotifications > 0
              ? ` · ${unreadNotifications} unread notifications`
              : ''}
          </AppText>
        </View>

        <View style={styles.content}>
          {loading ? (
            <AppLoader message="Loading your challenges and badges…" />
          ) : loadError ? (
            <AppErrorView
              message={loadError}
              onRefresh={() => {
                refresh();
              }}
            />
          ) : null}
          {!loading && !loadError && activeTab === 'Leaderboard' ? (
            <View>
              {competitions.length === 0 ? (
                <AppEmptyState
                  title="No competitions yet"
                  description="Active leaderboards and rule competitions will appear here when available."
                />
              ) : (
                competitions.map(competition => (
                  <View key={competition.id} style={styles.competitionCard}>
                    <AppText variant="subtitle1" bold>
                      {competition.title}
                    </AppText>
                    <AppText variant="caption" secondary>
                      {competition.audience.toLowerCase()}{' '}
                      {competition.ruleType.toLowerCase().replace(/_/g, ' ')} ·{' '}
                      {competition.metric.replace(/_/g, ' ')} · target{' '}
                      {competition.targetValue.toLocaleString()} ·{' '}
                      {Date.parse(competition.start) > Date.now()
                        ? 'UPCOMING'
                        : competition.status}
                    </AppText>
                    <AppText variant="caption" secondary>
                      {new Date(competition.start).toLocaleDateString()} –{' '}
                      {new Date(competition.end).toLocaleDateString()}
                    </AppText>
                    {(competition.myProgress || []).map((entry, index) => (
                      <View
                        key={`${entry.id}:${index}`}
                        style={styles.competitionEntry}
                      >
                        <AppText variant="body2" bold>
                          {entry.name}
                          {entry.rank > 0 ? `: #${entry.rank}` : ''} ·{' '}
                          {entry.value.toLocaleString()}
                        </AppText>
                        <AppText variant="caption" secondary>
                          {Math.round(entry.progress)}% progress
                          {entry.achieved ? ' · target reached' : ''}
                        </AppText>
                      </View>
                    ))}
                    {(competition.leaderboard || []).map(entry => (
                      <View key={entry.id} style={styles.competitionEntry}>
                        <AppText variant="body2">
                          {entry.rank}. {entry.name}
                        </AppText>
                        <AppText variant="caption" secondary>
                          {entry.value.toLocaleString()} ·{' '}
                          {Math.round(entry.progress)}%
                        </AppText>
                      </View>
                    ))}
                  </View>
                ))
              )}
            </View>
          ) : null}
          {!loading && !loadError && activeTab === 'Challenges' ? (
            challenges.length || ruleChallenges.length ? (
              <ChallengesTab
                challenges={visibleChallenges}
                onJoin={joinChallenge}
                onBrowseAll={browseAllChallenges}
                styles={styles}
              />
            ) : (
              <AppEmptyState
                title="No challenges yet"
                description="Challenges will appear here when they are available."
              />
            )
          ) : null}
          {!loading && !loadError && activeTab === 'Badges' ? (
            badges.length ? (
              <BadgesTab badges={badges} styles={styles} />
            ) : (
              <AppEmptyState
                title="No badges yet"
                description="Complete activities and challenges to earn badges."
              />
            )
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default ChallengesScreen;
