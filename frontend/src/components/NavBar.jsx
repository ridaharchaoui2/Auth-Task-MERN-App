import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/services/authApi";
import { removeCredentials } from "@/services/authSlice";
import {
  CircleUser,
  LogOut,
  User,
  LayoutDashboard,
  LogIn,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import SwitchTheme from "./SwitchTheme";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { SkeletonForm } from "./Skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function NavBar() {
  const { userInfo } = useSelector((state) => state.auth);
  const [logout, { isError, isSuccess, isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
      dispatch(removeCredentials());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isSuccess) toast.success("Logout successful!");
    if (isError) toast.error("Logout failed.");
  }, [isSuccess, isError]);

  if (isLoading) return <SkeletonForm />;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-[#1F1F1F] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl">
      {/* Gradient accent line */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

      <nav className="container relative mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        {/* LEFT: Branding with Icon */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-md opacity-50" />
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>

          <Link
            to="/"
            className="text-2xl sm:text-3xl font-black tracking-tighter bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            TM<span className="hidden xs:inline"> Manager</span>
          </Link>
        </div>

        {/* CENTER: Home Link */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link
            to="/Home"
            className="relative group px-4 py-2 rounded-xl text-xl sm:text-2xl font-bold text-slate-700 dark:text-gray-300 transition-all duration-300 hover:text-slate-900 dark:hover:text-white"
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
          </Link>
        </div>

        {/* RIGHT: Theme Switch & User Dropdown */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Switcher with Background */}
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#252525]">
            <SwitchTheme />
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full p-0 hover:bg-transparent group"
              >
                {/* Gradient ring on hover */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />

                <Avatar className="relative h-12 w-12 sm:h-14 sm:w-14 border-2 border-slate-200 dark:border-[#252525] group-hover:border-transparent transition-all duration-300 shadow-lg">
                  {userInfo?.avatar?.url ? (
                    <img
                      src={userInfo.avatar.url}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <CircleUser className="h-7 w-7 sm:h-8 sm:w-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-72 mt-2 bg-white dark:bg-[#141414] border-slate-200 dark:border-[#1F1F1F] shadow-2xl rounded-xl overflow-hidden"
              align="end"
              forceMount
            >
              {/* Gradient top accent */}
              <div className="h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

              {userInfo ? (
                <>
                  <DropdownMenuLabel className="font-normal p-0">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#1A1A1A]">
                      {/* Mini avatar */}
                      <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-[#252525]">
                        {userInfo?.avatar?.url ? (
                          <img
                            src={userInfo.avatar.url}
                            alt="avatar"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                            {userInfo.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold leading-tight text-slate-900 dark:text-gray-100 truncate">
                          {userInfo.name}
                        </p>
                        <p className="text-sm leading-tight text-slate-600 dark:text-gray-400 truncate mt-1">
                          {userInfo.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#1F1F1F]" />

                  <div className="p-2">
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer py-3 px-3 rounded-lg text-base font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] focus:bg-slate-100 dark:focus:bg-[#1A1A1A] transition-colors"
                    >
                      <Link
                        to={`/profile/${userInfo._id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer py-3 px-3 rounded-lg text-base font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] focus:bg-slate-100 dark:focus:bg-[#1A1A1A] transition-colors"
                    >
                      <Link to="/Home" className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                          <LayoutDashboard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#1F1F1F]" />

                  <div className="p-2">
                    <DropdownMenuItem
                      onClick={logoutHandler}
                      className="cursor-pointer py-3 px-3 rounded-lg text-base font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 focus:bg-red-50 dark:focus:bg-red-500/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10">
                          <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        Logout
                      </div>
                    </DropdownMenuItem>
                  </div>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="p-4 text-lg font-black text-slate-900 dark:text-gray-100">
                    Account
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-[#1F1F1F]" />

                  <div className="p-2">
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer py-3 px-3 rounded-lg text-base font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] focus:bg-slate-100 dark:focus:bg-[#1A1A1A] transition-colors"
                    >
                      <Link to="/signin" className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10">
                          <LogIn className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        Sign In
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer py-3 px-3 rounded-lg text-base font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] focus:bg-slate-100 dark:focus:bg-[#1A1A1A] transition-colors"
                    >
                      <Link to="/signup" className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10">
                          <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        Create Account
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
