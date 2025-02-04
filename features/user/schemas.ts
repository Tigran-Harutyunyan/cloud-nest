import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const registerSchema = (formType: FormType) => toTypedSchema(
  z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  }));