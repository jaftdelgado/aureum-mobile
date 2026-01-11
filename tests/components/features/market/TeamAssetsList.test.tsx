import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { TeamAssetsList } from '@features/market/components/TeamAssetsList';

const mockPrefetch = jest.fn();

jest.mock('expo-image', () => ({
  Image: {
    prefetch: (...args: any[]) => mockPrefetch(...args),
  },
}));

jest.mock('@core/ui/Avatar', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Avatar: ({ source }: any) => (
      <View testID="avatar">
        <Text>{String(source ?? '')}</Text>
      </View>
    ),
  };
});

jest.mock('@core/ui/Icon', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Icon: ({ component }: any) => (
      <View testID="icon">
        <Text>{component?.name ?? 'icon'}</Text>
      </View>
    ),
  };
});

jest.mock('@core/ui/ListItem', () => {
  const React = require('react');
  const { Pressable, View, Text } = require('react-native');

  return {
    ListItem: ({ title, subtitle, onPress, rightElement }: any) => (
      <Pressable testID={`list-item-${title}`} onPress={onPress}>
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
          <View testID="right-element">{rightElement}</View>
        </View>
      </Pressable>
    ),
  };
});

jest.mock('@features/market/resources/svg/SuccessIcon', () => ({
  SuccessIcon: { name: 'SuccessIcon' },
}));

describe('TeamAssetsList Component', () => {
  const onPressAsset = jest.fn();

  const baseData: any[] = [
    {
      publicId: 'team-asset-1',
      asset: {
        publicId: 'asset-1',
        assetName: 'Bitcoin',
        assetSymbol: 'BTC',
        assetPicUrl: 'https://example.com/btc.png',
      },
      currentPrice: 100,
    },
    {
      publicId: 'team-asset-2',
      asset: {
        public_id: 'asset-2',
        assetName: 'Ethereum',
        assetSymbol: 'ETH',
        assetPicUrl: 'https://example.com/eth.png',
      },
      currentPrice: 200,
    },
    {
      publicId: 'team-asset-3',
      asset: {
        id: 'asset-3',
        assetName: 'Solana',
        assetSymbol: 'SOL',
        assetPicUrl: null,
      },
      currentPrice: 300,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should prefetch images for items with assetPicUrl', () => {
    render(<TeamAssetsList data={baseData as any} />);

    expect(mockPrefetch).toHaveBeenCalledWith('https://example.com/btc.png');
    expect(mockPrefetch).toHaveBeenCalledWith('https://example.com/eth.png');
    // el tercero no debe prefetch por null
    expect(mockPrefetch).toHaveBeenCalledTimes(2);
  });

  it('should render titles and subtitles', () => {
    render(<TeamAssetsList data={baseData as any} />);

    expect(screen.getByText('Bitcoin')).toBeTruthy();
    expect(screen.getByText('BTC')).toBeTruthy();

    expect(screen.getByText('Ethereum')).toBeTruthy();
    expect(screen.getByText('ETH')).toBeTruthy();

    expect(screen.getByText('Solana')).toBeTruthy();
    expect(screen.getByText('SOL')).toBeTruthy();
  });

  it('should call onPressAsset with robust asset public id', () => {
    render(<TeamAssetsList data={baseData as any} onPressAsset={onPressAsset} />);

    fireEvent.press(screen.getByTestId('list-item-Bitcoin'));
    expect(onPressAsset).toHaveBeenCalledWith('asset-1');

    fireEvent.press(screen.getByTestId('list-item-Ethereum'));
    expect(onPressAsset).toHaveBeenCalledWith('asset-2');

    fireEvent.press(screen.getByTestId('list-item-Solana'));
    expect(onPressAsset).toHaveBeenCalledWith('asset-3');
  });

  it('should show selected icon when selectedAssetIds includes id', () => {
    render(
      <TeamAssetsList
        data={baseData as any}
        selectedAssetIds={['asset-2']}
        onPressAsset={onPressAsset}
      />
    );

    // en el item seleccionado, right-element contiene SuccessIcon (mockeado via Icon)
    // buscamos el texto "SuccessIcon" renderizado por Icon mock
    expect(screen.getByText('SuccessIcon')).toBeTruthy();
  });
});
