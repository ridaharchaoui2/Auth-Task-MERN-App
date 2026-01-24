import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Tasks from "./components/tasks/tasks";
import PrivateRoute from "./components/tasks/PrivateRoute";
import PublicRoute from "./components/auth/PublicRoute";
import NotFound from "./components/NotFound";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<PublicRoute />}>
              <Route index element={<Home />} />
            </Route>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="" element={<PrivateRoute />}>
              <Route path="/Home" element={<Tasks />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
