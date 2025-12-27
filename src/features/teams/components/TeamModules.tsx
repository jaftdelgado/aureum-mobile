import React from 'react';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';
import { useTranslation } from 'react-i18next';
import {
  AssetsIcon,
  SettingsIcon,
  PortfolioIcon,
  MarketIcon,
  OverviewIcon,
  MembersIcon,
  MovementsIcon,
} from '@features/teams/resources/svg/index';

interface TeamModulesProps {
  onMembers?: () => void;
  onMarket?: () => void;
  onAssets?: () => void;
  onTransactions?: () => void;
  onSettings?: () => void;
}

export const TeamModules: React.FC<TeamModulesProps> = ({
  onMembers,
  onMarket,
  onAssets,
  onTransactions,
  onSettings,
}) => {
  const { t } = useTranslation('teams');

  return (
    <ListContainer>
      <ListOption
        text={t('team.members')}
        onPress={onMembers}
        icon={MembersIcon}
        iconVariant="purple"
      />
      <ListOption text={t('team.market')} onPress={onMarket} icon={MarketIcon} iconVariant="blue" />
      <ListOption
        text={t('team.assets')}
        onPress={onAssets}
        icon={AssetsIcon}
        iconVariant="yellow"
      />
      <ListOption text={t('team.portfolio')} icon={PortfolioIcon} iconVariant="green" />
      <ListOption
        text={t('team.movements')}
        onPress={onTransactions}
        icon={MovementsIcon}
        iconVariant="purple"
      />
      <ListOption
        text={t('team.settings')}
        onPress={onSettings}
        icon={SettingsIcon}
        iconVariant="dark-gray"
      />
    </ListContainer>
  );
};
