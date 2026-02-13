import { useRef, useEffect } from "react";
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
import { Plus, Edit } from "lucide-react"; // Changed Plus to Edit for better UX
import { toast } from "sonner";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/services/authApi"; // Added mutation

export function EditProfile({ userId }) {
  const { data: profile } = useGetUserProfileQuery(userId, { skip: !userId });
  // 1. Initialize the mutation hook
  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const dialogCloseRef = useRef(null);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Validate passwords match
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return toast.error("Passwords do not match");
    }

    try {
      await updateUserProfile({
        id: userId,
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value || undefined, // Only send if changed
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
        <Button variant="outline" className="mb-4">
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your account information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                ref={nameRef}
                defaultValue={profile?.name} // Use defaultValue for uncontrolled inputs
                placeholder="Your Name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                ref={emailRef}
                defaultValue={profile?.email}
                placeholder="Your Email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">
                New Password (Leave blank to keep current)
              </Label>
              <Input
                id="password"
                type="password"
                ref={passwordRef}
                placeholder="••••••••"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                ref={confirmPasswordRef}
                placeholder="••••••••"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button ref={dialogCloseRef} variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            {/* 3. Fixed the syntax error in the button below */}
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
