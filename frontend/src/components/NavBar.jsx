import React from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/services/authApi";
import { removeCredentials } from "@/services/authSlice";
import { CircleUser, LogOut } from "lucide-react";
import { toast } from "sonner";
import SwitchTheme from "./SwitchTheme";
import { Avatar } from "./ui/avatar";
import { SkeletonForm } from "./Skeleton";

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
    if (isSuccess) {
      toast.success("Logout successful!");
    }
    if (isError) {
      toast.error("Logout failed. Please try again.");
    }
  }, [isSuccess, isError]);
  if (isLoading) {
    return <SkeletonForm />;
  }
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur ">
        <nav className="container mx-auto flex h-14 items-center justify-between gap-2 px-2 sm:gap-4 sm:px-4">
          {/* Left side */}
          {userInfo ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <CircleUser className="h-8 w-8 sm:h-9 sm:w-9" />
              </Avatar>
              <div className="hidden flex-col md:flex">
                <p className="text-sm font-semibold text-foreground">
                  {userInfo.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userInfo.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <h1 className="text-sm font-semibold sm:text-lg">Task Manager</h1>
            </div>
          )}

          {/* Center - Home link */}
          <div className="hidden sm:absolute sm:left-1/2 sm:block sm:-translate-x-1/2">
            <Link
              to="/Home"
              className="text-lg font-semibold transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
          </div>

          {/* Right side */}
          {userInfo ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                onClick={logoutHandler}
                size="sm"
                className="sm:size-default"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <SwitchTheme />
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" className="sm:size-default">
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link to="/signup">Sign up</Link>
              </Button>
              <SwitchTheme />
            </div>
          )}
        </nav>
      </header>
    </>
  );
}

export default NavBar;
