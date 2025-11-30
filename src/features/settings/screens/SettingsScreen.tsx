// SettingsScreen.tsx
import React, { useRef } from 'react';
import { View, Animated } from 'react-native';
import FixedHeader from '@app/components/screen-header/FixedHeader';
import DisplayTitle from '@app/components/screen-header/DisplayTitle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ListContainer } from '@core/ui/ListContainer';
import { ListOption } from '@core/ui/ListOption';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View className="flex-1">
      {/* Barra superior fija */}
      <FixedHeader title="Settings" scrollY={scrollY} />

      {/* Scrollable content */}
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={{ paddingTop: 50 + insets.top, paddingHorizontal: 16 }}
        className="flex-1">
        {/* Título grande dentro del scroll */}
        <DisplayTitle title="Settings" subtitle="Manage your preferences" scrollY={scrollY} />

        {/* ListContainer con ListOptions */}
        <ListContainer>
          <ListOption text="Account" onPress={() => console.log('Account')} />
          <ListOption text="Notifications" onPress={() => console.log('Notifications')} />
          <ListOption text="Privacy & Security" onPress={() => console.log('Privacy')} />
          <ListOption text="Notifications" onPress={() => console.log('Notifications')} />
        </ListContainer>
      </Animated.ScrollView>
    </View>
  );
}
