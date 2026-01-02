import React from 'react';
import { View, Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';
import { useTheme } from '@app/providers/ThemeProvider';

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@core/ui/ListOption', () => {
  const { View, Text } = require('react-native');
  return {
    ListOption: jest.fn((props) => (
      <View testID="mock-option" {...props}>
        <Text>{props.isLast ? 'Is Last' : 'Not Last'}</Text>
      </View>
    )),
  };
});

describe('ListContainer Component', () => {
  const mockTheme = {
    card: '#ffffff',
    border: '#e5e5e5',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme });
  });

  it('should render children and apply container styles', () => {
    const { toJSON } = render(
      <ListContainer>
        <Text>Regular Child</Text>
      </ListContainer>
    );

    expect(screen.getByText('Regular Child')).toBeTruthy();

    const tree = toJSON();
    // @ts-ignore
    const style = tree.props.style;
    const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;

    expect(flattenedStyle).toEqual(
      expect.objectContaining({
        backgroundColor: mockTheme.card,
        borderColor: mockTheme.border,
      })
    );
  });

  it('should identify ListOption children and pass isLast=true to the last one', () => {
    render(
      <ListContainer>
        <ListOption text="Option 1" />
        <ListOption text="Option 2" />
        <ListOption text="Option 3" />
      </ListContainer>
    );

    const calls = (ListOption as jest.Mock).mock.calls;

    expect(calls).toHaveLength(3);

    expect(calls[0][0].isLast).toBe(false);

    expect(calls[1][0].isLast).toBe(false);

    expect(calls[2][0].isLast).toBe(true);
  });

  it('should pass isLast=true correctly even with only one ListOption', () => {
    render(
      <ListContainer>
        <ListOption text="Single Option" />
      </ListContainer>
    );

    const calls = (ListOption as jest.Mock).mock.calls;
    expect(calls).toHaveLength(1);
    expect(calls[0][0].isLast).toBe(true);
  });

  it('should NOT pass isLast prop to children that are not ListOption', () => {
    const OtherComponent = (props: any) => <View testID="other" {...props} />;
    
    render(
      <ListContainer>
        <OtherComponent />
        <ListOption text="Last Option" />
      </ListContainer>
    );

    const listOptionCalls = (ListOption as jest.Mock).mock.calls;
    expect(listOptionCalls[0][0].isLast).toBe(true);

    expect(screen.getByTestId('other')).toBeTruthy();
  });
  
  it('should correctly mark isLast only if the ListOption is truly the last child', () => {
    render(
        <ListContainer>
            <ListOption text="Not Last Physically" />
            <Text>I am the last one</Text>
        </ListContainer>
    );

    const calls = (ListOption as jest.Mock).mock.calls;

    expect(calls[0][0].isLast).toBe(false);
  });
});