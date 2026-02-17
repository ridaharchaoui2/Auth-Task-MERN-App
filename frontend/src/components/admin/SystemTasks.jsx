import React, { useState } from "react";
import {
  ClipboardList,
  Search,
  Trash2,
  CheckCircle2,
  Circle,
  Flame,
  Zap,
  Droplet,
  Filter,
  ArrowUpDown,
  CalendarDays,
  User as UserIcon,
} from "lucide-react";
import {
  useGetAllAdminTasksQuery,
  useDeleteAdminTaskMutation,
  useUpdateAdminTaskMutation,
} from "@/services/adminApi";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SkeletonForm } from "../Skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

function SystemTasks() {
  const { data: tasks, isLoading, error } = useGetAllAdminTasksQuery();
  const [deleteTask] = useDeleteAdminTaskMutation();
  const [updateTask] = useUpdateAdminTaskMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete).unwrap();
      setTaskToDelete(null);
      toast.success("Task deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete task.");
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    try {
      await updateTask({ id: taskId, completed: !currentStatus }).unwrap();
      toast.success(
        !currentStatus ? "Task marked complete" : "Task marked active",
      );
    } catch (err) {
      toast.error("Failed to update task.");
    }
  };

  const getFilteredTasks = () => {
    if (!tasks) return [];

    return [...tasks]
      .filter((task) => {
        const matchesSearch =
          task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.user
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (statusFilter === "completed") matchesStatus = task.completed;
        if (statusFilter === "active") matchesStatus = !task.completed;

        let matchesPriority = true;
        if (priorityFilter !== "all")
          matchesPriority = task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        switch (sortBy) {
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

  const filteredTasks = getFilteredTasks();
  const activeCount = tasks?.filter((t) => !t.completed).length || 0;
  const completedCount = tasks?.filter((t) => t.completed).length || 0;

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

  if (isLoading) return <SkeletonForm />;

  if (error)
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-destructive font-medium">Failed to load tasks.</p>
      </div>
    );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            System Tasks
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            View and manage all tasks across the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/5 border border-primary/10 rounded-lg px-4 py-2 flex items-center gap-3">
            <ClipboardList className="h-4 w-4 text-primary" />
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold">{tasks?.length || 0}</span>
              <span className="text-muted-foreground">Total</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-bold text-amber-600">{activeCount}</span>
              <span className="text-muted-foreground">Active</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-bold text-emerald-600">
                {completedCount}
              </span>
              <span className="text-muted-foreground">Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card border rounded-lg p-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
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

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
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

      {/* Tasks Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="hidden sm:table-cell">Priority</TableHead>
              <TableHead className="hidden lg:table-cell">Due Date</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const pConfig = priorityConfig[task.priority];
                const PIcon = pConfig?.icon;
                return (
                  <TableRow
                    key={task._id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    {/* Status Toggle */}
                    <TableCell>
                      <Switch
                        checked={task.completed}
                        onCheckedChange={() =>
                          handleToggleStatus(task._id, task.completed)
                        }
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </TableCell>

                    {/* Title */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {task.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span
                          className={`font-medium ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-[250px]">
                        {task.description}
                      </p>
                    </TableCell>

                    {/* Priority */}
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="outline"
                        className={`gap-1 font-semibold ${pConfig?.color}`}
                      >
                        {PIcon && <PIcon className="h-3 w-3" />}
                        {task.priority}
                      </Badge>
                    </TableCell>

                    {/* Due Date */}
                    <TableCell className="hidden lg:table-cell">
                      {task.dueDate ? (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Created */}
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(task.createdAt), "MMM d, yyyy")}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setTaskToDelete(task._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground font-medium">
                      No tasks found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this task from the system. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SystemTasks;
