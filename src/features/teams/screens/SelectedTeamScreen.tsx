import React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';
import { TeamModules } from '@features/teams/components/TeamModules';
import { useSelectedTeam } from '../hooks/useSelectedTeam';

export default function SelectedTeamScreen() {
  const insets = useSafeAreaInsets();

  const {
    t,
    scrollY,
    teamName,
    teamDescription,
    accessCode,      
    isCopied,
    handleCopyCode,
    handleMembers,
    handleAssets,
    handleSettings,
    handleMarket, 
    handleTransactions, 
    handleBack,
  } = useSelectedTeam();

  return (
    <View className="flex-1">
      <FixedHeader title={teamName} scrollY={scrollY} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={{
          paddingTop: 50 + insets.top,
          paddingHorizontal: 16,
          paddingBottom: 60,
        }}
        className="flex-1">
        <DisplayTitle title={teamName} scrollY={scrollY} />

        {teamDescription && (
          <View className="mb-4 mt-6 px-1">
            <Text type="body" color="secondary" align="center">
              {teamDescription}
            </Text>
          </View>
        )}

        {accessCode && (
          <TouchableOpacity 
            onPress={handleCopyCode}
            activeOpacity={0.7}
            className="mt-2 mb-6 dark:card rounded-xl p-4 flex-row justify-between items-center border border-gray-200 dark:border-slate-700"
          >
            <View>
              <Text type="caption1" color="secondary" className="uppercase text-xs tracking-wider">
                {t('team.access_code_label', 'Código de Acceso')}
              </Text>
              <Text type="body" weight="bold" className="text-primary mt-1 tracking-widest">
                {accessCode}
              </Text>
            </View>
            
            <View className={`px-3 py-1.5 rounded-full ${isCopied ? 'bg-green-100 dark:bg-green-900' : 'bg-white dark:bg-slate-700'}`}>
              <Text 
                type="caption2" 
                weight="bold" 
                className={isCopied ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-300'}
              >
                {isCopied ? t('common.copied', '¡Copiado!') : t('common.copy', 'Copiar')}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <TeamModules
          onMembers={handleMembers}
          onAssets={handleAssets}
          onSettings={handleSettings}
          onMarket={handleMarket}
          onTransactions={handleTransactions}
        />
      </Animated.ScrollView>

      <View className="absolute left-3 right-3" style={{ bottom: insets.bottom }}>
        <Button variant="outline" title={t('common.back')} onPress={handleBack} />
      </View>
    </View>
  );
}
