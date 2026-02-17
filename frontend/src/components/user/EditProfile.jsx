import { useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import {
  Edit,
  User,
  Mail,
  Lock,
  Loader2,
  Settings2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/services/authApi";
import { cn } from "@/lib/utils";

export function EditProfile({ userId }) {
  const { data: profile } = useGetUserProfileQuery(userId, { skip: !userId });
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const dialogCloseRef = useRef(null);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return toast.error("Passwords do not match");
    }

    try {
      await updateUserProfile({
        id: userId,
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value || undefined,
      }).unwrap();

      toast.success("Profile updated successfully!");
      dialogCloseRef.current?.click();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="relative gap-2 px-6 py-2.5 rounded-xl font-bold overflow-hidden border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Edit className="relative z-10 h-4 w-4" />
          <span className="relative z-10">Edit Profile</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F] text-slate-900 dark:text-gray-100 p-0 gap-0 overflow-hidden">
        {/* Gradient Top Border */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-5 border-b border-slate-200 dark:border-[#1F1F1F]">
            <div className="flex items-center gap-4 mb-3">
              {/* Icon with Gradient */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-lg opacity-50" />
                <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Settings2 className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="text-left">
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-gray-100">
                  Account Settings
                </DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-gray-400 font-medium mt-1">
                  Modify your personal details and security
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-6 space-y-6">
            {/* Name Field */}
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
                  ref={nameRef}
                  defaultValue={profile?.name}
                  placeholder="John Doe"
                  className="pl-14 pr-4 h-12 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-medium"
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
                  ref={emailRef}
                  defaultValue={profile?.email}
                  placeholder="m@example.com"
                  type="email"
                  className="pl-14 pr-4 h-12 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-[#1F1F1F] space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-400 dark:text-gray-600" />
                <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-gray-500">
                  Security Settings
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold text-slate-600 dark:text-gray-400"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Lock className="h-4 w-4 text-slate-400 dark:text-gray-600" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      ref={passwordRef}
                      placeholder="••••••••"
                      className="pl-11 pr-4 h-11 rounded-lg bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
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
                      <Lock className="h-4 w-4 text-slate-400 dark:text-gray-600" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type="password"
                      ref={confirmPasswordRef}
                      placeholder="••••••••"
                      className="pl-11 pr-4 h-11 rounded-lg bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Helper Text */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                  Leave password fields empty to keep your current password
                  unchanged.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 bg-slate-50 dark:bg-[#0F0F0F] border-t border-slate-200 dark:border-[#1F1F1F] gap-3">
            <DialogClose asChild>
              <Button
                ref={dialogCloseRef}
                type="button"
                variant="ghost"
                className="flex-1 h-11 rounded-xl bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#252525] text-slate-700 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-[#1F1F1F] hover:border-slate-300 dark:hover:border-[#2A2A2A] hover:text-slate-900 dark:hover:text-gray-200 font-bold transition-all"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={isUpdating}
              className="relative flex-1 h-11 rounded-xl font-bold overflow-hidden border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all group disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isUpdating ? (
                <span className="relative z-10 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="relative z-10">Save Changes</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
