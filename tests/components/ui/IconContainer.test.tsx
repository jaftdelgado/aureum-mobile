import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { IconContainer } from '@core/ui/IconContainer'; 
import { Icon } from '@core/ui/Icon';

jest.mock('@core/ui/Icon', () => {
  const { View } = require('react-native');
  return {
    Icon: jest.fn((props) => <View testID="mock-icon" {...props} />),
  };
});

const getFlattenedStyle = (style: any) => {
  if (!style) return {};
  return Array.isArray(style) ? Object.assign({}, ...style) : style;
};

describe('IconContainer Component', () => {
  const MockSvg = () => <View />;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { toJSON } = render(<IconContainer icon={MockSvg} />);

    const tree = toJSON();
    // @ts-ignore
    const style = getFlattenedStyle(tree.props.style);

    expect(style).toEqual(expect.objectContaining({ width: 32, height: 32 }));

    expect(style).toEqual(expect.objectContaining({ backgroundColor: '#9193a0' }));

    expect(Icon).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 18,
        color: 'white', 
        component: MockSvg
      }),
      undefined
    );
  });

  it('should apply custom size to container', () => {
    const { toJSON } = render(<IconContainer icon={MockSvg} size={50} />);

    const tree = toJSON();
    // @ts-ignore
    const style = getFlattenedStyle(tree.props.style);

    expect(style).toEqual(expect.objectContaining({ width: 50, height: 50 }));
  });

  it('should apply custom size to inner icon', () => {
    render(<IconContainer icon={MockSvg} iconSize={24} />);

    expect(Icon).toHaveBeenCalledWith(
      expect.objectContaining({ size: 24 }),
      undefined
    );
  });

  describe('Color Variants', () => {
    it('should apply "blue" variant color', () => {
      const { toJSON } = render(<IconContainer icon={MockSvg} variant="blue" />);
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(expect.objectContaining({ backgroundColor: '#1c89fe' }));
    });

    it('should apply "green" variant color', () => {
      const { toJSON } = render(<IconContainer icon={MockSvg} variant="green" />);
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(expect.objectContaining({ backgroundColor: '#33d056' }));
    });

    it('should apply "purple" variant color', () => {
      const { toJSON } = render(<IconContainer icon={MockSvg} variant="purple" />);
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(expect.objectContaining({ backgroundColor: '#6c43c0' }));
    });
    
  });

  it('should pass extra props to the container View', () => {
    const { getByTestId } = render(
      <IconContainer icon={MockSvg} testID="custom-container" />
    );

    expect(getByTestId('custom-container')).toBeTruthy();
  });
});