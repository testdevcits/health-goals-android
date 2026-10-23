// src/theme/ThemeProvider.tsx
import React, { createContext, useMemo, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { AppTheme, lightTheme, darkTheme } from './index';

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
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemScheme);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

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
    setColorScheme(
      mode === 'system' ? Appearance.getColorScheme() ?? 'light' : mode,
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
