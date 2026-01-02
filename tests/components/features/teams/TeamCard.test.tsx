import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { TeamCard } from '@features/teams/components/TeamCard';
import { useTeamImage } from '@features/teams/hooks/useTeamImage';
import { Team } from '@domain/entities/Team';

jest.mock('@features/teams/hooks/useTeamImage', () => ({
  useTeamImage: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@core/ui/Text', () => {
  const { Text } = require('react-native');
  return {
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

describe('TeamCard Component', () => {
  const mockOnPress = jest.fn();

  const mockTeam: Team = {
    public_id: 'team-xyz',
    name: 'Gamma Team',
    description: 'Special operations',
    access_code: 'GAMMA1',
    created_at: '22-10-2025',
    team_pic: 'pic.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render team basic info', () => {
    (useTeamImage as jest.Mock).mockReturnValue({ imageSource: null });

    render(<TeamCard team={mockTeam} onPress={mockOnPress} />);

    expect(screen.getByText('Gamma Team')).toBeTruthy();
    expect(screen.getByText('Special operations')).toBeTruthy();
  });

  describe('Role Badge Logic', () => {
    it('should show PROFESSOR label when role is "professor"', () => {
      (useTeamImage as jest.Mock).mockReturnValue({ imageSource: null });

      render(<TeamCard team={mockTeam} role="professor" onPress={mockOnPress} />);

      expect(screen.getByText('card.professor')).toBeTruthy();
      expect(screen.queryByText('card.student')).toBeNull();
    });

    it('should show STUDENT label when role is NOT "professor"', () => {
      (useTeamImage as jest.Mock).mockReturnValue({ imageSource: null });

      render(<TeamCard team={mockTeam} role="student" onPress={mockOnPress} />);

      expect(screen.getByText('card.student')).toBeTruthy();
      expect(screen.queryByText('card.professor')).toBeNull();
    });
  });

  describe('Image Logic', () => {
    it('should use custom image when available', () => {
      const customUri = 'https://custom-image.com/pic.png';
      (useTeamImage as jest.Mock).mockReturnValue({ imageSource: customUri });

      render(<TeamCard team={mockTeam} onPress={mockOnPress} />);

      const image = screen.UNSAFE_getByType(Image);
      expect(image.props.source).toEqual({ uri: customUri });
    });

    it('should use default Unsplash image when no custom image exists', () => {
      (useTeamImage as jest.Mock).mockReturnValue({ imageSource: null });

      render(<TeamCard team={mockTeam} onPress={mockOnPress} />);

      const image = screen.UNSAFE_getByType(Image);
      const expectedUri = `https://source.unsplash.com/random/800x600?technology,code&sig=${mockTeam.public_id}`;
      
      expect(image.props.source).toEqual({ uri: expectedUri });
    });
  });

  it('should call onPress callback', () => {
    (useTeamImage as jest.Mock).mockReturnValue({ imageSource: null });

    render(<TeamCard team={mockTeam} onPress={mockOnPress} />);

    const card = screen.UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(card);

    expect(mockOnPress).toHaveBeenCalledWith(mockTeam);
  });

  it('should hide description if empty', () => {
    const teamNoDesc = { ...mockTeam, description: undefined };
    (useTeamImage as jest.Mock).mockReturnValue({ imageSource: null });

    render(<TeamCard team={teamNoDesc} onPress={mockOnPress} />);

    expect(screen.getByText('Gamma Team')).toBeTruthy();
    expect(screen.queryByText('Special operations')).toBeNull();
  });
});