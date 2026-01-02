import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Avatar } from '@core/ui/Avatar'; 
import { View } from 'react-native';

jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return {
    Image: (props: any) => (
      <View 
        testID="expo-image" 
        {...props} 
        onError={(e: any) => props.onError && props.onError(e)} 
      />
    ),
  };
});

describe('Avatar Component', () => {
  const validSource = 'https://example.com/photo.jpg';
  const placeholderText = 'JP';

  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should render the image when source is provided', () => {
    render(<Avatar source={validSource} placeholderText={placeholderText} />);

    const image = screen.getByTestId('expo-image');
    
    expect(image).toBeTruthy();
    expect(screen.queryByText(placeholderText)).toBeNull();
  });

  it('should render placeholder text when source is missing', () => {
    render(<Avatar source={null} placeholderText={placeholderText} />);

    expect(screen.queryByTestId('expo-image')).toBeNull();
    expect(screen.getByText(placeholderText)).toBeTruthy();
  });

  it('should render placeholder text when image fails to load (onError)', () => {
    render(<Avatar source={validSource} placeholderText={placeholderText} />);

    const image = screen.getByTestId('expo-image');

    act(() => {
      fireEvent(image, 'onError', { error: 'Network request failed' });
    });

    expect(screen.queryByTestId('expo-image')).toBeNull();

    expect(screen.getByText(placeholderText)).toBeTruthy();
  });

  it('should reset error state when source changes', () => {
    const { rerender } = render(<Avatar source="bad-url.jpg" placeholderText={placeholderText} />);

    const badImage = screen.getByTestId('expo-image');
    act(() => {
      fireEvent(badImage, 'onError', { error: 'Fail' });
    });

    expect(screen.getByText(placeholderText)).toBeTruthy();

    rerender(<Avatar source="new-good-url.jpg" placeholderText={placeholderText} />);

    expect(screen.getByTestId('expo-image')).toBeTruthy();
    expect(screen.queryByText(placeholderText)).toBeNull();
  });

  it('should accept custom styles', () => {
    const customStyle = { opacity: 0.5 };
    const { toJSON } = render(<Avatar source={null} style={customStyle} />);
    
    const tree = toJSON();
    // @ts-ignore
    expect(tree.props.style).toEqual(expect.objectContaining(customStyle));
  });
});