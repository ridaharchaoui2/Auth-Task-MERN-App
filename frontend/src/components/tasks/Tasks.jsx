import {
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from "@/services/taskApi";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { TaskCard } from "./TaskCard";

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
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId).unwrap();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (isFetching) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  return (
    <>
      {tasks && tasks.length > 0 ? (
        <main className="min-h-screen bg-slate-900 py-12 px-4">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-8 text-center text-4xl font-semibold text-white">
              My Tasks
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  title={task.title}
                  description={task.description}
                  completed={task.completed}
                  onStatusChange={(completed) =>
                    handleStatusChange(task._id, completed)
                  }
                  onDelete={() => handleDelete(task._id)}
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
