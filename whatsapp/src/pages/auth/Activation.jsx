import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/whatsappgallery.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Cookie from "js-cookie";
import {
  activateUserAccountByLink,
  activateUserAccountByOTP,
} from "../../features/auth/authApiSlice";
import "./auth.scss";
import { userData } from "../../features/auth/authSlice";
import { hideEmail, hidePhoneNumber } from "../../helpers/helpers";

function Activation() {
  const token = Cookie.get("verifyToken");
  const { tokenURL } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message } = useSelector(userData);
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

  useEffect(() => {
    // Activate user by Link
    if (tokenURL) {
      dispatch(activateUserAccountByLink(tokenURL));
    }

    if (!token) {
      navigate("/login");
    }
    if (message) {
      navigate("/login");
    }
  }, [message, token, navigate, tokenURL]);
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
        {/* {user.email && (
          <h5 onClick={handleResendEmail}>
            Resend activation OTP & link to {hideEmail(user.email)}
          </h5>
        )}
        {user.phone && (
          <h5>Resend activation OTP to {hidePhoneNumber(user.phone)}</h5>
        )} */}
        <p>
          If you are verified? <Link to="/login">Login.</Link>
        </p>
      </div>
    </div>
  );
}

export default Activation;
