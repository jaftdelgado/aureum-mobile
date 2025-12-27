import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';

export const Separator = ({ className }: { className?: string }) => {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.border }} className={`h-[1px] w-full ${className}`} />
  );
};
