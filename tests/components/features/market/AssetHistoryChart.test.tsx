import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AssetHistoryChart } from '@features/market/components/AssetHistoryChart';

const mockLineChartProps: any[] = [];

jest.mock('react-native-gifted-charts', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    LineChart: (props: any) => {
      mockLineChartProps.push(props);
      return <View testID="line-chart" />;
    },
  };
});

describe('AssetHistoryChart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLineChartProps.length = 0;
  });

  it('should render name/symbol and pass yAxisLabelTexts with first label empty', () => {
    const asset = {
      name: 'Bitcoin',
      symbol: 'BTC',
      history: [
        { date: 't1', value: 10 },
        { date: 't2', value: 20 },
      ],
    };

    render(<AssetHistoryChart asset={asset as any} />);

    expect(screen.getByText('Bitcoin')).toBeTruthy();
    expect(screen.getByText('BTC')).toBeTruthy();

    expect(screen.getByTestId('line-chart')).toBeTruthy();
    const props = mockLineChartProps[mockLineChartProps.length - 1];
    expect(props.yAxisLabelTexts[0]).toBe('');
    expect(props.noOfSections).toBe(9);
  });

  it('should fallback to currentPrice when history is empty', () => {
    const asset = { name: 'X', symbol: 'X', history: [], currentPrice: 123 };

    render(<AssetHistoryChart asset={asset as any} />);

    const props = mockLineChartProps[mockLineChartProps.length - 1];
    expect(props.data).toEqual(expect.arrayContaining([expect.objectContaining({ value: 123 })]));
  });

  it('should duplicate point when history has only 1 valid item', () => {
    const asset = {
      name: 'Y',
      symbol: 'Y',
      history: [{ date: 't1', value: 50 }],
    };

    render(<AssetHistoryChart asset={asset as any} />);

    const props = mockLineChartProps[mockLineChartProps.length - 1];
    expect(Array.isArray(props.data)).toBe(true);
    expect(props.data.length).toBe(2);
    expect(props.data[0].value).toBe(50);
    expect(props.data[1].value).toBe(50);
  });

  it('should handle PascalCase fields Name/Symbol', () => {
    const asset = { Name: 'Gold', Symbol: 'XAU', history: [{ date: 't1', value: 10 }] };

    render(<AssetHistoryChart asset={asset as any} />);

    expect(screen.getByText('Gold')).toBeTruthy();
    expect(screen.getByText('XAU')).toBeTruthy();
  });
});
