import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createSignUpSchema, SignUpFormData } from "../schemas/signUpSchema";

import { AuthApiRepository } from "../../../infra/external/auth/AuthApiRepository";
import { ProfileApiRepository } from "../../../infra/api/users/ProfileApiRepository";
import { RegisterUseCase } from "../../../domain/use-cases/auth/RegisterUseCase";
import { GetSocialUserUseCase } from "../../../domain/use-cases/auth/GetSocialUserUseCase";

const GOOGLE_AUTH_DUMMY_PASS = "GoogleDummyPass1!";

interface UseSignUpProps {
  isGoogleFlow: boolean;
  onSuccess: () => void;
}

export const useSignUp = ({ isGoogleFlow, onSuccess }: UseSignUpProps) => {
  const { t } = useTranslation('auth');
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shouldHideBackButton, setShouldHideBackButton] = useState(false);

  const authRepository = new AuthApiRepository();
  const profileRepository = new ProfileApiRepository();

  const { control, handleSubmit, trigger, setValue, setError, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(createSignUpSchema(t)),
    defaultValues: {
      firstName: "", lastName: "", email: "",
      username: "", accountType: "student",
      password: "", confirmPassword: ""
    }
  });

  useEffect(() => {
    if (isGoogleFlow) {
      const loadData = async () => {
        try {
          const getSocialUser = new GetSocialUserUseCase(authRepository);
          const socialUser = await getSocialUser.execute();
          
          if (socialUser) {
            setValue("email", socialUser.email);
            setValue("password", GOOGLE_AUTH_DUMMY_PASS);
            setValue("confirmPassword", GOOGLE_AUTH_DUMMY_PASS);
            
            setValue("firstName", socialUser.firstName);
            setValue("lastName", socialUser.lastName);

            if (socialUser.firstName.length >= 2 && socialUser.lastName.length >= 2) {
               setStep(2);
               setShouldHideBackButton(true); 
            }
          }
        } catch (e) {
          console.log("Error cargando usuario social:", e);
        }
      };
      loadData();
    }
  }, [isGoogleFlow, setValue]);

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const registerUseCase = new RegisterUseCase(authRepository, profileRepository);
      
      await registerUseCase.execute({
        email: data.email,
        password: data.password,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        accountType: data.accountType,
        isGoogle: isGoogleFlow,
      });

      onSuccess(); 
      
    } catch (error: any) {
      const errorMessage = error.message || "";
      
      if (errorMessage.includes("User already registered") || errorMessage.includes("already exists")) {
        setStep(1);
        setError("email", { 
          type: "manual", 
          message: t("signup.errors.emailAlreadyRegistered") || "Correo ya registrado"
        });
      } else {
        Alert.alert(t("common.error"), errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    let fields: (keyof SignUpFormData)[] = [];
    
    if (step === 1) fields = ["firstName", "lastName", "email"];
    if (step === 2) fields = ["username", "accountType"];
    
    if (step === 3 && !isGoogleFlow) {
        fields = ["password", "confirmPassword"];
    }

    const isValid = await trigger(fields);
    if (!isValid) return;

    const isLastStep = (isGoogleFlow && step === 2) || step === 3;

    if (isLastStep) {
      handleSubmit(onSubmit, (errors) => {
         console.log("Errores validación:", errors);
         Alert.alert("Faltan datos", "Revisa los campos requeridos.");
      })();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (shouldHideBackButton && step === 2) return; 
    if (step > 1) setStep(prev => prev - 1);
  };

  return {
    step,
    loading,
    control,
    errors,
    setValue,
    handleNext,
    handleBack, 
    shouldHideBackButton 
  };
};