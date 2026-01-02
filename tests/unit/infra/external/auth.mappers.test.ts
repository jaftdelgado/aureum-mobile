import { mapUserDTOToLoggedInUser, mapSessionToUser } from '@infra/external/auth/auth.mappers';
import type { User } from '@supabase/supabase-js';
import type { LoggedInUserDTO } from '@infra/external/auth/auth.dto';
import { UserProfileDTO } from '@infra/api/users/profile.dto';

describe('Auth Mappers', () => {
  
  describe('mapUserDTOToLoggedInUser', () => {
    const baseDto: LoggedInUserDTO = {
      id: 'auth-123',
      email: 'test@example.com',
      created_at: '2023-01-01T00:00:00Z',
      avatar_url: 'http://auth-avatar.com'
    };

    it('should map DTO combined with ProfileDTO correctly', () => {
      const profileDto: UserProfileDTO = {
        id: 'prof-1',
        auth_user_id: 'auth-123',
        username: 'cooluser',
        full_name: 'Cool User',
        bio: 'I am cool',
        role: 'student',
        profile_pic_id: 'img-123'
      };

      const result = mapUserDTOToLoggedInUser(baseDto, profileDto);

      expect(result).toEqual({
        id: 'auth-123',
        email: 'test@example.com',
        createdAt: '2023-01-01T00:00:00Z',
        username: 'cooluser',
        fullName: 'Cool User',
        bio: 'I am cool',
        role: 'student',
        avatarUrl: 'img-123' 
      });
    });

    it('should handle missing ProfileDTO (undefined)', () => {
      const result = mapUserDTOToLoggedInUser(baseDto, undefined);

      expect(result).toEqual({
        id: 'auth-123',
        email: 'test@example.com',
        createdAt: '2023-01-01T00:00:00Z',
        username: undefined,
        fullName: undefined,
        bio: undefined,
        role: undefined,
        avatarUrl: 'http://auth-avatar.com' 
      });
    });

    it('should handle missing email in DTO', () => {
      const dtoWithoutEmail = { ...baseDto, email: undefined };
      const result = mapUserDTOToLoggedInUser(dtoWithoutEmail as any);
      
      expect(result.email).toBe("");
    });

    it('should prioritize Profile picture over Auth avatar', () => {
        const profileWithPic: UserProfileDTO = { 
            id: '1', auth_user_id: '1', profile_pic_id: 'priority-pic' 
        } as any;
        
        const result = mapUserDTOToLoggedInUser(baseDto, profileWithPic);
        expect(result.avatarUrl).toBe('priority-pic');
    });

    it('should return undefined avatar if neither exists', () => {
        const dtoNoAvatar = { ...baseDto, avatar_url: null };
        const result = mapUserDTOToLoggedInUser(dtoNoAvatar as any);
        expect(result.avatarUrl).toBeUndefined();
    });
  });

  describe('mapSessionToUser', () => {
    it('should map standard Supabase User correctly', () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@test.com',
        created_at: '2023-01-01',
        user_metadata: {
          username: 'tester',
          full_name: 'Test User',
          avatar_url: 'http://img.com',
          role: 'professor'
        }
      } as unknown as User;

      const result = mapSessionToUser(mockUser);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@test.com',
        createdAt: '2023-01-01',
        username: 'tester',
        fullName: 'Test User',
        avatarUrl: 'http://img.com',
        role: 'professor'
      });
    });

    it('should map Social Login metadata fallbacks (Google style)', () => {
      const googleUser = {
        id: 'g-123',
        email: 'g@g.com',
        created_at: '2023',
        user_metadata: {
          name: 'Google User',   
          picture: 'http://google.com/pic.jpg', 
        }
      } as unknown as User;

      const result = mapSessionToUser(googleUser);

      expect(result.fullName).toBe('Google User');
      expect(result.avatarUrl).toBe('http://google.com/pic.jpg');
    });

    it('should handle missing email and metadata', () => {
      const emptyUser = {
        id: 'u-1',
        created_at: 'now',

      } as unknown as User;

      const result = mapSessionToUser(emptyUser);

      expect(result.email).toBe("");
      expect(result.username).toBeUndefined();
      expect(result.role).toBeUndefined();
    });
  });
});