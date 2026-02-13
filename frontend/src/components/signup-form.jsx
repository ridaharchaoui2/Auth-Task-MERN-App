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
import { useRegisterMutation } from "@/services/authApi";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SkeletonForm } from "./Skeleton";
import { UserPlus, Mail, Lock, User, Loader2, ShieldCheck } from "lucide-react";

export function SignupForm({ className, ...props }) {
  const [register, { isSuccess, isError, isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await register({ name, email, password }).unwrap();
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/Home");
    }
    if (isSuccess) {
      toast.success("Account created successfully! Please sign in.");
    }
    if (isError) {
      toast.error("Signup failed. That email might already be in use.");
    }
  }, [userInfo, isSuccess, isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[500px] space-y-6 px-4 py-8",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
          <UserPlus className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground">
          Join us today and start managing your tasks efficiently.
        </p>
      </div>

      <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Personal Details</CardTitle>
          <CardDescription>
            Enter your information to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Passwords Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-md hover:translate-y-[-1px] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              to="/signin"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="px-8 text-center text-[10px] text-muted-foreground uppercase tracking-widest">
        Secure • Fast • Encrypted
      </p>
    </div>
  );
}
