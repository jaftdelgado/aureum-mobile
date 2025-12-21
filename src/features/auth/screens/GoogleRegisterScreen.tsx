import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, ActivityIndicator } from "react-native";
import { SignUpForm } from "../components/SignUpForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../app/providers/AuthProvider";

export const GoogleRegisterScreen = () => {
  const { refreshSession, isLoading } = useAuth();

  const handleSuccess = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      await refreshSession();
    } catch (error) {
      console.error("Error finalizando registro:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          style={{ paddingHorizontal: 16 }}
        >
          <View style={{ width: '100%', maxWidth: 448, alignSelf: 'center', backgroundColor: 'white', padding: 24, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
            <SignUpForm 
              isGoogleFlow={true} 
              onSuccess={handleSuccess} 
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};