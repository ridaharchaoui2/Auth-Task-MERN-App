import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/services/authApi";
import { removeCredentials } from "@/services/authSlice";
import { CircleUser, LogOut, User, LayoutDashboard, LogIn } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      {/* relative container allows absolute centering of the Home link */}
      <nav className="container relative mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
        {/* LEFT: Branding */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-lg font-black tracking-tighter sm:text-2xl"
          >
            TM<span className="hidden xs:inline"> Manager</span>
          </Link>
        </div>

        {/* CENTER: Home Link (Always Centered) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link
            to="/Home"
            className="text-xl font-bold transition-colors hover:text-primary sm:text-2xl"
          >
            Home
          </Link>
        </div>

        {/* RIGHT: Theme & User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="scale-90 sm:scale-110">
            <SwitchTheme />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 rounded-full p-0 outline-none hover:bg-transparent"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/10 transition-all hover:border-primary sm:h-12 sm:w-12">
                  {/* If user is logged in, show user icon/avatar, else show generic login icon */}
                  <AvatarFallback>
                    <CircleUser className="h-8 w-8 sm:h-10 sm:w-10" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 mt-2" align="end" forceMount>
              {userInfo ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-base font-bold leading-none">
                        {userInfo.name}
                      </p>
                      <p className="text-sm leading-none text-muted-foreground">
                        {userInfo.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer py-4 text-lg font-medium"
                  >
                    <Link to={`/profile/${userInfo._id}`}>
                      <User className="mr-3 h-5 w-5" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer py-4 text-lg font-medium"
                  >
                    <Link to="/Home">
                      <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="cursor-pointer py-4 text-lg font-bold text-destructive focus:bg-destructive focus:text-destructive-foreground"
                  >
                    <LogOut className="mr-3 h-5 w-5" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="p-3 text-lg font-bold">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer py-4 text-lg font-medium"
                  >
                    <Link to="/signin">
                      <LogIn className="mr-3 h-5 w-5" /> Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer py-4 text-lg font-medium"
                  >
                    <Link to="/signup">
                      <User className="mr-3 h-5 w-5" /> Create Account
                    </Link>
                  </DropdownMenuItem>
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
