import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { MemberCard } from '@features/teams/components/MemberCard';
import { TeamMember } from '@domain/entities/TeamMember';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === 'members.since') return `Since ${options.date}`;
      return key;
    },
  }),
}));

jest.mock('@core/ui/Text', () => {
  const { Text } = require('react-native');
  return {
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

jest.mock('@core/ui/Avatar', () => {
  const { View } = require('react-native');
  return {
    Avatar: (props: any) => <View testID="mock-avatar" {...props} />,
  };
});

jest.mock('@core/ui/IconButton', () => {
  const { TouchableOpacity } = require('react-native');
  return {
    IconButton: ({ onPress, ...props }: any) => (
      <TouchableOpacity testID="remove-btn" onPress={onPress} {...props} />
    ),
  };
});

jest.mock('@features/teams/resources/svg/TrashIcon', () => {
  const { View } = require('react-native');
  return {
    TrashIcon: () => <View />,
  };
});

describe('MemberCard Component', () => {
  const mockOnRemove = jest.fn();
  
  const fixedDate = new Date('2023-01-15T12:00:00Z');
  const formattedDate = fixedDate.toLocaleDateString();

  const studentMember: TeamMember = {
    id: 'student-1',
    name: 'John Doe',
    email: 'john@test.com',
    role: 'student',
    avatarUrl: 'https://example.com/avatar.jpg',
    joinedAt: '2023-01-15T12:00:00Z',
  };

  const professorMember: TeamMember = {
    id: 'prof-1',
    name: 'Dr. Smith',
    email: 'smith@test.com',
    role: 'professor', 
    avatarUrl: undefined,
    joinedAt: '2023-01-15T12:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render member information correctly', () => {
    render(<MemberCard member={studentMember} isProfessorView={false} />);

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText(`Since ${formattedDate}`)).toBeTruthy();

    const avatar = screen.getByTestId('mock-avatar');
    expect(avatar.props.source).toBe('https://example.com/avatar.jpg');
    expect(avatar.props.placeholderText).toBe('J');
  });

  describe('Remove Button Logic', () => {
    it('should SHOW remove button if user is Professor and member is Student', () => {
      render(
        <MemberCard 
          member={studentMember} 
          isProfessorView={true} 
          onRemove={mockOnRemove} 
        />
      );

      const removeBtn = screen.getByTestId('remove-btn');
      expect(removeBtn).toBeTruthy();

      fireEvent.press(removeBtn);
      expect(mockOnRemove).toHaveBeenCalledWith('student-1');
    });

    it('should HIDE remove button if user is Professor but member is ALSO Professor', () => {
      render(
        <MemberCard 
          member={professorMember} 
          isProfessorView={true} 
          onRemove={mockOnRemove} 
        />
      );

      expect(screen.queryByTestId('remove-btn')).toBeNull();
    });

    it('should HIDE remove button if user is Student (view only)', () => {
      render(
        <MemberCard 
          member={studentMember} 
          isProfessorView={false} 
          onRemove={mockOnRemove} 
        />
      );

      expect(screen.queryByTestId('remove-btn')).toBeNull();
    });
  });

  it('should handle missing joinedAt date gracefully', () => {
    const memberNoDate = { ...studentMember, joinedAt: undefined };
    
    render(<MemberCard member={memberNoDate} isProfessorView={false} />);

    expect(screen.getByText('John Doe')).toBeTruthy();

    expect(screen.queryByText(/Since/)).toBeNull();
  });
});