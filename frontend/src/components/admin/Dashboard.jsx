import React from "react";
import {
  Users,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  useGetAllAdminTasksQuery,
  useGetAllUsersQuery,
  useGetEngagementStatsQuery,
} from "@/services/adminApi";
import { SkeletonForm } from "../Skeleton";
import { Badge } from "@/components/ui/badge";

function AdminDashboard() {
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useGetAllUsersQuery(undefined, { pollingInterval: 30000 });

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetAllAdminTasksQuery(undefined, { pollingInterval: 30000 });

  const { data: dynamicStats, isLoading: statsLoading } =
    useGetEngagementStatsQuery(undefined, { pollingInterval: 1000 });

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((task) => task.completed).length || 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (tasksLoading || usersLoading || statsLoading) return <SkeletonForm />;

  if (tasksError || usersError)
    return (
      <div className="flex h-[450px] items-center justify-center p-8 text-center">
        <div className="space-y-2">
          <Activity className="mx-auto h-12 w-12 text-destructive/50" />
          <p className="text-lg font-medium text-destructive">
            Connection Error
          </p>
          <p className="text-sm text-muted-foreground">
            Unable to fetch latest dashboard data.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background/50 p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto text-foreground">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor system performance and user engagement metrics.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit py-1 px-3 gap-2 bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Updates
        </Badge>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Community"
          value={users?.length || 0}
          subValue="Active accounts"
          icon={Users}
          trend="+12.5%"
          color="bg-blue-500"
        />
        <StatsCard
          title="Global Tasks"
          value={tasks?.length || 0}
          subValue="Across all projects"
          icon={ClipboardList}
          trend="+5.2%"
          color="bg-purple-500"
        />
        <StatsCard
          title="Success Rate"
          value={`${completionRate}%`}
          subValue="Completed objectives"
          icon={CheckCircle2}
          trend="+2.1%"
          color="bg-emerald-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* --- CHART 1: USER ENGAGEMENT --- */}
        <Card className="shadow-sm border-muted/40 bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">
                  User Engagement
                </CardTitle>
                <CardDescription>Sign-ups vs Sign-ins (7D)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicStats || []}>
                  <defs>
                    <linearGradient
                      id="colorSignups"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorSignins"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(148, 163, 184, 0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="#3b82f6"
                    fill="url(#colorSignups)"
                    strokeWidth={2.5}
                    name="New Sign-ups"
                  />
                  <Area
                    type="monotone"
                    dataKey="signins"
                    stroke="#a855f7"
                    fill="url(#colorSignins)"
                    strokeWidth={2.5}
                    name="Active Sign-ins"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* --- CHART 2: TASK ACTIVITY --- */}
        <Card className="shadow-sm border-muted/40 bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">
                  Task Management
                </CardTitle>
                <CardDescription>
                  Daily creation and update volume
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicStats || []}>
                  <defs>
                    <linearGradient
                      id="colorCreated"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(148, 163, 184, 0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="created"
                    stroke="#10b981"
                    fill="url(#colorCreated)"
                    strokeWidth={2.5}
                    name="Tasks Created"
                  />
                  <Area
                    type="monotone"
                    dataKey="updated"
                    stroke="#ef4444"
                    fill="none"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    name="Tasks Updated"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  subValue,
  icon: Icon,
  trend,
  color,
  iconColor,
}) {
  return (
    <Card className="relative overflow-hidden border-muted/40 transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
              <span className="flex items-center text-xs font-medium text-emerald-600">
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                {trend}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{subValue}</p>
          </div>
          {/* 2. Use the explicit iconColor prop here */}
          <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        <div
          className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full ${color} opacity-[0.03]`}
        />
      </CardContent>
    </Card>
  );
}

export default AdminDashboard;
