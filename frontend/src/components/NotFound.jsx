import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Home, ArrowLeft, MapPinOff } from "lucide-react";

function NotFound() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Large 404 Visual */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] font-black leading-none tracking-tighter text-muted/20 select-none sm:text-[15rem]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-background p-5 shadow-2xl border border-muted/20">
              <MapPinOff className="h-12 w-12 text-primary animate-bounce" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Lost in the Cloud?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We couldn't find the page you're looking for. It might have been
            moved, deleted, or perhaps it never existed at all.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 font-semibold shadow-lg transition-all hover:translate-y-[-2px]"
          >
            <Link
              to={userInfo ? "/tasks" : "/"}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="h-12 px-8 font-semibold backdrop-blur-sm transition-all hover:bg-muted/50"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
