import React, { useRef, useEffect, useState, forwardRef } from "react";
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

const Messagebar = forwardRef(({ sidebarRef }, ref) => {
  const { selectedUser, userData, socket, onlineUsers } = useSelector(
    (state) => state.user,
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
  const messagebarRef = ref || useRef(null);
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
      messagesContainerRef.current.scrollTop,
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

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const res = await axios.get(
          `${ServerUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true },
        );
        const serializableMessages = res.data.map((m) => ({
          ...m,
          createdAt: new Date(m.createdAt).toISOString(),
        }));
        dispatch(setMessages(serializableMessages));
        scrollToBottomInstant();
        await axios.put(
          `${ServerUrl}/api/message/read/${selectedUser._id}`,
          {},
          { withCredentials: true },
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
        { withCredentials: true },
      );
      const newMessage = {
        ...res.data,
        createdAt: res.data?.createdAt
          ? new Date(res.data.createdAt).toISOString()
          : new Date().toISOString(),
      };
      dispatch(addMessage(newMessage));
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

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = async (payload) => {
      const incoming = payload?.messageData ? payload.messageData : payload;
      incoming.createdAt = incoming.createdAt
        ? new Date(incoming.createdAt).toISOString()
        : new Date().toISOString();
      if (incoming.sender === userData?._id) return;
      dispatch(addMessage(incoming));
      if (selectedUser && incoming.sender === selectedUser._id) {
        try {
          await axios.put(
            `${ServerUrl}/api/message/read/${selectedUser._id}`,
            {},
            { withCredentials: true },
          );
        } catch (error) {}
      }
    };
    const handleTyping = ({ senderId, isTyping }) => {
      if (selectedUser && senderId === selectedUser._id) setIsTyping(isTyping);
    };
    const handleVoiceRecording = ({ senderId, isRecording }) => {
      if (selectedUser && senderId === selectedUser._id)
        setOtherRecording(isRecording);
    };
    const handleMessagesRead = ({ readBy }) => {
      if (selectedUser && readBy === selectedUser._id) {
        const updatedMessages = messages.map((msg) =>
          msg.sender === userData._id && msg.receiver === selectedUser._id
            ? { ...msg, isRead: true, readAt: new Date().toISOString() }
            : msg,
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
    if (selectedUser?._id) navigate(`/userinfo/${selectedUser._id}`);
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
          <div className="w-full flex-shrink-0 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 bg-[#21C4D3] text-white shadow-md">
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-1 min-w-0"
              onClick={handleHeaderClick}
            >
              <IoIosArrowRoundBack
                size={26}
                className="cursor-pointer lg:hidden flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setSelectedUser(null));
                }}
              />
              <img
                src={selectedUser?.image || dp}
                alt="Profile"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="font-semibold text-sm sm:text-base truncate leading-tight">
                  {selectedUser?.userName || "User"}
                </h1>
                <div className="flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                      isOnline ? "bg-green-400" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-[10px] sm:text-xs">
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-2 sm:p-3"
          >
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 mt-10 text-sm sm:text-base">
                No messages yet
              </p>
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

          {frontendImage && (
            <div className="flex items-center justify-between p-2 bg-gray-100 mx-2 sm:mx-3 mb-1 rounded-md flex-shrink-0">
              <img
                src={frontendImage}
                className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-md"
                alt="preview"
              />
              <IoMdClose
                size={22}
                className="text-red-500 cursor-pointer"
                onClick={removeImage}
              />
            </div>
          )}

          {audioBlob && (
            <div className="flex items-center justify-between p-2 bg-gray-100 mx-2 sm:mx-3 mb-1 rounded-md flex-shrink-0">
              <audio
                controls
                src={URL.createObjectURL(audioBlob)}
                className="h-8 w-full max-w-[220px] sm:max-w-xs"
              />
              <IoMdClose
                size={22}
                className="text-red-500 cursor-pointer ml-2 flex-shrink-0"
                onClick={() => setAudioBlob(null)}
              />
            </div>
          )}

          <div className="relative w-full px-2 sm:px-3 py-2 sm:py-3 bg-white border-t border-gray-200 flex flex-col gap-1 flex-shrink-0">
            {(isTyping || otherRecording) && (
              <div className="w-fit inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-xs sm:text-sm mb-1">
                {isTyping && (
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounceTyping delay-0" />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounceTyping delay-200" />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounceTyping delay-400" />
                  </div>
                )}
                {otherRecording && (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-600 rounded-full animate-pulse" />
                    <span className="whitespace-nowrap">Recording…</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setShowPicker(!showPicker)}
                className="emoji-toggle-btn text-xl sm:text-2xl text-[#189AA7] cursor-pointer flex-shrink-0 p-1"
              >
                <RiEmojiStickerLine />
              </button>

              <input
                type="file"
                hidden
                accept="image/*"
                ref={image}
                onChange={handleImage}
              />
              <button
                type="button"
                className="text-xl sm:text-2xl text-[#189AA7] cursor-pointer flex-shrink-0 p-1"
                onClick={() => image.current.click()}
              >
                <IoMdAttach />
              </button>

              <input
                type="text"
                value={isRecording ? "" : input}
                disabled={isRecording}
                onChange={handleInputChange}
                placeholder={isRecording ? "🎙 Recording..." : "Type message"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(e);
                }}
                className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#e8fdff] outline-none text-sm sm:text-base"
              />

              {input.trim() || frontendImage || audioBlob ? (
                <button
                  onClick={handleSendMessage}
                  className="bg-[#21C4D3] text-white p-2 sm:p-2.5 rounded-full flex-shrink-0 hover:bg-[#189AA7] transition-colors"
                >
                  <IoIosSend size={18} />
                </button>
              ) : (
                <button
                  onClick={handleVoiceRecord}
                  className={`text-white p-2 sm:p-2.5 rounded-full flex-shrink-0 transition-colors ${
                    isRecording
                      ? "bg-red-600 pulse"
                      : "bg-[#21C4D3] hover:bg-[#189AA7]"
                  }`}
                >
                  <MdOutlineKeyboardVoice size={18} />
                </button>
              )}

              {showPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-14 sm:bottom-16 left-2 sm:left-4 z-50"
                  style={{ maxWidth: "min(320px, calc(100vw - 16px))" }}
                >
                  <EmojiPicker
                    onEmojiClick={OnEmojiClick}
                    width="100%"
                    height={320}
                  />
                </div>
              )}
            </div>
          </div>

          {previewImage && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-3">
              <img
                src={previewImage}
                className="max-h-[88vh] max-w-[95vw] sm:max-h-[90vh] sm:max-w-[90vw] rounded-lg object-contain"
                alt="preview"
              />
              <IoMdClose
                size={28}
                className="absolute top-4 right-4 text-white cursor-pointer hover:text-gray-300 transition-colors"
                onClick={() => setPreviewImage("")}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full flex-col gap-4 sm:gap-6 px-4">
          <img
            src={logo}
            alt="Talkies Logo"
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full"
          />
          <div className="text-center space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#189AA7] to-[#0d6873] bg-clip-text text-transparent">
              Welcome to Talkies
            </h1>
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg font-medium">
              Your own chatting App!
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

Messagebar.displayName = "Messagebar";
export default Messagebar;
