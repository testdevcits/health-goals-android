// src/theme/ThemeProvider.tsx
import React, { createContext, useMemo, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { AppTheme, lightTheme, darkTheme } from './index';

type ThemeContextProps = {
  theme: AppTheme;
  colorScheme: ColorSchemeName;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
  colorScheme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = Appearance.getColorScheme() ?? 'light';
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemScheme);
  const [manualOverride, setManualOverride] = useState<ColorSchemeName | null>(
    null,
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: scheme }) => {
      if (!manualOverride) {
        setColorScheme(scheme ?? 'light');
      }
    });
    return () => subscription.remove();
  }, [manualOverride]);

  const toggleTheme = () => {
    const next = colorScheme === 'light' ? 'dark' : 'light';
    setManualOverride(next);
    setColorScheme(next);
  };

  const theme = useMemo(
    () => (colorScheme === 'dark' ? darkTheme : lightTheme),
    [colorScheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
