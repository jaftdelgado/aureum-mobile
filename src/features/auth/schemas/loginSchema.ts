import { z } from 'zod';

export const createLoginSchema = (t: (key: string, options?: any) => string) => {
  return z.object({
    email: z
      .string()
      .min(1, { message: t('signin.errors.required', 'El correo es requerido') })
      .email({ message: t('signin.errors.emailInvalid', 'Correo inválido') }),
    password: z
      .string()
      .min(1, { message: t('signin.errors.required', 'La contraseña es requerida') }),
  });
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginFormData = z.infer<typeof loginSchema>;