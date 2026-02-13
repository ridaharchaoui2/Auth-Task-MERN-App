import { useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Ensure you have this shadcn component
import { useAddTaskMutation } from "@/services/taskApi";
import { Button } from "../ui/button";
import { Plus, ClipboardPenLine, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AddTask() {
  const [addTask, { isLoading, isError }] = useAddTaskMutation();
  const dialogCloseRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = titleRef.current.value.trim();
    const description = descriptionRef.current.value.trim();

    if (!title) {
      return toast.error("Please provide a task title.");
    }

    try {
      await addTask({
        title,
        description,
      }).unwrap();

      toast.success("Task created successfully!");
      dialogCloseRef.current?.click();
    } catch (error) {
      toast.error("Failed to add task. Please try again.");
      console.error("Error adding task:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="group shadow-md hover:shadow-lg transition-all duration-300 gap-2"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span>New Task</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ClipboardPenLine className="h-6 w-6" />
            </div>
            <div className="space-y-1 text-center">
              <DialogTitle className="text-2xl font-bold">
                Create New Task
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to organize your workflow.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-lg font-semibold">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                ref={titleRef}
                placeholder="What needs to be done?"
                className="focus-visible:ring-primary"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-lg font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add some details about this task..."
                ref={descriptionRef}
                className="min-h-[100px] resize-none focus-visible:ring-primary"
              />
            </div>

            {isError && (
              <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                Something went wrong. Please check your connection and try
                again.
              </div>
            )}
          </div>

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-0">
            <DialogClose asChild>
              <Button
                ref={dialogCloseRef}
                variant="ghost"
                type="button"
                className="sm:mr-2"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
