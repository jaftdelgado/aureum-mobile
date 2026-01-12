import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RulesSection } from '@features/market/components/settings/RulesSection';
import { getSimpleOptions } from '@features/market/constants/defaultMarketConfig';
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
  const { TouchableOpacity, Text, Switch, View } = require('react-native');
  return {
    ListOption: ({ text, rightText, onPress, showSwitch, switchValue, onSwitchChange }: any) => (
      <TouchableOpacity testID={`option-${text}`} onPress={onPress}>
        <Text>{text}</Text>
        {rightText && <Text>{rightText}</Text>}
        {showSwitch && (
          <Switch testID={`switch-${text}`} value={switchValue} onValueChange={onSwitchChange} />
        )}
      </TouchableOpacity>
    ),
  };
});

describe('RulesSection', () => {
  const mockConfig: MarketConfig = {
    publicId: '1',
    teamId: 'team-1',
    marketVolatility: 'Medium',
    marketLiquidity: 'Medium',
    thickSpeed: 'Medium',
    initialCash: 100000,
    currency: 'USD',
    transactionFee: 'Low',
    eventFrequency: 'Medium',
    dividendImpact: 'Medium',
    crashImpact: 'Medium',
    allowShortSelling: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnOpenSelector = jest.fn();
  const mockOnToggleShortSelling = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title, description and current values correctly', () => {
    const { getByText, getByTestId } = render(
      <RulesSection
        config={mockConfig}
        onOpenSelector={mockOnOpenSelector}
        onToggleShortSelling={mockOnToggleShortSelling}
      />
    );

    expect(getByText('market:simulator.settings.sections.tradingRules')).toBeTruthy();
    expect(getByText('market:simulator.settings.sections.tradingRulesDesc')).toBeTruthy();
    expect(getByText('market:simulator.settings.options.low')).toBeTruthy();

    const switchElement = getByTestId('switch-market:simulator.settings.allowShortSelling');
    expect(switchElement.props.value).toBe(true);
  });

  it('should open selector for Transaction Fee', () => {
    const { getByTestId } = render(
      <RulesSection
        config={mockConfig}
        onOpenSelector={mockOnOpenSelector}
        onToggleShortSelling={mockOnToggleShortSelling}
      />
    );

    const option = getByTestId('option-market:simulator.settings.transactionFee');
    fireEvent.press(option);

    expect(mockOnOpenSelector).toHaveBeenCalledWith(
      'transactionFee',
      'market:simulator.settings.transactionFee',
      getSimpleOptions
    );
  });

  it('should call onToggleShortSelling when switch is toggled', () => {
    const { getByTestId } = render(
      <RulesSection
        config={mockConfig}
        onOpenSelector={mockOnOpenSelector}
        onToggleShortSelling={mockOnToggleShortSelling}
      />
    );

    const switchElement = getByTestId('switch-market:simulator.settings.allowShortSelling');

    fireEvent(switchElement, 'valueChange', false);

    expect(mockOnToggleShortSelling).toHaveBeenCalledTimes(1);
    expect(mockOnToggleShortSelling).toHaveBeenCalledWith(false);
  });
});
