import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AuthRoute({ children }) {
  let auth = useSelector((state) => state.auth);
  if (auth.user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AuthRoute;
