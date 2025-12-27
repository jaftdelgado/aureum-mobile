import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button'; // Asegúrate de que la ruta sea correcta
import { MarketHeaderActions } from '../components/MarketHeaderActions';

export default function MarketScreen() {
  const { t } = useTranslation('market');
  const navigation = useNavigation();

  const handleSettings = () => console.log('Settings pressed');
  const handlePlay = () => console.log('Play pressed');

  const handleSell = () => console.log('Vender pressed');
  const handleBuy = () => console.log('Comprar pressed');

  return (
    <CollapsibleHeaderLayout
      title={t('title')}
      onBack={() => navigation.goBack()}
      rightAction={
        <MarketHeaderActions onSettingsPress={handleSettings} onPlayPress={handlePlay} />
      }>
      <View className="gap-6 p-4">
        {/* Mensaje de bienvenida */}
        <Text className="text-center text-secondaryText">{t('welcome_message')}</Text>

        {/* Acciones principales: Dos columnas */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              title={t('sell', 'Vender')}
              variant="secondary"
              onPress={handleSell}
              size="md"
            />
          </View>
          <View className="flex-1">
            <Button title={t('buy', 'Comprar')} variant="primary" onPress={handleBuy} size="md" />
          </View>
        </View>

        {/* Espacio para el resto del contenido del Market */}
      </View>
    </CollapsibleHeaderLayout>
  );
}
