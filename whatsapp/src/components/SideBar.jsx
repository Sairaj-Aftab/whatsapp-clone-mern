import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import usersIcon from "../assets/icon/users.png";
import statusIcon from "../assets/icon/status.png";
import menuIcon from "../assets/icon/menu.png";
import chatIcon from "../assets/icon/newchat.png";
import "../pages/Home/home.scss";
import useDropdownPopup from "../hooks/useDropdownPopup";
import { logoutUser } from "../features/auth/authApiSlice";
import { setLogoutUser, userData } from "../features/auth/authSlice";
import ProfileEdit from "./ProfileEdit";
import NewChatAddUser from "./NewChatAddUser";
import { getAllUsersData } from "../features/user/userSlice";
import { getAllChats } from "../features/chat/chatApiSlice";
import { formatTime, formatTiming } from "../helpers/helpers";
import { io } from "socket.io-client";

function SideBar({ chatUser, setChatUser, typing, realTimeLastMsg }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(userData);
  const { users, chatUsers } = useSelector(getAllUsersData);
  const { open, toggleMenu, dropDownRef } = useDropdownPopup();
  const [profileEditShow, setProfileEditShow] = useState(false);
  const [newChatAddUserShow, setNewChatAddUserShow] = useState(false);
  const socket = useRef();

  const logOut = (e) => {
    e.preventDefault();
    socket.current.emit("removeLogoutUser", user._id);
    dispatch(logoutUser());
    dispatch(setLogoutUser());
    navigate("/login");
  };
  useEffect(() => {
    socket.current = io("http://localhost:9000");
  }, []);
  useEffect(() => {
    if (chatUser) {
      dispatch(getAllChats(chatUser._id));
    }
  }, [dispatch, chatUser]);
  return (
    <>
      <div className="left-side">
        <div className="left-side-header">
          <Avatar
            name={user.name}
            src={user?.photo}
            className="profile-img"
            onClick={() => setProfileEditShow(true)}
          />
          <ul>
            <li>
              <a href="#">
                <img src={usersIcon} alt="" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src={statusIcon} alt="" />
              </a>
            </li>
            <li>
              <a href="#">
                <img
                  src={chatIcon}
                  alt=""
                  onClick={() => setNewChatAddUserShow(true)}
                />
              </a>
            </li>
            <li className="menu" ref={dropDownRef}>
              <a href="#" onClick={toggleMenu}>
                <img src={menuIcon} alt="" />
              </a>
              {open && (
                <ul className="menuItem">
                  <li>
                    <a href="#">Log out</a>
                  </li>
                  <li>
                    <a href="#">Log out</a>
                  </li>
                  <li>
                    <a href="#" onClick={logOut}>
                      Log out
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        <div className="user-box">
          <div className="search-bar">
            <AiOutlineSearch className="search-icon" />
            <input type="text" placeholder="Search or start new chat" />
          </div>
          <ul className="users-list">
            {chatUsers?.map(({ userInfo, lastMsg }, index) => (
              <li key={index}>
                <a href="#" onClick={() => setChatUser(userInfo)}>
                  <div className="user-info">
                    <Avatar name="Sairaj Aftab" src={userInfo?.photo} />
                    <div className="name-chat-info">
                      <h4>{userInfo.name}</h4>
                      {typing.senderId === userInfo._id && <p>Typing...</p>}
                      {/* {typing && <p>Typing...</p>} */}
                      {typing.senderId !== userInfo._id && (
                        <p>
                          {lastMsg?.message
                            ? lastMsg?.message?.text?.slice(0, 35)
                            : userInfo?.about?.slice(0, 35)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="timing-more">
                    <p>{formatTiming(lastMsg?.createdAt)}</p>
                    <FaChevronDown className="more-icon" />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ProfileEdit
        profileEditShow={profileEditShow}
        setProfileEditShow={setProfileEditShow}
        user={user}
      />
      <NewChatAddUser
        newChatAddUserShow={newChatAddUserShow}
        setNewChatAddUserShow={setNewChatAddUserShow}
        user={user}
        users={users}
        setChatUser={setChatUser}
      />
    </>
  );
}

export default SideBar;
