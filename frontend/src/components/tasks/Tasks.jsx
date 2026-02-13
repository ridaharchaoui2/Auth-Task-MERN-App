import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ClipboardList, LayoutGrid, ListCheck, Clock } from "lucide-react";
import {
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from "@/services/taskApi";
import { TaskCard } from "./TaskCard";
import { SkeletonForm } from "../Skeleton";
import { AddTask } from "./AddTask.jsx";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

function Tasks() {
  const { userInfo } = useSelector((state) => state.auth);

  // 1. RTK Query Hooks
  const { data: tasks, isLoading, refetch } = useGetAllTasksQuery();

  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // 2. Refetch when user logs in or switches
  useEffect(() => {
    if (userInfo) refetch();
  }, [userInfo, refetch]);

  // 3. Status Change Handler
  const handleStatusChange = async (taskId, completed) => {
    try {
      await updateTask({ id: taskId, completed }).unwrap();
      toast.success(completed ? "Task completed!" : "Task marked as active");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update status.");
    }
  };

  // 4. Delete Handler
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId).unwrap();
      toast.success("Task moved to trash.");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Could not delete the task.");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="p-8">
        <SkeletonForm />
      </div>
    );
  }

  // Task Statistics for the Header
  const activeTasksCount = tasks?.filter((t) => !t.completed).length || 0;
  const completedTasksCount = tasks?.filter((t) => t.completed).length || 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <main className="mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <LayoutGrid className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Dashboard
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              My Tasks
            </h1>
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>{activeTasksCount} Pending</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <ListCheck className="h-4 w-4 text-emerald-500" />
                <span>{completedTasksCount} Completed</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <AddTask />
          </div>
        </header>

        {/* TASKS CONTENT */}
        {tasks && tasks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                taskId={task._id}
                title={task.title}
                description={task.description}
                completed={task.completed}
                onStatusChange={(completed) =>
                  handleStatusChange(task._id, completed)
                }
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE REDESIGN */
          <div className="mt-20 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-primary/50 opacity-20 blur-xl" />
              <div className="relative rounded-full bg-background border p-8 shadow-sm">
                <ClipboardList className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Focus on your day
            </h2>
            <p className="mt-2 mb-8 max-w-sm text-muted-foreground leading-relaxed">
              Your task list is currently empty. Clear your mind by writing down
              your next goal.
            </p>
            <AddTask />
          </div>
        )}
      </main>
    </div>
  );
}

export default Tasks;
