import { z } from "zod";

const envSchema = z.object({
  redis: z.object({
    url: z.string(),
  }),

  db: z.object({
    HOST: z.string(),
    USER: z.string(),
    PASSWORD: z.string(),
    DATABASE: z.string(),
  }),
  aws: z.object({
    ACCESS_KEY: z.string(),
    SECRET_KEY: z.string(),
    REGION: z.string(),
  }),
  port: z.number({ coerce: true }),
});

const parsed = envSchema.safeParse({
  ...process.env,
  redis: {
    url: process.env.REDIS_URL,
  },
  db: {
    HOST: process.env.POSTGRES_HOST,
    USER: process.env.POSTGRES_USER,
    PASSWORD: process.env.POSTGRES_PASSWORD,
    DATABASE: process.env.POSTGRES_DB,
  },
  aws: {
    ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    SECRET_KEY: process.env.AWS_SECRET_KEY,
    REGION: process.env.AWS_REGION,
  },
  port: process.env.PORT,
});
let env: z.infer<typeof envSchema>;

if (parsed.success === false) {
  const errors = parsed.error.errors.reduce((acc, err) => {
    acc[err.path.join(".")] = err.message;
    return acc;
  }, {} as Record<string, string>);
  console.error("❌ Invalid environment variables:", errors);
  throw new Error("Invalid environment variables");
}
env = parsed.data;

export default env;
