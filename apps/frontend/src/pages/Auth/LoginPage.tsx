import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "@rzkyakbr/libs";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { AxiosError } from "axios";
import { loginSchema, type LoginFormValues } from "@rzkyakbr/schemas";
import { SimpleField } from "@/components/form/SimpleField";

export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      const response = await api.post("/auth/login", values);
      const { user } = response.data.data;
      form.reset();

      toast.success(`Welcome, ${user.fullName}.`);
      navigate("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Login failed, please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-6 md:p-8"
                >
                  <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Welcome back</h1>
                      <p className="text-muted-foreground text-balance">
                        Login to your account
                      </p>
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
                            <div className="flex items-center">
                              <FormLabel>Password</FormLabel>

                              <Link
                                to="/auth/reset-password"
                                className="ml-auto text-sm text-info underline-offset-2 hover:underline"
                              >
                                Lupa kata sandi?
                              </Link>
                            </div>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  required
                                  placeholder="Masukan password"
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
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Loading
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>

                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or
                      </span>
                    </div>

                    {/* Register Navigate */}
                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <Link
                        to="/auth/register"
                        className="underline underline-offset-4"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>

              {/* Image Content */}
              <div className="bg-muted relative hidden md:block">
                <img
                  src="/img/bg-education.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
