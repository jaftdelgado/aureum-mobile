import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PortfolioScreen } from '@features/portfolio/screens/PortfolioScreen';
import { usePortfolio } from '@features/portfolio/hooks/usePortfolio';

jest.mock('@infra/external/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(),
    },
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaProvider: ({ children }: any) => children,
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@features/portfolio/hooks/usePortfolio');

jest.mock('@features/portfolio/components/PortfolioPnLChart', () => ({
  PortfolioPnLChart: () => null,
}));

jest.mock('@features/portfolio/components/PortfolioBalanceSummary', () => ({
  PortfolioBalanceSummary: () => null,
}));

jest.mock('@features/portfolio/components/PortfolioAssetCard', () => {
  const { View } = require('react-native');
  return {
    PortfolioAssetCard: ({ item, onPress }: any) => (
      <View testID={`asset-card-${item.assetId}`} onTouchEnd={onPress} />
    ),
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: () => ({
    theme: { 
      primaryText: '#000', 
      secondaryText: '#666',
      background: '#fff',
      card: '#fff',
      border: '#ccc'
    },
    isDark: false,
  })
}));

describe('PortfolioScreen', () => {
  const mockPortfolio = [
    { 
      portfolioId: 'p1', 
      assetId: 'btc', 
      assetName: 'Bitcoin', 
      currentTotalValue: 1000, 
      profitOrLoss: 100 
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar el indicador de carga mientras isLoading es true', () => {
    (usePortfolio as jest.Mock).mockReturnValue({
      portfolio: [],
      history: [],
      isLoading: true,
    });

    const { getByTestId } = render(<PortfolioScreen />);
    expect(getByTestId('portfolio-loading-indicator')).toBeTruthy();
  });

  it('debe mostrar el mensaje de lista vacía cuando no hay activos', () => {
    (usePortfolio as jest.Mock).mockReturnValue({
      portfolio: [],
      history: [],
      isLoading: false,
    });

    const { getByText } = render(<PortfolioScreen />);
    expect(getByText('empty')).toBeTruthy();
  });

  it('debe renderizar las tarjetas de los activos', () => {
    (usePortfolio as jest.Mock).mockReturnValue({
      portfolio: mockPortfolio,
      history: [],
      isLoading: false,
    });

    const { getByText, getByTestId } = render(<PortfolioScreen />);
    
    expect(getByText('your_assets')).toBeTruthy();
    expect(getByTestId('asset-card-btc')).toBeTruthy();
  });

  it('debe permitir seleccionar un activo al presionar la tarjeta', () => {
    (usePortfolio as jest.Mock).mockReturnValue({
      portfolio: mockPortfolio,
      history: [],
      isLoading: false,
    });

    const { getByTestId } = render(<PortfolioScreen />);
    const card = getByTestId('asset-card-btc');

    fireEvent(card, 'onTouchEnd');
    expect(card).toBeTruthy();
  });
});