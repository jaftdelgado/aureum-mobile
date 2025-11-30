import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SignUpForm } from "../components/SignUpForm";
import { SafeAreaView } from "react-native-safe-area-context";

export const GoogleRegisterScreen = ({ onProfileCreated }: { onProfileCreated: () => void }) => {
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
              onSuccess={onProfileCreated} 
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};