import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@rzkyakbr/libs";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { AxiosError } from "axios";
import {
  defaultResetPasswordFormValues,
  ResetPasswordSchema,
  type TResetPassword,
  type TVerifyUsername,
} from "@rzkyakbr/schemas";
import { SimpleField } from "@/components/form/SimpleField";

export default function ResetPasswordPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [accountExist, setAccountExist] = useState(false);
  const navigate = useNavigate();

  const form = useForm<TResetPassword>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: defaultResetPasswordFormValues,
  });

  const handleVerifyUsername = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    values: TVerifyUsername
  ): Promise<void> => {
    e.preventDefault();

    if (!form.getValues("username")) {
      toast.error("Kolom input tidak boleh kosong!");
      return;
    }

    try {
      const res = await api.post("/auth/verify-username", values);
      const { exist } = res.data.data;
      form.reset();

      setAccountExist(exist);
      toast.success(`${res.data.message}.`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Verifikasi akun gagal, silakan coba lagi.";
      toast.error(message);
    }
  };

  const onSubmit = async (values: TResetPassword): Promise<void> => {
    try {
      const res = await api.put("/auth/reset-password", values);

      toast.success(`${res.data.message}.`);
      navigate("/auth/login");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Reset kata sandi gagal, silakan coba lagi.";
      toast.error(message);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Logo Museum */}
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Avatar>
              <AvatarImage src="/img/logo-mg.png" alt="Logo Museum Geologi" />
              <AvatarFallback>MG</AvatarFallback>
            </Avatar>
          </div>
          Museum Geologi
        </div>

        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Reset kata sandi</CardTitle>
              <CardDescription>
                Masukkan nama pengguna yang Anda gunakan saat mendaftar untuk
                mereset kata sandi.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="grid gap-6">
                      {/* Username */}
                      <div className="grid gap-3">
                        <SimpleField
                          control={form.control}
                          name="username"
                          label="Username"
                          placeholder="Masukan username"
                        />
                      </div>

                      {/* Password */}
                      <div
                        className={`grid gap-3 relative ${
                          accountExist ? "" : "hidden"
                        }`}
                      >
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password Baru</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      required
                                      placeholder="Masukan password baru"
                                      {...field}
                                    />
                                    <Button
                                      type="button"
                                      variant="link"
                                      size="icon"
                                      className="absolute right-2 top-1/2 -translate-y-1/2"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                    >
                                      {showPassword ? (
                                        <EyeOffIcon className="size-5" />
                                      ) : (
                                        <EyeIcon className="size-5" />
                                      )}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      {accountExist ? (
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2 className="animate-spin" />
                              Loading
                            </>
                          ) : (
                            "Reset password"
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="w-full"
                          disabled={form.formState.isSubmitting}
                          onClick={(e) =>
                            handleVerifyUsername(e, form.getValues())
                          }
                        >
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2 className="animate-spin" />
                              Loading
                            </>
                          ) : (
                            "Verifikasi akun"
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Login Navigate */}
                    <div className="text-center text-sm">
                      Apakah Anda sudah mengingat kata sandi Anda lagi?{" "}
                      <Link
                        to="/auth/login"
                        className="underline underline-offset-4"
                      >
                        Log in
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
