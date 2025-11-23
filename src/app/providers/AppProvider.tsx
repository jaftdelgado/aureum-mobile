import React, { ReactNode } from 'react';
import { QueryProvider } from '@app/providers/QueryProvider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return <QueryProvider>{children}</QueryProvider>;
};
