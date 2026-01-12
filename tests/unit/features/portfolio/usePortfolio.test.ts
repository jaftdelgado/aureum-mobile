import { renderHook, waitFor } from '@testing-library/react-native';
import { usePortfolio } from '@features/portfolio/hooks/usePortfolio';
import { useAuth } from '@app/providers/AuthProvider';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useMarketStream } from '@features/market/hooks/useMarketStream';

jest.mock('@features/market/hooks/useMarketStream', () => ({
  useMarketStream: jest.fn(),
}));

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('@app/di', () => ({
  portfolioRepository: {
    getByCourse: jest.fn(),
    getHistory: jest.fn(),
  },
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@infra/external/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ 
        data: { session: { access_token: 'token' } }, 
        error: null 
      }),
      onAuthStateChange: jest.fn(),
    },
  },
}));

describe('usePortfolio Hook', () => {
  const mockUser = { id: 'user-123' };
  const mockTeam = { public_id: 'team-456' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useRoute as jest.Mock).mockReturnValue({ params: { team: mockTeam } });
    (useMarketStream as jest.Mock).mockReturnValue({ snapshot: null, error: null });
  });

  it('debe inicializar con estado de carga y datos vacíos', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => usePortfolio());

    expect(result.current.portfolio).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('debe retornar los datos del portafolio cuando la consulta es exitosa', async () => {
    const mockData = [{ assetId: 'btc', quantity: 1, avgPrice: 100, currentValue: 100 }];
    
    (useMarketStream as jest.Mock).mockReturnValue({ 
      snapshot: { assets: [{ id: 'btc', price: 150 }] }, 
      error: null 
    });

    (useQuery as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => usePortfolio());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.portfolio[0].currentValue).toBe(150);
  });

  it('debe estar deshabilitado si no hay team o user ID', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    renderHook(() => usePortfolio());
    const queryOptions = (useQuery as jest.Mock).mock.calls[0][0];
    expect(queryOptions.enabled).toBe(false);
  });
});