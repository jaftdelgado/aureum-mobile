import { GetStudentTeamsUseCase } from '@domain/use-cases/teams/GetStudentTeamsUseCase';
import type { TeamsRepository } from '@domain/repositories/TeamsRepository';
import type { Team } from '@domain/entities/Team';

describe('GetStudentTeamsUseCase', () => {
  let useCase: GetStudentTeamsUseCase;
  let mockTeamsRepository: jest.Mocked<TeamsRepository>;

  beforeEach(() => {
    mockTeamsRepository = {
      getStudentTeams: jest.fn(),
    } as unknown as jest.Mocked<TeamsRepository>;

    useCase = new GetStudentTeamsUseCase(mockTeamsRepository);
  });

  it('should return a list of teams for the given student', async () => {
    const studentId = 'student-123';
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

    mockTeamsRepository.getStudentTeams.mockResolvedValue(mockTeams);

    const result = await useCase.execute(studentId);

    expect(result).toEqual(mockTeams);
    expect(result).toHaveLength(2);
    expect(mockTeamsRepository.getStudentTeams).toHaveBeenCalledWith(studentId);
  });

  it('should return an empty list if student belongs to no teams', async () => {
    const studentId = 'new-student';
    mockTeamsRepository.getStudentTeams.mockResolvedValue([]);

    const result = await useCase.execute(studentId);

    expect(result).toEqual([]);
    expect(mockTeamsRepository.getStudentTeams).toHaveBeenCalledWith(studentId);
  });

  it('should propagate errors from the repository', async () => {
    const error = new Error('Database Error');
    mockTeamsRepository.getStudentTeams.mockRejectedValue(error);

    await expect(useCase.execute('student-123')).rejects.toThrow(error);
  });
});