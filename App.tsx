/**
 * Vitality App
 * Root entry point – wires ThemeProvider + Navigation
 */
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { useTheme } from './src/theme/useTheme';
import AppNavigation from './src/navigations/AppNavigation';
import { initializeBackgroundHealthSync } from './src/services/backgroundHealthSync';
import Toast from 'react-native-toast-message';
import { appToastConfig } from './src/components/AppToast';
import BootSplash from 'react-native-bootsplash';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

function AppToastHost() {
  const insets = useSafeAreaInsets();

  return (
    <Toast
      config={appToastConfig}
      position="top"
      topOffset={Math.max(insets.top + 8, 24)}
      visibilityTime={3200}
      swipeable
    />
  );
}

function ThemedRoot() {
  const { colorScheme, theme } = useTheme();
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
          backgroundColor: theme.colors.background,
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <AppNavigation />
        </SafeAreaView>
        <AppToastHost />
      </SafeAreaProvider>
    </>
  );
}

function App() {
  useEffect(() => {
    const init = async () => {
      await BootSplash.hide({ fade: true });
    };

    init().catch(error => {
      console.error('Could not hide the launch screen:', error);
    });
    initializeBackgroundHealthSync().catch(error => {
      console.error('Could not initialize background health sync:', error);
    });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ThemedRoot />
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;