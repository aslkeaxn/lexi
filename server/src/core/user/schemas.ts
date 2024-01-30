import { z } from "zod";

const updateUsername = z.object({
  username: z.string().min(3),
});

export const UserSchemas = { updateUsername };
