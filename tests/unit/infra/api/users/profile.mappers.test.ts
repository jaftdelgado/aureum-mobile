import { mapDTOToUserProfile, mapDTOToTeamMember } from '@infra/api/users/profile.mappers';
import type { UserProfileDTO } from '@infra/api/users/profile.dto';

describe('Profile Mappers', () => {
  
  const baseDto: UserProfileDTO = {
    id: 'profile-uuid-1',
    auth_user_id: 'auth-user-123',
    username: 'juanp',
    full_name: 'Juan Perez',
    bio: 'Dev Life',
    role: 'student',
    profile_pic_id: 'img-123',
    created_at: '2023-05-20T10:00:00Z',
    email: 'juan@test.com' 
  };

  describe('mapDTOToUserProfile', () => {
    it('should map all fields correctly including Date conversion', () => {
      const result = mapDTOToUserProfile(baseDto);

      expect(result).toEqual({
        id: 'profile-uuid-1',
        authUserId: 'auth-user-123',
        username: 'juanp',
        fullName: 'Juan Perez',
        bio: 'Dev Life',
        role: 'student',
        avatarUrl: 'img-123',
        createdAt: new Date('2023-05-20T10:00:00Z') 
      });
    });

    it('should handle missing nullable fields (avatar, createdAt)', () => {
      const dtoWithNulls: UserProfileDTO = {
        ...baseDto,
        profile_pic_id: null,
        created_at: undefined 
      };

      const result = mapDTOToUserProfile(dtoWithNulls);

      expect(result.avatarUrl).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
    });
  });

  describe('mapDTOToTeamMember', () => {
    it('should map DTO to TeamMember using auth_user_id as the Member ID', () => {
      const result = mapDTOToTeamMember(baseDto);

      expect(result).toEqual({
        id: 'auth-user-123', 
        name: 'Juan Perez',
        email: 'juan@test.com',
        role: 'student',
        avatarUrl: 'img-123'
      });
    });

    it('should provide fallback for missing email', () => {
      const dtoNoEmail = { ...baseDto, email: undefined };
      const result = mapDTOToTeamMember(dtoNoEmail);

      expect(result.email).toBe("");
    });

    it('should provide fallback for missing avatar', () => {
      const dtoNoPic = { ...baseDto, profile_pic_id: null };
      const result = mapDTOToTeamMember(dtoNoPic);

      expect(result.avatarUrl).toBeUndefined();
    });
  });
});