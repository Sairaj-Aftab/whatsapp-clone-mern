import React, { useState } from "react";
import demoImg from "../assets/profile.jpg";
import { BiSend, BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { createMessage } from "../features/chat/chatApiSlice";

function FileUploadPopup({ setImgLink, imgLink, me, chatUser }) {
  const dispatch = useDispatch();
  const [text, setText] = useState();
  const handleUploadFile = () => {
    let formData = new FormData();
    formData.append("sendPhoto", imgLink);
    formData.append("text", text);
    if (imgLink) {
      dispatch(
        createMessage({
          senderId: me._id,
          receiverId: chatUser._id,
          body: formData,
        })
      );
      setImgLink(null);
    }
  };
  return (
    <div className="file-upload-popup">
      <BiX className="bix-icon" onClick={() => setImgLink(null)} />
      {imgLink && (
        <img className="upload-img" src={URL.createObjectURL(imgLink)} alt="" />
      )}
      <div className="bottom-bar">
        <input
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Type a message"
        />
        <BiSend className="bisend-icon" onClick={handleUploadFile} />
      </div>
    </div>
  );
}

export default FileUploadPopup;
