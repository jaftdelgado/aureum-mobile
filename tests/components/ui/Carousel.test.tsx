import React from 'react';
import { Text, ScrollView } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Carousel } from '@core/ui/Carousel';

describe('Carousel Component', () => {
  const TestChild = () => <Text>Test Item</Text>;

  it('should render children correctly', () => {
    render(
      <Carousel>
        <TestChild />
        <TestChild />
      </Carousel>
    );

    expect(screen.getAllByText('Test Item')).toHaveLength(2);
  });

  it('should render a horizontal ScrollView', () => {
    render(
      <Carousel>
        <TestChild />
      </Carousel>
    );

    const scrollView = screen.UNSAFE_getByType(ScrollView);
    
    expect(scrollView.props.horizontal).toBe(true);
    expect(scrollView.props.showsHorizontalScrollIndicator).toBe(false);
  });

  it('should apply snap properties when snap={true}', () => {
    render(
      <Carousel snap>
        <TestChild />
      </Carousel>
    );

    const scrollView = screen.UNSAFE_getByType(ScrollView);
    
    expect(scrollView.props.snapToAlignment).toBe('start');
    expect(scrollView.props.decelerationRate).toBe('fast');
  });

  it('should NOT apply snap properties when snap={false} (default)', () => {
    render(
      <Carousel>
        <TestChild />
      </Carousel>
    );

    const scrollView = screen.UNSAFE_getByType(ScrollView);
    
    expect(scrollView.props.snapToAlignment).toBeUndefined();
    expect(scrollView.props.decelerationRate).toBeUndefined();
  });

  it('should wrap children in a container View', () => {
    render(
      <Carousel>
        <Text>Child Node</Text>
      </Carousel>
    );

    const childNode = screen.getByText('Child Node');
    const textComponent = childNode.parent;
    const containerView = textComponent?.parent;
    
    expect(containerView).toBeTruthy();
    expect(containerView?.type).toBe('View');
  });

  it('should accept custom className', () => {
    const { toJSON } = render(
      <Carousel className="bg-red-500">
        <TestChild />
      </Carousel>
    );
    
    expect(toJSON()).toBeTruthy();
  });
});