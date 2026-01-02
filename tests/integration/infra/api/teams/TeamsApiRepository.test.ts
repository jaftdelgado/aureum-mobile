import { TeamsApiRepository } from '@infra/api/teams/TeamsApiRepository';
import { httpClient, HttpError } from '@infra/api/http/client';
import { ProfileApiRepository } from '@infra/api/users/ProfileApiRepository';
import { mapTeamDTOToEntity } from '@infra/api/teams/team.mappers';

jest.mock('@infra/external/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock('@infra/api/http/client', () => {
  const actual = jest.requireActual('@infra/api/http/client');
  return {
    ...actual, 
    httpClient: {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
      getBlob: jest.fn(),
    },
  };
});

jest.mock('@infra/api/users/ProfileApiRepository');

jest.mock('@infra/api/teams/team.mappers', () => ({
  mapTeamDTOToEntity: jest.fn(),
}));

describe('TeamsApiRepository (Integration)', () => {
  let repository: TeamsApiRepository;

  const mockGet = httpClient.get as jest.Mock;
  const mockPost = httpClient.post as jest.Mock;
  const mockDelete = httpClient.delete as jest.Mock;
  const mockGetBlob = httpClient.getBlob as jest.Mock;
  const mockMapper = mapTeamDTOToEntity as jest.Mock;
  
  const mockGetPublicProfile = ProfileApiRepository.prototype.getPublicProfile as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TeamsApiRepository();
  });

  describe('getProfessorTeams', () => {
    it('should return mapped teams on success', async () => {
      const mockDTOs = [{ id: 1 }];
      const mockTeams = [{ id: 'team-1' }];
      
      mockGet.mockResolvedValue(mockDTOs);
      mockMapper.mockReturnValue(mockTeams[0]);

      const result = await repository.getProfessorTeams('prof-1');

      expect(mockGet).toHaveBeenCalledWith('/api/courses/professor/prof-1');
      expect(result).toEqual(mockTeams);
    });

    it('should return empty array on 404', async () => {
      mockGet.mockRejectedValue(new HttpError(404, 'Not found'));
      const result = await repository.getProfessorTeams('prof-1');
      expect(result).toEqual([]);
    });

    it('should throw on other errors', async () => {
      const error = new Error('Server Error');
      mockGet.mockRejectedValue(error);
      await expect(repository.getProfessorTeams('prof-1')).rejects.toThrow(error);
    });
  });

  describe('getStudentTeams', () => {
    it('should return mapped teams on success', async () => {
      mockGet.mockResolvedValue([{}]);
      mockMapper.mockReturnValue({ id: 'team-student' });

      const result = await repository.getStudentTeams('student-1');

      expect(mockGet).toHaveBeenCalledWith('/api/courses/student/student-1');
      expect(result).toHaveLength(1);
    });

    it('should return empty array on 404', async () => {
      mockGet.mockRejectedValue(new HttpError(404, 'Not found'));
      const result = await repository.getStudentTeams('student-1');
      expect(result).toEqual([]);
    });
  });

  describe('getTeamMembers', () => {
    const teamId = 'team-123';
    const memberships = [
      { userid: 'user-1', joinedat: '2023-01-01' },
      { userid: 'user-2', joinedat: '2023-01-02' }
    ];

    it('should fetch members and merge with profile data', async () => {
      mockGet.mockResolvedValue(memberships);
    
      mockGetPublicProfile.mockImplementation((id: string) => {
        if (id === 'user-1') return Promise.resolve({ id: 'user-1', name: 'Alice', email: 'a@a.com' });
        if (id === 'user-2') return Promise.resolve({ id: 'user-2', name: 'Bob', email: 'b@b.com' });
        return Promise.resolve(null);
      });

      const result = await repository.getTeamMembers(teamId);

      expect(mockGet).toHaveBeenCalledWith(`/api/courses/${teamId}/students`);
      expect(mockGetPublicProfile).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
    });

    it('should return "Usuario Desconocido" if profile not found', async () => {
      mockGet.mockResolvedValue([{ userid: 'ghost', joinedat: '2023' }]);
      mockGetPublicProfile.mockResolvedValue(null);

      const result = await repository.getTeamMembers(teamId);

      expect(result[0]).toMatchObject({
        id: 'ghost',
        name: 'Usuario Desconocido',
        email: 'Unknown'
      });
    });

    it('should filter out members if profile fetch crashes (inner try/catch)', async () => {
      const spyWarn = jest.spyOn(console, 'warn').mockImplementation();
      
      mockGet.mockResolvedValue([{ userid: 'crash-user' }]);
      mockGetPublicProfile.mockRejectedValue(new Error('Network fail'));

      const result = await repository.getTeamMembers(teamId);

      expect(result).toHaveLength(0); 
      expect(spyWarn).toHaveBeenCalled();
      spyWarn.mockRestore();
    });

    it('should return empty array if course not found (404)', async () => {
      const spyWarn = jest.spyOn(console, 'warn').mockImplementation();
      mockGet.mockRejectedValue(new HttpError(404, 'Not found'));

      const result = await repository.getTeamMembers(teamId);

      expect(result).toEqual([]);
      spyWarn.mockRestore();
    });
  });

  describe('createTeam', () => {
    const request = {
      professor_id: 'prof-1',
      name: 'Math',
      description: 'Hard math',
      image: { uri: 'file://img.jpg', type: 'image/png', name: 'math.png' }
    };

    it('should build FormData and post', async () => {
      mockPost.mockResolvedValue({ id: 100 });
      mockMapper.mockReturnValue({ id: 'team-100' });

      const result = await repository.createTeam(request);

      expect(mockPost).toHaveBeenCalledWith(
        '/api/courses',
        expect.any(FormData),
        expect.anything()
      );
      expect(result).toEqual({ id: 'team-100' });
    });

    it('should handle IMAGE_TOO_LARGE_SERVER error (413)', async () => {
      mockPost.mockRejectedValue(new HttpError(413, 'Payload Too Large'));

      await expect(repository.createTeam(request))
        .rejects.toThrow('IMAGE_TOO_LARGE_SERVER');
    });

    it('should propagate other errors', async () => {
      const err = new Error('Boom');
      mockPost.mockRejectedValue(err);
      await expect(repository.createTeam(request)).rejects.toThrow(err);
    });
  });

  describe('joinTeam', () => {
    const joinReq = { userId: 'u1', code: 'ABC' };

    it('should join successfully', async () => {
      mockPost.mockResolvedValue({});
      mockMapper.mockReturnValue({ id: 'joined' });

      const result = await repository.joinTeam(joinReq);
      
      expect(mockPost).toHaveBeenCalledWith('/api/memberships/join', {
        access_code: 'ABC',
        user_id: 'u1'
      });
      expect(result).toEqual({ id: 'joined' });
    });

    it('should map 404 to TEAM_NOT_FOUND', async () => {
      mockPost.mockRejectedValue(new HttpError(404, 'Not found'));
      await expect(repository.joinTeam(joinReq)).rejects.toThrow('TEAM_NOT_FOUND');
    });

    it('should map 409 to TEAM_ALREADY_MEMBER', async () => {
      mockPost.mockRejectedValue(new HttpError(409, 'Conflict'));
      await expect(repository.joinTeam(joinReq)).rejects.toThrow('TEAM_ALREADY_MEMBER');
    });
  });

  describe('removeMember', () => {
    it('should call delete endpoint', async () => {
      await repository.removeMember('team-1', 'user-1');
      expect(mockDelete).toHaveBeenCalledWith('/api/courses/team-1/members/user-1');
    });
  });

  describe('getTeamAvatar', () => {
    it('should return blob on success', async () => {
      const blob = new Blob();
      mockGetBlob.mockResolvedValue(blob);
      const result = await repository.getTeamAvatar('t1');
      expect(result).toBe(blob);
    });

    it('should return null on failure', async () => {
      mockGetBlob.mockRejectedValue(new Error('No image'));
      const result = await repository.getTeamAvatar('t1');
      expect(result).toBeNull();
    });
  });
});