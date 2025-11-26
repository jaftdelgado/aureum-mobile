import { z } from "zod";

const noInjectionRegex = /^[^<>]+$/;

export const createSignUpSchema = (t: (key: string, options?: any) => string) => {
  return z.object({
    firstName: z.string()
      .min(1, t("validation.required"))
      .regex(noInjectionRegex, "Caracteres no permitidos"),

    lastName: z.string()
      .min(1, t("validation.required"))
      .regex(noInjectionRegex, "Caracteres no permitidos"),

    email: z.string()
      .min(1, t("validation.required"))
      .email(t("validation.email")) 
      .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t("validation.format")),

    username: z.string()
      .min(3, t("validation.minLength", { min: 3 }))
      .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guion bajo"),

    accountType: z.enum(["student", "teacher"] as const, {
      message: t("validation.required")
    }),

    password: z.string()
      .min(8, t("validation.minLength", { min: 8 }))
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial (@$!%*?&)"),

    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
};

export type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;