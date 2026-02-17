import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Home, ArrowLeft, MapPinOff, Sparkles } from "lucide-react";

function NotFound() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#0A0A0A]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-400/20 dark:bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-12">
        {/* Large 404 Visual */}
        <div className="relative mb-12">
          {/* Background 404 Text */}
          <h1 className="text-[10rem] sm:text-[15rem] md:text-[18rem] font-black leading-none tracking-tighter text-slate-200/30 dark:text-gray-800/30 select-none">
            404
          </h1>

          {/* Centered Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" />

              {/* Icon container */}
              <div className="relative rounded-2xl bg-white dark:bg-[#141414] p-8 shadow-2xl border-2 border-slate-200 dark:border-[#1F1F1F]">
                <MapPinOff className="h-16 w-16 sm:h-20 sm:w-20 text-red-500 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-2xl space-y-6 mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-orange-500 dark:text-orange-400 animate-pulse" />
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Lost in the Cloud?
            </h2>
            <Sparkles className="h-6 w-6 text-red-500 dark:text-red-400 animate-pulse delay-500" />
          </div>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-400 leading-relaxed font-medium max-w-lg mx-auto">
            We couldn't find the page you're looking for. It might have been
            moved, deleted, or perhaps it never existed at all.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 max-w-md mx-auto">
            <div className="p-4 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#1F1F1F] shadow-lg">
              <div className="text-3xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                404
              </div>
              <div className="text-xs font-bold text-slate-600 dark:text-gray-400 mt-1">
                Error Code
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#1F1F1F] shadow-lg">
              <div className="text-3xl font-black text-slate-900 dark:text-gray-100">
                0
              </div>
              <div className="text-xs font-bold text-slate-600 dark:text-gray-400 mt-1">
                Pages Found
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#1F1F1F] shadow-lg col-span-2 sm:col-span-1">
              <div className="text-3xl font-black text-slate-900 dark:text-gray-100">
                ∞
              </div>
              <div className="text-xs font-bold text-slate-600 dark:text-gray-400 mt-1">
                Solutions
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Primary Button */}
          <Button
            asChild
            className="relative h-12 px-8 rounded-xl font-bold text-base overflow-hidden border-0 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all group"
          >
            <Link to={userInfo ? "/tasks" : "/"}>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </span>
            </Link>
          </Button>

          {/* Secondary Button */}
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="h-12 px-8 rounded-xl font-bold text-base bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] hover:border-slate-300 dark:hover:border-[#2A2A2A] hover:text-slate-900 dark:hover:text-white transition-all shadow-lg"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </span>
          </Button>
        </div>

        {/* Helper Text */}
        <div className="mt-12 flex items-start gap-2 p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 max-w-md">
          <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-orange-700 dark:text-orange-400 font-medium leading-relaxed text-left">
            If you believe this is an error, please contact support or try
            refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
