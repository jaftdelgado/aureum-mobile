import React from 'react';
import { View } from 'react-native';
import { Button } from '@core/ui/Button';
import { useTheme } from '@app/providers/ThemeProvider';

interface AssetsSelectionFooterProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const AssetsSelectionFooter: React.FC<AssetsSelectionFooterProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
}) => {
  const { theme } = useTheme();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t px-4 py-4 pb-8"
      style={{
        backgroundColor: theme.bg,
        borderColor: theme.border,
      }}>
      <Button title={title} onPress={onPress} isLoading={isLoading} disabled={disabled} />
    </View>
  );
};
