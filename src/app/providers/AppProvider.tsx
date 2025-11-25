import React, { ReactNode } from 'react';
import { QueryProvider } from '@app/providers/QueryProvider';
import { AuthProvider } from '@app/providers/AuthProvider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      <QueryProvider>{children}</QueryProvider>
    </AuthProvider>
  );
};
