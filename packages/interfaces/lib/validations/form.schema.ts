import { z } from 'zod';

export const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'El nombre es requerido' })
    .trim()
    .toLowerCase(),
});

export type FormValues = z.infer<typeof formSchema>;
