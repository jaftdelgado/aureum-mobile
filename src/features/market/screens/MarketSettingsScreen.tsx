import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { useTheme } from '@app/providers/ThemeProvider';
import { IconButton } from '@core/ui/IconButton';
import { SaveIcon } from '@resources/svg/general/SaveIcon';

import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import SelectionSheet, { SelectionOption } from '@core/components/SelectionSheet';
import { defaultMarketConfig } from '@features/market/constants/defaultMarketConfig';
import type { MarketConfig } from '@domain/entities/MarketConfig';

import { useMarketConfig } from '@features/market/hooks/useMarketConfig';
import { useSaveMarketConfig } from '@features/market/hooks/useMarketConfigMutations';

import {
  BasicsSection,
  ParamsSection,
  RulesSection,
  EventsSection,
} from '@features/market/components/settings';

type MarketSettingsParamList = {
  MarketSettings: { teamId: string };
};

type SheetConfigState = {
  title: string;
  options: SelectionOption<any>[];
  selectedValue: any;
  onSelect: (value: any) => void;
};

export default function MarketSettingsScreen() {
  const { t } = useTranslation(['market', 'common']);
  const navigation = useNavigation();
  const { theme } = useTheme();

  const route = useRoute<RouteProp<MarketSettingsParamList, 'MarketSettings'>>();
  const { teamId } = route.params;

  const { data: remoteConfig, isLoading: isFetching } = useMarketConfig(teamId);
  const { mutate: saveConfig, isPending: isSaving } = useSaveMarketConfig();

  const [config, setConfig] = useState<MarketConfig>(defaultMarketConfig);
  const sheetRef = useRef<BottomSheet>(null);
  const [activeSheet, setActiveSheet] = useState<SheetConfigState | null>(null);

  useEffect(() => {
    if (remoteConfig) {
      setConfig(remoteConfig);
    }
  }, [remoteConfig]);

  const openSelector = useCallback(
    <T extends keyof MarketConfig>(
      key: T,
      title: string,
      optionsGetter: (t: any) => SelectionOption<any>[]
    ) => {
      setActiveSheet({
        title,
        options: optionsGetter(t),
        selectedValue: config[key],
        onSelect: (newValue) => {
          setConfig((prev) => ({ ...prev, [key]: newValue }));
        },
      });
      sheetRef.current?.expand();
    },
    [t, config]
  );

  const handleSave = () => {
    const configToSave = { ...config, teamId };

    saveConfig(configToSave, {
      onSuccess: () => {
        Alert.alert(t('common:success'), t('market:settingsSaved'), [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      },
      onError: (error) => {
        console.error(error);
        Alert.alert(t('common:error'), t('market:settingsSaveError'));
      },
    });
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <CollapsibleHeaderLayout
        title={t('market:settings.title')}
        onBack={() => navigation.goBack()}
        rightAction={
          isSaving ? (
            <ActivityIndicator size="small" color={theme.primary} style={{ marginRight: 8 }} />
          ) : (
            <IconButton
              icon={SaveIcon}
              onPress={handleSave}
              variant="thirdy"
              disabled={isFetching}
            />
          )
        }>
        {isFetching ? (
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <ScrollView className="flex-1 py-4" contentContainerStyle={{ padding: 16, gap: 32 }}>
            <BasicsSection config={config} onOpenSelector={openSelector} />

            <ParamsSection config={config} onOpenSelector={openSelector} />

            <RulesSection
              config={config}
              onOpenSelector={openSelector}
              onToggleShortSelling={(val) =>
                setConfig((prev) => ({ ...prev, allowShortSelling: val }))
              }
            />

            <EventsSection config={config} onOpenSelector={openSelector} />
          </ScrollView>
        )}
      </CollapsibleHeaderLayout>

      <SelectionSheet
        ref={sheetRef}
        title={activeSheet?.title || ''}
        options={activeSheet?.options || []}
        selectedValue={activeSheet?.selectedValue}
        onSelect={activeSheet?.onSelect || (() => { })}
        snapPoints={['40%']}
      />
    </GestureHandlerRootView>
  );
}
