import Activation from "../pages/auth/Activation";
import ForgetPasswordOTP from "../pages/auth/ForgetPasswordOTP";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import SetNewPassword from "../pages/auth/SetNewPassword";

const publicRouter = [
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/activation",
    element: <Activation />,
  },
  {
    path: "/forget-password-otp",
    element: <ForgetPasswordOTP />,
  },
  {
    path: "/setnew-password",
    element: <SetNewPassword />,
  },
];

export default publicRouter;
