import React from 'react';
import { FlatList, Pressable, StatusBar, View } from 'react-native';
import { AppHeader, AppText } from '../../../components';
import { useTheme } from '../../../theme/useTheme';
import styles from './styles.Categories';
import { categories, WorkoutCategory } from './consts';

type Props = {
  navigation: any;
};

const WorkoutCategoriesScreen: React.FC<Props> = ({navigation}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const renderCategory = ({ item }: { item: WorkoutCategory }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item?.title}, ${item?.subtitle}`}
      onPress={() =>navigation.navigate("CategoriesDetailsScreen", { category: item } )}
      style={({ pressed }) => [
        styles.categoryCard,
        {
          backgroundColor: colors.surface,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={[styles.emojiBox, { backgroundColor: item?.tint }]}>
        <AppText style={styles.emoji}>{item?.emoji}</AppText>
      </View>

      <View style={styles.categoryText}>
        <AppText
          variant="subtitle2"
          bold
          numberOfLines={2}
          style={styles.categoryTitle}
        >
          {item?.title}
        </AppText>

        <AppText
          variant="caption"
          color="textSecondary"
          numberOfLines={2}
          style={styles.categorySubtitle}
        >
          {item?.subtitle}
        </AppText>
      </View>
    </Pressable>
  );

  return (
    <View
      style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}
    >
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}

      <AppHeader
        title="Workout Categories"
        subtitle="Choose an activity to track"
      />

      {/* Workout grid */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item?.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
        removeClippedSubviews
        initialNumToRender={10}
        windowSize={7}
      />
    </View>
  );
};

export default WorkoutCategoriesScreen;
