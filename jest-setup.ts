import '@testing-library/jest-native/extend-expect';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}), { virtual: true });

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];

  if (/Warning:/.test(message)) return;

  if (typeof message === 'string' && message.includes('An update to HookContainer')) return;
  if (typeof message === 'string' && message.includes('was not wrapped in act(...)')) return;

  originalConsoleError(...args);
};