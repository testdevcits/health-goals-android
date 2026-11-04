/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { Platform } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import App from './App';
import { runBackgroundHealthSync } from './src/services/backgroundHealthSync';
import { name as appName } from './app.json';

if (Platform.OS === 'android') {
  BackgroundFetch.registerHeadlessTask(async event => {
    if (event.timeout) {
      BackgroundFetch.finish(event.taskId);
      return;
    }

    try {
      await runBackgroundHealthSync();
    } catch (error) {
      console.error('Headless Health Connect sync failed:', error);
    } finally {
      BackgroundFetch.finish(event.taskId);
    }
  });
}

AppRegistry.registerComponent(appName, () => App);
