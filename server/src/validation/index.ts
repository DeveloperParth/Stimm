import { createInsertSchema } from "drizzle-zod";
import { users } from "../db/models";
import { z } from "zod";

const commonFieldsToOmit = {
  id: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const insertUserSchema = createInsertSchema(users).omit({
  ...commonFieldsToOmit,
});

export const initializeLoginSchema = z.object({
  email: z.string().email(),
});
export type initializeLoginSchema = z.infer<typeof initializeLoginSchema>;

export const sendMailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string(),
  template: z.string(),
  data: z.record(z.any()),
});
export type SendMailSchema = z.infer<typeof sendMailSchema>;
