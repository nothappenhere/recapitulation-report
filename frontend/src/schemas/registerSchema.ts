import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .nonempty("Full name cannot be empty!")
    .min(3, "Full name must be at least 3 characters long!"),
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

export type RegisterFormValues = z.infer<typeof registerSchema>;
