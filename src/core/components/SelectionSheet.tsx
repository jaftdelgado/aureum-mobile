import React, { useCallback, forwardRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native'; // Agregamos StyleSheet
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@core/ui/Text';
import { useTheme } from '@app/providers/ThemeProvider';

export type SelectionOption<T> = {
  label: string;
  value: T;
};

interface SelectionSheetProps<T> {
  title: string;
  options: SelectionOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  snapPoints?: string[];
  zIndex?: number;
}

const SelectionSheet = forwardRef<BottomSheet, SelectionSheetProps<any>>(
  ({ title, options, selectedValue, onSelect, snapPoints = ['40%'], zIndex = 30 }, ref) => {
    const { theme, isDark } = useTheme();

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={isDark ? 0.6 : 0.4}
        />
      ),
      [isDark]
    );

    const handleItemPress = (value: any) => {
      onSelect(value);
      // @ts-ignore
      ref?.current?.close();
    };

    return (
      <View style={[StyleSheet.absoluteFill, { zIndex: zIndex }]} pointerEvents="box-none">
        <BottomSheet
          ref={ref}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: theme.card }}
          handleIndicatorStyle={{ backgroundColor: theme.secondaryBtn }}>
          <View className="flex-1 px-5 pt-2">
            <Text type="title3" weight="bold" align="center" className="mb-6 mt-2">
              {title}
            </Text>

            <BottomSheetFlatList
              data={options}
              keyExtractor={(item: SelectionOption<any>) => String(item.value)}
              renderItem={({ item }: { item: SelectionOption<any> }) => {
                const isSelected = item.value === selectedValue;

                return (
                  <TouchableOpacity
                    className="flex-row items-center justify-between py-4"
                    style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}
                    onPress={() => handleItemPress(item.value)}
                    activeOpacity={0.7}>
                    <Text
                      type="body"
                      weight={isSelected ? 'semibold' : 'regular'}
                      color={isSelected ? 'default' : 'secondary'}>
                      {item.label}
                    </Text>

                    {isSelected && <Ionicons name="checkmark" size={22} color={theme.primaryBtn} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </BottomSheet>
      </View>
    );
  }
);

export default SelectionSheet;
