import z from "zod";

const envSchema = z.object({
  BACKEND_URL: z.string({
    message: "BACKEND_URL enviroment variable is required",
  }),
  CLIENT_URL: z.string({
    message: "CLIENT_URL enviroment variable is required",
  }),
  JWT_SECRET: z.string({
    message: "JWT_SECRET enviroment variable is required",
  }),
});

const env = envSchema.parse(process.env);

export default env;
