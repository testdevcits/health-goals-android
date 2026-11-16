import React from 'react';
import { Image, View } from 'react-native';
import { AppEmptyState, AppText, ProfileCard } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { ProfileSectionLabel } from '../../components/ProfileScreenLayout';
import createStyles from '../styles.Rewards';

export interface TicketClaimItem {
  id?: string;
  month: string;
  groupName?: string;
  winnerName?: string;
  stepTotal?: number;
  status: string;
  ticketImage?: string;
  ticketDate?: string;
  ticketNumber?: string;
  ticketCount?: number;
  bookingReference?: string;
}

interface LeaderboardTicketSectionProps {
  ticketClaims: TicketClaimItem[];
}

export const LeaderboardTicketSection: React.FC<
  LeaderboardTicketSectionProps
> = ({ ticketClaims }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);

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
            const issued =
              claim.status === 'SENT' || Boolean(claim.ticketImage);
            return (
              <ProfileCard key={claim.id || `${claim.month}:${index}`}>
                <View style={styles.ticketCard}>
                  <AppText variant="subtitle2" bold>
                    {claim.groupName ||
                      claim.winnerName ||
                      'Leaderboard reward'}
                  </AppText>
                  <AppText variant="caption" secondary>
                    {claim.month} · {claim.stepTotal?.toLocaleString() ?? '—'}{' '}
                    steps
                  </AppText>
                  <AppText variant="caption" primary>
                    {issued ? 'Ticket sent' : 'Reward being prepared'}
                  </AppText>
                  {issued ? (
                    <>
                      {claim.ticketDate ? (
                        <AppText variant="caption" secondary>
                          Date: {claim.ticketDate}
                        </AppText>
                      ) : null}
                      {claim.ticketNumber ? (
                        <AppText variant="caption" secondary>
                          Ticket: {claim.ticketNumber}
                        </AppText>
                      ) : null}
                      {claim.ticketCount ? (
                        <AppText variant="caption" secondary>
                          Tickets: {claim.ticketCount}
                        </AppText>
                      ) : null}
                      {claim.bookingReference ? (
                        <AppText variant="caption" secondary>
                          Booking reference: {claim.bookingReference}
                        </AppText>
                      ) : null}
                      {claim.ticketImage ? (
                        <Image
                          source={{ uri: claim.ticketImage }}
                          style={styles.ticketImage}
                          resizeMode="contain"
                          accessibilityLabel="Leaderboard ticket"
                        />
                      ) : null}
                    </>
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
