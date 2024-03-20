import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/whatsappgallery.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./auth.scss";
import { createUser } from "../../features/auth/authApiSlice";
import { userData } from "../../features/auth/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, error, loader } = useSelector(userData);
  const [input, setInput] = useState({
    name: "",
    auth: "",
    password: "",
  });
  const changeInput = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // Form Submit for doing register
  const handleSubmitRegister = (e) => {
    e.preventDefault();
    if (!input.name || !input.auth || !input.password) {
      toast.error("All fields are required!");
    } else {
      dispatch(createUser(input));
    }
  };

  useEffect(() => {
    if (message) {
      navigate("/activation");
      setInput({
        name: "",
        auth: "",
        password: "",
      });
    }
  }, [message]);
  return (
    <div className="register">
      <div className="register-card">
        <div className="logo-content">
          <img src={logo} alt="Logo" />
          <h2>REGISTER</h2>
        </div>
        <form onSubmit={handleSubmitRegister}>
          <input
            type="text"
            name="name"
            value={input.name}
            onChange={changeInput}
            placeholder="Full name"
          />
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

          <button type="submit">Register{loader && "..."}</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Log in.</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
