import React, { useState } from "react";
import { Avatar } from "@chakra-ui/avatar";
import profileImg from "../assets/profile.jpg";
import { LuArrowLeft } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userSearch } from "../features/user/userApiSllice";

function NewChatAddUser({
  newChatAddUserShow,
  setNewChatAddUserShow,
  user,
  users,
  setChatUser,
}) {
  const dispatch = useDispatch();

  const searchUsers = (e) => {
    dispatch(userSearch(e));
  };
  return (
    <div className={`new-chat ${newChatAddUserShow && "new-chat-show"}`}>
      <div className="header">
        <LuArrowLeft
          fontSize={22}
          color="#6b7c85"
          onClick={() => setNewChatAddUserShow(false)}
        />
        <h2>New chat</h2>
      </div>
      <div className="body">
        <div className="search-bar">
          <LuArrowLeft fontSize={19} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Phone"
            onChange={(e) => searchUsers(e.target.value)}
          />
        </div>
        <div className="users">
          <h2>CONTACTS ON HERE</h2>
          <ul className="users-list">
            {users?.map((data, index) => (
              <li key={index}>
                <a href="#" onClick={() => setChatUser(data)}>
                  <div className="user-info">
                    <Avatar name={data.name} src={data?.photo} />
                    <div className="name-chat-info">
                      <h4>{data.name}</h4>
                      <p>{data?.about}</p>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NewChatAddUser;
