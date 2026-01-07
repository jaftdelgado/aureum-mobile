import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';
import { getCurrencyOptions } from '@features/market/constants/defaultMarketConfig';
import type { MarketConfig } from '@domain/entities/MarketConfig';
import type { SelectionOption } from '@core/components/SelectionSheet';

interface Props {
    config: MarketConfig;
    onOpenSelector: <T extends keyof MarketConfig>(
        key: T,
        title: string,
        optionsGetter: (t: any) => SelectionOption<any>[]
    ) => void;
}

export const BasicsSection = ({ config, onOpenSelector }: Props) => {
    const { t } = useTranslation(['market']);

    return (
        <ListContainer
            title={t('market:settings.sections.marketBasics')}
            description={t('market:settings.sections.marketBasicsDesc')}
        >
            <ListOption
                text={t('market:settings.initialCash')}
                rightText={config.initialCash.toLocaleString()}
                onPress={() => { }}
            />
            <ListOption
                text={t('market:settings.currency')}
                rightText={config.currency}
                onPress={() =>
                    onOpenSelector('currency', t('market:settings.currency'), getCurrencyOptions)
                }
            />
        </ListContainer>
    );
};