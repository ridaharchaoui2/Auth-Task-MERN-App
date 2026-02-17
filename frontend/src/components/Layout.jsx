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
      <Toaster
        position="bottom-right"
        duration={3000}
        expand={false}
        closeButton={false}
        gap={16}
        toastOptions={{
          unstyled: false,
          classNames: {
            toast:
              "!min-w-[400px] !max-w-[500px] !bg-white dark:!bg-[#1F1F1F] !border-2 !shadow-2xl !rounded-2xl !p-6 !pr-16 !backdrop-blur-xl",
            title: "!text-base !font-black !leading-tight !text-left",
            description:
              "!text-sm !font-semibold !mt-2 !leading-relaxed !opacity-90",
            closeButton:
              "!absolute !top-4 !right-4 !bg-white/90 dark:!bg-white/20 !text-slate-900 dark:!text-white !border-0 hover:!bg-white dark:hover:!bg-white/30 !rounded-xl !w-10 !h-10 transition-all hover:!scale-110",
            success:
              "!bg-gradient-to-r !from-emerald-500 !to-emerald-600 !border-emerald-400 !text-white",
            error:
              "!bg-gradient-to-r !from-red-500 !to-red-600 !border-red-400 !text-white",
            warning:
              "!bg-gradient-to-r !from-amber-500 !to-orange-500 !border-amber-400 !text-white",
            info: "!bg-gradient-to-r !from-blue-500 !to-blue-600 !border-blue-400 !text-white",
          },
        }}
      />
      <main>
        {/* The Outlet renders the child route's element */}
        <Outlet />
      </main>
    </>
  );
};
export default Layout;
