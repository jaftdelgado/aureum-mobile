import React, { ReactNode } from 'react';
import { QueryProvider } from '@app/providers/QueryProvider';
import { TabBarProvider } from '@app/providers/TabBarProvider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryProvider>
      <TabBarProvider>{children}</TabBarProvider>
    </QueryProvider>
  );
};
