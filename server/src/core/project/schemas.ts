import { z } from "zod";

const createProject = z.object({
  name: z.string().min(1),
  languageIds: z.array(z.string().min(1)).min(1),
});

const updateProject = z.object({
  name: z.string().min(1),
  languagesToAddIds: z.array(z.string().min(1)),
  languagesToRemoveIds: z.array(z.string().min(1)),
});

export const ProjectSchemas = { createProject, updateProject };
