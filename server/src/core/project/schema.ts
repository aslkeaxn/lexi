import { z } from "zod";

const createProject = z.object({
  name: z.string().trim().min(1),
  languageIds: z.array(z.string().min(1)).min(1),
});

const updateProject = z.object({
  name: z.string().trim().min(1),
});

export const projectSchema = { createProject, updateProject };
