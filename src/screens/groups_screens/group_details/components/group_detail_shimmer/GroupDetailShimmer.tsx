import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { AppShimmer } from '../../../../../components';
import { useTheme } from '../../../../../theme/useTheme';
import { GroupTabs } from '../groups_tab/GroupTabs';
import { DetailTab } from '../../constants';
import { createGroupDetailShimmerStyles } from './styles.GroupDetailShimmer';

interface TabShimmerProps {
  styles: ReturnType<typeof createGroupDetailShimmerStyles>;
}

export const OverviewShimmer: React.FC<TabShimmerProps> = memo(({ styles }) => (
  <>
    {/* 1. Daily Goal Card Skeleton */}
    <AppShimmer>
      <View style={styles.goalCard}>
        <View style={styles.goalRing} />
        <View style={styles.goalContent}>
          <View style={styles.goalLabel} />
          <View style={styles.goalValue} />
          <View style={styles.goalSubtext} />
        </View>
      </View>
    </AppShimmer>

    {/* 2. Active Challenges Section */}
    <AppShimmer>
      <View style={styles.sectionTitle} />
    </AppShimmer>

    <AppShimmer>
      <View style={styles.cardContainer}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.cardIcon} />
            <View style={styles.cardTitle} />
          </View>
          <View style={styles.cardBadge} />
        </View>
        <View style={styles.cardProgressBar} />
        <View style={styles.cardFooterRow}>
          <View style={styles.cardFooterText} />
          <View style={styles.cardFooterBtn} />
        </View>
      </View>
    </AppShimmer>

    {/* 3. Top Contributors Preview */}
    <AppShimmer>
      <View style={styles.sectionTitle} />
    </AppShimmer>

    <AppShimmer>
      <View style={styles.contributorsCard}>
        {[1, 2, 3].map(item => (
          <View key={item} style={styles.memberRow}>
            <View style={styles.memberRowLeft}>
              <View style={styles.memberRank} />
              <View style={styles.memberAvatar} />
              <View style={styles.memberTextCol}>
                <View style={styles.memberName} />
                <View style={styles.memberSubtext} />
              </View>
            </View>
            <View style={styles.memberSteps} />
          </View>
        ))}
      </View>
    </AppShimmer>
  </>
));

export const LeaderboardShimmer: React.FC<TabShimmerProps> = memo(
  ({ styles }) => (
    <>
      {/* 1. Leaderboard Ranking Intro */}
      <AppShimmer>
        <View style={styles.leaderboardIntro} />
      </AppShimmer>

      {/* 2. Section Heading */}
      <AppShimmer>
        <View style={styles.sectionTitle} />
      </AppShimmer>

      {/* 3. Contributors Ranked Card with 5 rows */}
      <AppShimmer>
        <View style={styles.contributorsCard}>
          {[1, 2, 3, 4, 5].map(item => (
            <View key={item} style={styles.memberRow}>
              <View style={styles.memberRowLeft}>
                <View style={styles.memberRank} />
                <View style={styles.memberAvatar} />
                <View style={styles.memberTextCol}>
                  <View style={styles.memberName} />
                  <View style={styles.memberSubtext} />
                </View>
              </View>
              <View style={styles.memberSteps} />
            </View>
          ))}
        </View>
      </AppShimmer>
    </>
  ),
);

export const ChallengesShimmer: React.FC<TabShimmerProps> = memo(
  ({ styles }) => (
    <>
      {/* 1. Challenge Card 1 */}
      <AppShimmer>
        <View style={styles.challengeFullCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardIcon} />
              <View style={styles.cardTitle} />
            </View>
            <View style={styles.cardBadge} />
          </View>
          <View style={styles.challengeDescLine} />
          <View style={styles.challengeDescLine2} />
          <View style={styles.cardProgressBar} />
          <View style={styles.cardFooterRow}>
            <View style={styles.cardFooterText} />
            <View style={styles.cardBadge} />
          </View>
          <View style={styles.challengeFullBtn} />
        </View>
      </AppShimmer>

      {/* 2. Challenge Card 2 */}
      <AppShimmer>
        <View style={styles.challengeFullCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardIcon} />
              <View style={styles.cardTitle} />
            </View>
            <View style={styles.cardBadge} />
          </View>
          <View style={styles.challengeDescLine} />
          <View style={styles.cardProgressBar} />
          <View style={styles.cardFooterRow}>
            <View style={styles.cardFooterText} />
            <View style={styles.cardBadge} />
          </View>
          <View style={styles.challengeFullBtn} />
        </View>
      </AppShimmer>

      {/* 3. New Challenge Button Placeholder */}
      <AppShimmer>
        <View style={styles.newChallengeButton}>
          <View style={styles.newChallengeText} />
        </View>
      </AppShimmer>
    </>
  ),
);

export interface GroupDetailShimmerProps {
  activeTab?: DetailTab;
  onTabChange?: (tab: DetailTab) => void;
}

export const GroupDetailShimmer: React.FC<GroupDetailShimmerProps> = memo(
  ({ activeTab = 'Overview', onTabChange }) => {
    const { theme } = useTheme();
    const { colors, spacing } = theme;
    const styles = useMemo(
      () => createGroupDetailShimmerStyles(colors, spacing),
      [colors, spacing],
    );

    return (
      <View style={styles.container}>
        {/* Top Group Banner Skeleton */}
        <AppShimmer>
          <View style={styles.bannerCard}>
            <View style={styles.bannerIcon} />
            <View style={styles.bannerContent}>
              <View style={styles.bannerTitle} />
              <View style={styles.bannerSubtitle} />
              <View style={styles.avatarStack}>
                <View style={styles.stackAvatar} />
                <View style={styles.stackAvatar} />
                <View style={styles.stackAvatar} />
                <View style={styles.stackAvatar} />
              </View>
            </View>
          </View>
        </AppShimmer>

        {/* Group Tabs (Overview | Leaderboard | Challenges) */}
        <View style={styles.tabsContainer}>
          <GroupTabs
            activeTab={activeTab}
            onTabChange={onTabChange || (() => {})}
          />
        </View>

        {/* Tab-specific Shimmers */}
        {activeTab === 'Overview' && <OverviewShimmer styles={styles} />}
        {activeTab === 'Leaderboard' && <LeaderboardShimmer styles={styles} />}
        {activeTab === 'Challenges' && <ChallengesShimmer styles={styles} />}
      </View>
    );
  },
);

export default GroupDetailShimmer;
