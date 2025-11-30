import React from 'react';
import { View, Alert, Platform } from 'react-native';
import { useAuth } from '@app/providers/AuthProvider';
import { Button } from '@core/ui/Button';
import { Text } from '@core/ui/Text';

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const performLogout = async () => {
    try {
      console.log("Cerrando sesión...");
      await signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("¿Estás seguro de que quieres salir de tu cuenta?");
      if (confirm) {
        performLogout();
      }
      return;
    }

    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir de tu cuenta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => console.log("Logout cancelado"),
        },
        {
          text: "Salir",
          style: "destructive",
          onPress: performLogout,
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-bg p-4 justify-between">
      <View className="mt-4">
        <Text type="title1" weight="bold" className="mb-2">
          Configuración
        </Text>
        <Text color="secondary">
          Gestiona tus preferencias y cuenta.
        </Text>
        
      </View>

      <View className="mb-6">
        <Button 
          title="Cerrar Sesión" 
          variant="outline" 
          onPress={handleLogout}
          className="border-red-200 bg-red-50"
          textClassName="text-red-600 font-semibold"
        />
      </View>
    </View>
  );
}
