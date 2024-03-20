import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@chakra-ui/avatar";
import { LuArrowLeft } from "react-icons/lu";
import { MdEdit, MdCheck, MdCameraAlt } from "react-icons/md";
import profileImg from "../assets/profile.jpg";
import {
  changeProfileInfo,
  changeProfilePhoto,
} from "../features/auth/authApiSlice";

function ProfileEdit({ profileEditShow, setProfileEditShow, user }) {
  const dispatch = useDispatch();
  const [editNameInputShow, setEditNameInputShow] = useState(false);
  const [editAboutInputShow, setEditAboutInputShow] = useState(false);
  const [editNameInput, setEditNameInput] = useState(user.name);
  const [editAboutInput, setEditAboutInput] = useState(user?.about);

  const handleChangePhoto = (e) => {
    let formData = new FormData();
    formData.append("photo", e.target.files[0]);
    dispatch(changeProfilePhoto({ id: user._id, data: formData }));
  };

  const editNameInfo = () => {
    setEditNameInputShow(false);
    dispatch(
      changeProfileInfo({ id: user._id, data: { name: editNameInput } })
    );
  };
  const editAboutInfo = () => {
    setEditAboutInputShow(false);
    dispatch(
      changeProfileInfo({ id: user._id, data: { about: editAboutInput } })
    );
  };

  useEffect(() => {
    if (user) {
      setEditNameInput(user.name);
      setEditAboutInput(user.about);
    }
  }, [user]);
  return (
    <div className={`profile-edit ${profileEditShow && "profile-edit-show"}`}>
      <div className="header">
        <LuArrowLeft
          fontSize={22}
          color="#6b7c85"
          onClick={() => setProfileEditShow(false)}
        />
        <h2>Profile</h2>
      </div>
      <div className="body">
        <div className="profile-img">
          <Avatar name={user.name} src={user?.photo} className="profile-img" />
          <input type="file" accept="image/*" onChange={handleChangePhoto} />
          <div className="edit-photo">
            <MdCameraAlt fontSize={25} color="#ffffff" />
            <p>CHANGE PROFILE PHOTO</p>
          </div>
        </div>
        <div className="profile-name">
          <p>Your name</p>
          {editNameInputShow ? (
            <>
              <input
                type="text"
                value={editNameInput}
                onChange={(e) => setEditNameInput(e.target.value)}
              />
              <MdCheck
                fontSize={22}
                className="save-icon"
                onClick={editNameInfo}
              />
            </>
          ) : (
            <>
              <h2>{editNameInput}</h2>
              <MdEdit
                fontSize={20}
                className="edit-icon"
                onClick={() => setEditNameInputShow(true)}
              />
            </>
          )}
        </div>
        <div className="profile-name">
          <p>About</p>
          {editAboutInputShow ? (
            <>
              <input
                type="text"
                value={editAboutInput}
                onChange={(e) => setEditAboutInput(e.target.value)}
              />
              <MdCheck
                fontSize={22}
                className="save-icon"
                onClick={editAboutInfo}
              />
            </>
          ) : (
            <>
              <h2>{editAboutInput}</h2>
              <MdEdit
                fontSize={20}
                className="edit-icon"
                onClick={() => setEditAboutInputShow(true)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;
