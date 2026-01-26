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
        <nav className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Left side - Two buttons */}
          {userInfo ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <CircleUser size={32} />
              </Avatar>
              <div className="hidden flex-col sm:flex">
                <p className="text-sm font-semibold text-foreground">
                  {userInfo.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userInfo.email}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-lg font-semibold">Task App Manager</h1>
            </div>
          )}

          {/* Center - Home link */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link
              to="/Home"
              className="text-lg font-semibold transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
          </div>
          {userInfo ? (
            <>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={logoutHandler}>
                  <LogOut />
                  Logout
                </Button>
                <SwitchTheme />
              </div>
            </>
          ) : (
            <>
              {/* Right side - Mode toggle */}
              <div className="flex items-center gap-2">
                <Button variant="ghost">
                  <Link to="/signin">Sign in</Link>
                </Button>
                <Button variant="ghost">
                  <Link to="/signup">Sign up</Link>
                </Button>
                <SwitchTheme />
              </div>
            </>
          )}
        </nav>
      </header>
    </>
  );
}

export default NavBar;
