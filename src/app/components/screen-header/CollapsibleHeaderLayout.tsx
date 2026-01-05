import React, { useRef } from 'react';
import { View, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FixedHeader from './FixedHeader';
import DisplayTitle from './DisplayTitle';

const HEADER_HEIGHT = 44;
const MODAL_TOP_SPACING = 16;
const END_REACHED_THRESHOLD = 120;

type Props = {
  title: string;
  onBack?: () => void;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  isModal?: boolean;
};

export default function CollapsibleHeaderLayout({
  title,
  onBack,
  onEndReached,
  isFetchingNextPage,
  children,
  rightAction,
  isModal = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const hasCalledEnd = useRef(false);

  const headerSpace = isModal ? HEADER_HEIGHT + MODAL_TOP_SPACING : HEADER_HEIGHT + insets.top;

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

    if (distanceFromEnd > END_REACHED_THRESHOLD) hasCalledEnd.current = false;
  };

  return (
    <View className="flex-1">
      <FixedHeader
        title={title}
        scrollY={scrollY}
        onBack={onBack}
        right={rightAction}
        isModal={isModal}
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
          listener: handleScroll,
        })}
        contentContainerStyle={{
          paddingTop: headerSpace + 20,
        }}>
        <DisplayTitle title={title} scrollY={scrollY} />
        {children}
      </Animated.ScrollView>
    </View>
  );
}
