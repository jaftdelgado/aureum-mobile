import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';
import { getSimpleOptions, getThickSpeedOptions } from '@features/market/constants/defaultMarketConfig';
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

export const ParamsSection = ({ config, onOpenSelector }: Props) => {
    const { t } = useTranslation(['market']);

    return (
        <ListContainer
            title={t('market:settings.sections.marketParams')}
            description={t('market:settings.sections.marketParamsDesc')}
        >
            <ListOption
                text={t('market:settings.marketVolatility')}
                rightText={t(`market:settings.options.${config.marketVolatility.toLowerCase()}`)}
                onPress={() =>
                    onOpenSelector('marketVolatility', t('market:settings.marketVolatility'), getSimpleOptions)
                }
            />
            <ListOption
                text={t('market:settings.marketLiquidity')}
                rightText={t(`market:settings.options.${config.marketLiquidity.toLowerCase()}`)}
                onPress={() =>
                    onOpenSelector('marketLiquidity', t('market:settings.marketLiquidity'), getSimpleOptions)
                }
            />
            <ListOption
                text={t('market:settings.thickSpeed')}
                rightText={t(`market:settings.options.${config.thickSpeed.toLowerCase()}`)}
                onPress={() =>
                    onOpenSelector('thickSpeed', t('market:settings.thickSpeed'), getThickSpeedOptions)
                }
            />
        </ListContainer>
    );
};