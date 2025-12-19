import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El correo electrónico es requerido' })
    .email({ message: 'Correo electrónico no válido' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: 'La contraseña es requerida' })
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .max(50, { message: 'La contraseña no puede tener más de 50 caracteres' })
});

export type LoginFormValues = z.infer<typeof loginSchema>;
