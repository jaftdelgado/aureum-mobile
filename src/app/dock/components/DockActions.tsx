import React from 'react';
import { View } from 'react-native';
import { Text } from '@core/ui/Text';
import { HomeIcon } from '@app/dock/icons/HomeIcon';
import { TeamsIcon } from '@app/dock/icons/TeamsIcon';
import { LessonsIcon } from '@app/dock/icons/LessonsIcon';
import { SettingsIcon } from '@app/dock/icons/SettingsIcon';
import { useTabBarContext } from '@app/providers/TabBarProvider';
import { IconButton } from '@core/ui/IconButton';

export const DockActions: React.FC = () => {
  const { state, setDefault } = useTabBarContext();
  const cfg = state.config;

  const tabs = [
    { icon: HomeIcon, onPress: () => console.log('Home') },
    { icon: TeamsIcon, onPress: () => console.log('Teams') },
    { icon: LessonsIcon, onPress: () => console.log('Lessons') },
    { icon: SettingsIcon, onPress: () => console.log('Settings') },
  ];

  const DockTabBar = () => (
    <View className="flex-row items-center justify-between p-2">
      {tabs.map((tab, i) => (
        <IconButton
          key={i}
          icon={tab.icon}
          size="xl"
          variant="ghost"
          rounded="full"
          onPress={tab.onPress}
        />
      ))}
    </View>
  );

  const DockFormButtons = () => {
    if (!cfg) return null;

    const CancelIcon = cfg.cancelIcon;

    return (
      <View className="mt-3 flex-row items-center justify-between p-3">
        <IconButton
          icon={CancelIcon ?? (() => <Text weight="bold">X</Text>)}
          size="lg"
          variant="secondary"
          onPress={() => {
            cfg.onCancel?.();
            setDefault();
          }}
        />
        <IconButton
          icon={() => <Text weight="semibold">{cfg.submitLabel ?? 'Continuar'}</Text>}
          size="lg"
          variant="primary"
          className="ml-3 flex-1"
          onPress={cfg.onSubmit}
        />
      </View>
    );
  };

  const DockSingleButton = () => {
    if (!cfg) return null;
    const Icon = cfg.singleIcon;

    return (
      <View className="mt-2 items-center justify-center p-3">
        <IconButton
          icon={Icon ?? (() => <Text weight="bold" className="text-white"></Text>)}
          size="xl"
          variant="primary"
          rounded="full"
          onPress={cfg.onSubmit}
        />
      </View>
    );
  };

  switch (state.buttonsMode) {
    case 'form':
      return <DockFormButtons />;
    case 'single':
      return <DockSingleButton />;
    case 'tabbar':
    default:
      return <DockTabBar />;
  }
};
