import { JoinTeamUseCase } from '@domain/use-cases/teams/JoinTeamUseCase';
import type { TeamsRepository } from '@domain/repositories/TeamsRepository';
import type { Team } from '@domain/entities/Team';

describe('JoinTeamUseCase', () => {
  let useCase: JoinTeamUseCase;
  let mockTeamsRepository: jest.Mocked<TeamsRepository>;

  beforeEach(() => {
    mockTeamsRepository = {
      joinTeam: jest.fn(),
    } as unknown as jest.Mocked<TeamsRepository>;

    useCase = new JoinTeamUseCase(mockTeamsRepository);
  });

  it('should call joinTeam on repository with correct params and return the team', async () => {
    const userId = 'user-123';
    const code = 'ABC-123';
    
    const expectedTeam: Team = {
      public_id: 'team-1',
      name: 'Physics 101',
      access_code: 'ABC-123',
      professor_id: 'prof-99',
      created_at: '2024-01-01T00:00:00Z',
    };

    mockTeamsRepository.joinTeam.mockResolvedValue(expectedTeam);

    const result = await useCase.execute(userId, code);

    expect(mockTeamsRepository.joinTeam).toHaveBeenCalledWith({ userId, code });
    expect(result).toEqual(expectedTeam);
  });

  it('should propagate errors from the repository (e.g. invalid code)', async () => {
    const userId = 'user-123';
    const code = 'INVALID';
    const error = new Error('Invalid team code');
    
    mockTeamsRepository.joinTeam.mockRejectedValue(error);

    await expect(useCase.execute(userId, code)).rejects.toThrow(error);
  });
});