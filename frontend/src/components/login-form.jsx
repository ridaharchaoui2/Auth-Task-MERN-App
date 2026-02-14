import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/services/authSlice";
import { useEffect } from "react";
import { toast } from "sonner";
import { SkeletonForm } from "./Skeleton";
import { Loader2, LockKeyhole, Mail } from "lucide-react";

export function LoginForm({ className, ...props }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading, isSuccess, isError }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/Home");
      }
    }
    if (isSuccess) {
      toast.success("Welcome back!");
    }
    if (isError) {
      toast.error("Invalid email or password.");
    }
  }, [userInfo, isSuccess, isError, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      if (res.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/Home");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <div
      className={cn("mx-auto w-full max-w-[450px] space-y-6 px-4", className)}
      {...props}
    >
      <div className="flex flex-col items-center space-y-2 text-center">
        {/* Brand Icon or Logo placeholder */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>
            Choose your preferred way to log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold transition-all hover:translate-y-[-1px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="px-8 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
