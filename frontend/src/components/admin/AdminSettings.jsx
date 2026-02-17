import React, { useState } from "react";
import {
  Settings,
  Database,
  Users,
  ClipboardList,
  CheckCircle2,
  Activity,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Server,
  Shield,
} from "lucide-react";
import {
  useGetSystemStatsQuery,
  useClearActivityLogsMutation,
  useGetAllUsersQuery,
} from "@/services/adminApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { SkeletonForm } from "../Skeleton";
import { toast } from "sonner";

function AdminSettings() {
  const { data: stats, isLoading, refetch } = useGetSystemStatsQuery();
  const { data: users } = useGetAllUsersQuery();
  const [clearLogs, { isLoading: clearing }] = useClearActivityLogsMutation();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleClearLogs = async () => {
    try {
      await clearLogs().unwrap();
      setShowClearDialog(false);
      toast.success("Activity logs cleared successfully.");
      refetch();
    } catch (err) {
      toast.error("Failed to clear logs.");
    }
  };

  if (isLoading) return <SkeletonForm />;

  const verificationRate =
    stats?.totalUsers > 0
      ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100)
      : 0;

  const completionRate =
    stats?.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const adminCount = users?.filter((u) => u.isAdmin).length || 0;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            System overview and administrative actions.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 w-fit"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Stats
        </Button>
      </div>

      {/* System Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  Total Users
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.verifiedUsers || 0}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Verified Users
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                <ClipboardList className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalTasks || 0}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  Total Tasks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-500/10">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.totalActivities || 0}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Activity Logs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              User Verification
            </CardTitle>
            <CardDescription>
              Email verification status across all users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Verified</span>
              <span className="font-bold">{verificationRate}%</span>
            </div>
            <Progress value={verificationRate} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats?.verifiedUsers || 0} verified</span>
              <span>
                {(stats?.totalUsers || 0) - (stats?.verifiedUsers || 0)}{" "}
                unverified
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Admin Accounts</span>
              <Badge variant="secondary" className="font-bold">
                {adminCount}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Task Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Task Completion
            </CardTitle>
            <CardDescription>Overall task completion rate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-bold">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats?.completedTasks || 0} completed</span>
              <span>
                {(stats?.totalTasks || 0) - (stats?.completedTasks || 0)} active
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg per User</span>
              <Badge variant="secondary" className="font-bold">
                {stats?.totalUsers > 0
                  ? (stats.totalTasks / stats.totalUsers).toFixed(1)
                  : 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            System Information
          </CardTitle>
          <CardDescription>
            Current environment and platform details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <span className="text-sm text-muted-foreground">Platform</span>
              <Badge variant="outline">MERN Stack</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <span className="text-sm text-muted-foreground">Database</span>
              <Badge variant="outline">MongoDB</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <span className="text-sm text-muted-foreground">Auth</span>
              <Badge variant="outline">JWT + Cookies</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible administrative actions. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div>
              <p className="font-medium text-sm">Clear Activity Logs</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Remove all activity logs from the database. This cannot be
                undone.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 shrink-0"
              onClick={() => setShowClearDialog(true)}
              disabled={clearing}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clear Logs Confirmation */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all activity logs?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {stats?.totalActivities || 0}{" "}
              activity log entries. The engagement chart on the dashboard will
              be empty. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearLogs}
              className="bg-destructive hover:bg-destructive/90"
              disabled={clearing}
            >
              {clearing ? "Clearing..." : "Clear All Logs"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminSettings;
