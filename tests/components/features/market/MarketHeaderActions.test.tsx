import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { MarketHeaderActions } from '@features/market/components/MarketHeaderActions';

jest.mock('@core/components/ButtonGroup', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    ButtonGroup: ({ children }: any) => <View testID="button-group">{children}</View>,
  };
});

jest.mock('@core/ui/IconButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    IconButton: ({ onPress, icon }: any) => (
      <Pressable testID={`icon-btn-${icon?.name}`} onPress={onPress}>
        <Text>{icon?.name}</Text>
      </Pressable>
    ),
  };
});

jest.mock('@features/market/resources/svg/SettingsIcon', () => ({
  SettingsIcon: { name: 'SettingsIcon' },
}));

jest.mock('@features/market/resources/svg/PlayIcon', () => ({
  PlayIcon: { name: 'PlayIcon' },
}));

describe('MarketHeaderActions Component', () => {
  it('should render both buttons', () => {
    render(<MarketHeaderActions />);
    expect(screen.getByTestId('button-group')).toBeTruthy();
    expect(screen.getByTestId('icon-btn-SettingsIcon')).toBeTruthy();
    expect(screen.getByTestId('icon-btn-PlayIcon')).toBeTruthy();
  });

  it('should call handlers when pressed', () => {
    const onSettingsPress = jest.fn();
    const onPlayPress = jest.fn();

    render(<MarketHeaderActions onSettingsPress={onSettingsPress} onPlayPress={onPlayPress} />);

    fireEvent.press(screen.getByTestId('icon-btn-SettingsIcon'));
    expect(onSettingsPress).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByTestId('icon-btn-PlayIcon'));
    expect(onPlayPress).toHaveBeenCalledTimes(1);
  });
});
