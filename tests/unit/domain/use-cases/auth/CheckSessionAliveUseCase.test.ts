import { CheckSessionAliveUseCase } from '@domain/use-cases/auth/CheckSessionAliveUseCase';
import type { AuthRepository } from '@domain/repositories/AuthRepository';

describe('CheckSessionAliveUseCase', () => {
  let useCase: CheckSessionAliveUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      getSession: jest.fn(),
      checkSessionAlive: jest.fn(), 
      getPendingSocialUser: jest.fn(),
      onAuthStateChange: jest.fn(),
      setSession: jest.fn(),
      deleteAuthUser: jest.fn(),
      signInWithIdToken: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    useCase = new CheckSessionAliveUseCase(mockAuthRepository);
  });

  it('should return true if the session is alive', async () => {
    mockAuthRepository.checkSessionAlive.mockResolvedValue(true);

    const result = await useCase.execute();

    expect(result).toBe(true);
    expect(mockAuthRepository.checkSessionAlive).toHaveBeenCalledTimes(1);
  });

  it('should return false if the session is NOT alive', async () => {
    mockAuthRepository.checkSessionAlive.mockResolvedValue(false);

    const result = await useCase.execute();

    expect(result).toBe(false);
  });

  it('should return false (and not crash) if an unexpected error occurs', async () => {
    mockAuthRepository.checkSessionAlive.mockRejectedValue(new Error('Network Error'));

    const result = await useCase.execute();

    expect(result).toBe(false); 
  });
});