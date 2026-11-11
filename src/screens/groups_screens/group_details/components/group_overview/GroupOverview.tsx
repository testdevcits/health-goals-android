import React, { memo } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { AppText } from '../../../../../components';
import { Member, GroupChallenge, formatSteps } from '../../constants';
import { useTheme } from '../../../../../theme/useTheme';
import createGroupOverviewStyles from './styles.GroupOverview';

interface Props {
  members: Member[];
  challenges: GroupChallenge[];
  onNewChallenge: () => void;
  isLeader: boolean;
  onArchiveGroup: () => void;
}

const GoalCard: React.FC<{ styles: any; members: Member[] }> = memo(
  ({ styles, members }) => {
    const total = members.reduce((sum, member) => sum + member.steps, 0);
    const target = members.length * 10000;
    const percent = target
      ? Math.min(100, Math.round((total / target) * 100))
      : 0;
    return (
      <View style={styles.goalCard}>
        <View style={styles.goalRing}>
          <View style={styles.goalRingInner}>
            <AppText variant="h3" center>
              {percent}%
            </AppText>
            <AppText variant="caption" secondary center>
              OF GOAL
            </AppText>
          </View>
        </View>
        <View style={styles.goalInfo}>
          <AppText variant="caption" secondary>
            WEEKLY GROUP GOAL
          </AppText>
          <View style={styles.goalNumbers}>
            <AppText variant="h2">{formatSteps(total)}</AppText>
            <AppText variant="caption" secondary>
              {` / ${formatSteps(target)} steps`}
            </AppText>
          </View>
          <AppText variant="caption" success bold>
            {members.length
              ? `${members.length} members · last 7 days`
              : 'No synced steps this week'}
          </AppText>
        </View>
      </View>
    );
  },
);

const WeeklyChart: React.FC<{ styles: any; members: Member[] }> = memo(
  ({ styles, members }) => {
    const topMembers = [...members]
      .sort((first, second) => second.steps - first.steps)
      .slice(0, 7);
    const maxSteps = Math.max(...topMembers.map(member => member.steps), 0);
    const axisValues = [maxSteps, Math.round(maxSteps / 2), 0];
    const compactSteps = (steps: number) =>
      steps >= 1000 ? `${(steps / 1000).toFixed(1)}k` : String(steps);

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <AppText variant="subtitle1">Member steps</AppText>
          <View style={styles.weekBadge}>
            <AppText variant="caption" primary bold>
              Last 7 days
            </AppText>
          </View>
        </View>
        <View style={styles.chartCard}>
          {topMembers.length ? (
            <>
              <AppText variant="caption" secondary style={styles.chartCaption}>
                Steps by member · top {topMembers.length}
              </AppText>
              <View style={styles.chartBody}>
                <View style={styles.chartYAxis}>
                  {axisValues.map((value, index) => (
                    <AppText key={`${value}-${index}`} variant="caption" secondary>
                      {compactSteps(value)}
                    </AppText>
                  ))}
                </View>
                <View style={styles.chartPlot}>
                  <View style={[styles.chartGridLine, { top: '12%' }]} />
                  <View style={[styles.chartGridLine, { top: '56%' }]} />
                  <View style={[styles.chartGridLine, { bottom: 0 }]} />
                  <View style={styles.chartBars}>
                    {topMembers.map(member => {
                      const barHeight = maxSteps
                        ? Math.max(3, (member.steps / maxSteps) * 100)
                        : 0;
                      return (
                        <View
                          key={member.id}
                          accessibilityRole="image"
                          accessibilityLabel={`${member.name}: ${formatSteps(member.steps)} steps in the last 7 days`}
                          style={styles.chartColumn}
                        >
                          <AppText
                            variant="caption"
                            primary
                            bold
                            center
                            numberOfLines={1}
                            style={[
                              styles.chartValue,
                              { bottom: `${barHeight}%` },
                            ]}
                          >
                            {compactSteps(member.steps)}
                          </AppText>
                          <View
                            style={[
                              styles.chartBar,
                              {
                                height: `${barHeight}%` as any,
                                backgroundColor: member.color,
                              },
                            ]}
                          />
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
              <View style={styles.chartLabels}>
                <View style={styles.chartAxisSpacer} />
                {topMembers.map(member => (
                  <AppText
                    key={member.id}
                    variant="caption"
                    secondary
                    center
                    numberOfLines={1}
                    style={styles.chartMemberLabel}
                  >
                    {member.name.split(/\s+/)[0]}
                  </AppText>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.chartEmpty}>
              <AppText variant="body2" secondary center>
                Member step totals will appear here after activity syncs.
              </AppText>
            </View>
          )}
        </View>
      </View>
    );
  },
);

const MemberRow: React.FC<{
  member: Member;
  index: number;
  colors: any;
  styles: any;
}> = memo(({ member, index, colors, styles }) => {
  const isCurrentUser = false;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        Alert.alert(
          member.name,
          `${formatSteps(member.steps)} steps · ${
            member.streak
          } active days this week`,
        )
      }
      style={[styles.memberRow, isCurrentUser && styles.currentMemberRow]}
    >
      <View
        style={[
          styles.rankBadge,
          index === 0 && styles.firstRankBadge,
          index === 2 && styles.thirdRankBadge,
        ]}
      >
        <AppText
          variant="caption"
          style={{
            color:
              index === 0
                ? colors.warning
                : index === 2
                ? colors.coral
                : colors.textSecondary,
          }}
          bold
        >
          {index + 1}
        </AppText>
      </View>

      <View style={[styles.memberAvatar, { backgroundColor: member.color }]}>
        <AppText variant="subtitle2" color="white" bold>
          {member.initials}
        </AppText>
      </View>

      <View style={styles.memberInfo}>
        <AppText variant="label" numberOfLines={1}>
          {member.name}
        </AppText>
        <AppText variant="caption" secondary>
          {member.streak} active days this week
        </AppText>
      </View>

      <View style={styles.memberSteps}>
        <AppText variant="label" bold right>
          {formatSteps(member.steps)}
        </AppText>
        <AppText variant="caption" secondary right>
          steps
        </AppText>
      </View>
    </Pressable>
  );
});

const ChallengeCard: React.FC<{ challenge: GroupChallenge; styles: any }> =
  memo(({ challenge, styles }) => (
    <View style={[styles.challengeCard, { borderLeftColor: challenge.color }]}>
      <View style={styles.challengeHeading}>
        <View style={styles.challengeTitleRow}>
          <AppText style={styles.challengeEmoji}>🔥</AppText>
          <AppText variant="subtitle2" style={styles.challengeTitle}>
            {challenge.title}
          </AppText>
        </View>
        <View style={styles.challengeStatus}>
          <AppText variant="caption" style={{ color: challenge.color }}>
            {challenge.status}
          </AppText>
        </View>
      </View>

      <AppText variant="body2" secondary style={styles.challengeDescription}>
        {challenge.description}
      </AppText>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${challenge.progress}%` as any,
              backgroundColor: challenge.color,
            },
          ]}
        />
      </View>

      <View style={styles.challengeFooter}>
        <AppText variant="caption" secondary>
          {challenge.progressLabel}
        </AppText>
        <AppText variant="caption" style={{ color: challenge.color }} bold>
          {challenge.progress}%
        </AppText>
      </View>
    </View>
  ));

export const GroupOverview: React.FC<Props> = memo(
  ({ members, challenges, onNewChallenge, isLeader, onArchiveGroup }) => {
    const { theme } = useTheme();
    const { colors, spacing, radius } = theme;
    const styles = createGroupOverviewStyles(colors, spacing, radius);

    return (
      <>
        <GoalCard styles={styles} members={members} />

        <WeeklyChart styles={styles} members={members} />

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <AppText variant="subtitle1">Top Contributors</AppText>
          </View>
          <View style={styles.contributorsCard}>
            {members.slice(0, 3).map((m, i) => (
              <MemberRow
                key={m.id}
                member={m}
                index={i}
                colors={colors}
                styles={styles}
              />
            ))}
          </View>
          <AppText variant="caption" secondary center mt={spacing.sm}>
            View the leaderboard to see all members
          </AppText>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <AppText variant="subtitle1">Challenges</AppText>
          </View>
          {challenges.map(c => (
            <ChallengeCard key={c.id} challenge={c} styles={styles} />
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={onNewChallenge}
            style={styles.newChallengeButton}
          >
            <AppText variant="buttonSm" primary>
              + New Challenge
            </AppText>
          </Pressable>
        </View>

        {isLeader ? (
          <View style={styles.section}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Archive group"
              onPress={onArchiveGroup}
              style={styles.archiveGroupButton}
            >
              <AppText variant="label" error bold>
                Archive group
              </AppText>
              <AppText variant="caption" secondary center>
                This group will be removed from active groups and cannot be restored in the app.
              </AppText>
            </Pressable>
          </View>
        ) : null}
      </>
    );
  },
);

export { MemberRow };
