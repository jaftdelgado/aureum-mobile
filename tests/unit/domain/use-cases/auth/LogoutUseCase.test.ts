import { LogoutUseCase } from '@domain/use-cases/auth/LogoutUseCase';
import type { AuthRepository } from '@domain/repositories/AuthRepository';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      logout: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    useCase = new LogoutUseCase(mockAuthRepository);
  });

  it('should call logout on the repository successfully', async () => {
    mockAuthRepository.logout.mockResolvedValue();

    await useCase.execute();

    expect(mockAuthRepository.logout).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors if logout fails', async () => {
    const error = new Error('Logout failed');
    mockAuthRepository.logout.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow(error);
  });
});