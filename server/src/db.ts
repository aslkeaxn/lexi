import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { env } from "./env";

export const db = new PrismaClient({ datasourceUrl: env.DATABASE_URL });

type TDb = typeof db & { isTransaction: false };

export type TTransaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export type TAugmentedTransaction = TTransaction & { isTransaction: true };

export type TDatabase = TDb | TAugmentedTransaction;
