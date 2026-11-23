import React from 'react';
import { Image, Text, View } from 'react-native';
import AppIcon from '../../../../assets/appicon/AppIcon';
import { AppEmptyState, ProfileCard } from '../../../../components';
import { AppColors } from '../../../../theme/colors';
import { useTheme } from '../../../../theme/useTheme';
import { ProfileSectionLabel } from '../../components/ProfileScreenLayout';
import createStyles from '../styles.Rewards';

export interface TicketClaimItem {
  id?: string;
  month: string;
  audience?: string;
  winnerId?: string;
  winnerName?: string;
  recipientName?: string;
  recipientEmail?: string;
  rank?: number;
  steps?: number;
  groupName?: string;
  status: string;
  stepTotal?: number;
  ticketDate?: string | null;
  ticketNumber?: string;
  ticketCount?: number;
  bookingReference?: string;
  delivery?: string | null;
  ticketImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface LeaderboardTicketSectionProps {
  ticketClaims: TicketClaimItem[];
}

const formatMonth = (monthStr?: string): string => {
  if (!monthStr) return '';
  const parts = monthStr.split('-');
  if (parts.length === 2) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${months[monthIndex]} ${year}`;
    }
  }
  return monthStr;
};

const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const getRankBadge = (rank?: number, colors?: AppColors) => {
  if (rank === 1) {
    return {
      label: 'Rank #1 Winner',
      emoji: '🥇',
      bg: colors?.warningLight ?? '#FFFBEB',
      color: colors?.warning ?? '#F59E0B',
      border: colors?.warning ?? '#F59E0B',
    };
  }
  if (rank === 2) {
    return {
      label: 'Rank #2 Finalist',
      emoji: '🥈',
      bg: colors?.backgroundSecondary ?? '#F1F5F9',
      color: colors?.textSecondary ?? '#64748B',
      border: colors?.border ?? '#E2E8F0',
    };
  }
  if (rank === 3) {
    return {
      label: 'Rank #3 Finalist',
      emoji: '🥉',
      bg: colors?.coralLight ?? '#FFE9E5',
      color: colors?.coral ?? '#FF8278',
      border: colors?.coral ?? '#FF8278',
    };
  }
  return {
    label: rank ? `Rank #${rank}` : 'Winner',
    emoji: '🏆',
    bg: colors?.primaryLight ?? '#E0FAF5',
    color: colors?.primaryDark ?? '#009E82',
    border: colors?.primary ?? '#00C6A2',
  };
};

const getStatusBadge = (status?: string, colors?: AppColors) => {
  const norm = (status || '').toUpperCase();
  if (norm === 'CONSENT_PENDING') {
    return {
      label: 'Consent Pending',
      icon: 'Clock' as const,
      bg: colors?.warningLight ?? '#FFFBEB',
      color: colors?.warning ?? '#F59E0B',
    };
  }
  if (norm === 'SENT' || norm === 'DELIVERED' || norm === 'ISSUED') {
    return {
      label: norm === 'DELIVERED' ? 'Ticket Delivered' : 'Ticket Issued',
      icon: 'CheckCircle' as const,
      bg: colors?.successLight ?? '#ECFDF5',
      color: colors?.success ?? '#10B981',
    };
  }
  if (norm === 'CLAIMED') {
    return {
      label: 'Claimed',
      icon: 'Check' as const,
      bg: colors?.primaryLight ?? '#E0FAF5',
      color: colors?.primary ?? '#00C6A2',
    };
  }
  return {
    label: status ? status.replace(/_/g, ' ') : 'Pending',
    icon: 'Info' as const,
    bg: colors?.infoLight ?? '#EFF6FF',
    color: colors?.info ?? '#3B82F6',
  };
};

export const LeaderboardTicketSection: React.FC<
  LeaderboardTicketSectionProps
> = ({ ticketClaims }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);
  const { colors } = theme;

  return (
    <>
      <ProfileSectionLabel>Leaderboard Ticket Rewards</ProfileSectionLabel>
      <View style={styles.rewardList}>
        {ticketClaims.length === 0 ? (
          <AppEmptyState
            title="No ticket rewards yet"
            description="Leaderboard ticket rewards will appear here if you qualify."
          />
        ) : (
          ticketClaims.map((claim, index) => {
            const rankConfig = getRankBadge(claim?.rank, colors);
            const statusConfig = getStatusBadge(claim?.status, colors);
            const formattedMonth = formatMonth(claim?.month);
            const isIssued =
              claim?.status === 'SENT' ||
              claim?.status === 'DELIVERED' ||
              Boolean(claim?.ticketImage) ||
              Boolean(claim?.ticketNumber);
            const stepsCount = claim?.steps ?? claim?.stepTotal ?? 0;
            const ticketCount = claim?.ticketCount ?? 1;

            return (
              <ProfileCard
                key={claim?.id || `${claim?.month}:${index}`}
                style={styles.ticketCardWrapper}
              >
                <View style={styles.ticketCard}>
                  {/* Top Bar: Rank & Month on left, Status chip on right */}
                  <View style={styles.ticketTopRow}>
                    <View style={styles.ticketTopBadges}>
                      <View
                        style={[
                          styles.ticketRankBadge,
                          {
                            backgroundColor: rankConfig.bg,
                            borderColor: rankConfig.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.ticketRankText,
                            { color: rankConfig.color },
                          ]}
                        >
                          {rankConfig.emoji} {rankConfig.label}
                        </Text>
                      </View>
                      {formattedMonth ? (
                        <View style={styles.ticketMonthBadge}>
                          <AppIcon
                            name="Calendar"
                            size={12}
                            color={colors.textSecondary}
                          />
                          <Text style={styles.ticketMonthText}>
                            {formattedMonth}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <View
                      style={[
                        styles.ticketStatusBadge,
                        { backgroundColor: statusConfig.bg },
                      ]}
                    >
                      <AppIcon
                        name={statusConfig.icon}
                        size={12}
                        color={statusConfig.color}
                      />
                      <Text
                        style={[
                          styles.ticketStatusText,
                          { color: statusConfig.color },
                        ]}
                      >
                        {statusConfig.label}
                      </Text>
                    </View>
                  </View>

                  {/* Winner Title & Audience Meta */}
                  <View style={styles.ticketWinnerSection}>
                    <Text style={styles.ticketWinnerTitle}>
                      {claim?.winnerName ||
                        claim?.groupName ||
                        'Leaderboard Winner'}
                    </Text>

                    <View style={styles.ticketMetaRow}>
                      <View style={styles.ticketAudienceBadge}>
                        <AppIcon
                          name="UsersRound"
                          size={12}
                          color={colors.primaryDark}
                        />
                        <Text style={styles.ticketAudienceText}>
                          {claim?.audience === 'GROUP'
                            ? 'Group Challenge'
                            : 'Challenge Winner'}
                        </Text>
                      </View>

                      {claim?.recipientName ? (
                        <Text style={styles.ticketRecipientText}>
                          Winner: {claim.recipientName}
                          {claim.recipientEmail
                            ? ` (${claim.recipientEmail})`
                            : ''}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {/* Perforated Stub Line with Left & Right Notches */}
                  <View style={styles.ticketPerforationWrapper}>
                    <View style={styles.ticketNotchLeft} />
                    <View style={styles.ticketDashedLine} />
                    <View style={styles.ticketNotchRight} />
                  </View>

                  {/* 3-Column Highlights / Stats Grid */}
                  <View style={styles.ticketStatsGrid}>
                    <View style={styles.ticketStatItem}>
                      <Text style={styles.ticketStatLabel}>Tickets</Text>
                      <Text style={styles.ticketStatValue}>
                        🎟️ {ticketCount} Free{' '}
                        {ticketCount > 1 ? 'Passes' : 'Pass'}
                      </Text>
                    </View>

                    <View style={styles.ticketStatDivider} />

                    <View style={styles.ticketStatItem}>
                      <Text style={styles.ticketStatLabel}>Total Steps</Text>
                      <Text style={styles.ticketStatValue}>
                        👟 {stepsCount.toLocaleString()}
                      </Text>
                    </View>

                    <View style={styles.ticketStatDivider} />

                    <View style={styles.ticketStatItem}>
                      <Text style={styles.ticketStatLabel}>Rank</Text>
                      <Text style={styles.ticketStatValue}>
                        🏆 #{claim?.rank ?? 1}
                      </Text>
                    </View>
                  </View>

                  {/* Consent Pending Notice Banner */}
                  {claim?.status === 'CONSENT_PENDING' ? (
                    <View
                      style={[
                        styles.ticketNoticeBox,
                        {
                          backgroundColor: colors.warningLight,
                          borderColor: colors.warning,
                        },
                      ]}
                    >
                      <View style={styles.ticketNoticeHeader}>
                        <AppIcon
                          name="Clock"
                          size={15}
                          color={colors.warning}
                        />
                        <Text
                          style={[
                            styles.ticketNoticeTitle,
                            { color: colors.warning },
                          ]}
                        >
                          Consent & Confirmation Pending
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.ticketNoticeDesc,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Congratulations! Your reward pass is reserved. Please
                        check your registered email (
                        <Text
                          style={{
                            fontFamily: theme.fonts.medium,
                            color: colors.textPrimary,
                          }}
                        >
                          {claim?.recipientEmail || 'your email'}
                        </Text>
                        ) to confirm and claim your tickets.
                      </Text>
                    </View>
                  ) : null}

                  {/* Issued Ticket Details */}
                  {isIssued ? (
                    <View style={styles.ticketDetailsGrid}>
                      {claim?.ticketDate ? (
                        <View style={styles.ticketDetailRow}>
                          <Text style={styles.ticketDetailLabel}>
                            Valid Date:
                          </Text>
                          <Text style={styles.ticketDetailValue}>
                            {formatDate(claim.ticketDate)}
                          </Text>
                        </View>
                      ) : null}

                      {claim?.ticketNumber ? (
                        <View style={styles.ticketDetailRow}>
                          <Text style={styles.ticketDetailLabel}>
                            Ticket No:
                          </Text>
                          <Text style={styles.ticketDetailValue}>
                            {claim.ticketNumber}
                          </Text>
                        </View>
                      ) : null}

                      {claim?.bookingReference ? (
                        <View style={styles.ticketDetailRow}>
                          <Text style={styles.ticketDetailLabel}>
                            Booking Reference:
                          </Text>
                          <Text style={styles.ticketDetailValue}>
                            {claim.bookingReference}
                          </Text>
                        </View>
                      ) : null}

                      {claim?.delivery ? (
                        <View style={styles.ticketDetailRow}>
                          <Text style={styles.ticketDetailLabel}>
                            Delivery:
                          </Text>
                          <Text style={styles.ticketDetailValue}>
                            {claim.delivery}
                          </Text>
                        </View>
                      ) : null}

                      {claim?.ticketImage ? (
                        <Image
                          source={{ uri: claim.ticketImage }}
                          style={styles.ticketImage}
                          resizeMode="contain"
                          accessibilityLabel="Leaderboard ticket"
                        />
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </ProfileCard>
            );
          })
        )}
      </View>
    </>
  );
};
