import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';
import { getSimpleOptions } from '@features/market/constants/defaultMarketConfig';
import type { MarketConfig } from '@domain/entities/MarketConfig';
import type { SelectionOption } from '@core/components/SelectionSheet';

interface Props {
    config: MarketConfig;
    onOpenSelector: <T extends keyof MarketConfig>(
        key: T,
        title: string,
        optionsGetter: (t: any) => SelectionOption<any>[]
    ) => void;
    onToggleShortSelling: (value: boolean) => void;
}

export const RulesSection = ({ config, onOpenSelector, onToggleShortSelling }: Props) => {
    const { t } = useTranslation(['market']);

    return (
        <ListContainer
            title={t('market:settings.sections.tradingRules')}
            description={t('market:settings.sections.tradingRulesDesc')}
        >
            <ListOption
                text={t('market:settings.transactionFee')}
                rightText={t(`market:settings.options.${config.transactionFee.toLowerCase()}`)}
                onPress={() =>
                    onOpenSelector('transactionFee', t('market:settings.transactionFee'), getSimpleOptions)
                }
            />
            <ListOption
                text={t('market:settings.allowShortSelling')}
                showSwitch
                switchValue={config.allowShortSelling}
                onSwitchChange={onToggleShortSelling}
            />
        </ListContainer>
    );
};