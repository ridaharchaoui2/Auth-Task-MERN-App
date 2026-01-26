import { Outlet } from "react-router-dom";
import { Toaster } from "./ui/sonner";
import NavBar from "./NavBar";

const Layout = () => {
  return (
    <>
      <NavBar />
      <Toaster />
      <main>
        {/* The Outlet renders the child route's element */}
        <Outlet />
      </main>
    </>
  );
};
export default Layout;
