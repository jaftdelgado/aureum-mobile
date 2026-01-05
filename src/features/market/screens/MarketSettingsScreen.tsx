import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { ListOption } from '@core/ui/ListOption';
import { ListContainer } from '@core/ui/ListContainer';

export default function MarketSettingsScreen() {
  const { t } = useTranslation(['market']);
  const navigation = useNavigation();

  const [allowShortSelling, setAllowShortSelling] = useState(false);

  return (
    <CollapsibleHeaderLayout title={t('market:settings_title')} onBack={() => navigation.goBack()}>
      <ScrollView className="flex-1 py-4" contentContainerStyle={{ padding: 16, gap: 32 }}>
        <ListContainer
          title={t('market:simulator.sections.marketBasics')}
          description={t('market:simulator.sections.marketBasicsDesc')}>
          <ListOption
            text={t('market:simulator.settings.initialCash')}
            rightText="10,000"
            onPress={() => {}}
          />
          <ListOption
            text={t('market:simulator.settings.currency')}
            rightText="USD"
            onPress={() => {}}
          />
        </ListContainer>

        <ListContainer
          title={t('market:simulator.sections.marketParams')}
          description={t('market:simulator.sections.marketParamsDesc')}>
          <ListOption
            text={t('market:simulator.settings.marketVolatility')}
            rightText={t('market:common.medium', 'Media')}
            onPress={() => {}}
          />
          <ListOption
            text={t('market:simulator.settings.marketLiquidity')}
            rightText={t('market:common.high', 'Alta')}
            onPress={() => {}}
          />
          <ListOption
            text={t('market:simulator.settings.thickSpeed')}
            rightText="1s"
            onPress={() => {}}
          />
        </ListContainer>

        <ListContainer
          title={t('market:simulator.sections.tradingRules')}
          description={t('market:simulator.sections.tradingRulesDesc')}>
          <ListOption
            text={t('market:simulator.settings.transactionFee')}
            rightText="0.1%"
            onPress={() => {}}
          />
          <ListOption
            text={t('market:simulator.settings.allowShortSelling')}
            showSwitch
            switchValue={allowShortSelling}
            onSwitchChange={setAllowShortSelling}
          />
        </ListContainer>

        <ListContainer
          title={t('market:simulator.sections.marketEvents')}
          description={t('market:simulator.sections.marketEventsDesc')}>
          <ListOption
            text={t('market:simulator.settings.eventFrequency')}
            rightText={t('market:common.low', 'Baja')}
            onPress={() => {}}
          />
          <ListOption
            text={t('market:simulator.settings.dividendImpact')}
            rightText={t('market:common.medium', 'Medio')}
            onPress={() => {}}
          />
          <ListOption
            text={t('market:simulator.settings.crashImpact')}
            rightText={t('market:common.high', 'Alto')}
            onPress={() => {}}
          />
        </ListContainer>
      </ScrollView>
    </CollapsibleHeaderLayout>
  );
}
