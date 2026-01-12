import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { TeamAssetsList } from '@features/assets/components/TeamAssetsList';
import { FlatList } from 'react-native';
import { Image } from 'expo-image';
import type { TeamAsset } from '@domain/entities/TeamAsset';

jest.mock('expo-image', () => ({
  Image: {
    prefetch: jest.fn(),
  },
}));

jest.mock('@core/ui/Avatar', () => {
  const { View } = require('react-native');
  return {
    Avatar: () => <View testID="avatar" />,
  };
});

jest.mock('@core/ui/ListItem', () => {
  const { Text, View } = require('react-native');
  return {
    ListItem: ({ title, subtitle, leftElement }: any) => (
      <View testID={`list-item-${title}`}>
        <Text>{title}</Text>
        <Text>{subtitle}</Text>
        {leftElement}
      </View>
    ),
  };
});

describe('TeamAssetsList', () => {
  const mockData: TeamAsset[] = [
    {
      teamAssetId: 1,
      publicId: 'ta-1',
      teamId: 'team-1',
      assetId: 'asset-1',
      currentPrice: 150,
      hasMovements: true,
      asset: {
        publicId: 'asset-1',
        assetName: 'Bitcoin',
        assetSymbol: 'BTC',
        assetPicUrl: 'https://example.com/btc.png',
      } as any,
    },
    {
      teamAssetId: 2,
      publicId: 'ta-2',
      teamId: 'team-1',
      assetId: 'asset-2',
      currentPrice: 2100,
      hasMovements: false,
      asset: {
        publicId: 'asset-2',
        assetName: 'Ethereum',
        assetSymbol: 'ETH',
        assetPicUrl: null,
      } as any,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the list items correctly', () => {
    const { getByText, getByTestId } = render(<TeamAssetsList data={mockData} />);

    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('BTC')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
    expect(getByText('ETH')).toBeTruthy();
    expect(getByTestId('list-item-Bitcoin')).toBeTruthy();
  });

  it('should prefetch images for assets with URLs on mount', async () => {
    render(<TeamAssetsList data={mockData} />);

    await waitFor(() => {
      expect(Image.prefetch).toHaveBeenCalledWith('https://example.com/btc.png');
    });

    expect(Image.prefetch).toHaveBeenCalledTimes(1);
  });

  it('should render RefreshControl when onRefresh is provided', () => {
    const onRefreshMock = jest.fn();
    const { UNSAFE_getByType } = render(
      <TeamAssetsList data={mockData} onRefresh={onRefreshMock} isRefreshing={false} />
    );

    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.refreshControl).toBeTruthy();
  });

  it('should trigger onRefresh when pulling to refresh', () => {
    const onRefreshMock = jest.fn();
    const { UNSAFE_getByType } = render(
      <TeamAssetsList data={mockData} onRefresh={onRefreshMock} isRefreshing={true} />
    );

    const flatList = UNSAFE_getByType(FlatList);
    flatList.props.refreshControl.props.onRefresh();

    expect(onRefreshMock).toHaveBeenCalled();
  });

  it('should not render RefreshControl if onRefresh is undefined', () => {
    const { UNSAFE_getByType } = render(<TeamAssetsList data={mockData} />);
    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.refreshControl).toBeUndefined();
  });
});
