export const getActivityThemeColors = (
  activityKey: string,
  metricType: string,
  themeColors: any,
) => {
  const key = `${activityKey}_${metricType}`.toLowerCase();
  if (key.includes('run')) {
    return {
      bg: themeColors.coralLight || themeColors.primaryLight,
      accent: themeColors.coral || themeColors.primary,
    };
  }
  if (key.includes('walk')) {
    return {
      bg: themeColors.successLight,
      accent: themeColors.success,
    };
  }
  if (key.includes('cycl')) {
    return {
      bg: themeColors.infoLight,
      accent: themeColors.info,
    };
  }
  if (key.includes('step')) {
    return {
      bg: themeColors.warningLight,
      accent: themeColors.warning,
    };
  }
  if (key.includes('calor')) {
    return {
      bg: themeColors.errorLight,
      accent: themeColors.error,
    };
  }
  if (key.includes('sleep')) {
    return {
      bg: themeColors.purpleLight,
      accent: themeColors.primaryDark || themeColors.info,
    };
  }
  if (key.includes('active')) {
    return {
      bg: themeColors.warningLight,
      accent: themeColors.warning,
    };
  }
  if (key.includes('dist')) {
    return {
      bg: themeColors.primaryLight,
      accent: themeColors.primary,
    };
  }
  return { bg: themeColors.backgroundSecondary, accent: themeColors.primary };
};
