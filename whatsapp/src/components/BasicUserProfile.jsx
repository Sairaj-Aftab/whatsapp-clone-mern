import React from "react";
import { BiX } from "react-icons/bi";
import profileImg from "../assets/profile.jpg";

function BasicUserProfile({ basicUserInfo, setBasicUserInfo }) {
  return (
    <div className="basic-user-profile">
      <div className="header">
        <BiX onClick={() => setBasicUserInfo(null)} />
        <h1>Contact info</h1>
      </div>
      <div className="profile-info">
        <img src={basicUserInfo?.photo} alt="" />
        <h1>{basicUserInfo.name}</h1>
        <p>
          {basicUserInfo?.email ? basicUserInfo?.email : basicUserInfo?.phone}
        </p>
      </div>
      <div className="about">
        <p>About</p>
        <h4>{basicUserInfo?.about}</h4>
      </div>
      <div className="media">
        <p>Media, links and docs</p>
        <div className="media-list">
          <img src={profileImg} alt="" />
          <img src={profileImg} alt="" />
          <img src={profileImg} alt="" />
        </div>
      </div>
    </div>
  );
}

export default BasicUserProfile;
