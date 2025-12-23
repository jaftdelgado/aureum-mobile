import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createSignUpSchema, SignUpFormData } from "../schemas/signUpSchema";
import { getSocialUserUseCase } from "../../../app/di";
import { useAuth } from "../../../app/providers/AuthProvider";

const GOOGLE_AUTH_DUMMY_PASS = "GoogleDummyPass1!";

interface UseSignUpProps {
  isGoogleFlow: boolean;
  onSuccess: () => void;
  onBack?: () => void; 
}

export const useSignUp = ({ isGoogleFlow, onSuccess, onBack }: UseSignUpProps) => {
  const { t } = useTranslation('auth');
  const { register, refreshSession } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shouldHideBackButton, setShouldHideBackButton] = useState(false);

  const { control, handleSubmit, trigger, setValue, setError, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(createSignUpSchema((key, opts) => t(key, opts) as string)),
    mode: "onChange",
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
          const socialUser = await getSocialUserUseCase.execute();
          
          if (socialUser) {
            setValue("email", socialUser.email);
            setValue("password", GOOGLE_AUTH_DUMMY_PASS);
            setValue("confirmPassword", GOOGLE_AUTH_DUMMY_PASS);
            
            if (socialUser.firstName) setValue("firstName", socialUser.firstName);
            if (socialUser.lastName) setValue("lastName", socialUser.lastName);

            if (socialUser.firstName && socialUser.firstName.length >= 2 && 
                socialUser.lastName && socialUser.lastName.length >= 2) {
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
      await register({
        ...data,
        accountType: data.accountType, 
        isGoogle: isGoogleFlow,
      });

      await refreshSession();

      onSuccess(); 
      
    } catch (error: any) {
      const errorMessage = error.message || "";
      
      if (errorMessage.includes("already registered") || errorMessage.includes("already exists")) {
        setStep(1);
        setShouldHideBackButton(false);
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
    if (step === 3 && !isGoogleFlow) fields = ["password", "confirmPassword"];

    const isValid = await trigger(fields);
    if (!isValid) return;

    const isLastStep = (isGoogleFlow && step === 2) || step === 3;

    if (isLastStep) {
      handleSubmit(onSubmit, (formErrors) => {
        if (isGoogleFlow && (formErrors.firstName || formErrors.lastName)) {
           Alert.alert(t("common.attention"), t("signup.errors.checkName"));
           setStep(1);
           setShouldHideBackButton(false);
        }
      })();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (shouldHideBackButton && step === 2) return; 
    if (step > 1) {
      setStep(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
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