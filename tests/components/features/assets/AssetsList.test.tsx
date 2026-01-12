import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AssetsList, Asset } from '@features/assets/components/AssetsList';
import { FlatList } from 'react-native';

jest.mock('@core/ui/Avatar', () => {
  const { View } = require('react-native');
  return {
    Avatar: () => <View testID="avatar" />,
  };
});

jest.mock('@core/ui/ListItem', () => {
  const { Text, TouchableOpacity } = require('react-native');
  return {
    ListItem: ({ title, subtitle, onPress, rightElement }: any) => (
      <TouchableOpacity testID={`list-item-${title}`} onPress={onPress}>
        <Text>{title}</Text>
        <Text>{subtitle}</Text>
        {rightElement}
      </TouchableOpacity>
    ),
  };
});

jest.mock('@features/assets/resources/svg/AddIcon', () => ({ AddIcon: 'AddIconMock' }), {
  virtual: true,
});
jest.mock(
  '@features/assets/resources/svg/SuccessIcon',
  () => ({ SuccessIcon: 'SuccessIconMock' }),
  { virtual: true }
);

jest.mock('@core/ui/Icon', () => {
  const { View } = require('react-native');
  return {
    Icon: ({ component }: any) => {
      const iconName = component === 'AddIconMock' ? 'icon-add' : 'icon-success';
      return <View testID={iconName} />;
    },
  };
});

describe('AssetsList', () => {
  const mockData: Asset[] = [
    {
      publicId: '1',
      assetName: 'Bitcoin',
      assetSymbol: 'BTC',
      assetPicUrl: 'btc.png',
    },
    {
      publicId: '2',
      assetName: 'Ethereum',
      assetSymbol: 'ETH',
      assetPicUrl: 'eth.png',
    },
  ];

  it('should render the list of assets correctly', () => {
    const { getByText, getByTestId } = render(<AssetsList data={mockData} />);

    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('BTC')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
    expect(getByText('ETH')).toBeTruthy();
    expect(getByTestId('list-item-Bitcoin')).toBeTruthy();
  });

  it('should handle onPressAsset event', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<AssetsList data={mockData} onPressAsset={mockOnPress} />);

    fireEvent.press(getByTestId('list-item-Bitcoin'));

    expect(mockOnPress).toHaveBeenCalledWith('1');
  });

  it('should display the SuccessIcon when asset is in addedAssetIds', () => {
    const { getByTestId } = render(<AssetsList data={mockData} addedAssetIds={['1']} />);

    const item1 = getByTestId('list-item-Bitcoin');
    expect(item1).toContainElement(getByTestId('icon-success'));

    const item2 = getByTestId('list-item-Ethereum');
    expect(item2).toContainElement(getByTestId('icon-add'));
  });

  it('should show ActivityIndicator when isFetchingNextPage is true', () => {
    const { UNSAFE_getByType } = render(<AssetsList data={mockData} isFetchingNextPage={true} />);

    const flatList = UNSAFE_getByType(FlatList);

    expect(flatList.props.ListFooterComponent).toBeTruthy();
  });

  it('should trigger fetchNextPage when reaching the end of the list', () => {
    const mockFetchNextPage = jest.fn();
    const { UNSAFE_getByType } = render(
      <AssetsList data={mockData} fetchNextPage={mockFetchNextPage} />
    );

    const flatList = UNSAFE_getByType(FlatList);
    fireEvent(flatList, 'onEndReached');

    expect(mockFetchNextPage).toHaveBeenCalled();
  });
});
