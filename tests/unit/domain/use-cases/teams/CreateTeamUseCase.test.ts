import { CreateTeamUseCase } from '@domain/use-cases/teams/CreateTeamUseCase';
import type { TeamsRepository } from '@domain/repositories/TeamsRepository';
import type { Team } from '@domain/entities/Team';
import type { CreateTeamRequestDTO } from '@infra/api/teams/team.dto';

describe('CreateTeamUseCase', () => {
  let useCase: CreateTeamUseCase;
  let mockTeamsRepository: jest.Mocked<TeamsRepository>;

  beforeEach(() => {
    mockTeamsRepository = {
      createTeam: jest.fn(),
    } as unknown as jest.Mocked<TeamsRepository>;

    useCase = new CreateTeamUseCase(mockTeamsRepository);
  });

  it('should call createTeam on repository and return the created team', async () => {
    const request: CreateTeamRequestDTO = {
      name: 'Dream Team',
      professor_id: 'prof-123'
    };

    const expectedTeam: Team = {
      public_id: 'team-1',
      name: 'Dream Team',
      access_code: '123456',
      professor_id: 'prof-123',
      created_at: '2024-01-01T00:00:00Z',
    };

    mockTeamsRepository.createTeam.mockResolvedValue(expectedTeam);

    const result = await useCase.execute(request);

    expect(mockTeamsRepository.createTeam).toHaveBeenCalledWith(request);
    expect(result).toEqual(expectedTeam);
  });

  it('should propagate errors from repository', async () => {
    const request: CreateTeamRequestDTO = { name: 'Fail Team', professor_id: 'prof-123' };
    const error = new Error('Creation failed');
    mockTeamsRepository.createTeam.mockRejectedValue(error);

    await expect(useCase.execute(request)).rejects.toThrow(error);
  });
});