import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        toast.error("All fields are required!");
        return;
      }

      const response = await api.post("/auth/register", {
        fullName,
        username,
        password,
        role: "user",
      });
      const data = response.data.data?.user;

      toast.success(`${response.data.message}.`);
      navigate("/auth/login");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message
        ? `${err.response.data.message}!`
        : "Register failed, please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="bg-muted relative hidden md:block">
                <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>

              <form className="p-6 md:p-8" onSubmit={(e) => handleSubmit(e)}>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create account</h1>
                    <p className="text-muted-foreground text-balance">
                      Enter your personal information to create an account.
                    </p>
                  </div>

                  {/* Full Name Field */}
                  <div className="grid gap-3">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

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
                  <div className="grid gap-3 relative">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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

                  <Button type="submit" className="w-full">
                    {loading ? "Loading..." : "Create account"}
                  </Button>

                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or
                    </span>
                  </div>

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
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
