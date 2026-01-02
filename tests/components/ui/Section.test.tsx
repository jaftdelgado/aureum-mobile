import React from 'react';
import { View, Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Section } from '@core/ui/Section';

jest.mock('@core/ui/Text', () => {
  const { Text } = require('react-native');
  return {
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

describe('Section Component', () => {
  it('should render the title', () => {
    render(<Section title="Section Title" />);
    expect(screen.getByText('Section Title')).toBeTruthy();
  });

  it('should render the subtitle when provided', () => {
    render(<Section title="Title" subtitle="Section Subtitle" />);
    expect(screen.getByText('Section Subtitle')).toBeTruthy();
  });

  it('should NOT render subtitle when not provided', () => {
    render(<Section title="Title" />);
    expect(screen.queryByText('Section Subtitle')).toBeNull();
  });

  it('should render the right element when provided', () => {
    const RightComponent = () => <Text>Right Action</Text>;
    
    render(
      <Section title="Title" right={<RightComponent />}>
        <Text>Content</Text>
      </Section>
    );

    expect(screen.getByText('Right Action')).toBeTruthy();
  });

  it('should render children content correctly', () => {
    render(
      <Section title="Title">
        <Text>Child Content</Text>
      </Section>
    );

    expect(screen.getByText('Child Content')).toBeTruthy();
  });

  it('should pass custom className to the root container', () => {
    const { toJSON } = render(
      <Section title="Title" className="bg-red-500" />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();
    
    // @ts-ignore
    expect(tree.props.className).toContain('bg-red-500');
  });

  it('should pass standard ViewProps (like testID) to root', () => {
    render(<Section title="Title" testID="my-section-root" />);
    
    expect(screen.getByTestId('my-section-root')).toBeTruthy();
  });

  it('should apply variant styles (verification via prop passing)', () => {
    const { toJSON } = render(
      <Section title="Title" spacing="lg" bordered={true} />
    );

    const tree = toJSON();
    // @ts-ignore
    const className = tree.props.className;

    expect(className).toContain('py-4');
    expect(className).toContain('border-b');
  });
});