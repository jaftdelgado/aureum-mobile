import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LessonsScreen from '@features/lessons/screens/LessonsScreen';
import { useLessons } from '@features/lessons/hooks/useLessons';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      primaryText: '#FFFFFF',
      secondaryText: '#999999',
      success: '#00FF00',
      warning: '#FFA500',
      error: '#FF0000',
    },
    isDark: true,
    toggleTheme: jest.fn(),
  })
}));

jest.mock('expo-av', () => ({
  Video: 'Video',
  ResizeMode: { CONTAIN: 'contain' },
}));

jest.mock('@infra/external/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ 
        data: { session: { access_token: 'fake-token' } }, 
        error: null 
      }),
    },
  },
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@features/lessons/hooks/useLessons');

describe('LessonsScreen', () => {
  const mockLessons = [
    { id: '1', title: 'Lección de Prueba', description: 'Descripción de prueba', thumbnailUrl: null, videoUrl: 'http://video.mp4' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar el indicador de carga cuando isLoading es true', () => {
    (useLessons as jest.Mock).mockReturnValue({ lessons: [], isLoading: true });
    const { getByTestId } = render(<LessonsScreen />);
    expect(getByTestId('lessons-loading-indicator')).toBeTruthy();
  });

  it('debe renderizar la lista de lecciones', () => {
    (useLessons as jest.Mock).mockReturnValue({ lessons: mockLessons, isLoading: false });
    const { getByText } = render(<LessonsScreen />);
    expect(getByText('Lección de Prueba')).toBeTruthy();
  });

  it('debe abrir el reproductor y mostrar el botón de cerrar al seleccionar una lección', async () => {
    (useLessons as jest.Mock).mockReturnValue({ lessons: mockLessons, isLoading: false });
    
    const { getByText, findByText } = render(<LessonsScreen />);
    
    const lessonItem = getByText('Lección de Prueba');
    fireEvent.press(lessonItem);

    const closeButton = await findByText('✕');
    expect(closeButton).toBeTruthy();
  });
});