import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@chakra-ui/avatar";
import EmojiPicker from "emoji-picker-react";
import documentIcon from "../assets/icon/document.png";
import photosIcon from "../assets/icon/photos.png";
import { FaChevronDown } from "react-icons/fa";
import {
  MdOutlineEmojiEmotions,
  MdEmojiEmotions,
  MdClear,
} from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { MdKeyboardVoice } from "react-icons/md";
import "../pages/Home/home.scss";
import useDropdownPopup from "../hooks/useDropdownPopup";
import { createMessage } from "../features/chat/chatApiSlice";
import { getChats } from "../features/chat/chatSlice";
import { formatTime, formatTiming } from "../helpers/helpers";
import { io } from "socket.io-client";
import dropDownPopId from "../hooks/dropDownPopId";
import profileImg from "../assets/profile.jpg";
import FileUploadPopup from "./FileUploadPopup";

function UserChatBox({ chatUser, me, activeUser, typing, setBasicUserInfo }) {
  const dispatch = useDispatch();
  const { chats, success } = useSelector(getChats);
  const { open, toggleMenu } = useDropdownPopup();
  const {
    open: openDocument,
    toggleMenu: documentToggle,
    dropDownRef: documentDropDownRef,
  } = useDropdownPopup();
  const {
    open: openPopId,
    toggleMenu: toggleMenuId,
    dropDownRef: dropDownRefId,
  } = dropDownPopId();
  const [msg, setMsg] = useState("");
  const [openPopupImg, setOpenPopupImg] = useState(false);
  const [imgLink, setImgLink] = useState(null);
  const scrollRef = useRef();
  const socket = useRef();
  const handleChangeMsgValue = (e) => {
    setMsg(e.target.value);

    socket.current.emit("typing", {
      msg: e.target.value,
      senderId: me._id,
    });
    // if (e.target.value) {
    // }
  };
  const handleCreateMsg = (e) => {
    if (e.key === "Enter") {
      if (msg) {
        dispatch(
          createMessage({
            senderId: me._id,
            receiverId: chatUser._id,
            body: { text: msg },
          })
        );
      }
    }
  };
  // Emoji click
  const handleEmojiClick = (emojiObject, e) => {
    setMsg((prev) => prev + emojiObject.emoji);
  };
  // handleSetEmojiOnSingleChat
  const handleSetEmojiOnSingleChat = (id) => {
    console.log(id);
  };
  // handleMoreItem
  const handleMoreItem = (id) => {};
  const handleChangePhotoVideo = (e) => {
    if (e.target.files[0]) {
      setImgLink(e.target.files[0]);
    } else {
      setImgLink(null);
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    socket.current = io("http://localhost:9000");
    if (success) {
      setMsg("");
    }
  }, [chats, success, msg]);
  return (
    <div className="user-chat-info">
      {imgLink && (
        <FileUploadPopup
          setImgLink={setImgLink}
          imgLink={imgLink}
          me={me}
          chatUser={chatUser}
        />
      )}
      <div className="user-chat-info-header">
        <div className="user-name-img">
          <Avatar
            name={chatUser.name}
            src={chatUser?.photo}
            onClick={() => setBasicUserInfo(chatUser)}
          />
          <div
            className="name-online-status"
            onClick={() => setBasicUserInfo(chatUser)}
          >
            <h2>{chatUser.name}</h2>
            {typing.senderId == chatUser._id && (
              <p className="typing">Typing...</p>
            )}
            {activeUser.some((d) => d.userId === chatUser._id) &&
              typing.senderId !== chatUser._id && <p>Online</p>}
            {/* <p>last seen yesterday at 12:55 pm</p> */}
          </div>
        </div>
        <div className="info-icon">Here are icon</div>
      </div>
      <div className="user-chat-info-box">
        {chats?.map((data, index) => {
          return (
            <>
              {data.senderId === me._id ? (
                <div className="chat me" ref={scrollRef}>
                  {!data.message?.img && (
                    <div className="only-text">
                      <p>
                        {data?.message?.text}
                        <span className="chating-time">
                          {formatTime(data.createdAt)}
                        </span>
                        <FaChevronDown className="chat-more-icon" />
                        <MdEmojiEmotions className="emoji-more" />
                      </p>
                    </div>
                  )}
                  {data.message?.img && (
                    <div className="file-text" ref={scrollRef}>
                      <p>
                        <img src={data.message?.img} alt="" />
                        {data.message?.text}
                        <span className="chating-time">
                          {formatTime(data.createdAt)}
                        </span>
                        <FaChevronDown className="chat-more-icon" />
                        <MdEmojiEmotions className="emoji-more" />
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="chat user" ref={scrollRef}>
                  {!data.message?.img && (
                    <div className="only-text">
                      <p>
                        {data?.message?.text}
                        <span className="chating-time">
                          {formatTime(data.createdAt)}
                        </span>
                        <FaChevronDown className="chat-more-icon" />
                        <MdEmojiEmotions className="emoji-more" />
                      </p>
                    </div>
                  )}
                  {data.message?.img && (
                    <div className="file-text" ref={scrollRef}>
                      <p>
                        <img src={data.message?.img} alt="" />
                        {data.message?.text}
                        <span className="chating-time">
                          {formatTime(data.createdAt)}
                        </span>
                        <FaChevronDown className="chat-more-icon" />
                        <MdEmojiEmotions className="emoji-more" />
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          );
        })}

        {/* {chats?.map((data, index) => {
          return (
            <div key={index} ref={scrollRef}>
              {data.senderId === me._id ? (
                <div className="me-chating">
                  {!data?.message?.img && (
                    <p>
                      <MdEmojiEmotions className="emoji-more" />
                      {data.message.text}{" "}
                      <span className="chating-time">
                        {formatTime(data.createdAt)}
                      </span>
                      <FaChevronDown className="chat-more-icon" />
                    </p>
                  )}
                  {data?.message?.img && (
                    <div className="withImg">
                      <MdEmojiEmotions className="emoji-more" />
                      <img
                        className="file-sharing"
                        src={data.message?.img}
                        alt=""
                      />
                      {data.message.text && data.message.text}
                      <span className="chating-time">
                        {formatTime(data.createdAt)}
                      </span>
                      <FaChevronDown className="chat-more-icon" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="user-chating">
                  {!data?.message?.img && (
                    <p>
                      <MdEmojiEmotions
                        className="emoji-more"
                        onClick={() => handleSetEmojiOnSingleChat(data._id)}
                      />
                      {data._id === openPopId && (
                        <ul className="more-option-popup">
                          <li>Reply</li>
                          <li>Reply</li>
                          <li>Reply</li>
                          <li>Reply</li>
                          <li>Reply</li>
                          <li>Reply</li>
                          <li>Reply</li>
                        </ul>
                      )}
                      {data.message.text}{" "}
                      <span className="chating-time">
                        {formatTime(data.createdAt)}
                      </span>
                      <FaChevronDown
                        className="chat-more-icon"
                        onClick={() => toggleMenuId(data._id)}
                      />
                    </p>
                  )}
                  {data?.message?.img && (
                    <div className="withImg">
                      <MdEmojiEmotions className="emoji-more" />
                      <img
                        className="file-sharing"
                        src={data.message?.img}
                        alt=""
                      />
                      {data.message.text && data.message.text}
                      <span className="chating-time">
                        {formatTime(data.createdAt)}
                      </span>
                      <FaChevronDown className="chat-more-icon" />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })} */}
      </div>
      <div className="chat-input-bottom">
        {open ? (
          <MdClear
            color="#6B7C85"
            size={32}
            style={{ cursor: "pointer" }}
            onClick={toggleMenu}
          />
        ) : (
          <MdOutlineEmojiEmotions
            color="#6B7C85"
            size={32}
            style={{ cursor: "pointer" }}
            onClick={toggleMenu}
          />
        )}

        {open && (
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="light"
            width="100%"
          />
        )}
        {openDocument ? (
          <MdClear
            color="#6B7C85"
            size={28}
            style={{ cursor: "pointer" }}
            onClick={documentToggle}
          />
        ) : (
          <FaPlus
            color="#6B7C85"
            size={28}
            style={{ cursor: "pointer" }}
            onClick={documentToggle}
          />
        )}

        {openDocument && (
          <ul className="file-uploading">
            <li>
              <img src={photosIcon} alt="" />
              <span>Photos & Videos</span>
              <input type="file" onChange={handleChangePhotoVideo} />
            </li>
            <li>
              <img src={documentIcon} alt="" />
              <span>Document</span>
              <input type="file" />
            </li>
            <li>
              <img src={documentIcon} alt="" />
              <span>Photos</span>
              <input type="file" />
            </li>
          </ul>
        )}
        <input
          type="text"
          value={msg}
          onChange={handleChangeMsgValue}
          onKeyUp={handleCreateMsg}
          placeholder="Type a message"
        />
        <MdKeyboardVoice
          color="#6B7C85"
          size={28}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default UserChatBox;
