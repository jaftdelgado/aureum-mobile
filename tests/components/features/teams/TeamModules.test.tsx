import React from 'react';
import { View } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { TeamModules } from '@features/teams/components/TeamModules';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@core/ui/ListContainer', () => {
  const { View } = require('react-native');
  return {
    ListContainer: ({ children }: any) => <View testID="list-container">{children}</View>,
  };
});

jest.mock('@core/ui/ListOption', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    ListOption: ({ text, onPress, ...props }: any) => (
      <TouchableOpacity testID={`option-${text}`} onPress={onPress}>
        <Text>{text}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('@features/teams/resources/svg/index', () => {
  const { View } = require('react-native');
  const MockIcon = () => <View />;
  return {
    AssetsIcon: MockIcon,
    SettingsIcon: MockIcon,
    PortfolioIcon: MockIcon,
    MarketIcon: MockIcon,
    OverviewIcon: MockIcon,
    MembersIcon: MockIcon,
    MovementsIcon: MockIcon,
  };
});

describe('TeamModules Component', () => {
  const mockHandlers = {
    onMembers: jest.fn(),
    onMarket: jest.fn(),
    onAssets: jest.fn(),
    onTransactions: jest.fn(),
    onSettings: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all module options', () => {
    render(<TeamModules {...mockHandlers} />);

    expect(screen.getByText('team.members')).toBeTruthy();
    expect(screen.getByText('team.market')).toBeTruthy();
    expect(screen.getByText('team.assets')).toBeTruthy();
    expect(screen.getByText('team.portfolio')).toBeTruthy();
    expect(screen.getByText('team.movements')).toBeTruthy();
    expect(screen.getByText('team.settings')).toBeTruthy();
  });

  it('should trigger onMembers when pressed', () => {
    render(<TeamModules {...mockHandlers} />);
    
    const btn = screen.getByTestId('option-team.members');
    fireEvent.press(btn);
    
    expect(mockHandlers.onMembers).toHaveBeenCalledTimes(1);
  });

  it('should trigger onMarket when pressed', () => {
    render(<TeamModules {...mockHandlers} />);
    
    const btn = screen.getByTestId('option-team.market');
    fireEvent.press(btn);
    
    expect(mockHandlers.onMarket).toHaveBeenCalledTimes(1);
  });

  it('should trigger onAssets when pressed', () => {
    render(<TeamModules {...mockHandlers} />);
    
    const btn = screen.getByTestId('option-team.assets');
    fireEvent.press(btn);
    
    expect(mockHandlers.onAssets).toHaveBeenCalledTimes(1);
  });

  it('should trigger onTransactions when movements option is pressed', () => {
    render(<TeamModules {...mockHandlers} />);

    const btn = screen.getByTestId('option-team.movements');
    fireEvent.press(btn);
    
    expect(mockHandlers.onTransactions).toHaveBeenCalledTimes(1);
  });

  it('should trigger onSettings when pressed', () => {
    render(<TeamModules {...mockHandlers} />);
    
    const btn = screen.getByTestId('option-team.settings');
    fireEvent.press(btn);
    
    expect(mockHandlers.onSettings).toHaveBeenCalledTimes(1);
  });

  it('should render Portfolio option but it might be static (no handler passed)', () => {
    render(<TeamModules {...mockHandlers} />);
    
    const btn = screen.getByTestId('option-team.portfolio');
    expect(btn).toBeTruthy();

    fireEvent.press(btn);
  });
});