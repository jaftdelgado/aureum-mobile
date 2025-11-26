import React from 'react';
import { View } from 'react-native';

export const Separator = ({ className }: { className?: string }) => (
  <View className={`h-[1px] bg-gray-200 w-full ${className}`} />
);