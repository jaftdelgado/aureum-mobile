import { ProfileApiRepository } from '@infra/api/users/ProfileApiRepository';
import { httpClient, HttpError } from '@infra/api/http/client';
import { blobToBase64 } from '@core/utils/fileUtils';
import { mapDTOToUserProfile, mapDTOToTeamMember } from '@infra/api/users/profile.mappers';

jest.mock('@infra/external/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock('@infra/api/http/client', () => {

  const actualModule = jest.requireActual('@infra/api/http/client');
  
  return {
    __esModule: true,
    ...actualModule, 
    httpClient: {  
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      getBlob: jest.fn(),
    },
  };
});

jest.mock('@core/utils/fileUtils', () => ({
  blobToBase64: jest.fn(),
}));

jest.mock('@infra/api/users/profile.mappers', () => ({
  mapDTOToUserProfile: jest.fn(),
  mapDTOToTeamMember: jest.fn(),
}));

describe('ProfileApiRepository (Integration)', () => {
  let repository: ProfileApiRepository;

  const mockGet = httpClient.get as jest.Mock;
  const mockPost = httpClient.post as jest.Mock;
  const mockPatch = httpClient.patch as jest.Mock;
  const mockDelete = httpClient.delete as jest.Mock;
  const mockGetBlob = httpClient.getBlob as jest.Mock;
  const mockBlobToBase64 = blobToBase64 as jest.Mock;
  const mockMapToUserProfile = mapDTOToUserProfile as jest.Mock;
  const mockMapToTeamMember = mapDTOToTeamMember as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    repository = new ProfileApiRepository();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getProfile', () => {
    const authId = 'user-123';
    const mockDTO = { 
      id: 'profile-1', 
      auth_user_id: authId, 
      full_name: 'John Doe',
      profile_pic_id: 'avatar-123' 
    };
    const mockProfile = { 
      id: 'profile-1', 
      userId: authId, 
      fullName: 'John Doe', 
      avatarUrl: undefined 
    };

    it('should return profile with avatar if requests succeed', async () => {
      mockGet.mockResolvedValue(mockDTO);
      mockGetBlob.mockResolvedValue(new Blob(['img']));
      mockBlobToBase64.mockResolvedValue('base64-string');
      mockMapToUserProfile.mockReturnValue(mockProfile);

      const result = await repository.getProfile(authId);

      expect(mockGet).toHaveBeenCalledWith(`/api/users/profiles/${authId}`);
      expect(mockGetBlob).toHaveBeenCalledWith(`/api/users/profiles/${authId}/avatar`);
      expect(result).toEqual({ ...mockProfile, avatarUrl: 'base64-string' });
    });

    it('should NOT fetch avatar if profile_pic_id is null', async () => {
      mockGet.mockResolvedValue({ ...mockDTO, profile_pic_id: null });
      mockMapToUserProfile.mockReturnValue(mockProfile);

      const result = await repository.getProfile(authId);

      expect(mockGetBlob).not.toHaveBeenCalled();
      expect(result?.avatarUrl).toBeUndefined();
    });

    it('should return null if API returns 404', async () => {
      mockGet.mockRejectedValue(new HttpError(404, 'Not Found'));

      const result = await repository.getProfile(authId);

      expect(result).toBeNull();
    });

    it('should throw error for non-404 errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const error = new HttpError(500, 'Server Error');
      mockGet.mockRejectedValue(error);

      await expect(repository.getProfile(authId)).rejects.toThrow(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ProfileApiRepository] Error fetching profile:', 
        error
      );

      consoleSpy.mockRestore();
    });

    it('should retry fetching avatar up to 3 times on failure', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      mockGet.mockResolvedValue(mockDTO);
      mockMapToUserProfile.mockReturnValue(mockProfile);
      mockGetBlob.mockRejectedValue(new Error('Network Fail'));

      const promise = repository.getProfile(authId);
      await jest.runAllTimersAsync();
      const result = await promise;

      expect(mockGetBlob).toHaveBeenCalledTimes(3);
      expect(result?.avatarUrl).toBeUndefined();
    });

    it('should succeed fetching avatar on retry', async () => {
      mockGet.mockResolvedValue(mockDTO);
      mockMapToUserProfile.mockReturnValue(mockProfile);
      mockBlobToBase64.mockResolvedValue('ok-base64');
      
      mockGetBlob
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockResolvedValueOnce(new Blob(['img']));

      const promise = repository.getProfile(authId);
      await jest.runAllTimersAsync();
      const result = await promise;

      expect(mockGetBlob).toHaveBeenCalledTimes(2);
      expect(result?.avatarUrl).toBe('ok-base64');
    });
  });

  describe('getPublicProfile', () => {
    const userId = 'user-abc';

    it('should return team member with avatar', async () => {
      mockGet.mockResolvedValue({ profile_pic_id: 'pic' });
      mockGetBlob.mockResolvedValue(new Blob());
      mockBlobToBase64.mockResolvedValue('base64');
      mockMapToTeamMember.mockReturnValue({ id: 'u1', name: 'User' });

      const result = await repository.getPublicProfile(userId);

      expect(result).toEqual({ id: 'u1', name: 'User', avatarUrl: 'base64' });
    });

    it('should return null on 404 error', async () => {
      mockGet.mockRejectedValue({ status: 404 }); 
      const result = await repository.getPublicProfile(userId);
      expect(result).toBeNull();
    });

    it('should swallow other errors and return null (warn only)', async () => {
      mockGet.mockRejectedValue(new Error('Random Error'));
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await repository.getPublicProfile(userId);

      expect(result).toBeNull();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('checkProfileExists', () => {
    it('should return true on success', async () => {
      mockGet.mockResolvedValue({});
      const exists = await repository.checkProfileExists('uid');
      expect(exists).toBe(true);
    });

    it('should return false on 404', async () => {
      mockGet.mockRejectedValue(new HttpError(404, 'Not Found'));
      const exists = await repository.checkProfileExists('uid');
      expect(exists).toBe(false);
    });

    it('should throw on other errors', async () => {
      mockGet.mockRejectedValue(new Error('Boom'));
      await expect(repository.checkProfileExists('uid')).rejects.toThrow('Boom');
    });
  });

  describe('createProfile', () => {
    it('should post correct payload combining names and lowercasing role', async () => {
      const data: any = {
        firstName: 'Juan',
        lastName: 'Perez',
        username: 'juanp',
        accountType: 'Student' 
      };

      await repository.createProfile('auth-1', data);

      expect(mockPost).toHaveBeenCalledWith('/api/users/profiles', {
        auth_user_id: 'auth-1',
        username: 'juanp',
        full_name: 'Juan Perez', 
        bio: "",
        role: 'student', 
        profile_pic_id: null
      });
    });
  });

  describe('updateProfile', () => {
    it('should send PATCH request with data', async () => {
      const updateData = { bio: 'New bio' };
      await repository.updateProfile('auth-1', updateData);
      expect(mockPatch).toHaveBeenCalledWith('/api/users/profiles/auth-1', updateData);
    });
  });

  describe('uploadAvatar', () => {
    it('should construct FormData and POST it', async () => {
      const file = { uri: 'file://img.jpg', name: 'me.jpg', type: 'image/jpeg' };
      
      await repository.uploadAvatar('auth-1', file);

      expect(mockPost).toHaveBeenCalledWith(
        '/api/users/profiles/auth-1/avatar',
        expect.any(FormData), 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    });

    it('should use default name and type if missing', async () => {
        const file = { uri: 'file://img.jpg' }; 
        
        await repository.uploadAvatar('auth-1', file as any);

        expect(mockPost).toHaveBeenCalledWith(
            expect.stringContaining('/avatar'),
            expect.any(FormData),
            expect.any(Object)
        );
      });
  });

  describe('deleteAccount', () => {
    it('should send DELETE request', async () => {
      await repository.deleteAccount('auth-1');
      expect(mockDelete).toHaveBeenCalledWith('/api/users/profiles/auth-1');
    });
  });
});