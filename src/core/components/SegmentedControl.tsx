import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, StyleSheet } from 'react-native';

interface SegmentedControlProps {
  options: string[];
  onChange: (option: string) => void;
}

const SegmentedControl = ({ options, onChange }: SegmentedControlProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePress = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedIndex(index);
    onChange(options[index]);
  };

  return (
    <View className="mx-4 my-2 rounded-xl bg-gray-200/80 p-1">
      <View className="relative flex-row">
        {/* Capa del Indicador: Copiamos la estructura de los botones para que el ancho sea idéntico */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none" className="flex-row">
          <View
            style={{
              width: `${100 / options.length}%`,
              left: `${(selectedIndex * 100) / options.length}%`,
            }}
            className="h-full p-0.5" // Este padding crea el margen interno simétrico
          >
            <View className="flex-1 rounded-lg bg-white shadow-sm" />
          </View>
        </View>

        {/* Capa de Botones */}
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <TouchableOpacity
              key={option}
              activeOpacity={1}
              onPress={() => handlePress(index)}
              // flex-1 asegura que cada botón ocupe exactamente el mismo espacio
              className="z-10 flex-1 items-center justify-center py-2.5">
              <Text
                numberOfLines={1}
                style={{ textAlignVertical: 'center' }}
                className={`text-center text-sm font-semibold ${
                  isSelected ? 'text-black' : 'text-gray-500'
                }`}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default SegmentedControl;
