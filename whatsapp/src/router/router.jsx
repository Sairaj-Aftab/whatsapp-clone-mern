import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import UserChatBox from "../components/UserChatBox";
import Activation from "../pages/auth/Activation";
import PublicGuard from "./publicGuard";
import publicRouter from "./publicRouter";
import PrivateGuard from "./PrivateGuard";
import privateRouter from "./privateRouter";

const router = createBrowserRouter([
  {
    element: <PrivateGuard />,
    children: [...privateRouter],
  },
  {
    element: <PublicGuard />,
    children: [...publicRouter],
  },
  {
    path: "/activation/:tokenURL",
    element: <Activation />,
  },
]);

export default router;
