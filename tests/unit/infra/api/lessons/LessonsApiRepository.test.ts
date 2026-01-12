import { LessonsApiRepository } from '@infra/api/lessons/LessonsApiRepository';
import { httpClient } from '@infra/api/http/client';
import { ENV } from '@app/config/env';

jest.mock('@infra/api/http/client', () => ({
  httpClient: {
    get: jest.fn(),
  },
}));

describe('LessonsApiRepository', () => {
  let repository: LessonsApiRepository;

  beforeEach(() => {
    repository = new LessonsApiRepository();
    jest.clearAllMocks();
  });

  it('debe obtener lecciones y mapear correctamente los campos', async () => {
    const mockDTOs = [
      { id: 'l1', title: 'Test', description: 'Desc', thumbnail: 'base64string' }
    ];

    (httpClient.get as jest.Mock).mockResolvedValue(mockDTOs);

    const result = await repository.getAll();

    expect(httpClient.get).toHaveBeenCalledWith('/api/lessons');
    expect(result[0]).toEqual({
      id: 'l1',
      title: 'Test',
      description: 'Desc',
      thumbnailUrl: 'data:image/png;base64,base64string',
      videoUrl: `${ENV.API_GATEWAY_URL}/api/lessons/l1/video`
    });
  });

  it('debe manejar thumbnail nulo correctamente', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue([{ id: '1', title: 'T', description: 'D', thumbnail: null }]);
    
    const result = await repository.getAll();
    expect(result[0].thumbnailUrl).toBeNull();
  });
});