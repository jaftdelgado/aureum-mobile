import React from 'react';
import { AuthProvider } from './AuthProvider';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { FontProvider } from './FontProvider';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
      <FontProvider>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </FontProvider>
  );
};