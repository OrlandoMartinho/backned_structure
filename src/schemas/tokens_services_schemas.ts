import { z } from 'zod';

export const tokenSchema = z.object({
    accessToken: z.string(),
});

export const emailSchema = z.object({
    email: z.string()
});

export const dateSchema = z.object({
    date: z.string(),
});
