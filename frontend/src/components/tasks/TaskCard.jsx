import {
  Trash2,
  CheckCircle2,
  Circle,
  CalendarDays,
  AlertCircle,
  Flame,
  Zap,
  Droplet,
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

export function TaskCard({
  taskId,
  title,
  description,
  completed,
  dueDate,
  priority,
  onStatusChange,
  onDelete,
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
      iconColor: "text-red-600 dark:text-red-400",
    },
    Medium: {
      gradient: "from-amber-500 to-orange-500",
      glowColor: "shadow-amber-500/30",
      icon: Zap,
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    Low: {
      gradient: "from-blue-500 to-cyan-500",
      glowColor: "shadow-blue-500/30",
      icon: Droplet,
      iconColor: "text-blue-600 dark:text-blue-400",
    },
  };

  const config = priorityConfig[priority];
  const PriorityIcon = config?.icon;

  const handleConfirmDelete = async () => {
    await onDelete(taskId);
    setIsDeleteDialogOpen(false);
  };

  const handleSwitchChange = (checked) => {
    onStatusChange(checked);
  };

  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden transition-all duration-500 bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F]",
        "hover:-translate-y-2 hover:shadow-2xl",
        completed ? "opacity-50 hover:opacity-70" : config?.glowColor,
      )}
    >
      {/* Animated Top Border with Gradient */}
      {!completed && (
        <div className="absolute top-0 inset-x-0 h-[2px] overflow-hidden">
          <div
            className={cn(
              "h-full bg-gradient-to-r",
              config?.gradient,
              "animate-pulse",
            )}
          />
        </div>
      )}

      {/* Completed Top Border */}
      {completed && (
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500" />
      )}

      {/* Subtle Glow Effect on Hover */}
      {!completed && (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none bg-gradient-to-br opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500",
            config?.gradient,
          )}
        />
      )}

      <div className="p-6 flex-1 space-y-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative">
            {!completed && (
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-r blur-md opacity-60",
                  config?.gradient,
                )}
              />
            )}
            <Badge
              className={cn(
                "relative flex items-center gap-2 px-3 py-1.5 text-xs font-black uppercase tracking-wider border-0 shadow-lg",
                completed
                  ? "bg-slate-200 dark:bg-[#1A1A1A] text-slate-600 dark:text-gray-500"
                  : cn("bg-gradient-to-r text-white", config?.gradient),
              )}
            >
              {PriorityIcon && <PriorityIcon className="h-3.5 w-3.5" />}
              {priority}
            </Badge>
          </div>

          <div
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
              completed
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                : "bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-gray-500 border-slate-200 dark:border-[#252525]",
            )}
          >
            {completed ? "✓ DONE" : "ACTIVE"}
          </div>
        </div>

        {/* Title Section */}
        <div className="flex items-start gap-3.5">
          <div className="mt-1 transition-all duration-300 group-hover:scale-110">
            {completed ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            ) : isTaskOverdue ? (
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 blur-md opacity-50 animate-pulse" />
                <AlertCircle className="relative h-6 w-6 text-red-500" />
              </div>
            ) : (
              <Circle
                className={cn(
                  "h-6 w-6",
                  isTaskToday
                    ? "text-purple-500"
                    : "text-slate-300 dark:text-gray-700",
                )}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-bold text-xl leading-tight transition-all duration-300",
                completed
                  ? "text-slate-500 dark:text-gray-500 line-through decoration-2 decoration-emerald-500/50"
                  : "text-slate-900 dark:text-gray-100 group-hover:text-slate-950 dark:group-hover:text-white",
              )}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p
          className={cn(
            "text-sm leading-relaxed line-clamp-2 pl-9",
            completed
              ? "text-slate-400 dark:text-gray-600"
              : "text-slate-600 dark:text-gray-400",
          )}
        >
          {description}
        </p>

        {/* Date Badge */}
        {dateObj && (
          <div className="pl-9">
            <div className="relative inline-block">
              {(isTaskOverdue || isTaskToday) && (
                <div
                  className={cn(
                    "absolute  blur-lg opacity-50",
                    isTaskOverdue ? "bg-red-500" : "bg-blue-500",
                  )}
                />
              )}
              <div
                className={cn(
                  "relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all",
                  isTaskOverdue
                    ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30"
                    : isTaskToday
                      ? "bg-blue-50 dark:bg-blue-500/10 text-purple-700 dark:text-purple-400 border-blue-200 dark:border-purple-500/30"
                      : "bg-slate-100 dark:bg-[#1A1A1A] text-slate-700 dark:text-gray-400 border-slate-200 dark:border-[#252525]",
                )}
              >
                <CalendarDays className="h-4 w-4" />
                <span className="tracking-wide">
                  {isToday(dateObj)
                    ? "Today"
                    : isTomorrow(dateObj)
                      ? "Tomorrow"
                      : format(dateObj, "MMM do, yyyy")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-[#0F0F0F] border-t border-slate-200 dark:border-[#1F1F1F] flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer group/switch">
          <Switch
            checked={completed}
            onCheckedChange={handleSwitchChange}
            className="data-[state=checked]:bg-linear-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
          />
          <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-600 dark:text-gray-600 group-hover/switch:text-slate-900 dark:group-hover/switch:text-gray-400 transition-colors">
            Mark Done
          </span>
        </label>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-slate-400 dark:text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 hover:scale-110"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                Delete this task?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-slate-600 dark:text-gray-400">
                This will permanently remove{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  "{title}"
                </span>
                . This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-100 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#252525] text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#1F1F1F] hover:text-slate-900 dark:hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-lg shadow-red-500/25"
              >
                Delete Task
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
