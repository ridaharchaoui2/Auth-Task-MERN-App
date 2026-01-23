import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/services/authApi";
import { removeCredentials } from "@/services/authSlice";

function NavBar() {
  const { userInfo } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
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
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur ">
        <nav className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Left side - Two buttons */}
          <div className="flex items-center gap-2"></div>

          {/* Center - Home link */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link
              to="/"
              className="text-lg font-semibold transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
          </div>
          {userInfo ? (
            <>
              <div className="flex items-center gap-2">
                {userInfo.name}
                <Button variant="ghost" onClick={logoutHandler}>
                  Logout
                </Button>
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
                <ModeToggle />
              </div>
            </>
          )}
        </nav>
      </header>
    </>
  );
}

export default NavBar;
