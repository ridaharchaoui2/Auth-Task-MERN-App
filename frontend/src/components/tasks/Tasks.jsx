import { useGetAllTasksQuery } from "@/services/taskApi";
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

  // Refetch when user logs in
  useEffect(() => {
    if (userInfo) refetch();
  }, [userInfo, refetch]);

  if (isLoading) return <div>Loading tasks...</div>;
  if (isFetching) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  return (
    <>
      {tasks && tasks.length > 0 ? (
        <main className="min-h-screen bg-slate-100 py-12 px-4">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-8 text-center text-4xl font-semibold text-foreground">
              My Tasks
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  status={task.completed}
                  onStatusChange={(completed) =>
                    handleStatusChange(task.id, completed)
                  }
                  onEdit={() => handleEdit(task.id)}
                  onDelete={() => handleDelete(task.id)}
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
