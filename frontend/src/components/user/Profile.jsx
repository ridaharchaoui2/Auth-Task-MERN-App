import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetAllTasksQuery } from "@/services/taskApi";
import {
  useGetUserProfileQuery,
  useUploadAvatarMutation,
} from "@/services/authApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Calendar,
  CheckCircle2,
  Circle,
  ListTodo,
  ShieldCheck,
  Fingerprint,
  TrendingUp,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { EditProfile } from "./EditProfile";

function Profile() {
  const { id } = useParams();
  const fileInputRef = useRef(null);

  // 1. Auth & API Hooks
  const { userInfo } = useSelector((state) => state.auth);
  const userId = id || userInfo?._id;

  const { data: profile } = useGetUserProfileQuery(userId, { skip: !userId });
  const { data: tasks } = useGetAllTasksQuery();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

  // 2. Utility Functions
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 3. Task Logic
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((task) => task.completed).length || 0;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 4. Image Upload Handler
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Condition to verify size (2MB = 2,097,152 bytes)
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "File is too large! Please upload an image smaller than 2MB.",
      );
      // Reset the input so the same file can be selected again if needed
      e.target.value = null;
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await uploadAvatar(formData).unwrap();
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(err?.data?.message || "Upload failed");
    }
  };

  const avatarUrl = profile?.avatar?.url || null;

  return (
    <main className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* PROFILE HERO SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-background border shadow-sm">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background" />
          <div className="px-6 pb-6">
            <div className="relative -mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                <div
                  className="relative group cursor-pointer"
                  onClick={handleImageClick}
                >
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl sm:h-32 sm:w-32 transition-transform group-hover:scale-105">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
                        {getInitials(profile?.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {/* Upload Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white h-8 w-8" />
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <div className="space-y-1 text-center sm:text-left sm:pb-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {profile?.name}
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{profile?.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pb-2">
                <EditProfile userId={userId} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* TASK STATISTICS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-none bg-background shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <ListTodo className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total
                    </p>
                    <p className="text-2xl font-bold">{totalTasks}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-background shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Done
                    </p>
                    <p className="text-2xl font-bold">{completedTasks}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-background shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                    <Circle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending
                    </p>
                    <p className="text-2xl font-bold">{pendingTasks}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* PRODUCTIVITY CARD */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">
                    Productivity
                  </CardTitle>
                  <CardDescription>Overall completion rate</CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold">{completionRate}%</span>
                  <Badge
                    variant={completionRate > 50 ? "default" : "secondary"}
                  >
                    {completionRate > 80 ? "Pro Mode" : "Getting There"}
                  </Badge>
                </div>
                <Progress value={completionRate} className="h-3" />
              </CardContent>
            </Card>
          </div>

          {/* ACCOUNT DETAILS */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Calendar className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(profile?.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t pt-4">
                  <ShieldCheck className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Status</p>
                    <Badge className="bg-green-500/10 text-green-600 border-none mt-1">
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t pt-4">
                  <Fingerprint className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">ID</p>
                    <p className="truncate text-xs text-muted-foreground font-mono max-w-[150px]">
                      {profile?._id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
