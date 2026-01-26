import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { Toaster } from "./ui/sonner";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Toaster />
      <main>
        {/* The Outlet renders the child route's element */}
        <Outlet />
      </main>
    </>
  );
};
export default Layout;
