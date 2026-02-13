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
import { Edit, User, Mail, Lock, Loader2, Settings2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/services/authApi";

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
        <Button
          variant="outline"
          size="sm"
          className="gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Profile</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-col items-center text-center space-y-2 pb-4 border-b">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <Settings2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Account Settings
            </DialogTitle>
            <DialogDescription>
              Modify your personal details and security preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            {/* Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  ref={nameRef}
                  defaultValue={profile?.name}
                  placeholder="John Doe"
                  className="pl-10 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  ref={emailRef}
                  defaultValue={profile?.email}
                  placeholder="m@example.com"
                  className="pl-10 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Password Section - Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t mt-2">
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  title="Leave blank to keep current"
                  className="text-sm font-semibold truncate"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    ref={passwordRef}
                    placeholder="••••••••"
                    className="pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    ref={confirmPasswordRef}
                    placeholder="••••••••"
                    className="pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              Leave password fields empty if you do not wish to change them.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
            <DialogClose asChild>
              <Button ref={dialogCloseRef} variant="ghost" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isUpdating}
              className="min-w-[120px]"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
