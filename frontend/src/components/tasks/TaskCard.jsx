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

export function TaskCard({
  title,
  description,
  status,
  onStatusChange,
  onDelete,
}) {
  const isCompleted = status === "completed";

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Badge
            variant={isCompleted ? "default" : "secondary"}
            className={
              isCompleted
                ? "bg-emerald-500 text-white hover:bg-emerald-500"
                : "bg-gray-500 text-white hover:bg-gray-500"
            }
          >
            {isCompleted ? "Completed" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center gap-2">
          <Switch
            checked={isCompleted}
            onCheckedChange={onStatusChange}
            className="data-[state=checked]:bg-emerald-500"
          />
          <span className="text-sm text-muted-foreground">
            {isCompleted ? "Completed" : "Mark complete"}
          </span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
