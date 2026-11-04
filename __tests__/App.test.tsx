/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/navigations/AppNavigation', () => () => null);
jest.mock('react-native-bootsplash', () => ({ hide: jest.fn() }));
jest.mock('react-redux', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('../src/store/store', () => ({ store: {} }));
jest.mock('react-native-toast-message', () => 'Toast');
jest.mock('../src/services/backgroundHealthSync', () => ({
  initializeBackgroundHealthSync: jest.fn().mockResolvedValue(undefined),
}));

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
