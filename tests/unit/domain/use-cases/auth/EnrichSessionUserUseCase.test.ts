import { EnrichSessionUserUseCase } from '@domain/use-cases/auth/EnrichSessionUserUseCase';
import type { AuthRepository } from '@domain/repositories/AuthRepository';
import type { ProfileRepository } from '@domain/repositories/ProfileRepository';
import type { UserProfile } from '@domain/entities/UserProfile';

describe('EnrichSessionUserUseCase', () => {
  let useCase: EnrichSessionUserUseCase;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      getSession: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    mockProfileRepository = {
      getProfile: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new EnrichSessionUserUseCase(mockAuthRepository, mockProfileRepository);
  });

  it('should enrich the provided authUser with profile data if profile exists', async () => {
    const authUser = { id: 'user-123', email: 'test@example.com' };
    
    const mockProfile: UserProfile = {
      id: 'user-123',
      authUserId: 'user-123',
      username: 'cool_user',
      fullName: 'John Doe',
      role: 'professor',
      avatarUrl: 'https://avatar.com/1.png',
      createdAt: new Date('2023-01-01'), 
      updatedAt: new Date()
    };

    mockProfileRepository.getProfile.mockResolvedValue(mockProfile);

    const result = await useCase.execute(authUser);

    expect(result).not.toBeNull();
    expect(result?.id).toBe('user-123');
    expect(result?.username).toBe('cool_user');
    expect(result?.role).toBe('professor');
    expect(result?.createdAt).toBe(mockProfile.createdAt?.toDateString());
    
    expect(mockAuthRepository.getSession).not.toHaveBeenCalled();
    expect(mockProfileRepository.getProfile).toHaveBeenCalledWith('user-123');
  });

  it('should fetch session if no authUser is provided, then enrich with profile', async () => {
    const sessionUser = { id: 'session-user-999', email: 'session@example.com' };
    mockAuthRepository.getSession.mockResolvedValue(sessionUser as any); 

    const mockProfile: UserProfile = {
      id: 'session-user-999',
      username: 'session_master',
      fullName: 'Session Master',
      role: 'student',
      createdAt: new Date(),
    } as UserProfile;

    mockProfileRepository.getProfile.mockResolvedValue(mockProfile);

    const result = await useCase.execute(); 

    expect(result?.id).toBe('session-user-999');
    expect(result?.username).toBe('session_master');
    expect(mockAuthRepository.getSession).toHaveBeenCalled(); 
  });

  it('should return a basic user shell if user exists but Profile does NOT exist', async () => {
    const authUser = { id: 'new-user-000', email: 'new@example.com' };
    
    mockProfileRepository.getProfile.mockResolvedValue(null);

    const result = await useCase.execute(authUser);

    expect(result).not.toBeNull();
    expect(result?.id).toBe('new-user-000');
    expect(result?.role).toBe('student');
    expect(result?.fullName).toBe('');    
    expect(result?.username).toBe('');
  });

  it('should return null if no authUser is provided and no Session exists', async () => {
    mockAuthRepository.getSession.mockResolvedValue(null); 

    const result = await useCase.execute(); 

    expect(result).toBeNull();
    expect(mockProfileRepository.getProfile).not.toHaveBeenCalled(); 
  });
});