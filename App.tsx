/**
 * Vitality App
 * Root entry point – wires ThemeProvider + Navigation
 */
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { useTheme } from './src/theme/useTheme';
import AppNavigation from './src/navigations/AppNavigation';
import BootSplash from 'react-native-bootsplash';

function ThemedRoot() {
  const { colorScheme } = useTheme();
  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaProvider
        style={{
          flex: 1,
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <AppNavigation />
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

function App() {
  useEffect(() => {
    const init = async () => {
      await BootSplash.hide({ fade: true });
    };

    init();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedRoot />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
