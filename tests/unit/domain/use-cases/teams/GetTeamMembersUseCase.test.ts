import { GetTeamMembersUseCase } from '@domain/use-cases/teams/GetTeamMembersUseCase';
import type { TeamsRepository } from '@domain/repositories/TeamsRepository';
import type { TeamMember } from '@domain/entities/TeamMember';

describe('GetTeamMembersUseCase', () => {
  let useCase: GetTeamMembersUseCase;
  let mockTeamsRepository: jest.Mocked<TeamsRepository>;

  beforeEach(() => {
    mockTeamsRepository = {
      getTeamMembers: jest.fn(),
    } as unknown as jest.Mocked<TeamsRepository>;

    useCase = new GetTeamMembersUseCase(mockTeamsRepository);
  });

  it('should return a list of team members for a given teamId', async () => {
    const teamId = 'team-123';
    
    const mockMembers: TeamMember[] = [
      {
        id: 'user-1',
        name: 'Alice Smith',
        email: 'alice@example.com',
        avatarUrl: 'https://img.com/alice.png',
        role: 'student',
        joinedAt: '2023-01-01' 
      },
      {
        id: 'user-2',
        name: 'Bob Jones',
        email: 'bob@example.com',
        role: 'student',
      }
    ];

    mockTeamsRepository.getTeamMembers.mockResolvedValue(mockMembers);

    const result = await useCase.execute(teamId);

    expect(result).toEqual(mockMembers);
    expect(result).toHaveLength(2);
    expect(mockTeamsRepository.getTeamMembers).toHaveBeenCalledWith(teamId);
  });

  it('should return an empty list if the team has no members', async () => {
    const teamId = 'empty-team';
    mockTeamsRepository.getTeamMembers.mockResolvedValue([]);

    const result = await useCase.execute(teamId);

    expect(result).toEqual([]);
    expect(mockTeamsRepository.getTeamMembers).toHaveBeenCalledWith(teamId);
  });

  it('should propagate errors from the repository', async () => {
    const teamId = 'team-error';
    const error = new Error('Failed to fetch members');
    mockTeamsRepository.getTeamMembers.mockRejectedValue(error);

    await expect(useCase.execute(teamId)).rejects.toThrow(error);
  });
});