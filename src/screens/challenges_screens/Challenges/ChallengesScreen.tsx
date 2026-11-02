import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader, AppText } from '../../../components';
import type { ChallengesStackParamList } from '../../../navigations/ChallengesStack';
import { useTheme } from '../../../theme/useTheme';
import ChallengeTabs from './components/ChallengeTabs';
import {
  type Badge,
  type Challenge,
  type ChallengeTab,
} from './data/challengesData';
import BadgesTab from './tabs/BadgesTab';
import ChallengesTab from './tabs/ChallengesTab';
import createStyles from './styles.Challenges';
import { authenticatedRequest } from '../../../services/authenticatedApi';
import { apiErrorMessage } from '../../../services/api';
import { Footprints, Sunrise, Dumbbell } from 'lucide-react-native';

type Props = NativeStackScreenProps<ChallengesStackParamList, 'Challenges'>;

const ChallengesScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState<ChallengeTab>('Leaderboard');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const refresh = useCallback(async () => {
    try {
      const [result, badgeResult] = await Promise.all([
        authenticatedRequest<{ challenges: Array<{ id: string; title: string; description: string; status: string; metricType: string; targetValue: number; participants: number; joined: boolean; progress: number; currentValue: number }> }>('GET', '/community/challenges'),
        authenticatedRequest<{ badges: Badge[] }>('GET', '/community/badges'),
      ]);
      setChallenges((result.challenges || []).map(item => ({ id: item.id, title: item.title, description: item.description || `${item.targetValue} ${item.metricType}`, progress: item.progress || 0, progressLabel: `${item.currentValue.toLocaleString()} / ${item.targetValue.toLocaleString()} · ${item.participants} participants`, status: item.status === 'ACTIVE' ? 'LIVE' : 'ENDED', color: '#00C6A2', icon: item.metricType === 'steps' ? Footprints : item.metricType === 'workout' ? Dumbbell : Sunrise, joined: item.joined })));
      setBadges(badgeResult.badges || []);
    } catch (error) { Alert.alert('Could not load challenges', apiErrorMessage(error)); }
  }, []);
  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const joinChallenge = async (id: string) => {
    try { await authenticatedRequest('POST', `/community/challenges/${encodeURIComponent(id)}/join`); await refresh(); }
    catch (error) { Alert.alert('Could not join challenge', apiErrorMessage(error)); }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Challenges & Leaderboard"
        subtitle="Compete, earn badges, stay motivated"
        isBack={false}
      />

      <ScrollView
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

        <View style={styles.content}>
          {activeTab === 'Leaderboard' ? <View style={styles.leaderboardCard}><AppText variant="subtitle1" bold center>Group leaderboards</AppText><AppText variant="body2" secondary center mt={theme.spacing.md}>Open Groups and select a team to view its live 7-day steps leaderboard.</AppText></View> : null}
          {activeTab === 'Challenges' ? (
            <ChallengesTab
              challenges={challenges}
              onJoin={id => void joinChallenge(id)}
              onBrowseAll={() => navigation.navigate('AllChallenges')}
              styles={styles}
            />
          ) : null}
          {activeTab === 'Badges' ? (
            <BadgesTab badges={badges} styles={styles} />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default ChallengesScreen;
