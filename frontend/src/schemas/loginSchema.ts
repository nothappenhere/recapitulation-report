import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().lowercase().nonempty("Username cannot be empty!"),
  password: z
    .string()
    .trim()
    .nonempty("Password cannot be empty!")
    .min(8, "Password must be at least 8 characters long!")
    .regex(/[0-9]/, "Passwords must contain at least 1 number!")
    .regex(/[a-z]/, "Passwords must contain at least 1 lowercase letter!")
    .regex(/[A-Z]/, "Passwords must contain at least 1 uppercase letter!")
    .regex(
      /[^A-Za-z0-9]/,
      "Passwords must contain at least 1 special character!"
    ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
