import React from 'react';
import { View, Text } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ListItem } from '@core/ui/ListItem';
import { useTheme } from '@app/providers/ThemeProvider';

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@core/ui/Separator', () => {
  const { View } = require('react-native');
  return {
    Separator: (props: any) => <View testID="mock-separator" {...props} />,
  };
});

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    Swipeable: jest.fn(({ children, renderLeftActions, renderRightActions }) => (
      <View testID="mock-swipeable">
        {children}
        {renderLeftActions && renderLeftActions()}
        {renderRightActions && renderRightActions()}
      </View>
    )),
  };
});

const getFlattenedStyle = (style: any) => {
  if (!style) return {};
  return Array.isArray(style) ? Object.assign({}, ...style) : style;
};

describe('ListItem Component', () => {
  const mockOnPress = jest.fn();
  const mockTheme = {
    bg: '#ffffff',
    secondaryBtn: '#cccccc',
    secondary: '#aaaaaa',
    white: '#ffffff',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme, isDark: false });
  });

  describe('Rendering Content', () => {
    it('should render title and subtitle as strings', () => {
      render(<ListItem title="My Title" subtitle="My Subtitle" />);

      expect(screen.getByText('My Title')).toBeTruthy();
      expect(screen.getByText('My Subtitle')).toBeTruthy();
    });

    it('should render title and subtitle as ReactNodes', () => {
      render(
        <ListItem 
          title={<Text>Custom Title</Text>} 
          subtitle={<Text>Custom Subtitle</Text>} 
        />
      );

      expect(screen.getByText('Custom Title')).toBeTruthy();
      expect(screen.getByText('Custom Subtitle')).toBeTruthy();
    });

    it('should render left and right elements', () => {
      render(
        <ListItem
          leftElement={<Text>Left</Text>}
          rightElement={<Text>Right</Text>}
        />
      );

      expect(screen.getByText('Left')).toBeTruthy();
      expect(screen.getByText('Right')).toBeTruthy();
    });

    it('should render children content', () => {
      render(
        <ListItem>
          <Text>Inner Child</Text>
        </ListItem>
      );
      expect(screen.getByText('Inner Child')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should handle onPress on the main item', () => {
      render(<ListItem title="Press Me" onPress={mockOnPress} />);
      
      const itemText = screen.getByText('Press Me');
      fireEvent.press(itemText);
      
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Separator Logic', () => {
    it('should show separator by default', () => {
      render(<ListItem title="Item" />);
      expect(screen.getByTestId('mock-separator')).toBeTruthy();
    });

    it('should hide separator when isLast is true', () => {
      render(<ListItem title="Item" isLast />);
      expect(screen.queryByTestId('mock-separator')).toBeNull();
    });

    it('should hide separator when showSeparator is false', () => {
      render(<ListItem title="Item" showSeparator={false} />);
      expect(screen.queryByTestId('mock-separator')).toBeNull();
    });
    
    it('should show separator with left element logic', () => {
      render(<ListItem title="Item" leftElement={<Text>L</Text>} />);
      expect(screen.getByTestId('mock-separator')).toBeTruthy();
    });
  });

  describe('Swipe Actions', () => {
    it('should render swipe left actions and handle press', () => {
      const onActionPress = jest.fn();
      const actions = [{ label: 'Archive', onPress: onActionPress }];

      render(<ListItem title="Swipe Me" swipeLeftActions={actions} />);

      const actionButton = screen.getByText('Archive');
      fireEvent.press(actionButton);

      expect(onActionPress).toHaveBeenCalledTimes(1);
    });

    it('should render swipe right actions and handle press', () => {
      const onActionPress = jest.fn();
      const actions = [{ label: 'Delete', onPress: onActionPress, color: 'red' }];

      render(<ListItem title="Swipe Me" swipeRightActions={actions} />);

      const actionButton = screen.getByText('Delete');
      fireEvent.press(actionButton);

      expect(onActionPress).toHaveBeenCalledTimes(1);
    });

    it('should apply custom colors to swipe actions', () => {
      const actions = [{ label: 'BlueAction', onPress: jest.fn(), color: 'blue', textColor: 'yellow' }];
      
      render(<ListItem title="Swipe Me" swipeRightActions={actions} />);
      
      const actionText = screen.getByText('BlueAction');

      let textNodeWithStyle: any = actionText;
      let style = getFlattenedStyle(textNodeWithStyle.props.style);
      
      if (style.color !== 'yellow' && actionText.parent) {
         textNodeWithStyle = actionText.parent;
         style = getFlattenedStyle(textNodeWithStyle.props.style);
      }
      
      expect(style).toEqual(expect.objectContaining({ color: 'yellow' }));

      let containerNode = textNodeWithStyle.parent;
      let foundContainer = false;

      while (containerNode) {
        const containerStyle = getFlattenedStyle(containerNode.props.style);
        if (containerStyle.backgroundColor === 'blue') {
          foundContainer = true;
          break;
        }
        containerNode = containerNode.parent;
      }

      expect(foundContainer).toBe(true);
      expect(containerNode).toBeTruthy();
    });
  });
});