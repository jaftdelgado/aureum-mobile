import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ message: 'validation.required' })
    .trim()
    .min(1, 'validation.required')
    .max(255, 'validation.maxLength255')                  
    .email('validation.email'),      

  password: z
    .string({ message: 'validation.required' })
    .min(1, 'validation.required')                  
    .min(6, 'validation.password_min'),            
});

export type LoginFormData = z.infer<typeof loginSchema>;