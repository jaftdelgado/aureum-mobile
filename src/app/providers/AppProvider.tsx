import React, { ReactNode } from 'react';
import { QueryProvider } from '@app/providers/QueryProvider';
import { AuthProvider } from '@app/providers/AuthProvider';
import { ThemeProvider } from '@app/providers/ThemeProvider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
