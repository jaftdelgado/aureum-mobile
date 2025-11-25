import React, { ReactNode } from 'react';
import { QueryProvider } from '@app/providers/QueryProvider';
<<<<<<< HEAD
import { AuthProvider } from './AuthProvider'; 
=======
import { TabBarProvider } from '@app/providers/TabBarProvider';
>>>>>>> c75afaf3ef0af4bc279d9d4dfd0b9d2625cb8d06

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
<<<<<<< HEAD
    <AuthProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </AuthProvider>
  );
};
=======
    <QueryProvider>
      <TabBarProvider>{children}</TabBarProvider>
    </QueryProvider>
  );
};
>>>>>>> c75afaf3ef0af4bc279d9d4dfd0b9d2625cb8d06
