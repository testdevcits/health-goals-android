import React, { useCallback } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { AppText, SectionHeader } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import { WORKOUT_CATEGORIES } from '../const';
import { createHomeStyles } from '../styles.Home';
import { useNavigation } from '@react-navigation/native';

const WorkoutCategories: React.FC<{ onViewAllPress: () => void }> = ({
  onViewAllPress,
}) => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const navigation: any = useNavigation();

  const renderWorkoutCard = useCallback(
    ({ item }: { item: (typeof WORKOUT_CATEGORIES)[number] }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.workoutCard,
          {   borderBottomColor: item?.accent },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${item?.name}: ${item?.subtitle}`}
        onPress={() =>
          navigation.navigate('CategoriesDetailsScreen', {
            workoutId: item?.id,
          })
        }
      >
        <View style={[styles.workoutIconBox, { backgroundColor: item?.bg }]}>
          <Text style={styles.workoutEmoji}>{item?.emoji}</Text>
        </View>
        <AppText variant="subtitle2" bold mb={2}>
          {item?.name}
        </AppText>
        <AppText variant="caption" secondary>
          {item?.subtitle}
        </AppText>
        {/* <View
          style={[styles.workoutAccentBar, { backgroundColor: item?.accent }]}
        /> */}
      </TouchableOpacity>
    ),
    [styles],
  );

  return (
    <>
      <SectionHeader
        sectionTitle="Workout Categories"
        rightText="View all"
        onRightPress={onViewAllPress}
      />
      <FlatList
        data={WORKOUT_CATEGORIES}
        renderItem={renderWorkoutCard}
        keyExtractor={item => item?.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.workoutList}
      />
    </>
  );
};

export default WorkoutCategories;
