import {
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from "@/services/taskApi";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { TaskCard } from "./TaskCard";
import { SkeletonForm } from "../Skeleton";
import { AddTask } from "./AddTask.jsx";
import { toast } from "sonner";

function Tasks() {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: tasks,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAllTasksQuery();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Refetch when user logs in
  useEffect(() => {
    if (userInfo) refetch();
  }, [userInfo, refetch]);

  const handleStatusChange = async (taskId, completed) => {
    try {
      await updateTask({ id: taskId, completed }).unwrap();
      toast.success("Task status updated!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task status. Please try again.");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId).unwrap();
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  if (isLoading) {
    return <SkeletonForm />;
  }
  if (isFetching) {
    return <SkeletonForm />;
  }

  return (
    <>
      {tasks && tasks.length > 0 ? (
        <main className="min-h-screen py-12 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-4xl font-semibold">My Tasks</h1>
              <AddTask />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </main>
      ) : (
        <p>No tasks found</p>
      )}
    </>
  );
}

export default Tasks;
