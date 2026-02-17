import React, { useRef, useState } from "react";
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
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Sparkles,
  Award,
  Target,
  Zap,
  Flame,
  Droplet,
  Clock,
  Activity,
  Search,
  Filter,
  ArrowUpDown,
  CalendarDays,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { EditProfile } from "./EditProfile";
import { cn } from "@/lib/utils";
import { isToday, isPast, format } from "date-fns";

function Profile() {
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);
  const userId = id || userInfo?._id;

  const { data: profile } = useGetUserProfileQuery(userId, { skip: !userId });
  const { data: tasks } = useGetAllTasksQuery();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

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

  // --- STATS CALCULATIONS ---
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((task) => task.completed).length || 0;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Today's Stats
  const tasksToday =
    tasks?.filter((task) => task.dueDate && isToday(new Date(task.dueDate))) ||
    [];
  const completedToday = tasksToday.filter((task) => task.completed).length;
  const totalToday = tasksToday.length;
  const todayProgress =
    totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Priority Stats
  const highPriority = tasks?.filter((t) => t.priority === "High").length || 0;
  const mediumPriority =
    tasks?.filter((t) => t.priority === "Medium").length || 0;
  const lowPriority = tasks?.filter((t) => t.priority === "Low").length || 0;

  // Task History Filters
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatus, setHistoryStatus] = useState("all");
  const [historyPriority, setHistoryPriority] = useState("all");
  const [historySort, setHistorySort] = useState("newest");

  const getHistoryTasks = () => {
    if (!tasks) return [];
    return [...tasks]
      .filter((task) => {
        const matchesSearch =
          task.title?.toLowerCase().includes(historySearch.toLowerCase()) ||
          task.description?.toLowerCase().includes(historySearch.toLowerCase());
        let matchesStatus = true;
        if (historyStatus === "completed") matchesStatus = task.completed;
        if (historyStatus === "active") {
          const dueDate = task.dueDate ? new Date(task.dueDate) : null;
          matchesStatus =
            !task.completed &&
            (!dueDate || isToday(dueDate) || !isPast(dueDate));
        }
        if (historyStatus === "overdue") {
          const dueDate = task.dueDate ? new Date(task.dueDate) : null;
          matchesStatus =
            !task.completed && dueDate && isPast(dueDate) && !isToday(dueDate);
        }
        let matchesPriority = true;
        if (historyPriority !== "all")
          matchesPriority = task.priority === historyPriority;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        switch (historySort) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "priority": {
            const w = { High: 3, Medium: 2, Low: 1 };
            return (w[b.priority] || 0) - (w[a.priority] || 0);
          }
          case "dueDate":
            return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
          default:
            return 0;
        }
      });
  };

  const historyTasks = getHistoryTasks();

  const priorityConfig = {
    High: {
      color:
        "text-red-600 bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400",
      icon: Flame,
    },
    Medium: {
      color:
        "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400",
      icon: Zap,
    },
    Low: {
      color:
        "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400",
      icon: Droplet,
    },
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        "File is too large! Please upload an image smaller than 2MB.",
      );
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
    <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] relative overflow-hidden pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* --- 1. PROFILE HERO SECTION --- */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#1F1F1F] shadow-xl">
          {/* Gradient Header */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="px-8 pb-8">
            <div className="relative -mt-20 flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
                {/* Avatar with Upload */}
                <div
                  className="relative group cursor-pointer"
                  onClick={handleImageClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                  <Avatar className="relative h-32 w-32 sm:h-40 sm:w-40 border-4 border-white dark:border-[#0A0A0A] shadow-2xl transition-transform duration-300 group-hover:scale-105">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-slate-800 to-black text-4xl font-black text-white">
                        {getInitials(profile?.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Upload Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-center">
                      <Camera className="text-white h-8 w-8 mx-auto mb-1" />
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                        Upload
                      </span>
                    </div>
                  </div>

                  {/* Loading Spinner */}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/80 backdrop-blur-sm">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                    </div>
                  )}

                  {/* Status Indicator */}
                  <div className="absolute bottom-3 right-3 h-5 w-5 rounded-full bg-emerald-500 border-4 border-white dark:border-[#0A0A0A]" />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {/* Name & Bio */}
                <div className="space-y-1 text-center sm:text-left sm:pb-2">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    {profile?.name}
                  </h1>
                  <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-gray-400 sm:justify-start font-medium">
                    <Mail className="h-4 w-4" />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#2A2A2A]"
                    >
                      Developer
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#2A2A2A]"
                    >
                      Pro Member
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="pb-4">
                <EditProfile userId={userId} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* --- 2. MAIN STATS COLUMN --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3-Grid Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatsCard
                icon={ListTodo}
                label="Total Tasks"
                value={totalTasks}
                color="blue"
                subtext="All time"
              />
              <StatsCard
                icon={CheckCircle2}
                label="Completed"
                value={completedTasks}
                color="emerald"
                subtext={`${completionRate}% success`}
              />
              <StatsCard
                icon={Circle}
                label="Pending"
                value={pendingTasks}
                color="orange"
                subtext="Needs action"
              />
            </div>

            {/* PRODUCTIVITY & ANALYSIS */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Overall Progress */}
              <Card className="border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <CardTitle className="text-base font-bold">
                        Overall Efficiency
                      </CardTitle>
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {completionRate}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={completionRate}
                    className="h-2.5 mb-2 bg-slate-100 dark:bg-[#1A1A1A] "
                    indicatorClassName="bg-indigo-600"
                  />
                  <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                    You have completed {completedTasks} out of {totalTasks}{" "}
                    total tasks.
                  </p>
                </CardContent>
              </Card>

              {/* Today's Productivity (NEW) */}
              <Card className="border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-pink-50 dark:bg-pink-500/10 rounded-lg">
                        <Activity className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                      </div>
                      <CardTitle className="text-base font-bold">
                        Today's Focus
                      </CardTitle>
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {todayProgress}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={todayProgress}
                    className="h-2.5 mb-2 bg-slate-100 dark:bg-[#1A1A1A]"
                    indicatorClassName="bg-pink-600"
                  />
                  <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                    {completedToday} of {totalToday} tasks due today are done.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Task Priority Breakdown (NEW) */}
            <Card className="border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Target className="h-5 w-5 text-slate-400" />
                  Task Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <PriorityRow
                    label="High Priority"
                    count={highPriority}
                    total={totalTasks}
                    color="bg-red-500"
                    icon={Flame}
                  />
                  <PriorityRow
                    label="Medium Priority"
                    count={mediumPriority}
                    total={totalTasks}
                    color="bg-amber-500"
                    icon={Zap}
                  />
                  <PriorityRow
                    label="Low Priority"
                    count={lowPriority}
                    total={totalTasks}
                    color="bg-blue-500"
                    icon={Droplet}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- 3. SIDEBAR DETAILS --- */}
          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] shadow-lg">
              <CardHeader className="border-b border-slate-100 dark:border-[#1F1F1F] pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <InfoRow
                  icon={Calendar}
                  label="Member Since"
                  value={formatDate(profile?.createdAt)}
                  color="text-blue-500"
                  bg="bg-blue-50 dark:bg-blue-500/10"
                />

                <InfoRow
                  icon={ShieldCheck}
                  label="Account Status"
                  value="Active & Verified"
                  color="text-emerald-500"
                  bg="bg-emerald-50 dark:bg-emerald-500/10"
                />

                <InfoRow
                  icon={Fingerprint}
                  label="User ID"
                  value={profile?._id}
                  isMono
                  color="text-purple-500"
                  bg="bg-purple-50 dark:bg-purple-500/10"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- 4. TASK HISTORY TABLE --- */}
        <Card className="border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] shadow-lg">
          <CardHeader className="border-b border-slate-100 dark:border-[#1F1F1F]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#1A1A1A]">
                  <History className="h-5 w-5 text-slate-600 dark:text-gray-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">
                    Task History
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {historyTasks.length} of {tasks?.length || 0} tasks shown
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-b border-slate-100 dark:border-[#1F1F1F]">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={historyStatus} onValueChange={setHistoryStatus}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={historyPriority}
                  onValueChange={setHistoryPriority}
                >
                  <SelectTrigger className="w-32">
                    <Flame className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={historySort} onValueChange={setHistorySort}>
                  <SelectTrigger className="w-36">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Status</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyTasks.length > 0 ? (
                    historyTasks.map((task) => {
                      const pConfig = priorityConfig[task.priority];
                      const PIcon = pConfig?.icon;
                      return (
                        <TableRow
                          key={task._id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell>
                            {(() => {
                              if (task.completed) {
                                return (
                                  <Badge
                                    variant="outline"
                                    className="gap-1 text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                    Done
                                  </Badge>
                                );
                              }
                              const dueDate = task.dueDate
                                ? new Date(task.dueDate)
                                : null;
                              const isOverdue =
                                dueDate && isPast(dueDate) && !isToday(dueDate);
                              if (isOverdue) {
                                return (
                                  <Badge
                                    variant="outline"
                                    className="gap-1 text-red-600 bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400"
                                  >
                                    <Clock className="h-3 w-3" />
                                    Overdue
                                  </Badge>
                                );
                              }
                              return (
                                <Badge
                                  variant="outline"
                                  className="gap-1 text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400"
                                >
                                  <Circle className="h-3 w-3" />
                                  Active
                                </Badge>
                              );
                            })()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "font-medium",
                                task.completed &&
                                  "line-through text-muted-foreground",
                              )}
                            >
                              {task.title}
                            </span>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-[250px]">
                              {task.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "gap-1 font-semibold",
                                pConfig?.color,
                              )}
                            >
                              {PIcon && <PIcon className="h-3 w-3" />}
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {task.dueDate ? (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {format(new Date(task.dueDate), "MMM d, yyyy")}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {format(
                                new Date(task.createdAt),
                                "MMM d, yyyy 'at' HH:mm",
                              )}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <ListTodo className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground font-medium">
                            No tasks found
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your filters.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Card List - Mobile */}
            <div className="md:hidden divide-y divide-border">
              {historyTasks.length > 0 ? (
                historyTasks.map((task) => {
                  const pConfig = priorityConfig[task.priority];
                  const PIcon = pConfig?.icon;
                  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                  const isOverdue =
                    !task.completed &&
                    dueDate &&
                    isPast(dueDate) &&
                    !isToday(dueDate);

                  return (
                    <div key={task._id} className="p-4 space-y-3">
                      {/* Row 1: Title + Status */}
                      <div className="flex items-start justify-between gap-3">
                        <h4
                          className={cn(
                            "font-semibold text-sm flex-1",
                            task.completed &&
                              "line-through text-muted-foreground",
                          )}
                        >
                          {task.title}
                        </h4>
                        {task.completed ? (
                          <Badge
                            variant="outline"
                            className="shrink-0 gap-1 text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 text-xs"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Done
                          </Badge>
                        ) : isOverdue ? (
                          <Badge
                            variant="outline"
                            className="shrink-0 gap-1 text-red-600 bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400 text-xs"
                          >
                            <Clock className="h-3 w-3" />
                            Overdue
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="shrink-0 gap-1 text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 text-xs"
                          >
                            <Circle className="h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </div>

                      {/* Row 2: Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>

                      {/* Row 3: Priority + Dates */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1 font-semibold text-xs",
                            pConfig?.color,
                          )}
                        >
                          {PIcon && <PIcon className="h-3 w-3" />}
                          {task.priority}
                        </Badge>
                        {dueDate && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            {format(dueDate, "MMM d, yyyy")}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-muted-foreground ml-auto">
                          <Clock className="h-3 w-3" />
                          {format(
                            new Date(task.createdAt),
                            "MMM d, yyyy 'at' HH:mm",
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center gap-2 py-12">
                  <ListTodo className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground font-medium">
                    No tasks found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// --- SUB-COMPONENTS FOR CLEANER CODE ---

function StatsCard({ icon: Icon, label, value, color, subtext }) {
  const colorStyles = {
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/20 text-blue-600",
    emerald:
      "from-emerald-500 to-teal-600 shadow-emerald-500/20 text-emerald-600",
    orange: "from-orange-500 to-amber-600 shadow-orange-500/20 text-orange-600",
  };

  return (
    <Card className="relative overflow-hidden border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "p-2.5 rounded-xl bg-gradient-to-br shadow-lg text-white",
              colorStyles[color].split(" ").slice(0, 2).join(" "),
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-[#1A1A1A]",
              colorStyles[color].split(" ").pop(),
            )}
          >
            {subtext}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
            {label}
          </p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PriorityRow({ label, count, total, color, icon: Icon }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <div
        className={cn(
          "p-2 rounded-lg bg-opacity-10",
          color.replace("bg-", "bg-opacity-10 bg-"),
        )}
      >
        <Icon className={cn("h-4 w-4", color.replace("bg-", "text-"))} />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between text-sm font-bold">
          <span className="text-slate-700 dark:text-gray-300">{label}</span>
          <span className="text-slate-500">
            {count} tasks ({percentage}%)
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full", color)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, color, bg, isMono }) {
  return (
    <div className="flex items-center gap-4">
      <div className={cn("p-2.5 rounded-xl", bg)}>
        <Icon className={cn("h-5 w-5", color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-semibold text-slate-900 dark:text-gray-100 truncate",
            isMono && "font-mono text-xs",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default Profile;
