import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
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
import {
  registerSchema,
  type RegisterFormValues,
} from "@/schemas/registerSchema";
import type { AxiosError } from "axios";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        fullName: values.fullName,
        username: values.username,
        password: values.password,
        role: "user",
      });

      toast.success(`${response.data.message}.`);
      navigate("/auth/login");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message = error.response?.data?.message
        ? `${error.response.data.message}!`
        : "Register failed, please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
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
                      <h1 className="text-2xl font-bold">Create account</h1>
                      <p className="text-muted-foreground text-balance">
                        Enter your personal information to create an account.
                      </p>
                    </div>

                    {/* Full Name Field */}
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Enter your full name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Username Field */}
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Enter your username"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Password Field */}
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
                                  placeholder="Enter your password"
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
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Loading
                        </>
                      ) : (
                        "Sign up"
                      )}
                    </Button>

                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or
                      </span>
                    </div>

                    {/* Login Navigate */}
                    <div className="text-center text-sm">
                      Already have an account?{" "}
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
