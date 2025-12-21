import React from "react";
import { View } from "react-native";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@core/ui/Button";
import { Text } from "@core/ui/Text";
import { TextField } from "@core/ui/TextField";
import { useSignUp } from "../hooks/useSignUp"; 

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
  const { t } = useTranslation('auth');
  
  const { 
    step, 
    loading, 
    control, 
    errors, 
    handleNext,
    handleBack, 
    shouldHideBackButton
  } = useSignUp({ isGoogleFlow, onSuccess });

  return (
    <View className="p-6 bg-white rounded-xl w-full shadow-sm">
      <Text type="title1" weight="bold" align="center" className="mb-6">
        {isGoogleFlow ? t("signup.completeRegistration", "Terminar Registro") : t("signup.createAccount", "Crear Cuenta")}
      </Text>

      {isGoogleFlow && (
         <Text className="text-sm text-gray-500 text-center mb-4">
           {t("signup.googleFlowMessage", "Confirma tus datos para continuar")}
         </Text>
      )}

      {/* PASO 1: Datos Personales */}
      {step === 1 && (
        <View className="gap-4">
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t("signup.firstName", "Nombre")}
                placeholder="Tu nombre"
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
                label={t("signup.lastName", "Apellido")}
                placeholder="Tu apellido"
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
                label={t("signup.email", "Correo")}
                placeholder="correo@ejemplo.com"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                errorText={errors.email?.message}
                error={!!errors.email}
                disabled={isGoogleFlow} 
              />
            )}
          />
        </View>
      )}

      {/* PASO 2: Perfil Académico */}
      {step === 2 && (
        <View className="gap-4">
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t("signup.usernameLabel", "Usuario")}
                placeholder="nombredeusuario"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                errorText={errors.username?.message}
                error={!!errors.username}
              />
            )}
          />
          
          <View>
            <Text className="mb-2 font-medium">{t("signup.accountType", "Soy...")}:</Text>
            <View className="flex-row gap-2">
              <Controller
                control={control}
                name="accountType"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Button 
                      title={t("signup.student", "Estudiante")}
                      variant={value === 'student' ? 'primary' : 'outline'} 
                      onPress={() => onChange('student')} 
                      className="flex-1"
                    />
                    <Button 
                      title={t("signup.teacher", "Profesor")}
                      variant={value === 'teacher' ? 'primary' : 'outline'} 
                      onPress={() => onChange('teacher')} 
                      className="flex-1"
                    />
                  </>
                )}
              />
            </View>
             {errors.accountType && <Text color="error" className="mt-1">{errors.accountType.message}</Text>}
          </View>
        </View>
      )}

      {/* PASO 3: Contraseña (Solo flujo normal) */}
      {step === 3 && !isGoogleFlow && (
        <View className="gap-4">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label={t("signup.password", "Contraseña")}
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
                  label={t("signup.confirmPassword", "Confirmar Contraseña")}
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
            title={
              loading 
                ? t("common.loading", "Cargando...") 
                : (step === 2 && isGoogleFlow) || step === 3 
                  ? t("common.finish", "Finalizar") 
                  : t("common.next", "Siguiente")
            } 
            onPress={handleNext} 
            loading={loading} 
        />
        
        {/* Botón Atrás */}
        {step > 1 && !shouldHideBackButton && (
           <Button 
             title={t("common.back", "Atrás")} 
             variant="outline" 
             onPress={handleBack} 
           />
        )}

        {/* Botón ir a Login */}
        {!isGoogleFlow && step === 1 && onBack && (
            <Button 
              title={t("signup.goToLogin", "Ya tengo cuenta")} 
              variant="link" 
              onPress={onBack} 
              className="p-2"
            />
        )}
      </View>
    </View>
  );
};