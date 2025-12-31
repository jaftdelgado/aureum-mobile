import { CheckProfileExistsUseCase } from '@domain/use-cases/auth/CheckProfileExistsUseCase';
import type { ProfileRepository } from '@domain/repositories/ProfileRepository';

describe('CheckProfileExistsUseCase', () => {
  let useCase: CheckProfileExistsUseCase;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    mockProfileRepository = {
      checkProfileExists: jest.fn(), 
      getProfile: jest.fn(),         
      updateProfile: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new CheckProfileExistsUseCase(mockProfileRepository);
  });

  it('should return true if the repository returns true (Profile exists)', async () => {
    const authId = 'user-123';
    mockProfileRepository.checkProfileExists.mockResolvedValue(true);

    const result = await useCase.execute(authId);

    expect(result).toBe(true); 
    expect(mockProfileRepository.checkProfileExists).toHaveBeenCalledWith(authId);
  });

  it('should return false if the repository returns false (Profile does not exist)', async () => {
    const authId = 'user-new-456';
    mockProfileRepository.checkProfileExists.mockResolvedValue(false);

    const result = await useCase.execute(authId);

    expect(result).toBe(false);
    expect(mockProfileRepository.checkProfileExists).toHaveBeenCalledWith(authId);
  });

  it('should propagate errors from the repository', async () => {
    const error = new Error('Database connection failed');
    mockProfileRepository.checkProfileExists.mockRejectedValue(error);

    await expect(useCase.execute('any-id')).rejects.toThrow('Database connection failed');
  });
});