import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

function Home() {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <>
      <main className="container mx-auto flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
        {userInfo ? (
          navigate("/Home")
        ) : (
          <>
            <h1 className="text-4xl font-bold">
              Welcome To Task Management Appllication
            </h1>
            <p className="mt-4 text-muted-foreground">
              Please signin to manage your Tasks
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild variant="outline">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Home;
