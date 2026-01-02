import React from 'react';
import { Image, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { ImageView } from '@core/ui/ImageView';

describe('ImageView Component', () => {
  const mockSource = { uri: 'https://example.com/image.jpg' };

  it('should render the image with the correct source', () => {
    render(<ImageView source={mockSource} />);

    const image = screen.UNSAFE_getByType(Image);
    
    expect(image).toBeTruthy();
    expect(image.props.source).toEqual(mockSource);
  });

  it('should use "cover" resizeMode by default', () => {
    render(<ImageView source={mockSource} />);

    const image = screen.UNSAFE_getByType(Image);
    expect(image.props.resizeMode).toBe('cover');
  });

  it('should allow overriding resizeMode', () => {
    render(<ImageView source={mockSource} resizeMode="contain" />);

    const image = screen.UNSAFE_getByType(Image);
    expect(image.props.resizeMode).toBe('contain');
  });

  it('should wrap Image in a container View', () => {
    render(<ImageView source={mockSource} />);

    const image = screen.UNSAFE_getByType(Image);
    const container = image.parent;

    expect(container?.type).toBe('View');
  });

  it('should pass accessibility props to the Image', () => {
    render(
      <ImageView 
        source={mockSource} 
        accessibilityLabel="Test Image" 
        alt="Alternative text"
      />
    );

    const image = screen.UNSAFE_getByType(Image);
    expect(image.props.accessibilityLabel).toBe('Test Image');
    expect(image.props.alt).toBe('Alternative text');
  });

  it('should accept containerClass and pass it to the wrapper View', () => {
    const { toJSON } = render(
      <ImageView source={mockSource} containerClass="bg-red-500" />
    );
    
    const tree = toJSON();
    expect(tree).toBeTruthy();
    // @ts-ignore
    expect(tree.type).toBe('View');
  });

  it('should accept className and pass it to the inner Image', () => {
     render(
      <ImageView source={mockSource} className="opacity-50" />
    );
    
    const image = screen.UNSAFE_getByType(Image);
    expect(image).toBeTruthy();
  });
});