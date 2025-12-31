import { LoginUseCase } from '@domain/use-cases/auth/LoginUseCase';
import type { AuthRepository } from '@domain/repositories/AuthRepository';
import type { ProfileRepository } from '@domain/repositories/ProfileRepository';
import type { LoggedInUser } from '@domain/entities/LoggedInUser';
import type { UserProfile } from '@domain/entities/UserProfile';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockAuthRepo: jest.Mocked<AuthRepository>;
  let mockProfileRepo: jest.Mocked<ProfileRepository>;

  const baseUser: LoggedInUser = {
    id: 'user-1',
    email: 'test@test.com',
    role: 'student',
    username: '',
    fullName: '',
    avatarUrl: 'default-avatar',
    createdAt: ''
  };

  beforeEach(() => {
    mockAuthRepo = {
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    mockProfileRepo = {
      getProfile: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new LoginUseCase(mockAuthRepo, mockProfileRepo);
  });

  it('should return enriched user when login succeeds and profile exists', async () => {
    const profile: UserProfile = {
      id: 'user-1',
      authUserId: 'user-1',
      username: 'custom_user',
      fullName: 'Custom Name',
      role: 'professor',
      bio: 'Bio',
      avatarUrl: 'custom-avatar',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockAuthRepo.login.mockResolvedValue(baseUser);
    mockProfileRepo.getProfile.mockResolvedValue(profile);

    const result = await useCase.execute('test@test.com', 'password');

    expect(result).toEqual({
      ...baseUser,
      username: profile.username,
      fullName: profile.fullName,
      bio: profile.bio,
      role: profile.role,
      avatarUrl: profile.avatarUrl
    });
    expect(mockAuthRepo.login).toHaveBeenCalledWith('test@test.com', 'password');
    expect(mockProfileRepo.getProfile).toHaveBeenCalledWith(baseUser.id);
  });

  it('should return base user when login succeeds but profile is not found', async () => {
    mockAuthRepo.login.mockResolvedValue(baseUser);
    mockProfileRepo.getProfile.mockResolvedValue(null);

    const result = await useCase.execute('test@test.com', 'password');

    expect(result).toEqual(baseUser);
  });

  it('should return base user when fetching profile throws an error', async () => {
    mockAuthRepo.login.mockResolvedValue(baseUser);
    mockProfileRepo.getProfile.mockRejectedValue(new Error('Profile DB Error'));

    const result = await useCase.execute('test@test.com', 'password');

    expect(result).toEqual(baseUser);
  });

  it('should throw error when login fails', async () => {
    const error = new Error('Invalid credentials');
    mockAuthRepo.login.mockRejectedValue(error);

    await expect(useCase.execute('test@test.com', 'wrong-pass')).rejects.toThrow(error);
    expect(mockProfileRepo.getProfile).not.toHaveBeenCalled();
  });
});