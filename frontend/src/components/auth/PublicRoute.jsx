import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Home from "../Home";

function PublicRoute() {
  const { userInfo } = useSelector((state) => state.auth);
  return <>{!userInfo ? <Home /> : <Navigate to="/Home" replace />}</>;
}

export default PublicRoute;
