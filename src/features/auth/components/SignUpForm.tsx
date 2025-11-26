import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { Button } from "@core/ui/Button";
import { Text } from "@core/ui/Text";
import { TextField } from "@core/ui/TextField";
import { supabase } from "../../../infra/external/supabase";
import { createProfile } from "../api/authApi";
import { createSignUpSchema, SignUpFormData } from "../schemas/signUpSchema";

interface SignUpFormProps {
  isGoogleFlow?: boolean;
  onSuccess: () => void;
  onBack?: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ 
  isGoogleFlow = false, 
  onSuccess, 
  onBack 
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(isGoogleFlow ? 2 : 1);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, trigger, setValue, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(createSignUpSchema(t)),
    defaultValues: {
      firstName: "", lastName: "", email: "",
      username: "", accountType: "student",
      password: "", confirmPassword: ""
    }
  });

  useEffect(() => {
    if (isGoogleFlow) {
      const fetchUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (user) {
          const meta = user.user_metadata || {};
          const fullName = meta.full_name || meta.name || "";
          const parts = fullName.split(" ");
          
          setValue("email", user.email || "");
          setValue("firstName", parts[0] || "");
          setValue("lastName", parts.slice(1).join(" ") || "");
          setValue("password", "GOOGLE_DUMMY");
          setValue("confirmPassword", "GOOGLE_DUMMY");
        }
      };
      fetchUser();
    }
  }, [isGoogleFlow]);

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      let userId = "";

      if (!isGoogleFlow) {
        const { data: auth, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        if (!auth.user) throw new Error("No user ID");
        userId = auth.user.id;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user!.id;
      }

      await createProfile({
        auth_user_id: userId,
        username: data.username,
        full_name: `${data.firstName} ${data.lastName}`.trim(),
        role: data.accountType === "teacher" ? "professor" : "student"
      });

      onSuccess(); 
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    let fields: (keyof SignUpFormData)[] = [];
    if (step === 1) fields = ["firstName", "lastName", "email"];
    if (step === 2) fields = ["username", "accountType"];

    const isValid = await trigger(fields);
    if (!isValid) return;

    if (step === 2 && isGoogleFlow) {
      handleSubmit(onSubmit)(); 
    } else if (step === 3) {
      handleSubmit(onSubmit)();
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <View className="w-full">
      <Text type="title1" weight="bold" align="center" className="mb-6">
        {isGoogleFlow ? "Completa tu Registro" : "Crear Cuenta"}
      </Text>

      {/* PASO 1 */}
      {step === 1 && (
        <View className="gap-4">
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Nombre"
                placeholder="Ej. Juan"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorText={errors.firstName?.message}
                error={!!errors.firstName}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Apellido"
                placeholder="Ej. Pérez"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorText={errors.lastName?.message}
                error={!!errors.lastName}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Email"
                placeholder="correo@ejemplo.com"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                errorText={errors.email?.message}
                error={!!errors.email}
              />
            )}
          />
        </View>
      )}

      {/* PASO 2 */}
      {step === 2 && (
        <View className="gap-4">
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Usuario (@)"
                placeholder="usuario123"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                errorText={errors.username?.message}
                error={!!errors.username}
              />
            )}
          />
          
          {/* Selector de Rol */}
          <View>
            <Text className="mb-2 font-medium">Soy:</Text>
            <View className="flex-row gap-2">
              {/* Usamos Controller para el Rol también para leer el valor actual */}
              <Controller
                control={control}
                name="accountType"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Button 
                      title="Estudiante" 
                      variant={value === 'student' ? 'primary' : 'outline'} 
                      onPress={() => onChange('student')} 
                      className="flex-1"
                    />
                    <Button 
                      title="Profesor" 
                      variant={value === 'teacher' ? 'primary' : 'outline'} 
                      onPress={() => onChange('teacher')} 
                      className="flex-1"
                    />
                  </>
                )}
              />
            </View>
             {errors.accountType && <Text color="error">{errors.accountType.message}</Text>}
          </View>
        </View>
      )}

      {/* PASO 3 */}
      {step === 3 && !isGoogleFlow && (
        <View className="gap-4">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Contraseña"
                  placeholder="••••••••"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorText={errors.password?.message}
                  error={!!errors.password}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Confirmar"
                  placeholder="••••••••"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorText={errors.confirmPassword?.message}
                  error={!!errors.confirmPassword}
                />
              )}
            />
        </View>
      )}

      <View className="mt-6 gap-3">
        <Button 
            title={loading ? "Procesando..." : (step === 2 && isGoogleFlow) || step === 3 ? "Finalizar" : "Siguiente"} 
            onPress={handleNext} 
            loading={loading} 
        />
        {!isGoogleFlow && step === 1 && onBack && (
            <Button title="Volver al Login" variant="link" onPress={onBack} />
        )}
      </View>
    </View>
  );
};