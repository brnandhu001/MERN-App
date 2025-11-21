import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
