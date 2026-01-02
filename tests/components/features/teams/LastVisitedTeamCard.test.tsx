import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { LastVisitedTeamCard } from '@features/teams/components/LastVisitedTeamCard';
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

describe('LastVisitedTeamCard Component', () => {
  const mockOnPress = jest.fn();

  const mockTeam: Team = {
    public_id: 'team-123',
    name: 'Alpha Squad',
    description: 'Elite development team',
    access_code: 'ALPHA1',
    created_at: '22-10-2025',
    team_pic: 'custom-pic.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render team name and description correctly', () => {
    (useTeamImage as jest.Mock).mockReturnValue({ imageSource: 'http://test.com/image.jpg' });

    render(<LastVisitedTeamCard team={mockTeam} onPress={mockOnPress} />);

    expect(screen.getByText('Alpha Squad')).toBeTruthy();
    expect(screen.getByText('Elite development team')).toBeTruthy();
  });

  it('should render the "Last Visited" badge', () => {
    (useTeamImage as jest.Mock).mockReturnValue({ imageSource: 'http://test.com/image.jpg' });

    render(<LastVisitedTeamCard team={mockTeam} onPress={mockOnPress} />);

    expect(screen.getByText('card.last_visited')).toBeTruthy();
  });

  it('should use custom image source when available', () => {
    const customUri = 'http://test.com/custom.jpg';
    (useTeamImage as jest.Mock).mockReturnValue({ imageSource: customUri });

    render(<LastVisitedTeamCard team={mockTeam} onPress={mockOnPress} />);

    const image = screen.UNSAFE_getByType(Image);
    expect(image.props.source).toEqual({ uri: customUri });
  });

  it('should use default image source when useTeamImage returns null', () => {
    (useTeamImage as jest.Mock).mockReturnValue({ imageSource: null });

    render(<LastVisitedTeamCard team={mockTeam} onPress={mockOnPress} />);

    const image = screen.UNSAFE_getByType(Image);
    const expectedDefaultUri = `https://source.unsplash.com/random/800x600?technology,code&sig=${mockTeam.public_id}`;
    
    expect(image.props.source).toEqual({ uri: expectedDefaultUri });
  });

  it('should NOT render description if not provided', () => {
    const teamWithoutDesc = { ...mockTeam, description: undefined };
    (useTeamImage as jest.Mock).mockReturnValue({ imageSource: null });

    render(<LastVisitedTeamCard team={teamWithoutDesc} onPress={mockOnPress} />);

    expect(screen.getByText('Alpha Squad')).toBeTruthy();
    expect(screen.queryByText('Elite development team')).toBeNull();
  });

  it('should call onPress with the team object when pressed', () => {
    (useTeamImage as jest.Mock).mockReturnValue({ imageSource: null });

    render(<LastVisitedTeamCard team={mockTeam} onPress={mockOnPress} />);

    const card = screen.UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(card);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(mockTeam);
  });
});