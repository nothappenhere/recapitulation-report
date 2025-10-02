import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@rzkyakbr/libs";
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
  defaultRegisterFormValues,
  RegisterSchema,
  type TRegister,
} from "@rzkyakbr/schemas";
import { SimpleField } from "@/components/form/SimpleField";

export default function RegisterPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<TRegister>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: defaultRegisterFormValues,
  });

  const onSubmit = async (values: TRegister): Promise<void> => {
    try {
      const res = await api.post("/auth/register", {
        ...values,
        // role: "Administrator",
      });
      form.reset();

      toast.success(`${res.data.message}.`);
      navigate("/auth/login");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Registrasi gagal, silakan coba lagi.";
      toast.error(message);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Image Content */}
              <div className="bg-muted relative hidden md:block">
                <img
                  src="/img/bg-education.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.2] dark:grayscale"
                />
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-6 md:p-8"
                >
                  <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Buat akun</h1>
                      <p className="text-muted-foreground text-balance">
                        Masukkan informasi Anda untuk membuat akun.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* NIP */}
                      <SimpleField
                        control={form.control}
                        type="number"
                        name="NIP"
                        label="Nomor Induk Pegawai"
                        placeholder="Masukan NIP"
                      />

                      {/* Position */}
                      <SimpleField
                        control={form.control}
                        name="position"
                        label="Jabatan"
                        placeholder="Masukan jabatan"
                      />
                    </div>

                    {/* Full Name */}
                    <div className="grid gap-3">
                      <SimpleField
                        control={form.control}
                        name="fullName"
                        label="Nama Lengkap"
                        placeholder="Masukan nama lengkap"
                      />
                    </div>

                    {/* Username */}
                    <div className="grid gap-3">
                      <SimpleField
                        control={form.control}
                        name="username"
                        label="Username"
                        placeholder="Masukan username"
                      />
                    </div>

                    {/* Password  */}
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Masukan password"
                                  className="rounded-xs"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="link"
                                  size="icon"
                                  className="absolute right-2 top-1/2 -translate-y-1/2"
                                  onClick={() => setShowPassword(!showPassword)}
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

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full rounded-xs"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Loading
                        </>
                      ) : (
                        "Buat akun"
                      )}
                    </Button>

                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Atau
                      </span>
                    </div>

                    {/* Login Navigate */}
                    <div className="text-center text-sm">
                      Sudah memiliki akun?{" "}
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
