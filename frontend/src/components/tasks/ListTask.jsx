import {
  Trash2,
  CheckCircle2,
  Circle,
  CalendarDays,
  AlertCircle,
  Flame,
  Zap,
  Droplet,
  Layers,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format, isPast, isToday, isTomorrow } from "date-fns";

export function ListTask({
  _id,
  title,
  description,
  completed,
  dueDate,
  priority,
  onStatusChange,
  onDelete,
  isFirst,
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const dateObj = dueDate ? new Date(dueDate) : null;
  const isTaskOverdue =
    dateObj && isPast(dateObj) && !isToday(dateObj) && !completed;
  const isTaskToday = dateObj && isToday(dateObj) && !completed;

  const priorityConfig = {
    High: {
      gradient: "from-red-500 to-rose-500",
      glowColor: "shadow-red-500/30",
      icon: Flame,
    },
    Medium: {
      gradient: "from-amber-500 to-orange-500",
      glowColor: "shadow-amber-500/30",
      icon: Zap,
    },
    Low: {
      gradient: "from-blue-500 to-cyan-500",
      glowColor: "shadow-blue-500/30",
      icon: Droplet,
    },
  };

  const config = priorityConfig[priority];
  const PriorityIcon = config?.icon;

  const handleConfirmDelete = async () => {
    await onDelete(_id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* HEADER: Hidden on Mobile, Visible on Desktop (md+) */}
      {isFirst && (
        <div className="hidden md:flex items-center gap-6 px-7 py-2 mb-2 opacity-60">
          <div className="flex items-center gap-2 w-20">
            <Layers className="h-3 w-3 text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Status
            </span>
          </div>
          <div className="flex-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-4">
            Task Description
          </div>
          <div className="flex items-center justify-center gap-4 w-64 pr-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-[110px] text-center">
              Priority
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 w-[110px] text-center">
              Due Date
            </span>
          </div>
          <div className="w-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Action
          </div>
        </div>
      )}

      <Card
        className={cn(
          "group relative flex items-center overflow-hidden transition-all duration-500 bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F]",
          "hover:shadow-xl hover:border-slate-300 dark:hover:border-[#2A2A2A]",
          completed ? "opacity-60" : config?.glowColor,
        )}
      >
        {/* Decorative Side Gradient */}
        {!completed && (
          <div
            className={cn(
              "absolute left-0 inset-y-0 w-[3px] sm:w-[4px] bg-gradient-to-b animate-pulse",
              config?.gradient,
            )}
          />
        )}
        {completed && (
          <div className="absolute left-0 inset-y-0 w-[3px] sm:w-[4px] bg-emerald-500" />
        )}

        {/* Hover Glow */}
        {!completed && (
          <div
            className={cn(
              "absolute inset-0 pointer-events-none bg-gradient-to-r opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500",
              config?.gradient,
            )}
          />
        )}

        {/* CONTENT CONTAINER */}
        <div className="flex items-center w-full p-3 sm:p-5 sm:pl-7 gap-3 sm:gap-6">
          {/* 1. SWITCH */}
          {/* 1. STATUS CHECK CIRCLE */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <button
              onClick={() => onStatusChange(!completed)}
              className={cn(
                "group/check relative flex items-center justify-center transition-all duration-300 ease-out",
                "h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2",
                completed
                  ? "bg-emerald-500 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  : "bg-transparent border-slate-300 dark:border-[#2A2A2A] hover:border-emerald-400 dark:hover:border-emerald-500/50",
              )}
            >
              {/* Inner Glow/Pulse for Active State */}
              {completed && (
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
              )}

              {/* The Checkmark Icon */}
              <Check
                className={cn(
                  "h-3.5 w-3.5 sm:h-4 sm:w-4 text-white transition-all duration-500",
                  completed
                    ? "scale-100 opacity-100 translate-y-0"
                    : "scale-50 opacity-0 translate-y-1 group-hover/check:opacity-30 group-hover/check:scale-75",
                )}
                strokeWidth={3}
              />
            </button>

            {/* Vertical Divider (Visible on Desktop) */}
            <div className="hidden md:block w-[1px] h-8 bg-slate-200 dark:bg-[#252525]" />
          </div>

          {/* 2. TITLE & INFO */}
          <div className="flex-1 min-w-0 grid gap-1">
            <div className="flex items-center gap-2">
              <div className="shrink-0">
                {completed ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                ) : isTaskOverdue ? (
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 animate-pulse" />
                ) : (
                  <Circle
                    className={cn(
                      "h-4 w-4 sm:h-5 sm:w-5",
                      // UPDATED: Purple icon for Today
                      isTaskToday
                        ? "text-purple-500"
                        : "text-slate-300 dark:text-gray-600",
                    )}
                  />
                )}
              </div>

              <h3
                className={cn(
                  "font-bold text-sm sm:text-lg leading-tight truncate",
                  completed
                    ? "text-slate-500 line-through decoration-emerald-500/50"
                    : "text-slate-900 dark:text-gray-100",
                )}
              >
                {title}
              </h3>
            </div>

            <p className="hidden md:block text-sm font-medium pl-8 line-clamp-2 leading-relaxed text-slate-600 dark:text-gray-400">
              {description || "No description provided"}
            </p>

            {/* Mobile Only: Badges Row */}
            <div className="flex md:hidden items-center gap-2 mt-0.5 ml-6">
              <Badge
                variant="outline"
                className={cn(
                  "px-1.5 py-0 text-[10px] h-5 border-0 font-bold uppercase",
                  completed
                    ? "bg-slate-100 text-slate-500"
                    : cn(
                        "bg-opacity-10 text-opacity-100",
                        priority === "High"
                          ? "bg-red-500/10 text-red-600"
                          : priority === "Medium"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-blue-500/10 text-blue-600",
                      ),
                )}
              >
                {priority}
              </Badge>

              {dateObj && (
                <span
                  className={cn(
                    "text-[10px] font-bold truncate",
                    // UPDATED: Purple text for Today on mobile
                    isTaskOverdue
                      ? "text-red-500"
                      : isTaskToday
                        ? "text-purple-500"
                        : "text-slate-400",
                  )}
                >
                  {format(dateObj, "MMM dd")}
                </span>
              )}
            </div>
          </div>

          {/* 3. METADATA (Desktop Only) */}
          <div className="hidden md:flex items-center justify-center gap-4 w-64 shrink-0">
            <Badge
              className={cn(
                "flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest border-0 shadow-sm min-w-[110px] justify-center",
                completed
                  ? "bg-slate-200 text-slate-600"
                  : cn("bg-gradient-to-r text-white", config?.gradient),
              )}
            >
              {PriorityIcon && <PriorityIcon className="h-3.5 w-3.5" />}
              {priority}
            </Badge>

            {/* UPDATED: Date Badge Logic */}
            {dateObj && (
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border shadow-sm min-w-[110px] justify-center transition-colors",
                  isTaskOverdue
                    ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30"
                    : isTaskToday
                      ? "bg-blue-50 dark:bg-blue-500/10 text-purple-700 dark:text-purple-400 border-blue-200 dark:border-purple-500/30" // Purple Style
                      : "bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-gray-400 border-slate-200 dark:border-[#252525]",
                )}
              >
                <CalendarDays className="h-4 w-4" />
                <span>
                  {isToday(dateObj)
                    ? "Today"
                    : isTomorrow(dateObj)
                      ? "Tomorrow"
                      : format(dateObj, "MMM do")}
                </span>
              </div>
            )}
          </div>

          {/* 4. DELETE ACTION */}
          <div className="pl-0 sm:pl-2 sm:border-l border-slate-200 dark:border-[#2A2A2A]">
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove "{title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmDelete}
                    className="bg-red-600 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </div>
  );
}
