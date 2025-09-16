import { z } from "zod";

const UserSchema = z.object({
  NIP: z.coerce.number().nonnegative("NIP tidak boleh kosong / negative!"),
  position: z.string().nonempty("Jabatan tidak boleh kosong!"),
  fullName: z
    .string()
    .nonempty("Nama lengkap tidak boleh kosong!")
    .min(3, "Nama lengkap harus minimal 3 karakter!"),
  username: z
    .string()
    .nonempty(" tidak boleh kosong!")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .nonempty("Password tidak boleh kosong!")
    .min(8, "Password harus minimal 8 karakter!")
    .regex(/[0-9]/, "Passwords harus memiliki minimal 1 angka!")
    .regex(/[a-z]/, "Passwords harus memiliki minimal 1 huruf kecil!")
    .regex(/[A-Z]/, "Passwords harus memiliki minimal 1 huruf besar!")
    .regex(
      /[^A-Za-z0-9]/,
      "Passwords harus memiliki minimal 1 karakter spesial!"
    ),
  role: z
    .enum(["administrator", "user"], "Role tidak boleh kosong!")
    .default("user"),
});

export const LoginSchema = UserSchema.pick({ username: true, password: true });
export type TLogin = z.infer<typeof LoginSchema>;
export const defaultLoginFormValues: TLogin = {
  username: "",
  password: "",
};

export const RegisterSchema = UserSchema;
export type TRegister = z.infer<typeof RegisterSchema>;
export const defaultRegisterFormValues: TRegister = {
  NIP: 0,
  position: "",
  fullName: "",
  username: "",
  password: "",
  role: "user",
};

export const VerifyUsernameSchema = UserSchema.pick({ username: true });
export type TVerifyUsername = z.infer<typeof VerifyUsernameSchema>;
export const defaultVerifyUsernameFormValues: TVerifyUsername = {
  username: "",
};

export const ResetPasswordSchema = UserSchema.pick({
  username: true,
  password: true,
});
export type TResetPassword = z.infer<typeof ResetPasswordSchema>;
export const defaultResetPasswordFormValues: TResetPassword = {
  username: "",
  password: "",
};
