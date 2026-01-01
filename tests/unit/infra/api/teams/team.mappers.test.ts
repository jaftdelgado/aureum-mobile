import { mapTeamDTOToEntity } from '@infra/api/teams/team.mappers';
import type { TeamDTO } from '@infra/api/teams/team.dto';

jest.mock('@app/config/env', () => ({
  ENV: {
    API_GATEWAY_URL: 'https://mock-gateway.com',
  },
}));

describe('Team Mappers', () => {
  
  describe('mapTeamDTOToEntity', () => {
    const baseDto: TeamDTO = {
      public_id: 'team-123',
      professor_id: 'prof-1',
      name: 'Physics 101',
      description: 'Intro class',
      team_pic: 'some-path.jpg',
      access_code: 'PHYS1',
      created_at: '2023-01-01'
    };

    it('should map all fields correctly and construct full image URL when team_pic exists', () => {
      const result = mapTeamDTOToEntity(baseDto);

      expect(result).toEqual({
        public_id: 'team-123',
        professor_id: 'prof-1',
        name: 'Physics 101',
        description: 'Intro class',
        team_pic: 'https://mock-gateway.com/api/courses/team-123/image',
        access_code: 'PHYS1',
        created_at: '2023-01-01'
      });
    });

    it('should set team_pic to undefined if DTO team_pic is missing/null', () => {
      const dtoNoImage: TeamDTO = { ...baseDto, team_pic: null };
      
      const result = mapTeamDTOToEntity(dtoNoImage);

      expect(result.team_pic).toBeUndefined();
    });

    it('should set description to undefined if DTO description is null', () => {
      const dtoNoDesc: TeamDTO = { ...baseDto, description: null };
      
      const result = mapTeamDTOToEntity(dtoNoDesc);

      expect(result.description).toBeUndefined();
    });

    it('should use the public_id in the image URL construction, not other IDs', () => {
      const dtoDifferentIds: TeamDTO = { 
        ...baseDto, 
        public_id: 'public-id-abc',
        professor_id: 'prof-id-xyz'
      };

      const result = mapTeamDTOToEntity(dtoDifferentIds);

      expect(result.team_pic).toContain('/api/courses/public-id-abc/image');
    });
  });
});