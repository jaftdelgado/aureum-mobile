import { GetSocialUserUseCase } from '@domain/use-cases/auth/GetSocialUserUseCase';
import type { AuthRepository } from '@domain/repositories/AuthRepository';
import type { SocialUser } from '@domain/entities/SocialUser';

describe('GetSocialUserUseCase', () => {
  let useCase: GetSocialUserUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      getPendingSocialUser: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    useCase = new GetSocialUserUseCase(mockAuthRepository);
  });

  it('should return the social user when repository finds one', async () => {
    const socialUser: SocialUser = {
      email: 'test@social.com',
      firstName: 'Social',
      lastName: 'User'
    };
    mockAuthRepository.getPendingSocialUser.mockResolvedValue(socialUser);

    const result = await useCase.execute();

    expect(result).toEqual(socialUser);
    expect(mockAuthRepository.getPendingSocialUser).toHaveBeenCalledTimes(1);
  });

  it('should return null when repository returns null', async () => {
    mockAuthRepository.getPendingSocialUser.mockResolvedValue(null);

    const result = await useCase.execute();

    expect(result).toBeNull();
    expect(mockAuthRepository.getPendingSocialUser).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from the repository', async () => {
    const error = new Error('Auth Error');
    mockAuthRepository.getPendingSocialUser.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow(error);
  });
});