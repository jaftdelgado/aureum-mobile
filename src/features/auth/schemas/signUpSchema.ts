import { z } from "zod";
import { checkPasswordLeaked } from "@core/utils/pwned"; 

const RESERVED_USERNAMES = ["admin", "root", "support", "system", "user", "guest", "aureum"];

const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
const REPEATING_CHARS_REGEX = /(.)\1{5,}/;

export const createSignUpSchema = (t: (key: string, options?: any) => string) => {
  return z
    .object({
      firstName: z
        .string()
        .transform((val) => val.trim().replace(/\s+/g, " "))
        .pipe(
          z
            .string()
            .min(2, { message: t("signup.errors.nameLength", "Mínimo 2 caracteres") })
            .max(50, { message: t("signup.errors.nameLength", "Máximo 50 caracteres") })
            .regex(NAME_REGEX, { message: t("signup.errors.nameInvalid", "Solo letras y espacios") })
        ),

      lastName: z
        .string()
        .transform((val) => val.trim().replace(/\s+/g, " "))
        .pipe(
          z
            .string()
            .min(2, { message: t("signup.errors.nameLength", "Mínimo 2 caracteres") })
            .max(50, { message: t("signup.errors.nameLength", "Máximo 50 caracteres") })
            .regex(NAME_REGEX, { message: t("signup.errors.nameInvalid", "Solo letras y espacios") })
        ),

      email: z
        .string()
        .transform((val) => val.trim().toLowerCase()) 
        .pipe(
          z
            .string()
            .email({ message: t("signup.errors.emailInvalid", "Correo inválido") })
            .max(254, { message: t("signup.errors.emailLength", "Correo muy largo") })
        ),

      username: z
        .string()
        .transform((val) => val.trim())
        .pipe(
          z
            .string()
            .min(4, { message: t("signup.errors.usernameMin", "Mínimo 4 caracteres") })
            .max(20, { message: t("signup.errors.usernameMax", "Máximo 20 caracteres") })
            .regex(USERNAME_REGEX, { message: t("signup.errors.usernameInvalid", "Solo letras, números y _") })
            .refine((val) => !RESERVED_USERNAMES.includes(val.toLowerCase()), {
              message: t("signup.errors.usernameReserved", "Este usuario no está disponible"),
            })
        ),

      accountType: z.enum(["student", "teacher"], {
        error: t("signup.errors.accountTypeRequired", "Selecciona un tipo de cuenta"),
      }),

      password: z
        .string()
        .min(8, { message: t("signup.errors.passwordMin", "Mínimo 8 caracteres") })
        .max(64, { message: t("signup.errors.passwordMax", "Máximo 64 caracteres") })
        .refine((val) => val.trim() === val, {
          message: t("signup.errors.passwordSpaces", "No puede tener espacios al inicio/final"),
        })
        .refine((val) => PASSWORD_COMPLEXITY_REGEX.test(val), {
          message: t("signup.errors.passwordComplexity", "Requiere mayúscula, minúscula, número y símbolo"),
        })
        .refine((val) => !REPEATING_CHARS_REGEX.test(val), {
          message: t("signup.errors.passwordRepeating", "Demasiados caracteres repetidos"),
        })
        .refine((val) => !["123456", "password", "12345678", "qwerty"].includes(val), {
          message: t("signup.errors.passwordCommon", "Contraseña demasiado común"),
        })
        .refine(async (val) => {
          if (val === "GoogleDummyPass1!" || val.length < 8) return true; 
          
          const isLeaked = await checkPasswordLeaked(val);
          return !isLeaked;
        }, {
          message: t("signup.errors.passwordPwned", "Esta contraseña ha sido filtrada en internet, elige otra"), 
        }),

      confirmPassword: z.string().max(64),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("signup.errors.passwordsDoNotMatch", "Las contraseñas no coinciden"),
          path: ["confirmPassword"],
        });
      }

      const passLower = data.password.toLowerCase();
      const checks = [
        { val: data.username.toLowerCase(), field: "username" },
        { val: data.firstName.toLowerCase(), field: "nombre" },
        { val: data.email.split("@")[0].toLowerCase(), field: "email" },
      ];

      checks.forEach((check) => {
        if (check.val.length > 3 && passLower.includes(check.val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("signup.errors.passwordSimilar", "La contraseña no debe contener tu información personal"),
            path: ["password"],
          });
        }
      });
    });
};

export type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;