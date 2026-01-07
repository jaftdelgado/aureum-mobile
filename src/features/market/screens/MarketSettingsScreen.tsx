import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { ListOption } from '@core/ui/ListOption';
import { ListContainer } from '@core/ui/ListContainer';

export default function MarketSettingsScreen() {
  const { t } = useTranslation('market');
  const navigation = useNavigation();

  const [allowShortSelling, setAllowShortSelling] = useState(false);

  return (
    <CollapsibleHeaderLayout title={t('settings_title')} onBack={() => navigation.goBack()}>
      <ScrollView className="flex-1 py-4" contentContainerStyle={{ padding: 16, gap: 32 }}>
        <ListContainer
          title={t('simulator.sections.marketBasics')}
          description={t('simulator.sections.marketBasicsDesc')}
        >
          <ListOption text={t('simulator.settings.initialCash')} rightText="10,000" onPress={() => {}} />
          <ListOption text={t('simulator.settings.currency')} rightText="USD" onPress={() => {}} />
        </ListContainer>

        <ListContainer
          title={t('simulator.sections.marketParams')}
          description={t('simulator.sections.marketParamsDesc')}
        >
          <ListOption
            text={t('simulator.settings.marketVolatility')}
            rightText={t('common.medium')}
            onPress={() => {}}
          />
          <ListOption
            text={t('simulator.settings.marketLiquidity')}
            rightText={t('common.high')}
            onPress={() => {}}
          />
          <ListOption text={t('simulator.settings.thickSpeed')} rightText="1s" onPress={() => {}} />
        </ListContainer>

        <ListContainer
          title={t('simulator.sections.tradingRules')}
          description={t('simulator.sections.tradingRulesDesc')}
        >
          <ListOption text={t('simulator.settings.transactionFee')} rightText="0.1%" onPress={() => {}} />
          <ListOption
            text={t('simulator.settings.allowShortSelling')}
            showSwitch
            switchValue={allowShortSelling}
            onSwitchChange={setAllowShortSelling}
          />
        </ListContainer>

        <ListContainer
          title={t('simulator.sections.marketEvents')}
          description={t('simulator.sections.marketEventsDesc')}
        >
          <ListOption text={t('simulator.settings.eventFrequency')} rightText={t('common.low')} onPress={() => {}} />
          <ListOption text={t('simulator.settings.dividendImpact')} rightText={t('common.medium')} onPress={() => {}} />
          <ListOption text={t('simulator.settings.crashImpact')} rightText={t('common.high')} onPress={() => {}} />
        </ListContainer>
      </ScrollView>
    </CollapsibleHeaderLayout>
  );
}
