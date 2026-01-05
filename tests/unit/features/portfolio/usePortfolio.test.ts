import { renderHook } from '@testing-library/react-native';
import { usePortfolio } from '@features/portfolio/hooks/usePortfolio';
import { useAuth } from '@app/providers/AuthProvider';
import { useRoute } from '@react-navigation/native';
import { portfolioRepository } from '@app/di';
import { useQuery } from '@tanstack/react-query';

jest.mock('@app/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../../../src/app/di', () => ({ }));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('usePortfolio Hook', () => {
  const mockUser = { id: 'user-123' };
  const mockTeam = { public_id: 'team-456' };

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useRoute as jest.Mock).mockReturnValue({
      params: { team: mockTeam }
    });
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

  it('debe retornar los datos del portafolio cuando la consulta es exitosa', () => {
    const mockData = [{ assetName: 'Bitcoin', quantity: 1 }];
    (useQuery as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => usePortfolio());

    expect(result.current.portfolio).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
  });

  it('debe estar deshabilitado si no hay team o user ID', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    
    renderHook(() => usePortfolio());

    const queryOptions = (useQuery as jest.Mock).mock.calls[0][0];
    expect(queryOptions.enabled).toBe(false);
  });
});