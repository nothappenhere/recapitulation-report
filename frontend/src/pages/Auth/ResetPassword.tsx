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
import api from "@/lib/axios";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { z } from "zod";
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

const formSchema = z.object({
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

export default function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [accountExist, setAccountExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function handleVerifyAccount(e, values: z.infer<typeof formSchema>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-account", {
        username: values.username,
      });

      setAccountExist(response.data.data?.exist);
      toast.success("Please enter new password.");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message
        ? `${err.response.data.message}!`
        : "Verify account failed, please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const response = await api.put("/auth/reset-password", {
        username: values.username,
        password: values.password,
      });

      toast.success(`${response.data.message}.`);
      navigate("/auth/login");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message
        ? `${err.response.data.message}!`
        : "Reset password failed, please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

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
              <CardTitle className="text-xl">Reset password</CardTitle>
              <CardDescription>
                Enter the username you used when registering to reset your
                password.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="grid gap-6">
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
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Enter your new password"
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
                          disabled={loading}
                        >
                          {loading ? (
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
                          onClick={(e) =>
                            handleVerifyAccount(e, form.getValues())
                          }
                        >
                          {loading ? (
                            <>
                              <Loader2 className="animate-spin" />
                              Loading
                            </>
                          ) : (
                            "Verify account"
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Login Navigate */}
                    <div className="text-center text-sm">
                      Have you remembered your password again?{" "}
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
