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
import { toast } from "sonner";
import {
  Loader2,
  LockKeyhole,
  Mail,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export function LoginForm({ className, ...props }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading, isSuccess, isError }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    } catch (err) {
      toast.error(err?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div
        className={cn(
          "relative mx-auto w-full max-w-[480px] space-y-8",
          className,
        )}
        {...props}
      >
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Brand Icon with Gradient */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-gray-400 font-medium">
              Enter your credentials to access your dashboard
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="relative overflow-hidden border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] shadow-2xl">
          {/* Gradient Top Border */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <CardHeader className="space-y-2 pt-8">
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-gray-100">
              Sign In
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-gray-400 font-medium">
              Enter your email and password to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="pl-14 pr-4 h-12 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-gray-500"
                  >
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 dark:bg-[#1A1A1A]">
                    <LockKeyhole className="h-4 w-4 text-slate-600 dark:text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-14 pr-4 h-12 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="relative w-full h-12 rounded-xl font-bold text-base overflow-hidden border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all group mt-8"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isLoading ? (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="relative z-10">Sign In</span>
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-slate-600 dark:text-gray-400">
                Don't have an account?{" "}
              </span>
              <Link
                to="/signup"
                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Privacy */}
        <div className="flex items-start gap-2 p-4 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#252525]">
          <Sparkles className="h-4 w-4 text-slate-400 dark:text-gray-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="font-bold text-slate-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-bold text-slate-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
