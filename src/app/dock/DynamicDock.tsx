import React from 'react';
import { View } from 'react-native';
import { useTabBarContext } from '@app/providers/TabBarProvider';
import { DockActions } from '@app/dock/components/DockActions';

const DynamicDock: React.FC = () => {
  const { state } = useTabBarContext();

  const RenderDockContent = () => {
    const cfg = state.config;
    if (!cfg?.component) return null;

    return (
      <View className="mb-4 w-full">
        <cfg.component />
      </View>
    );
  };

  return (
    <View pointerEvents="box-none" className="absolute inset-0">
      <View className="absolute bottom-12 left-14 right-14">
        <View className="rounded-[26px] bg-white p-1 shadow-md">
          {RenderDockContent()}
          <DockActions />
        </View>
      </View>
    </View>
  );
};

export { DynamicDock };
