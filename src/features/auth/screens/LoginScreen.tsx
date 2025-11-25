import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../../infra/external/supabase'; // Ajusta la ruta

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-2xl font-bold mb-6 text-blue-600">Aureum Mobile</Text>
      
      <TextInput
        className="w-full border border-gray-300 rounded p-3 mb-4"
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        className="w-full border border-gray-300 rounded p-3 mb-6"
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        onPress={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 p-4 rounded items-center"
      >
        <Text className="text-white font-bold">
          {loading ? 'Entrando...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};