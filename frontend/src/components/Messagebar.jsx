// components/Messagebar.jsx - FIXED VERSION
import React, { useRef, useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/UserSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoMdAttach, IoIosSend, IoMdClose } from "react-icons/io";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { ServerUrl } from "../main";
import axios from "axios";
import { setMessages, addMessage } from "../redux/MessageSlice";
import { useNavigate } from "react-router-dom";
import "../Messagebar.css";
import logo from "../assets/logo.png";

const Messagebar = ({ sidebarRef }) => {
  const { selectedUser, userData, socket, onlineUsers } = useSelector(
    (state) => state.user
  );
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherRecording, setOtherRecording] = useState(false);
  const audioChunks = useRef([]);

  const currentAudioRef = useRef(null);
  const messagebarRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const image = useRef();
  const messagesContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  const isOnline = selectedUser && onlineUsers?.includes(selectedUser._id);

  const scrollToBottomInstant = () => {
    if (chatEndRef.current && messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      el.style.scrollBehavior = "auto";
      chatEndRef.current.scrollIntoView();
      el.style.scrollBehavior = "";
    }
  };

  useEffect(() => {
    if (selectedUser) scrollToBottomInstant();
  }, [selectedUser]);

  const handleScroll = () => {
    if (!selectedUser) return;
    localStorage.setItem(
      "scroll_" + selectedUser._id,
      messagesContainerRef.current.scrollTop
    );
  };

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const el = messagesContainerRef.current;
    const distanceFromBottom =
      el.scrollHeight - (el.scrollTop + el.clientHeight);

    if (distanceFromBottom < 120) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        messagebarRef.current &&
        !messagebarRef.current.contains(event.target) &&
        (!sidebarRef || !sidebarRef.current.contains(event.target))
      ) {
        dispatch(setSelectedUser(null));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch, sidebarRef]);

  useEffect(() => {
    const handleClickOutsideEmoji = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest(".emoji-toggle-btn")
      ) {
        setShowPicker(false);
      }
    };
    if (showPicker)
      document.addEventListener("mousedown", handleClickOutsideEmoji);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideEmoji);
  }, [showPicker]);

  // ✅ Fetch messages and mark as read
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const res = await axios.get(
          `${ServerUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );
        const serializableMessages = res.data.map((m) => ({
          ...m,
          createdAt: new Date(m.createdAt).toISOString(),
        }));
        dispatch(setMessages(serializableMessages));
        scrollToBottomInstant();

        // ✅ Mark messages as read when chat opens
        await axios.put(
          `${ServerUrl}/api/message/read/${selectedUser._id}`,
          {},
          { withCredentials: true }
        );
      } catch (error) {
        dispatch(setMessages([]));
      }
    };
    fetchMessages();
  }, [selectedUser, dispatch]);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  const handleAudioPlay = (audioElement) => {
    if (currentAudioRef.current && currentAudioRef.current !== audioElement) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    currentAudioRef.current = audioElement;
    audioElement.onended = () => {
      if (currentAudioRef.current === audioElement)
        currentAudioRef.current = null;
    };
  };

  const handleVoiceRecord = async () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (socket && selectedUser)
        socket.emit("voiceRecording", {
          receiverId: selectedUser._id,
          isRecording: false,
        });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunks.current = [];
      recorder.ondataavailable = (e) => audioChunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      if (socket && selectedUser)
        socket.emit("voiceRecording", {
          receiverId: selectedUser._id,
          isRecording: true,
        });
    } catch (err) {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !backendImage && !audioBlob) return;
    try {
      const formData = new FormData();
      if (audioBlob) formData.append("file", audioBlob, "voice-message.webm");
      else {
        formData.append("message", input);
        if (backendImage) formData.append("file", backendImage);
      }

      const res = await axios.post(
        `${ServerUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      const newMessage = {
        ...res.data,
        createdAt: res.data?.createdAt
          ? new Date(res.data.createdAt).toISOString()
          : new Date().toISOString(),
      };

      dispatch(addMessage(newMessage));
      dispatch(setMessages([...messages, newMessage]));

      setInput("");
      setFrontendImage("");
      setBackendImage(null);
      setAudioBlob(null);

      if (socket && selectedUser)
        socket.emit("typing", {
          receiverId: selectedUser._id,
          isTyping: false,
        });
      if (socket && selectedUser)
        socket.emit("voiceRecording", {
          receiverId: selectedUser._id,
          isRecording: false,
        });
    } catch (error) {}
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket || !selectedUser) return;
    socket.emit("typing", {
      receiverId: selectedUser._id,
      isTyping: e.target.value.length > 0,
    });
  };

  const OnEmojiClick = (emojiData) =>
    setInput((prev) => prev + emojiData.emoji);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFrontendImage("");
    setBackendImage(null);
    image.current.value = null;
  };

  // ✅ FIXED: Mark messages as read when new message arrives in active chat
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (payload) => {
      const incoming = payload?.messageData ? payload.messageData : payload;
      incoming.createdAt = new Date().toISOString();
      dispatch(addMessage(incoming));

      // ✅ NEW: If message is from selectedUser and we're in the chat, mark as read immediately
      if (selectedUser && incoming.sender === selectedUser._id) {
        try {
          await axios.put(
            `${ServerUrl}/api/message/read/${selectedUser._id}`,
            {},
            { withCredentials: true }
          );
        } catch (error) {
          console.error("Failed to mark as read:", error);
        }
      }
    };

    const handleTyping = ({ senderId, isTyping }) => {
      if (selectedUser && senderId === selectedUser._id) setIsTyping(isTyping);
    };

    const handleVoiceRecording = ({ senderId, isRecording }) => {
      if (selectedUser && senderId === selectedUser._id)
        setOtherRecording(isRecording);
    };

    // ✅ Handle read receipts
    const handleMessagesRead = ({ readBy }) => {
      if (selectedUser && readBy === selectedUser._id) {
        // Update local messages to mark as read
        const updatedMessages = messages.map((msg) =>
          msg.sender === userData._id && msg.receiver === selectedUser._id
            ? { ...msg, isRead: true, readAt: new Date().toISOString() }
            : msg
        );
        dispatch(setMessages(updatedMessages));
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("voiceRecording", handleVoiceRecording);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("voiceRecording", handleVoiceRecording);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, selectedUser, dispatch, messages, userData]);

  const handleImagePreview = (url) => setPreviewImage(url);

  const handleHeaderClick = () => {
    if (selectedUser?._id) {
      navigate(`/userinfo/${selectedUser._id}`);
    }
  };

  return (
    <div
      ref={messagebarRef}
      className={`lg:w-[70%] w-full h-full flex-col bg-[#e8fdff] ${
        selectedUser ? "flex" : "hidden lg:flex"
      } transition-all duration-300`}
    >
      {selectedUser ? (
        <div className="flex flex-col h-full relative">
          {/* Header */}
          <div className="w-full h-[68px] flex items-center justify-between px-4 bg-[#21C4D3] text-white shadow-md">
            <div
              className="flex items-center space-x-2 cursor-pointer flex-1"
              onClick={handleHeaderClick}
            >
              <IoIosArrowRoundBack
                size={28}
                className="cursor-pointer lg:hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setSelectedUser(null));
                }}
              />
              <img
                src={selectedUser?.image || dp}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <div>
                <h1 className="font-semibold truncate">
                  {selectedUser?.userName || "User"}
                </h1>
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? "bg-green-400" : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="text-xs">
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-3"
          >
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">No messages yet</p>
            ) : (
              messages.map((mess, index) => {
                const time = formatTime(mess.createdAt);

                if (mess.audio) {
                  const audioElement = (
                    <audio
                      controls
                      src={mess.audio}
                      onPlay={(e) => handleAudioPlay(e.target)}
                    />
                  );
                  return mess.sender === userData._id ? (
                    <SenderMessage
                      key={index}
                      message={audioElement}
                      time={time}
                      isRead={mess.isRead}
                    />
                  ) : (
                    <ReceiverMessage
                      key={index}
                      message={audioElement}
                      time={time}
                    />
                  );
                }

                return mess.sender === userData._id ? (
                  <SenderMessage
                    key={index}
                    image={mess.image}
                    message={mess.message}
                    time={time}
                    isRead={mess.isRead}
                    onImageClick={() =>
                      mess.image && handleImagePreview(mess.image)
                    }
                  />
                ) : (
                  <ReceiverMessage
                    key={index}
                    image={mess.image}
                    message={mess.message}
                    time={time}
                    onImageClick={() =>
                      mess.image && handleImagePreview(mess.image)
                    }
                  />
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Image & Audio Preview */}
          {frontendImage && (
            <div className="flex items-center justify-between p-2 bg-gray-100 mx-3 mb-2 rounded-md">
              <img
                src={frontendImage}
                className="h-20 w-20 object-cover rounded-md"
              />
              <IoMdClose
                size={25}
                className="text-red-500 cursor-pointer"
                onClick={removeImage}
              />
            </div>
          )}

          {audioBlob && (
            <div className="flex items-center justify-between p-2 bg-gray-100 mx-3 mb-2 rounded-md">
              <audio controls src={URL.createObjectURL(audioBlob)} />
              <IoMdClose
                size={25}
                className="text-red-500 cursor-pointer"
                onClick={() => setAudioBlob(null)}
              />
            </div>
          )}

          {/* Input + Typing/Recording Indicators */}
          <div className="relative w-full p-3 bg-white border-t flex flex-col gap-1">
            {(isTyping || otherRecording) && (
              <div className="w-fit inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm">
                {isTyping && (
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounceTyping delay-0"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounceTyping delay-200"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounceTyping delay-400"></span>
                  </div>
                )}

                {otherRecording && (
                  <div className="w-fit flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    <span className="whitespace-nowrap">Recording…</span>
                  </div>
                )}
              </div>
            )}

            {/* Input row */}
            <div className="flex items-center gap-3 mt-1">
              <div
                onClick={() => setShowPicker(!showPicker)}
                className="emoji-toggle-btn text-xl text-[#189AA7] cursor-pointer"
              >
                <RiEmojiStickerLine />
              </div>

              <input
                type="file"
                hidden
                accept="image/*"
                ref={image}
                onChange={handleImage}
              />
              <div
                className="text-xl text-[#189AA7] cursor-pointer"
                onClick={() => image.current.click()}
              >
                <IoMdAttach />
              </div>

              <input
                type="text"
                value={isRecording ? "" : input}
                disabled={isRecording}
                onChange={handleInputChange}
                placeholder={isRecording ? "🎙 Recording..." : "Type message"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(e);
                }}
                className="flex-1 px-4 py-2 rounded-full bg-[#e8fdff] outline-none"
              />

              {input.trim() || frontendImage || audioBlob ? (
                <button
                  onClick={handleSendMessage}
                  className="bg-[#21C4D3] text-white p-2 rounded-full"
                >
                  <IoIosSend />
                </button>
              ) : (
                <button
                  onClick={handleVoiceRecord}
                  className={`text-white p-2 rounded-full ${
                    isRecording ? "bg-red-600 pulse" : "bg-[#21C4D3]"
                  }`}
                >
                  <MdOutlineKeyboardVoice />
                </button>
              )}

              {showPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-16 left-5 z-50"
                >
                  <EmojiPicker onEmojiClick={OnEmojiClick} />
                </div>
              )}
            </div>
          </div>

          {/* Full image preview */}
          {previewImage && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
              <img src={previewImage} className="max-h-[90%]" />
              <IoMdClose
                size={30}
                className="absolute top-5 right-5 text-white cursor-pointer"
                onClick={() => setPreviewImage("")}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full flex-col gap-6 px-4">
          {/* Logo with animation effect */}
          <div className="relative">
            <img
              src={logo}
              alt="Talkies Logo"
              className="w-24 h-24 rounded-full relative z-10"
            />
          </div>

          {/* Text Content */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#189AA7] to-[#0d6873] bg-clip-text text-transparent">
              Welcome to Talkies
            </h1>
            <p className="text-gray-500 text-lg font-medium">
              Your own chatting App!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messagebar;
