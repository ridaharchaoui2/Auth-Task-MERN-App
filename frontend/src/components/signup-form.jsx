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
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
      toast.success(
        "Account created successfully! Please check your email to verify.",
      );
    }
    if (isError) {
      toast.error("Signup failed. That email might already be in use.");
    }
  }, [userInfo, isSuccess, isError, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div
        className={cn(
          "relative mx-auto w-full max-w-[520px] space-y-8",
          className,
        )}
        {...props}
      >
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Brand Icon with Gradient */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-2xl">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Create an account
            </h1>
            <p className="text-slate-600 dark:text-gray-400 font-medium">
              Join us today and start managing your tasks efficiently
            </p>
          </div>
        </div>

        {/* Signup Card */}
        <Card className="relative overflow-hidden border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] shadow-2xl">
          {/* Gradient Top Border */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />

          <CardHeader className="space-y-2 pt-8">
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-gray-100">
              Personal Details
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-gray-400 font-medium">
              Enter your information to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-gray-500"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 dark:bg-[#1A1A1A]">
                    <User className="h-4 w-4 text-slate-600 dark:text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className="pl-14 pr-4 h-12 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-gray-500"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 dark:bg-[#1A1A1A]">
                    <Mail className="h-4 w-4 text-slate-600 dark:text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-14 pr-4 h-12 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-[#1F1F1F] space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-400 dark:text-gray-600" />
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-gray-500">
                    Security
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-xs font-bold text-slate-600 dark:text-gray-400"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Lock className="h-4 w-4 text-slate-400 dark:text-gray-600" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-11 pr-4 h-11 rounded-lg bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs font-bold text-slate-600 dark:text-gray-400"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <ShieldCheck className="h-4 w-4 text-slate-400 dark:text-gray-600" />
                      </div>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-11 pr-4 h-11 rounded-lg bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="relative w-full h-12 rounded-xl font-bold text-base overflow-hidden border-0 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all group mt-8"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isLoading ? (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <span className="relative z-10">Get Started</span>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-slate-600 dark:text-gray-400">
                Already have an account?{" "}
              </span>
              <Link
                to="/signin"
                className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Badges */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: "Secure" },
            { icon: Sparkles, label: "Fast" },
            { icon: Lock, label: "Encrypted" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#252525] group hover:bg-slate-200 dark:hover:bg-[#1F1F1F] transition-all"
            >
              <item.icon className="h-5 w-5 text-slate-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
