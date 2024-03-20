import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/whatsappgallery.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./auth.scss";
import {
  loginUser,
  resendActivateLinkOTP,
} from "../../features/auth/authApiSlice";
import { userData } from "../../features/auth/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, loader } = useSelector(userData);
  const [input, setInput] = useState({
    auth: "",
    password: "",
  });
  const changeInput = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // Form Submit for doing register
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    if (!input.auth || !input.password) {
      toast.error("All fields are required!");
    } else {
      dispatch(loginUser(input));
    }
  };
  // Handle Forget Password
  const handleForgetPassword = (e) => {
    e.preventDefault();
    if (!input.auth) {
      toast.error("Please provide email or number");
    } else {
      dispatch(resendActivateLinkOTP(input.auth));
    }
  };
  useEffect(() => {
    if (message) {
      navigate("/forget-password-otp");
    }
  }, [message]);
  return (
    <div className="register">
      <div className="register-card">
        <div className="logo-content">
          <img src={logo} alt="Logo" />
          <h2>LOG IN</h2>
        </div>
        <form onSubmit={handleSubmitLogin}>
          <input
            type="text"
            name="auth"
            value={input.auth}
            onChange={changeInput}
            placeholder="Email or phone number"
          />
          <input
            type="text"
            name="password"
            value={input.password}
            onChange={changeInput}
            placeholder="Password"
          />
          <a href="#" onClick={handleForgetPassword}>
            Forget your password?
          </a>
          <button type="submit">Log in{loader && "..."}</button>
        </form>
        <p>
          If you haven't an account? <Link to="/register">Register.</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
