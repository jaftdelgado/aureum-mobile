import { renderHook, act } from '@testing-library/react-native';
import { useLessons } from '@features/lessons/hooks/useLessons';
import { getLessonsUseCase } from '@app/di';

jest.mock('@app/di', () => ({
  getLessonsUseCase: {
    execute: jest.fn(),
  },
}));

describe('useLessons Hook', () => {
  it('debe cargar las lecciones exitosamente', async () => {
    const mockData = [{ id: '1', title: 'Lesson 1' }];
    (getLessonsUseCase.execute as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useLessons());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {}); 

    expect(result.current.lessons).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores de carga', async () => {
    (getLessonsUseCase.execute as jest.Mock).mockRejectedValue(new Error('Fail'));

    const { result } = renderHook(() => useLessons());

    await act(async () => {});

    expect(result.current.error).toBe('Fail');
    expect(result.current.isLoading).toBe(false);
  });
});