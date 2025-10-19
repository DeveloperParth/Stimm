import { availableParallelism } from "node:os";
import { z } from "zod/v4";
const envSchema = z.object({
  PORT: z.coerce.number({}),
  DATABASE_URL: z.string(),
  MAX_CPU: z.coerce.number({}).max(availableParallelism()).optional(),
  // ------tokens start-------
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRATION: z.string().default("7d"),

  VERIFICATION_TOKEN_SECRET: z.string(),
  VERIFICATION_TOKEN_EXPIRATION: z.string().default("1h"),

  PAYMENT_LINK_TOKEN_SECRET: z.string(),
  PAYMENT_LINK_TOKEN_EXPIRATION: z.string().default("15m"),
  // ------tokens end-------

  INVITE_LINK_EXPIRATION: z.string().default("1d"),

  USE_CLUSTER: z.coerce.boolean().default(false),

  REDIS_URL: z.string(),

  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_SES_FROM: z.string(),

  FRONTEND_URL: z.string().url(),

  SYSTEM_USER_EMAIL: z
    .literal("system@tryconexus.com")
    .default("system@tryconexus.com"),
  SUPPORT_EMAIL: z.string().default("support@tryconexus.com"),
});

const parsed = envSchema.safeParse(process.env);
let env: z.infer<typeof envSchema>;

if (parsed.success === false) {
  const errors = parsed.error.issues.reduce((acc, err) => {
    acc[err.path.join(".")] = err.message;
    return acc;
  }, {} as Record<string, string>);
  console.error("❌ Invalid environment variables:", errors);
  throw new Error("Invalid environment variables");
}
env = parsed.data;

export default env;
