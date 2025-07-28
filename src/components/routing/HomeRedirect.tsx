import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

// Redirects users to login if needed and then to appropiate page based on their functions could be reworked to work with roles instead depending on needs
export function HomeRedirect() {
  const { user } = useAuth();
  console.log(user)
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.functions.includes("ViewUsers") ? "/manage" : "/me"} replace />;
};