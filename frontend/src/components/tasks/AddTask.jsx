import React, { useState } from "react";
import {
  Plus,
  Calendar as CalendarIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useAddTaskMutation } from "@/services/taskApi";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function AddTask() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState("Medium");

  const [addTask, { isLoading }] = useAddTaskMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addTask({
        title,
        description,
        dueDate: date.toISOString(),
        priority,
      }).unwrap();

      toast.success("Task created successfully!");

      setTitle("");
      setDescription("");
      setDate(new Date());
      setPriority("Medium");
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create task");
    }
  };

  const priorityConfig = {
    High: {
      gradient: "from-red-500 to-rose-500",
      icon: "🔥",
      hoverGlow: "hover:shadow-red-500/50",
    },
    Medium: {
      gradient: "from-amber-500 to-orange-500",
      icon: "⚡",
      hoverGlow: "hover:shadow-amber-500/50",
    },
    Low: {
      gradient: "from-blue-500 to-cyan-500",
      icon: "💧",
      hoverGlow: "hover:shadow-blue-500/50",
    },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="relative gap-2 px-6 py-6 rounded-xl font-bold overflow-hidden border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="relative z-10 h-4 w-4" />
          <span className="relative z-10">New Task</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F] text-slate-900 dark:text-gray-100 p-0 gap-0 overflow-hidden">
        {/* Header with Gradient Accent */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-200 dark:border-[#1F1F1F]">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-lg opacity-50" />
                <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-gray-100">
                  Create New Task
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-slate-600 dark:text-gray-400 font-medium">
              Add the details of your task and set a due date.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-gray-500">
              Task Title
            </label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all h-12 rounded-xl"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-gray-500">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe what needs to be done..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all min-h-[120px] rounded-xl resize-none"
            />
          </div>

          {/* Priority Selection */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-gray-500">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Low", "Medium", "High"].map((p) => {
                const config = priorityConfig[p];
                const isSelected = priority === p;

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    disabled={isLoading}
                    className={cn(
                      "relative px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden border",
                      isSelected
                        ? "text-white border-transparent shadow-lg scale-105"
                        : "text-slate-700 dark:text-gray-400 bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] hover:border-slate-300 dark:hover:border-[#2A2A2A] hover:bg-slate-100 dark:hover:bg-[#1F1F1F] hover:text-slate-900 dark:hover:text-gray-300",
                      isSelected && config.hoverGlow,
                    )}
                  >
                    {isSelected && (
                      <>
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-r",
                            config.gradient,
                          )}
                        />
                        <div className="absolute inset-0 bg-slate-950/10 dark:bg-[#0A0A0A]/20" />
                      </>
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      <span className="text-base">{config.icon}</span>
                      {p}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date Selection */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-gray-500">
              Due Date
            </label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className={cn(
                    "w-full justify-start text-left font-semibold h-12 rounded-xl",
                    "bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-900 dark:text-gray-100 hover:bg-slate-100 dark:hover:bg-[#1F1F1F] hover:border-slate-300 dark:hover:border-[#2A2A2A] hover:text-slate-950 dark:hover:text-white transition-all",
                    !date && "text-slate-500 dark:text-gray-500",
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F]"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="rounded-xl"
                />
              </PopoverContent>
            </Popover>

            {/* Quick Date Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDate(new Date())}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#252525] text-slate-700 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-[#1F1F1F] hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDate(addDays(new Date(), 1))}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#252525] text-slate-700 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-[#1F1F1F] hover:border-purple-500/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
              >
                Tomorrow
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="gap-3 mt-8">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#252525] text-slate-700 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-[#1F1F1F] hover:border-slate-300 dark:hover:border-[#2A2A2A] hover:text-slate-900 dark:hover:text-gray-200 font-bold transition-all"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="relative flex-1 h-12 rounded-xl font-bold overflow-hidden border-0 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isLoading ? (
                <span className="relative z-10 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                <span className="relative z-10">Create Task</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
