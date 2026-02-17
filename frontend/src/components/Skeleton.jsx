import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonForm() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="relative mx-auto w-full max-w-[480px] space-y-8 animate-pulse">
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Icon Skeleton with Gradient */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl" />
            <Skeleton className="relative h-16 w-16 rounded-2xl bg-slate-200 dark:bg-[#1A1A1A]" />
          </div>

          {/* Title & Subtitle Skeletons */}
          <div className="space-y-2 w-full flex flex-col items-center">
            <Skeleton className="h-10 w-64 rounded-lg bg-slate-200 dark:bg-[#1A1A1A]" />
            <Skeleton className="h-5 w-80 rounded-lg bg-slate-100 dark:bg-[#141414]" />
          </div>
        </div>

        {/* Card Skeleton */}
        <Card className="relative overflow-hidden border-slate-200 dark:border-[#1F1F1F] bg-white dark:bg-[#141414] shadow-2xl">
          {/* Gradient Top Border */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50" />

          <CardHeader className="space-y-3 pt-8">
            <Skeleton className="h-7 w-40 rounded-lg bg-slate-200 dark:bg-[#1A1A1A]" />
            <Skeleton className="h-5 w-56 rounded-lg bg-slate-100 dark:bg-[#141414]" />
          </CardHeader>

          <CardContent className="space-y-6 pt-2 pb-8">
            {/* Input Field 1 */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded bg-slate-100 dark:bg-[#141414]" />
              <div className="relative">
                {/* Icon placeholder */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Skeleton className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-[#1A1A1A]" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#252525]" />
              </div>
            </div>

            {/* Input Field 2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24 rounded bg-slate-100 dark:bg-[#141414]" />
                <Skeleton className="h-3 w-20 rounded bg-slate-100 dark:bg-[#141414]" />
              </div>
              <div className="relative">
                {/* Icon placeholder */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Skeleton className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-[#1A1A1A]" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#252525]" />
              </div>
            </div>

            {/* Submit Button Skeleton with Gradient */}
            <div className="relative mt-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md" />
              <Skeleton className="relative h-12 w-full rounded-xl bg-gradient-to-r from-slate-300 to-slate-200 dark:from-[#1A1A1A] dark:to-[#141414]" />
            </div>

            {/* Bottom Link */}
            <div className="flex justify-center mt-6">
              <Skeleton className="h-4 w-48 rounded bg-slate-100 dark:bg-[#141414]" />
            </div>
          </CardContent>
        </Card>

        {/* Footer Info Box */}
        <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#252525]">
          <Skeleton className="h-4 w-4 rounded-full bg-slate-200 dark:bg-[#141414]" />
          <Skeleton className="h-3 w-32 rounded bg-slate-200 dark:bg-[#141414]" />
        </div>
      </div>
    </div>
  );
}
