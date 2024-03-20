import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/whatsappgallery.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Cookie from "js-cookie";
import {
  activateUserAccountByLink,
  activateUserAccountByOTP,
  logoutUser,
  resendActivateLinkOTP,
} from "../features/auth/authApiSlice";
import { setLogoutUser, userData } from "../features/auth/authSlice";
import { hideEmail, hidePhoneNumber } from "../helpers/helpers";

function ActivateAfterLogin() {
  const navigate = useNavigate();
  const token = Cookie.get("verifyToken");
  const dispatch = useDispatch();
  const { user } = useSelector(userData);
  const [otp, setOtp] = useState();
  // Form Submit for doing register
  const handleSubmitActivation = (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("The field is required!");
    } else {
      dispatch(activateUserAccountByOTP({ token, otp }));
    }
  };
  //   Resend Email bor OTP and Link to activate account
  const handleResendEmail = () => {
    dispatch(resendActivateLinkOTP(user.email));
  };
  //   Logut
  const logOut = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    dispatch(setLogoutUser());
    navigate("/login");
  };
  return (
    <div className="register">
      <div className="register-card">
        <div className="logo-content">
          <img src={logo} alt="Logo" />
          <h2>Activation account</h2>
        </div>
        <form onSubmit={handleSubmitActivation}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
          />
          <button type="submit">Activate now</button>
        </form>
        {user.email && (
          <h5 onClick={handleResendEmail}>
            Resend activation OTP & link to {hideEmail(user.email)}
          </h5>
        )}
        {user.phone && (
          <h5>Resend activation OTP to {hidePhoneNumber(user.phone)}</h5>
        )}
        <p>
          You can{" "}
          <a href="#" onClick={logOut}>
            Log out
          </a>
        </p>
      </div>
    </div>
  );
}

export default ActivateAfterLogin;
