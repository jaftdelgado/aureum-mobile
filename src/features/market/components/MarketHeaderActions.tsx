import React from 'react';
import { ButtonGroup } from '@core/components/ButtonGroup';
import { IconButton } from '@core/ui/IconButton';
import { SettingsIcon } from '@features/market/resources/svg/SettingsIcon';
import { PlayIcon } from '@features/market/resources/svg/PlayIcon';

interface MarketHeaderActionsProps {
  onSettingsPress?: () => void;
  onPlayPress?: () => void;
}

export const MarketHeaderActions = ({ onSettingsPress, onPlayPress }: MarketHeaderActionsProps) => {
  return (
    <ButtonGroup showSeparators className="mr-2">
      <IconButton icon={SettingsIcon} variant="thirdy" size="md" onPress={onSettingsPress} />
      <IconButton icon={PlayIcon} variant="thirdy" size="md" onPress={onPlayPress} />
    </ButtonGroup>
  );
};
