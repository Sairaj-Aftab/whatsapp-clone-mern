import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicGuard = () => {
  const { user } = useSelector((state) => state.auth);
  if (!localStorage.getItem("user") || !user) {
    return !user ? <Outlet /> : <Navigate to="/" />;
  }
  return <Navigate to="/" />;
};

export default PublicGuard;
