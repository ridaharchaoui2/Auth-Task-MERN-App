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
import { useAddTaskMutation } from "@/services/taskApi";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function AddTask() {
  const [addTask, { isLoading, isError, isSuccess }] = useAddTaskMutation();
  const formRef = useRef(null);
  const dialogCloseRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const description = formData.get("description");
    try {
      await addTask({ title, description }).unwrap();
      toast.success("Task added successfully!");
      formRef.current?.reset();
      dialogCloseRef.current?.click();
    } catch (error) {
      toast.error("Failed to add task. Please try again.");
      console.error("Error adding task:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className={"font-bold text-lg"}>
          <Plus strokeWidth={"4px"} /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} ref={formRef}>
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              Add a Task
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid gap-4">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Task Title" />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Task Description"
              />
            </div>
            {isError && (
              <p className="text-red-500 text-sm">Error adding task</p>
            )}
            {isSuccess && (
              <p className="text-green-500 text-sm">Task added successfully!</p>
            )}
          </div>
          <DialogFooter className={"mt-8"}>
            <DialogClose asChild className="mr-1">
              <Button ref={dialogCloseRef} variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
