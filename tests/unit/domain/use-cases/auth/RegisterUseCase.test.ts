import { RegisterUseCase } from '@domain/use-cases/auth/RegisterUseCase';
import type { AuthRepository } from '@domain/repositories/AuthRepository';
import type { ProfileRepository } from '@domain/repositories/ProfileRepository';
import type { RegisterData } from '@domain/entities/RegisterData';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let mockAuthRepo: jest.Mocked<AuthRepository>;
  let mockProfileRepo: jest.Mocked<ProfileRepository>;

  const registerData: RegisterData = {
    username: 'newuser',
    accountType: 'student',
    email: 'new@user.com',
    password: 'securePassword',
    firstName: 'New',
    lastName: 'User',
    isGoogle: false
  };

  beforeEach(() => {
    mockAuthRepo = {
      register: jest.fn(),
      deleteAuthUser: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    mockProfileRepo = {
      createProfile: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new RegisterUseCase(mockAuthRepo, mockProfileRepo);
    jest.clearAllMocks();
  });

  it('should successfully register user and create profile', async () => {
    const userId = 'user-id-123';
    mockAuthRepo.register.mockResolvedValue(userId);
    mockProfileRepo.createProfile.mockResolvedValue();

    await useCase.execute(registerData);

    expect(mockAuthRepo.register).toHaveBeenCalledWith(registerData);
    expect(mockProfileRepo.createProfile).toHaveBeenCalledWith(userId, registerData);
    expect(mockAuthRepo.deleteAuthUser).not.toHaveBeenCalled();
  });

  it('should perform rollback (deleteAuthUser) if profile creation fails', async () => {
    const userId = 'user-id-123';
    const profileError = new Error('Profile creation failed');
    
    mockAuthRepo.register.mockResolvedValue(userId);
    mockProfileRepo.createProfile.mockRejectedValue(profileError);
    mockAuthRepo.deleteAuthUser.mockResolvedValue();

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(useCase.execute(registerData)).rejects.toThrow(profileError);

    expect(mockAuthRepo.register).toHaveBeenCalledTimes(1);
    expect(mockProfileRepo.createProfile).toHaveBeenCalledTimes(1);
    expect(mockAuthRepo.deleteAuthUser).toHaveBeenCalledTimes(1); 

    consoleSpy.mockRestore();
  });

  it('should throw original error even if rollback fails (Catastrophic failure)', async () => {
    const userId = 'user-id-123';
    const profileError = new Error('Original Profile Error');
    const rollbackError = new Error('Rollback Error');

    mockAuthRepo.register.mockResolvedValue(userId);
    mockProfileRepo.createProfile.mockRejectedValue(profileError);
    mockAuthRepo.deleteAuthUser.mockRejectedValue(rollbackError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await expect(useCase.execute(registerData)).rejects.toThrow(profileError);

    expect(mockAuthRepo.deleteAuthUser).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('should propagate error if auth registration fails initially', async () => {
    const authError = new Error('Auth Registration Failed');
    mockAuthRepo.register.mockRejectedValue(authError);

    await expect(useCase.execute(registerData)).rejects.toThrow(authError);

    expect(mockProfileRepo.createProfile).not.toHaveBeenCalled();
    expect(mockAuthRepo.deleteAuthUser).not.toHaveBeenCalled();
  });
});