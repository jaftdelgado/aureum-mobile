import { GetLessonsUseCase } from '@domain/use-cases/lessons/GetLessonsUseCase';
import { LessonsApiRepository } from '@infra/api/lessons/LessonsApiRepository';
import { Lesson } from '@domain/entities/Lesson';

describe('GetLessonsUseCase', () => {
  let useCase: GetLessonsUseCase;
  let mockRepo: jest.Mocked<LessonsApiRepository>;

  const mockLessons: Lesson[] = [
    { id: '1', title: 'Lección 1', description: 'Desc 1', thumbnailUrl: 'url1', videoUrl: 'v1' },
    { id: '2', title: 'Lección 2', description: 'Desc 2', thumbnailUrl: null, videoUrl: 'v2' },
  ];

  beforeEach(() => {
    mockRepo = {
      getAll: jest.fn(),
    } as unknown as jest.Mocked<LessonsApiRepository>;

    useCase = new GetLessonsUseCase(mockRepo);
  });

  it('debe retornar la lista de lecciones desde el repositorio', async () => {
    mockRepo.getAll.mockResolvedValue(mockLessons);

    const result = await useCase.execute();

    expect(result).toEqual(mockLessons);
    expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
  });

  it('debe propagar el error si el repositorio falla', async () => {
    const error = new Error('API Error');
    mockRepo.getAll.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('API Error');
  });
});