import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Config/firebase";
import Loading from "../Components/Loading";

const PrivateRoutes = () => {
  const [user, loading] = useAuthState(auth);
  return loading ? <Loading /> : user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
