import { z } from "zod";

const register = z.object({
  username: z.string().min(3),
});

const updateUsername = z.object({
  username: z.string().min(3),
});

export const UserSchemas = { register, updateUsername };
