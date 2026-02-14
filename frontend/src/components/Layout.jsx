import { Outlet } from "react-router-dom";
import { Toaster } from "./ui/sonner";
import NavBar from "./NavBar";
import AdminNavbar from "./admin/AdminNavbar";
import { useSelector } from "react-redux";

const Layout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <>
      {userInfo && userInfo.isAdmin ? <AdminNavbar /> : <NavBar />}
      <Toaster />
      <main>
        {/* The Outlet renders the child route's element */}
        <Outlet />
      </main>
    </>
  );
};
export default Layout;
