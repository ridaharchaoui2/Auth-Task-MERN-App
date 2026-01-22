import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* The Outlet renders the child route's element */}
        <Outlet />
      </main>
    </>
  );
};
export default Layout;
