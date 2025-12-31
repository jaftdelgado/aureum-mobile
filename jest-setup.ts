import '@testing-library/jest-native/extend-expect';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}), { virtual: true });

const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Warning:/.test(args[0])) return;
  originalConsoleError(...args);
};