import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BasicsSection } from '@features/market/components/settings/BasicsSection';
import { getCurrencyOptions } from '@features/market/constants/defaultMarketConfig';
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

describe('BasicsSection', () => {
  const mockConfig = {
    initialCash: 50000,
    currency: 'USD',
    publicId: '1',
    teamId: 'team-1',
  } as MarketConfig;

  const mockOnOpenSelector = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title, description and config values correctly', () => {
    const { getByText } = render(
      <BasicsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    expect(getByText('market:simulator.settings.sections.marketBasics')).toBeTruthy();
    expect(getByText('market:simulator.settings.sections.marketBasicsDesc')).toBeTruthy();

    expect(getByText('50,000')).toBeTruthy();
    expect(getByText('USD')).toBeTruthy();
  });

  it('should call onOpenSelector with correct params when Currency option is pressed', () => {
    const { getByTestId } = render(
      <BasicsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    const currencyOption = getByTestId('option-market:simulator.settings.currency');
    fireEvent.press(currencyOption);

    expect(mockOnOpenSelector).toHaveBeenCalledTimes(1);
    expect(mockOnOpenSelector).toHaveBeenCalledWith(
      'currency',
      'market:simulator.settings.currency',
      getCurrencyOptions
    );
  });

  it('should not call onOpenSelector when Initial Cash option is pressed', () => {
    const { getByTestId } = render(
      <BasicsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    const cashOption = getByTestId('option-market:simulator.settings.initialCash');
    fireEvent.press(cashOption);

    expect(mockOnOpenSelector).not.toHaveBeenCalled();
  });
});
