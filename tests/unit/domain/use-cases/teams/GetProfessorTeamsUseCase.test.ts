import { GetProfessorTeamsUseCase } from '@domain/use-cases/teams/GetProfessorTeamsUseCase';
import type { TeamsRepository } from '@domain/repositories/TeamsRepository';
import type { Team } from '@domain/entities/Team';

describe('GetProfessorTeamsUseCase', () => {
  let useCase: GetProfessorTeamsUseCase;
  let mockTeamsRepository: jest.Mocked<TeamsRepository>;

  beforeEach(() => {
    mockTeamsRepository = {
      getProfessorTeams: jest.fn(),
    } as unknown as jest.Mocked<TeamsRepository>;

    useCase = new GetProfessorTeamsUseCase(mockTeamsRepository);
  });

  it('should return a list of teams for the given professor', async () => {
    const professorId = 'prof-123';
    const mockTeams: Team[] = [
      {
        public_id: 'team-1',
        name: 'Dream Team',
        access_code: '123456',
        professor_id: 'prof-123',
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        public_id: 'team-2',
        name: 'Dream Team 2',
        access_code: '123456',
        professor_id: 'prof-123',
        created_at: '2024-01-01T00:00:00Z',
      }
    ];

    mockTeamsRepository.getProfessorTeams.mockResolvedValue(mockTeams);
    const result = await useCase.execute(professorId);

    expect(result).toEqual(mockTeams);
    expect(result).toHaveLength(2);
    expect(mockTeamsRepository.getProfessorTeams).toHaveBeenCalledWith(professorId);
  });

  it('should return an empty list if professor has no teams', async () => {
    const professorId = 'new-prof';
    mockTeamsRepository.getProfessorTeams.mockResolvedValue([]);

    const result = await useCase.execute(professorId);

    expect(result).toEqual([]);
    expect(mockTeamsRepository.getProfessorTeams).toHaveBeenCalledWith(professorId);
  });

  it('should propagate errors from the repository', async () => {
    const error = new Error('Database connection failed');
    mockTeamsRepository.getProfessorTeams.mockRejectedValue(error);

    await expect(useCase.execute('prof-123')).rejects.toThrow(error);
  });
});