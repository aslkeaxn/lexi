import { PrismaClient } from "@prisma/client";
import { Env } from "./env";

export const db = new PrismaClient({ datasourceUrl: Env.DATABASE_URL });
