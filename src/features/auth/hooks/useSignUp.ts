import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../infra/external/supabase";
import { createProfile } from "../api/authApi";
import { createSignUpSchema, SignUpFormData } from "../schemas/signUpSchema";

interface UseSignUpProps {
  isGoogleFlow: boolean;
  onSuccess: () => void;
}

export const useSignUp = ({ isGoogleFlow, onSuccess }: UseSignUpProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(isGoogleFlow ? 2 : 1);
  const [loading, setLoading] = useState(false);

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
      const fetchUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (user) {
          const meta = user.user_metadata || {};
          const fullName = meta.full_name || meta.name || "";
          const spaceIndex = fullName.indexOf(" ");
          
          const first = spaceIndex > 0 ? fullName.substring(0, spaceIndex) : fullName;
          const last = spaceIndex > 0 ? fullName.substring(spaceIndex + 1) : ".";
          
          setValue("email", user.email || "");
          setValue("firstName", first);
          setValue("lastName", last);
          const dummyPass = "GoogleDummyPass1!";
          setValue("password", dummyPass);
          setValue("confirmPassword", dummyPass);
        }
      };
      fetchUser();
    }
  }, [isGoogleFlow, setValue]);

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      let userId = "";

      if (!isGoogleFlow) {
        const { data: auth, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        if (error) {
          if (error.message.includes("User already registered") || error.status === 422) {
            setError("email", { 
              type: "manual", 
              message: "Este correo ya está registrado. Intenta iniciar sesión." 
            });
            setStep(1); 
            return; 
          }
          throw error;
        }
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

      console.log("¡Registro completo!");
      onSuccess(); 
      
    } catch (error: any) {
      console.error(error);
      Alert.alert(t("common.error"), error.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    let fields: (keyof SignUpFormData)[] = [];
    if (step === 1) fields = ["firstName", "lastName", "email"];
    if (step === 2) fields = ["username", "accountType"];
    if (step === 3) fields = ["password", "confirmPassword"];

    const isValid = await trigger(fields);
    if (!isValid) return;

    if ((step === 2 && isGoogleFlow) || step === 3) {
      handleSubmit(onSubmit, (errors) => {
         console.log("Errores validación:", errors);
         Alert.alert("Faltan datos", "Revisa los campos requeridos.");
      })();
    } else {
      setStep(prev => prev + 1);
    }
  };

  return {
    step,
    loading,
    control,
    errors,
    setValue,
    handleNext
  };
};