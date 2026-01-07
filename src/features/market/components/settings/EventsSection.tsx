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
}

export const EventsSection = ({ config, onOpenSelector }: Props) => {
    const { t } = useTranslation(['market']);

    return (
        <ListContainer
            title={t('market:settings.sections.marketEvents')}
            description={t('market:settings.sections.marketEventsDesc')}
        >
            <ListOption
                text={t('market:settings.eventFrequency')}
                rightText={t(`market:settings.options.${config.eventFrequency.toLowerCase()}`)}
                onPress={() =>
                    onOpenSelector('eventFrequency', t('market:settings.eventFrequency'), getSimpleOptions)
                }
            />
            <ListOption
                text={t('market:settings.dividendImpact')}
                rightText={t(`market:settings.options.${config.dividendImpact.toLowerCase()}`)}
                onPress={() =>
                    onOpenSelector('dividendImpact', t('market:settings.dividendImpact'), getSimpleOptions)
                }
            />
            <ListOption
                text={t('market:settings.crashImpact')}
                rightText={t(`market:settings.options.${config.crashImpact.toLowerCase()}`)}
                onPress={() =>
                    onOpenSelector('crashImpact', t('market:settings.crashImpact'), getSimpleOptions)
                }
            />
        </ListContainer>
    );
};