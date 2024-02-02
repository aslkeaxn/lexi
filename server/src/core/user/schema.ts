import { z } from "zod";

const register = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .refine((v) => !/\s/.test(v)),
});

export const userSchema = { register };
