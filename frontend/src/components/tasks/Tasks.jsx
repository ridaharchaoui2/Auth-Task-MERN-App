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
  const { data: tasks, isLoading, isFetching, refetch } = useGetAllTasksQuery();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Refetch when user logs in
  useEffect(() => {
    if (userInfo) refetch();
  }, [userInfo]);

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
  // if (isFetching) {
  //   return <SkeletonForm />;
  // }

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
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <h2 className="mb-4 text-3xl font-semibold">No Tasks Found</h2>
          <p className="mb-8 text-center text-muted-foreground">
            You have no tasks at the moment. Click the button below to add your
            first task.
          </p>
          <AddTask />
        </main>
      )}
    </>
  );
}

export default Tasks;
