import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateGuard() {
  const { user } = useSelector((state) => state.auth);
  // if (user.verify === false) {
  //   return user.verify === false && <Navigate to="/activation" />;
  // }
  if (localStorage.getItem("user") || user) {
    return user ? <Outlet /> : <Navigate to="/login" />;
  }
  return <Navigate to="/login" />;
}

export default PrivateGuard;
