export const getActivityThemeColors = (
  activityKey: string,
  metricType: string,
  themeColors: any,
) => {
  const key = `${activityKey}_${metricType}`.toLowerCase();
  if (key.includes('run')) {
    return { bg: themeColors.primaryLight || '#FFEDE8', accent: themeColors.primary };
  }
  if (key.includes('walk')) {
    return { bg: '#E8F5E9', accent: '#2E7D32' };
  }
  if (key.includes('cycl')) {
    return { bg: '#E1F5FE', accent: '#0288D1' };
  }
  if (key.includes('step')) {
    return { bg: '#FFF8E1', accent: '#F59E0B' };
  }
  if (key.includes('calor')) {
    return { bg: '#FFEBEE', accent: '#EF4444' };
  }
  if (key.includes('sleep')) {
    return { bg: '#EDE7F6', accent: '#6366F1' };
  }
  if (key.includes('active')) {
    return { bg: '#FFF3E0', accent: '#F97316' };
  }
  if (key.includes('dist')) {
    return { bg: '#E0F7FA', accent: '#06B6D4' };
  }
  return { bg: themeColors.backgroundSecondary, accent: themeColors.primary };
};
