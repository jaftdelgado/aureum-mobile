import React from 'react';
import { View } from 'react-native';
import { Button } from '@core/ui/Button';
import { Text } from '@core/ui/Text';
import { useSettings } from '../hooks/usesettings';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { loading, handleLogout, handleDeleteAccount } = useSettings();

  return (
    <View className="flex-1 justify-between bg-bg p-4">
      <View className="mt-4">
        <Text type="title1" weight="bold" className="mb-2">
          {t('settings.title')}
        </Text>
        <Text color="secondary">{t('settings.subtitle')}</Text>
      </View>

      <View className="mb-6 gap-4">
        <Button
          title={t('settings.logout')}
          variant="outline"
          onPress={handleLogout}
          disabled={loading}
          className="border-gray-300"
          textClassName="text-gray-700 font-medium"
        />

        <Button
          title={loading ? t('settings.deleting') : t('settings.deleteAccount')}
          variant="outline"
          onPress={handleDeleteAccount}
          disabled={loading}
          className="border-red-200 bg-red-50"
          textClassName="text-red-600 font-bold"
        />
      </View>
    </View>
  );
}
