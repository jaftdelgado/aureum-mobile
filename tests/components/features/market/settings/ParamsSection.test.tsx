import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ParamsSection } from '@features/market/components/settings/ParamsSection';
import {
  getSimpleOptions,
  getThickSpeedOptions,
} from '@features/market/constants/defaultMarketConfig';
import type { MarketConfig } from '@domain/entities/MarketConfig';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@core/ui/ListContainer', () => {
  const { View, Text } = require('react-native');
  return {
    ListContainer: ({ title, description, children }: any) => (
      <View testID="list-container">
        <Text>{title}</Text>
        <Text>{description}</Text>
        {children}
      </View>
    ),
  };
});

jest.mock('@core/ui/ListOption', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    ListOption: ({ text, rightText, onPress }: any) => (
      <TouchableOpacity testID={`option-${text}`} onPress={onPress}>
        <Text>{text}</Text>
        <Text>{rightText}</Text>
      </TouchableOpacity>
    ),
  };
});

describe('ParamsSection', () => {
  const mockConfig: MarketConfig = {
    publicId: '1',
    teamId: 'team-1',
    marketVolatility: 'High',
    marketLiquidity: 'Low',
    thickSpeed: 'Medium',
    initialCash: 100000,
    currency: 'USD',
    transactionFee: 'Low',
    eventFrequency: 'Medium',
    dividendImpact: 'Low',
    crashImpact: 'High',
    allowShortSelling: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnOpenSelector = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title, description and current values correctly', () => {
    const { getByText } = render(
      <ParamsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    expect(getByText('market:simulator.settings.sections.marketParams')).toBeTruthy();
    expect(getByText('market:simulator.settings.sections.marketParamsDesc')).toBeTruthy();

    expect(getByText('market:simulator.settings.options.high')).toBeTruthy();
    expect(getByText('market:simulator.settings.options.low')).toBeTruthy();
    expect(getByText('market:simulator.settings.options.high')).toBeTruthy();
  });

  it('should open selector for Market Volatility', () => {
    const { getByTestId } = render(
      <ParamsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    const option = getByTestId('option-market:simulator.settings.marketVolatility');
    fireEvent.press(option);

    expect(mockOnOpenSelector).toHaveBeenCalledWith(
      'marketVolatility',
      'market:simulator.settings.marketVolatility',
      getSimpleOptions
    );
  });

  it('should open selector for Market Liquidity', () => {
    const { getByTestId } = render(
      <ParamsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    const option = getByTestId('option-market:simulator.settings.marketLiquidity');
    fireEvent.press(option);

    expect(mockOnOpenSelector).toHaveBeenCalledWith(
      'marketLiquidity',
      'market:simulator.settings.marketLiquidity',
      getSimpleOptions
    );
  });

  it('should open selector for Thick Speed', () => {
    const { getByTestId } = render(
      <ParamsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    const option = getByTestId('option-market:simulator.settings.thickSpeed');
    fireEvent.press(option);

    expect(mockOnOpenSelector).toHaveBeenCalledWith(
      'thickSpeed',
      'market:simulator.settings.thickSpeed',
      getThickSpeedOptions
    );
  });
});
