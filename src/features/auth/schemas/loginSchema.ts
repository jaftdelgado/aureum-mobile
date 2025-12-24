import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ message: 'validation.required' }) 
    .min(1, 'validation.required')                     
    .email('validation.email'),      

  password: z
    .string({ message: 'validation.required' })
    .min(1, 'validation.required')                  
    .min(6, 'validation.password_min'),            
});

export type LoginFormData = z.infer<typeof loginSchema>;