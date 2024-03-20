import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/whatsappgallery.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Cookie from "js-cookie";
import {
  activateUserAccountByLink,
  activateUserAccountByOTP,
  setNewPassword,
} from "../../features/auth/authApiSlice";
import "./auth.scss";
import { userData } from "../../features/auth/authSlice";
import { hideEmail, hidePhoneNumber } from "../../helpers/helpers";

function SetNewPassword() {
  const token = Cookie.get("verifyToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, success } = useSelector(userData);
  const [newPass, setNewPass] = useState();
  const [conNewPass, setConNewPass] = useState();
  // Form Submit for doing register
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPass != conNewPass || !newPass || !conNewPass) {
      toast.error("Not matching!");
    } else {
      dispatch(setNewPassword({ token, password: newPass }));
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (success) {
      navigate("/login");
    }
  }, [message, token, navigate, success]);
  return (
    <div className="register">
      <div className="register-card">
        <div className="logo-content">
          <img src={logo} alt="Logo" />
          <h2>Set new password</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="New password"
          />
          <input
            type="text"
            value={conNewPass}
            onChange={(e) => setConNewPass(e.target.value)}
            placeholder="Confirm new password"
          />
          <button type="submit">Set new password</button>
        </form>
        {/* {user.email && (
          <h5 onClick={handleResendEmail}>
            Resend activation OTP & link to {hideEmail(user.email)}
          </h5>
        )}
        {user.phone && (
          <h5>Resend activation OTP to {hidePhoneNumber(user.phone)}</h5>
        )} */}
        <p>
          You can? <Link to="/login">Login.</Link>
        </p>
      </div>
    </div>
  );
}

export default SetNewPassword;
