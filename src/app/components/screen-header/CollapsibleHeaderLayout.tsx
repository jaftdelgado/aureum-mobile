import React, { useRef } from 'react';
import { View, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FixedHeader from './FixedHeader';
import DisplayTitle from './DisplayTitle';

const HEADER_HEIGHT = 40;
const END_REACHED_THRESHOLD = 120;

type Props = {
  title: string;
  onBack?: () => void;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  children: React.ReactNode;
};

export default function CollapsibleHeaderLayout({
  title,
  onBack,
  onEndReached,
  isFetchingNextPage,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const hasCalledEnd = useRef(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const distanceFromEnd = contentSize.height - (layoutMeasurement.height + contentOffset.y);

    if (
      distanceFromEnd < END_REACHED_THRESHOLD &&
      onEndReached &&
      !isFetchingNextPage &&
      !hasCalledEnd.current
    ) {
      hasCalledEnd.current = true;
      onEndReached();
    }

    if (distanceFromEnd > END_REACHED_THRESHOLD) {
      hasCalledEnd.current = false;
    }
  };

  return (
    <View className="flex-1">
      <FixedHeader title={title} scrollY={scrollY} onBack={onBack} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
          listener: handleScroll,
        })}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + insets.top + 20,
        }}>
        <DisplayTitle title={title} scrollY={scrollY} />
        {children}
      </Animated.ScrollView>
    </View>
  );
}
