import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppHeader } from '../../../components';
import type { ChallengesStackParamList } from '../../../navigations/ChallengesStack';
import { useTheme } from '../../../theme/useTheme';
import ChallengeTabs from './components/ChallengeTabs';
import {
  BADGES,
  CHALLENGES,
  LEADERBOARD,
  type ChallengeTab,
} from './data/challengesData';
import BadgesTab from './tabs/BadgesTab';
import ChallengesTab from './tabs/ChallengesTab';
import LeaderBoardTab from './tabs/LeaderBoardTab';
import createStyles from './styles.Challenges';

type Props = NativeStackScreenProps<ChallengesStackParamList, 'Challenges'>;

const ChallengesScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState<ChallengeTab>('Leaderboard');

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
          {activeTab === 'Leaderboard' ? (
            <LeaderBoardTab leaderboard={LEADERBOARD} styles={styles} />
          ) : null}
          {activeTab === 'Challenges' ? (
            <ChallengesTab
              challenges={CHALLENGES}
              onBrowseAll={() => navigation.navigate('AllChallenges')}
              styles={styles}
            />
          ) : null}
          {activeTab === 'Badges' ? (
            <BadgesTab badges={BADGES} styles={styles} />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default ChallengesScreen;
