import { Trash2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

export function TaskCard({
  taskId,
  title,
  description,
  completed,
  onStatusChange,
  onDelete,
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = async () => {
    await onDelete(taskId);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card
      className={cn(
        "group relative flex flex-col transition-all duration-300 hover:shadow-lg border-l-4",
        completed
          ? "border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10"
          : "border-l-amber-400 bg-background",
      )}
    >
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <Circle className="h-5 w-5 text-amber-500" />
            )}
            <h3
              className={cn(
                "font-bold text-lg leading-none tracking-tight",
                completed && "text-muted-foreground line-through",
              )}
            >
              {title}
            </h3>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "font-medium px-2 py-0.5",
              completed
                ? "border-emerald-500/50 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-amber-500/50 text-amber-600 bg-amber-50 dark:bg-amber-900/20",
            )}
          >
            {completed ? "Done" : "To Do"}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <CardFooter className="px-5 py-4 bg-muted/30 border-t flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch
            checked={completed}
            onCheckedChange={onStatusChange}
            className="data-[state=checked]:bg-emerald-500"
          />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {completed ? "Completed" : "Active"}
          </span>
        </div>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this task?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove "{title}". This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
