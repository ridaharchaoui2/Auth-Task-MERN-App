import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ClipboardList, Zap, LayoutGrid, List } from "lucide-react";
import {
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from "@/services/taskApi";
import { TaskCard } from "./TaskCard";
import { ListTask } from "./ListTask"; // New Component
import { SkeletonForm } from "../Skeleton";
import { AddTask } from "./AddTask.jsx";
import { toast } from "sonner";
import { isToday, isTomorrow, isFuture, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Tasks() {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: tasks, isLoading, refetch } = useGetAllTasksQuery();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [activeTab, setActiveTab] = useState("today");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // New: grid or list

  const handleStatusChange = async (taskId, completed) => {
    try {
      await updateTask({ id: taskId, completed }).unwrap();
      toast.success(completed ? "Task completed!" : "Task marked as active");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId).unwrap();
      toast.warning("Task deleted");
    } catch (error) {
      toast.error("Could not delete.");
    }
  };

  const getFilteredAndSortedTasks = () => {
    if (!tasks) return [];
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };

    return [...tasks]
      .filter((task) => {
        const taskDate = task.dueDate ? new Date(task.dueDate) : null;
        let matchesDate = true;
        switch (activeTab) {
          case "today":
            matchesDate = taskDate && isToday(taskDate);
            break;
          case "tomorrow":
            matchesDate = taskDate && isTomorrow(taskDate);
            break;
          case "upcoming":
            matchesDate =
              taskDate &&
              isFuture(taskDate) &&
              !isToday(taskDate) &&
              !isTomorrow(taskDate);
            break;
          case "overdue":
            matchesDate =
              taskDate &&
              isPast(taskDate) &&
              !isToday(taskDate) &&
              !task.completed;
            break;
          case "all":
            matchesDate = true;
            break;
        }

        let matchesPriority = true;
        if (priorityFilter !== "All") {
          matchesPriority = task.priority === priorityFilter;
        }

        return matchesDate && matchesPriority;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
  };

  const filteredTasks = getFilteredAndSortedTasks();

  if (isLoading)
    return (
      <div className="p-8 bg-slate-50 dark:bg-[#0A0A0A] min-h-screen">
        <SkeletonForm />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <main className="relative mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8 sm:py-16">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                    Workspace
                  </h1>
                  <p className="text-slate-600 dark:text-gray-500 text-sm font-semibold mt-1.5 tracking-wide">
                    {filteredTasks.length}{" "}
                    {filteredTasks.length === 1 ? "task" : "tasks"} •{" "}
                    {activeTab}
                  </p>
                </div>
              </div>
            </div>
            <AddTask />
          </div>

          <div className="space-y-8">
            {/* Timeline Filters */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-gray-600">
                Timeline
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    key: "today",
                    label: "Today",
                    color: "from-blue-500 to-cyan-400",
                  },
                  {
                    key: "tomorrow",
                    label: "Tomorrow",
                    color: "from-purple-500 to-pink-400",
                  },
                  {
                    key: "upcoming",
                    label: "Upcoming",
                    color: "from-emerald-500 to-teal-400",
                  },
                  {
                    key: "overdue",
                    label: "Overdue",
                    color: "from-red-500 to-orange-400",
                  },
                  {
                    key: "all",
                    label: "All",
                    color: "from-gray-500 to-gray-400",
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden border",
                      activeTab === tab.key
                        ? "text-white border-transparent shadow-lg shadow-blue-500/20 scale-105"
                        : "text-slate-700 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F] hover:border-slate-300 dark:hover:border-[#2A2A2A]",
                    )}
                  >
                    {activeTab === tab.key && (
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-r opacity-100",
                          tab.color,
                        )}
                      />
                    )}
                    <span className="relative z-10 tracking-wide">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Row: Priority and View Toggle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              {/* Priority Filters */}
              <div className="space-y-3 flex-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-gray-600">
                  Priority Level
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      key: "All",
                      label: "All Tasks",
                      color: "from-gray-600 to-gray-500",
                      emoji: "⚡",
                    },
                    {
                      key: "High",
                      label: "High",
                      color: "from-red-500 to-rose-500",
                      emoji: "🔥",
                    },
                    {
                      key: "Medium",
                      label: "Medium",
                      color: "from-amber-500 to-yellow-500",
                      emoji: "⚠️",
                    },
                    {
                      key: "Low",
                      label: "Low",
                      color: "from-blue-500 to-cyan-500",
                      emoji: "💧",
                    },
                  ].map((priority) => (
                    <button
                      key={priority.key}
                      onClick={() => setPriorityFilter(priority.key)}
                      className={cn(
                        "relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden border flex items-center gap-2",
                        priorityFilter === priority.key
                          ? "text-white border-transparent shadow-lg scale-105"
                          : "text-slate-700 dark:text-gray-400 bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F]",
                      )}
                    >
                      {priorityFilter === priority.key && (
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-r",
                            priority.color,
                          )}
                        />
                      )}
                      <span className="relative z-10 text-base">
                        {priority.emoji}
                      </span>
                      <span className="relative z-10 tracking-wide">
                        {priority.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-gray-600 block md:text-right">
                  View Mode
                </span>
                <div className="flex bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#1F1F1F] p-1 rounded-xl shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2.5 rounded-lg transition-all flex items-center gap-2 text-sm font-bold",
                      viewMode === "grid"
                        ? "bg-slate-100 dark:bg-[#1F1F1F] text-blue-500 shadow-inner"
                        : "text-slate-400 hover:text-slate-600",
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2.5 rounded-lg transition-all flex items-center gap-2 text-sm font-bold",
                      viewMode === "list"
                        ? "bg-slate-100 dark:bg-[#1F1F1F] text-blue-500 shadow-inner"
                        : "text-slate-400 hover:text-slate-600",
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tasks Display */}
        {filteredTasks.length > 0 ? (
          <div
            className={cn(
              "gap-5",
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col",
            )}
          >
            {filteredTasks.map((task, index) => (
              <div
                key={task._id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${index * 40}ms`,
                  animationFillMode: "backwards",
                  animationDuration: "600ms",
                }}
              >
                {viewMode === "grid" ? (
                  <TaskCard
                    {...task}
                    onStatusChange={(c) => handleStatusChange(task._id, c)}
                    onDelete={handleDelete}
                    taskId={task._id}
                  />
                ) : (
                  <ListTask
                    key={task._id}
                    {...task}
                    isFirst={index === 0} // <--- This ensures the header only shows once at the top
                    onStatusChange={(c) => handleStatusChange(task._id, c)}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-32 flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-32 w-32 rounded-3xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#1F1F1F] flex items-center justify-center shadow-2xl">
                <ClipboardList className="h-16 w-16 text-slate-300 dark:text-gray-700" />
              </div>
            </div>
            <h3 className="mt-8 text-2xl font-bold text-slate-900 dark:text-gray-200">
              No tasks found
            </h3>
            <Button
              onClick={() => {
                setActiveTab("all");
                setPriorityFilter("All");
              }}
              className="mt-6 relative px-8 py-6 rounded-xl text-sm font-bold overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
              <span className="relative z-10 text-white tracking-wide">
                Clear all filters
              </span>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Tasks;
