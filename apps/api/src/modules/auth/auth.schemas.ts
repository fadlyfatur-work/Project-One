import { email, z } from 'zod';

export const registerSchema = z.object({
    email: z
        .string({required_error:"Email wajib diisi"})
        .email("Email tidak valid!"),
    password: z
        .string({required_error:"Password wajib diisi"})
        .min(8, "Password minimal 8 karakter!"),
    username: z
        .string()
        .min(4, "Username minimal 4 karakter!")
        .max(20, "Username maksimal 20 karakter!")
    .regex(/^[a-z0-9_]+$/i, "Username hanya boleh huruf/angka/underscore"),
});

export const loginSchema = z.object({
    email: z
    .string({required_error:"Email/Username wajib diisi"}),
    // .email("Harus memakai Format email!"),
    password: z
    .string({required_error:"Password wajib diisi"})
})