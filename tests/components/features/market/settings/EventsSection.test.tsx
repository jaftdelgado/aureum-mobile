import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EventsSection } from '@features/market/components/settings/EventsSection';
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

describe('EventsSection', () => {
  const mockConfig = {
    eventFrequency: 'Low',
    dividendImpact: 'Medium',
    crashImpact: 'High',
    publicId: '1',
    teamId: 'team-1',
  } as MarketConfig;

  const mockOnOpenSelector = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title, description and current values correctly', () => {
    const { getByText } = render(
      <EventsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    expect(getByText('market:simulator.settings.sections.marketEvents')).toBeTruthy();
    expect(getByText('market:simulator.settings.sections.marketEventsDesc')).toBeTruthy();

    expect(getByText('market:simulator.settings.options.low')).toBeTruthy();
    expect(getByText('market:simulator.settings.options.medium')).toBeTruthy();

    expect(getByText('market:simulator.settings.options.high')).toBeTruthy();
  });

  it('should open selector for Event Frequency', () => {
    const { getByTestId } = render(
      <EventsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    const option = getByTestId('option-market:simulator.settings.eventFrequency');
    fireEvent.press(option);

    expect(mockOnOpenSelector).toHaveBeenCalledWith(
      'eventFrequency',
      'market:simulator.settings.eventFrequency',
      getSimpleOptions
    );
  });

  it('should open selector for Dividend Impact', () => {
    const { getByTestId } = render(
      <EventsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    const option = getByTestId('option-market:simulator.settings.dividendImpact');
    fireEvent.press(option);

    expect(mockOnOpenSelector).toHaveBeenCalledWith(
      'dividendImpact',
      'market:simulator.settings.dividendImpact',
      getSimpleOptions
    );
  });

  it('should open selector for Crash Impact', () => {
    const { getByTestId } = render(
      <EventsSection config={mockConfig} onOpenSelector={mockOnOpenSelector} />
    );

    const option = getByTestId('option-market:simulator.settings.crashImpact');
    fireEvent.press(option);

    expect(mockOnOpenSelector).toHaveBeenCalledWith(
      'crashImpact',
      'market:simulator.settings.crashImpact',
      getSimpleOptions
    );
  });
});
