import { z } from "zod";

const signinSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z
    .string()
    .min(6, "A senha deve conter no minimo 6 digitos.")
    .regex(
      new RegExp("[a-zA-Z]"),
      "A senha precisa conter no mínimo uma letra.",
    ),
});

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email("E-mail inválido."),
  password: z
    .string()
    .min(6, "A senha deve conter no minimo 6 digitos.")
    .regex(
      new RegExp("[a-zA-Z]"),
      "A senha precisa conter no mínimo uma letra.",
    ),
  // Foi adicionando duas barras no regexp do telefone, pois o prettier estava modificando a string.
  // Original Regex = (\b\(\d{2}\)\s?[9]?\s?\d{4}(\-|\s)?\d\d{4})|(\b\d{2}\s?[9]?\s?\d{4}(\-|\s)?\d{4})|(\b([9]|[9]\s)?\d{4}(\-|\s)?\d{4})|(\b\d{4}(\-|\s)?\d{4})
  telephone: z
    .string()
    .regex(
      new RegExp(
        "(\b\\(\\d{2}\\)\\s?[9]?\\s?\\d{4}(\\-|\\s)?\\d\\d{4})$|(\\b\\d{2}\\s?[9]?\\s?\\d{4}(\\-|\\s)?\\d{4})$|(\\b([9]|[9]\\s)?\\d{4}(\\-|\\s)?\\d{4})$|(\\b\\d{4}(\\-|\\s)?\\d{4})$",
      ),
      "Por favor, digite um telefone válido.",
    ),
});

const authenticateTokensSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

type AuthenticateTokens = z.infer<typeof authenticateTokensSchema>;
type SigninForm = z.infer<typeof signinSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export {
  signinSchema,
  signupSchema,
  authenticateTokensSchema,
  type AuthenticateTokens,
  type SigninForm,
  type SignupForm,
};
