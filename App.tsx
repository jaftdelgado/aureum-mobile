import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { FontProvider } from '@core/providers/FontProvider';
import './global.css';

export default function App() {
  return (
    <FontProvider>
      <ScreenContent title="Home" path="App.tsx" />
      <View className="flex-1 items-center justify-center">
        <Text className="font-geist text-2xl">¡Rola Mundo con Geist!</Text>
      </View>
      <StatusBar style="auto" />
    </FontProvider>
  );
}
