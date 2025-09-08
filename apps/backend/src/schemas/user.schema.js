import { z } from "zod";

const userSchema = z.object({
  NIP: z.coerce.number().nonnegative("NIP cannot be negative!"),
  position: z.string().nonempty("Position cannot be empty!"),
  fullName: z
    .string()
    .nonempty("Full name cannot be empty!")
    .min(3, "Full name must be at least 3 characters!"),
  username: z
    .string()
    .nonempty("Username cannot be empty!")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .nonempty("Password cannot be empty!")
    .min(8, "Password must be at least 8 characters!")
    .regex(/[0-9]/, "Passwords must contain at least 1 number!")
    .regex(/[a-z]/, "Passwords must contain at least 1 lowercase letter!")
    .regex(/[A-Z]/, "Passwords must contain at least 1 uppercase letter!")
    .regex(
      /[^A-Za-z0-9]/,
      "Passwords must contain at least 1 special character!"
    ),
  role: z.enum(["administrator", "user"], "Invalid role!").default("user"),
});

export const loginSchema = userSchema.pick({
  username: true,
  password: true,
});
export const registerSchema = userSchema;
export const verifyAccountSchema = userSchema.pick({
  username: true,
});
export const resetPasswordSchema = userSchema.pick({
  username: true,
  password: true,
});
