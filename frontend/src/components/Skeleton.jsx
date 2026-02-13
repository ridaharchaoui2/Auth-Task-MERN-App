import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonForm() {
  return (
    <div className="mx-auto flex w-full max-w-[450px] flex-col items-center justify-center space-y-6 px-4 animate-pulse">
      {/* Ghost Header Section */}
      <div className="flex flex-col items-center space-y-4 text-center">
        {/* The Icon Circle */}
        <Skeleton className="h-12 w-12 rounded-xl bg-muted/60" />
        {/* The Main Title */}
        <Skeleton className="h-8 w-48 bg-muted/60" />
        {/* The Subtitle */}
        <Skeleton className="h-4 w-64 bg-muted/40" />
      </div>

      {/* Ghost Card Section */}
      <Card className="w-full border-none shadow-2xl bg-background/60 backdrop-blur-xl">
        <CardHeader className="space-y-3">
          <Skeleton className="h-6 w-32 bg-muted/60" />
          <Skeleton className="h-4 w-48 bg-muted/40" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Input Field 1 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-muted/40" />
            <Skeleton className="h-11 w-full rounded-md bg-muted/20" />
          </div>

          {/* Input Field 2 */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24 bg-muted/40" />
              <Skeleton className="h-3 w-16 bg-muted/20" />
            </div>
            <Skeleton className="h-11 w-full rounded-md bg-muted/20" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-11 w-full rounded-md bg-primary/20" />

          {/* Bottom Link */}
          <div className="flex justify-center">
            <Skeleton className="h-4 w-40 bg-muted/20" />
          </div>
        </CardContent>
      </Card>

      {/* Footer Text */}
      <div className="flex justify-center space-x-2">
        <Skeleton className="h-3 w-20 bg-muted/10" />
        <Skeleton className="h-3 w-20 bg-muted/10" />
      </div>
    </div>
  );
}
