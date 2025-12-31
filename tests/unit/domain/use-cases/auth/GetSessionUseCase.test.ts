import { GetSessionUseCase } from '@domain/use-cases/auth/GetSessionUseCase';
import type { AuthRepository } from '@domain/repositories/AuthRepository';
import type { ProfileRepository } from '@domain/repositories/ProfileRepository';
import type { LoggedInUser } from '@domain/entities/LoggedInUser';
import type { UserProfile } from '@domain/entities/UserProfile';

describe('GetSessionUseCase', () => {
  let useCase: GetSessionUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;

  // Datos de prueba reutilizables
  const basicUser: LoggedInUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: 'student',
    username: '',
    fullName: '',
    avatarUrl: 'https://google.com/avatar.png', 
    createdAt: ''
  };

  beforeEach(() => {
    mockAuthRepository = {
      getSession: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    mockProfileRepository = {
      getProfile: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new GetSessionUseCase(mockAuthRepository, mockProfileRepository);

    jest.clearAllMocks();
  });

  it('should return null if there is no active session', async () => {
    mockAuthRepository.getSession.mockResolvedValue(null);

    const result = await useCase.execute();

    expect(result).toBeNull();
    expect(mockProfileRepository.getProfile).not.toHaveBeenCalled();
  });

  it('should return enriched user data if session AND profile exist', async () => {
    mockAuthRepository.getSession.mockResolvedValue(basicUser);

    const fullProfile: UserProfile = {
      id: 'user-123',
      authUserId: 'user-123',
      username: 'pro_coder',
      fullName: 'Master Chief',
      role: 'professor',
      bio: 'I love testing',
      avatarUrl: 'https://custom.com/avatar.png', 
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockProfileRepository.getProfile.mockResolvedValue(fullProfile);

    const result = await useCase.execute();

    expect(result).not.toBeNull();
    expect(result?.username).toBe('pro_coder'); 
    expect(result?.role).toBe('professor'); 
    expect(result?.avatarUrl).toBe('https://custom.com/avatar.png');
  });

  it('should return basic user data if profile does NOT exist', async () => {
    mockAuthRepository.getSession.mockResolvedValue(basicUser);
    mockProfileRepository.getProfile.mockResolvedValue(null); 

    const result = await useCase.execute();

    expect(result).not.toBeNull();
    expect(result?.id).toBe('user-123');
    expect(result?.username).toBe(''); 
    expect(result?.avatarUrl).toBe(basicUser.avatarUrl); 
  });

  it('should return basic user data (Graceful Degradation) if fetching profile FAILS', async () => {
    mockAuthRepository.getSession.mockResolvedValue(basicUser);
    
    mockProfileRepository.getProfile.mockRejectedValue(new Error('DB Timeout'));

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const result = await useCase.execute();

    expect(result).toEqual(basicUser);
    expect(logSpy).toHaveBeenCalledWith("Perfil no encontrado o error:", expect.any(Error));
    
    logSpy.mockRestore(); 
  });
});