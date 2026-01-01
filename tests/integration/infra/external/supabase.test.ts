const mockGetItemAsync = jest.fn();
const mockSetItemAsync = jest.fn();
const mockDeleteItemAsync = jest.fn();

const mockStartAutoRefresh = jest.fn();
const mockStopAutoRefresh = jest.fn();

const mockCreateClientFn = jest.fn(() => ({
  auth: {
    startAutoRefresh: mockStartAutoRefresh,
    stopAutoRefresh: mockStopAutoRefresh,
    storage: {},
  },
}));

const mockAddEventListener = jest.fn();

jest.mock('react-native-url-polyfill/auto', () => {});

jest.mock('expo-secure-store', () => ({
  getItemAsync: mockGetItemAsync,
  setItemAsync: mockSetItemAsync,
  deleteItemAsync: mockDeleteItemAsync,
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClientFn,
}));

jest.mock('react-native', () => ({
  AppState: {
    addEventListener: mockAddEventListener,
  },
  Platform: { OS: 'ios' },
}));

describe('Supabase Client Configuration (Integration)', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks(); 

    process.env = {
      ...OLD_ENV,
      EXPO_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-key',
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should initialize Supabase client with environment variables and SecureStore adapter', () => {
    require('@infra/external/supabase');

    expect(mockCreateClientFn).toHaveBeenCalledTimes(1);
    expect(mockCreateClientFn).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-key',
      expect.objectContaining({
        auth: expect.objectContaining({
          storage: expect.any(Object),
          autoRefreshToken: true,
          persistSession: true,
        }),
      })
    );
  });

  it('should use ExpoSecureStore for storage operations', async () => {
    require('@infra/external/supabase');

    const calls = mockCreateClientFn.mock.calls[0] as any[];
    const options = calls[2];
    const storageAdapter = options.auth.storage;

    await storageAdapter.getItem('my-key');
    expect(mockGetItemAsync).toHaveBeenCalledWith('my-key');

    await storageAdapter.setItem('my-key', 'my-val');
    expect(mockSetItemAsync).toHaveBeenCalledWith('my-key', 'my-val');

    await storageAdapter.removeItem('my-key');
    expect(mockDeleteItemAsync).toHaveBeenCalledWith('my-key');
  });

  it('should handle AppState changes to manage auto-refresh', () => {
    require('@infra/external/supabase');

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    const calls = mockAddEventListener.mock.calls[0] as any[];
    const callback = calls[1];

    callback('active');
    expect(mockStartAutoRefresh).toHaveBeenCalled();

    callback('background');
    expect(mockStopAutoRefresh).toHaveBeenCalled();
  });
});