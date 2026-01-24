import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
      className="flex flex-col   bg-gray-100 dark:bg-black           // Inverted background
                                 border-gray-700 dark:border-gray-400   // Inverted border
      p-4 rounded-lg shadow-md "
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-2xl ">{title}</h3>
          <Badge
            variant={completed ? "default" : "secondary"}
            className={
              completed
                ? "bg-emerald-500 text-black "
                : "bg-amber-300 dark:text-black"
            }
          >
            {completed ? "Completed" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <p className="text-sm ">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center gap-2">
          <Switch
            checked={completed}
            onCheckedChange={onStatusChange}
            className="data-[state=unchecked]:bg-gray-400 dark:data-[state=unchecked]:bg-gray-800 "
          />
          <span className="text-sm text-muted-foreground">
            {completed ? "Completed" : "Mark complete"}
          </span>
        </div>
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button variant="" size="sm" className="gap-1.5 ">
              <Trash2 className="h-3.5 w-3.5 " />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="size-5 text-destructive" />
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                This will permanently delete the task. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive  hover:bg-destructive/90"
              >
                Delete Task
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
