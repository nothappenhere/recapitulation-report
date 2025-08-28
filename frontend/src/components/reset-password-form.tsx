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
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountExist, setAccountExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleVerifyAccount(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!username.trim()) {
        toast.error("Field cannot be empty!");
        return;
      }

      const response = await api.post("/auth/verify-username", { username });

      setAccountExist(response.data.data?.exists);
      toast.success("Please enter new password.");
    } catch (err) {
      const message = err.response?.data?.message
        ? `${err.response.data.message}!`
        : "Verify account failed, please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        toast.error("All fields are required!");
        return;
      }

      const response = await api.put("/auth/reset-password", {
        username,
        password,
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
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Avatar>
              <AvatarImage src="/img/logo-mg.png" alt="Logo Museum Geologi" />
              <AvatarFallback>MG</AvatarFallback>
            </Avatar>
          </div>
          Museum Geologi
        </a>

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
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    {/* Username Field */}
                    <div className="grid gap-3">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div
                      className={`grid gap-3 relative ${
                        accountExist ? "" : "hidden"
                      }`}
                    >
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />

                      <span className="absolute top-10 right-10 size-2 flex items-center text-neutral-600">
                        <Button
                          variant={"link"}
                          type="button"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="size-5" />
                          ) : (
                            <EyeIcon className="size-5" />
                          )}
                        </Button>
                      </span>
                    </div>

                    {accountExist ? (
                      <Button type="submit" className="w-full">
                        {loading ? "Loading..." : "Reset password"}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="w-full"
                        onClick={(e) => handleVerifyAccount(e)}
                      >
                        {loading ? "Loading..." : "Verify account"}
                      </Button>
                    )}
                  </div>

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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
