// src/theme/ThemeProvider.tsx
import React, { createContext, useMemo, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName, StatusBar } from 'react-native';
import { AppTheme, lightTheme, darkTheme } from './index';
import { storageService } from '../storage/storageService';

const THEME_STORAGE_KEY = 'app_theme_mode';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextProps = {
  theme: AppTheme;
  colorScheme: ColorSchemeName;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
  colorScheme: 'light',
  themeMode: 'system',
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = Appearance.getColorScheme() ?? 'light';
  const savedMode =
    (storageService.getString(THEME_STORAGE_KEY) as ThemeMode) || 'system';
  const [themeMode, setThemeModeState] = useState<ThemeMode>(savedMode);
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(() => {
    if (savedMode === 'system') return systemScheme;
    return savedMode;
  });

  useEffect(() => {
    const isDark = colorScheme === 'dark';
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [colorScheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme: scheme }) => {
        if (themeMode === 'system') {
          setColorScheme(scheme ?? 'light');
        }
      },
    );
    return () => subscription.remove();
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    storageService.setString(THEME_STORAGE_KEY, mode);
    const nextScheme: ColorSchemeName =
      mode === 'system' ? Appearance.getColorScheme() ?? 'light' : mode;
    setColorScheme(nextScheme);
    StatusBar.setBarStyle(
      nextScheme === 'dark' ? 'light-content' : 'dark-content',
      true,
    );
  };

  const toggleTheme = () => {
    setThemeMode(colorScheme === 'light' ? 'dark' : 'light');
  };

  const theme = useMemo(
    () => (colorScheme === 'dark' ? darkTheme : lightTheme),
    [colorScheme],
  );

  return (
    <ThemeContext.Provider
      value={{ theme, colorScheme, themeMode, toggleTheme, setThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
