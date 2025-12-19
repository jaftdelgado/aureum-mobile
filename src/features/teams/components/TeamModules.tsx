import React from 'react';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';
import { useTranslation } from 'react-i18next';
import {
  AssetsIcon,
  SettingsIcon,
  PortfolioIcon,
  MarketIcon,
} from '@features/teams/resources/svg/index';

interface TeamModulesProps {
  onOverview?: () => void;
  onMembers?: () => void;
  onAssets?: () => void;
  onSettings?: () => void;
}

export const TeamModules: React.FC<TeamModulesProps> = ({
  onOverview,
  onMembers,
  onAssets,
  onSettings,
}) => {
  const { t } = useTranslation('teams');

  return (
    <ListContainer>
      <ListOption text={t('team.overview')} onPress={onOverview} />
      <ListOption text={t('team.members')} onPress={onMembers} />
      <ListOption text={t('team.market')} icon={MarketIcon} iconVariant="blue" />
      <ListOption
        text={t('team.assets')}
        onPress={onAssets}
        icon={AssetsIcon}
        iconVariant="yellow"
      />
      <ListOption text={t('team.portfolio')} icon={PortfolioIcon} iconVariant="green" />
      <ListOption
        text={t('team.settings')}
        onPress={onSettings}
        icon={SettingsIcon}
        iconVariant="dark-gray"
      />
    </ListContainer>
  );
};
