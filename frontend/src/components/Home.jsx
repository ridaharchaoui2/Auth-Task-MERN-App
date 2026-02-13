import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { Sparkles, CheckCircle, Shield, Zap } from "lucide-react";

function Home() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Handle redirect in useEffect to avoid rendering logic issues
  useEffect(() => {
    if (userInfo) {
      navigate("/tasks"); // Or wherever your main dashboard is
    }
  }, [userInfo, navigate]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <main className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 py-20 text-center lg:py-32">
        {/* Badge */}
        <div className="mb-6 flex animate-fade-in items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>The smarter way to manage work</span>
        </div>

        {/* Hero Title */}
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Organize your life, <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            one task at a time.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          A powerful yet simple task management tool designed to help you focus
          on what matters most. Stay organized, meet deadlines, and achieve your
          goals.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-md font-semibold shadow-lg"
          >
            <Link to="/signup">Get Started for Free</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-md font-semibold backdrop-blur-sm"
          >
            <Link to="/signin">Sign In to Dashboard</Link>
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:mt-32">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Real-time updates and cloud sync.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold">Total Control</h3>
            <p className="text-sm text-muted-foreground">
              Easily track and manage status.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-bold">Secure Data</h3>
            <p className="text-sm text-muted-foreground">
              Your tasks are private and encrypted.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
