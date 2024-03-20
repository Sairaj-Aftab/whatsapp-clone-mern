import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { setMessageEmpty, userData } from "./features/auth/authSlice";
import { useEffect } from "react";
import { getLogedInUser } from "./features/auth/authApiSlice";
import { getAllChatUsers, getAllUsers } from "./features/user/userApiSllice";

function App() {
  const dispatch = useDispatch();
  const { message, error, success } = useSelector(userData);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      dispatch(getLogedInUser());
      dispatch(getAllUsers());
      dispatch(getAllChatUsers());
    }
    if (message) {
      toast.success(message);
      dispatch(setMessageEmpty());
    }
    if (success) {
      dispatch(setMessageEmpty());
    }
    if (error) {
      toast.error(error);
      dispatch(setMessageEmpty());
    }
  }, [message, success, error, dispatch]);
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
