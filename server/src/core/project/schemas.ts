import { z } from "zod";

const createProject = z.object({
  name: z.string().min(1),
  languageIds: z.array(z.string().min(1)).min(1),
});

export const ProjectSchemas = { createProject };
