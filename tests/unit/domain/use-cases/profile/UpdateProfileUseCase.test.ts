import { UpdateProfileUseCase, ImageUploadError } from '@domain/use-cases/profile/UpdateProfileUseCase';
import type { ProfileRepository } from '@domain/repositories/ProfileRepository';
import type { UpdateProfileParams } from '@domain/use-cases/profile/UpdateProfileUseCase';

describe('UpdateProfileUseCase', () => {
  let useCase: UpdateProfileUseCase;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;

  const baseParams: UpdateProfileParams = {
    userId: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Hello world',
  };

  beforeEach(() => {
    mockProfileRepository = {
      updateProfile: jest.fn(),
      uploadAvatar: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new UpdateProfileUseCase(mockProfileRepository);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should update profile text data with formatted full name (trimming spaces)', async () => {
    const params: UpdateProfileParams = {
      ...baseParams,
      firstName: '  Pepe  ',
      lastName: '  Mujica  ', 
      bio: '  Presidente  ',
      image: undefined
    };

    mockProfileRepository.updateProfile.mockResolvedValue();

    await useCase.execute(params);

    expect(mockProfileRepository.updateProfile).toHaveBeenCalledWith(
      baseParams.userId,
      {
        full_name: 'Pepe Mujica', 
        bio: 'Presidente'      
      }
    );
    expect(mockProfileRepository.uploadAvatar).not.toHaveBeenCalled();
  });

  it('should update profile text AND upload avatar if image is provided', async () => {
    const params: UpdateProfileParams = {
      ...baseParams,
      image: { uri: 'file://img.jpg', fileName: 'custom.jpg', mimeType: 'image/png' }
    };

    mockProfileRepository.updateProfile.mockResolvedValue();
    mockProfileRepository.uploadAvatar.mockResolvedValue();

    await useCase.execute(params);

    expect(mockProfileRepository.updateProfile).toHaveBeenCalledTimes(1);
    
    expect(mockProfileRepository.uploadAvatar).toHaveBeenCalledWith(
      baseParams.userId,
      {
        uri: 'file://img.jpg',
        name: 'custom.jpg',
        type: 'image/png'
      }
    );
  });

  it('should use default name and type for image if not provided', async () => {
    const params: UpdateProfileParams = {
      ...baseParams,
      image: { uri: 'file://simple.jpg' } 
    };


    await useCase.execute(params);

    expect(mockProfileRepository.uploadAvatar).toHaveBeenCalledWith(
      baseParams.userId,
      expect.objectContaining({
        name: `avatar_${baseParams.userId}.jpg`, 
        type: 'image/jpeg'                       
      })
    );
  });

  it('should throw specific ImageUploadError if avatar upload fails', async () => {
    const params: UpdateProfileParams = {
      ...baseParams,
      image: { uri: 'file://img.jpg' }
    };

    mockProfileRepository.updateProfile.mockResolvedValue();
    mockProfileRepository.uploadAvatar.mockRejectedValue(new Error('Network Fail'));

    await expect(useCase.execute(params)).rejects.toThrow(ImageUploadError);
    
    expect(mockProfileRepository.updateProfile).toHaveBeenCalled();
  });

  it('should propagate error immediately if updateProfile (text) fails', async () => {
    const dbError = new Error('DB Error');
    mockProfileRepository.updateProfile.mockRejectedValue(dbError);

    await expect(useCase.execute(baseParams)).rejects.toThrow(dbError);

    expect(mockProfileRepository.uploadAvatar).not.toHaveBeenCalled();
  });
});