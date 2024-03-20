import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import whatsappBanner from "../../assets/whatsappgallery.png";
import SideBar from "../../components/SideBar";
import { userData } from "../../features/auth/authSlice";
import "./home.scss";
import ActivateAfterLogin from "../../components/ActivateAfterLogin";
import UserChatBox from "../../components/UserChatBox";
import {
  getChats,
  realTimeChat,
  setMessageEmpty,
} from "../../features/chat/chatSlice";
import BasicUserProfile from "../../components/BasicUserProfile";

function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector(userData);
  const { chats, success } = useSelector(getChats);
  const [basicUserInfo, setBasicUserInfo] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [activeUser, setActiveUser] = useState([]);
  const [realTimeLastMsg, setRealTimeLastMsg] = useState(null);
  const [typing, setTyping] = useState(false);
  let socket = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:9000");
    socket.current.emit("setActiveUser", user);
    socket.current.on("getActiveUser", (data) => {
      setActiveUser(data);
    });
    if (success) {
      socket.current.emit("sentRealTimeMsg", success);

      dispatch(setMessageEmpty());
    }
    socket.current.on("sentRealTimeMsgGet", (msg) => {
      setRealTimeLastMsg(msg);
      dispatch(realTimeChat(msg));
    });
  }, [success]);
  useEffect(() => {
    socket.current.on("getTyping", (msg) => {
      msg.msg ? setTyping(msg) : setTyping(false);
    });
    setTyping(false);
  }, [success, chats]);
  return (
    <>
      {user.verify ? (
        <div className="home">
          <SideBar
            chatUser={chatUser}
            setChatUser={setChatUser}
            typing={typing}
            realTimeLastMsg={realTimeLastMsg}
          />
          <div className="right-side">
            {chatUser ? (
              <UserChatBox
                chatUser={chatUser}
                me={user}
                activeUser={activeUser}
                typing={typing}
                setBasicUserInfo={setBasicUserInfo}
              />
            ) : (
              <div className="welcome-banner">
                <img src={whatsappBanner} alt="" />
              </div>
            )}
          </div>
          {basicUserInfo && (
            <BasicUserProfile
              basicUserInfo={basicUserInfo}
              setBasicUserInfo={setBasicUserInfo}
            />
          )}
        </div>
      ) : (
        <ActivateAfterLogin />
      )}
    </>
  );
}

export default Home;
