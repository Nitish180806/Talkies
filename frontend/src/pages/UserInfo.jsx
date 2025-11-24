import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";


const ServerUrl = "http://localhost:8000";

const UserInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { socket } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/user/${id}`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
     if (!socket) return;
    socket.emit("addUser", id);

    socket.on("onlineUsers", (users) => setOnlineUsers(users));

    socket.on("profileUpdated", (updatedUser) => {
      if (updatedUser._id === id) setUser(updatedUser);
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("profileUpdated");
    };
  }, [socket,id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-base sm:text-lg px-4">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-500 px-4">
        <p className="text-base sm:text-lg">User not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-[#21C4D3] text-white rounded-md hover:bg-[#189AA7] transition text-sm sm:text-base"
        >
          Go Back
        </button>
      </div>
    );

  const isOnline = onlineUsers.includes(user._id);

  return (
    <div className="flex flex-col h-screen bg-[#e8fdff] overflow-hidden">
      {/* Header - Responsive */}
      <div className="p-3 sm:p-4 bg-[#21C4D3] text-white shadow-lg  top-0 z-10 flex justify-center items-center">
        {/* Back Arrow */}
        <IoIosArrowRoundBack
          size={30}
          className="absolute left-3 sm:left-4 cursor-pointer hover:text-gray-200 transition"
          onClick={() => navigate(-1)}
        />
        {/* Centered Text */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">
          Profile Info
        </h2>
      </div>

      {/* Profile Content - Responsive with scrolling */}
      <div className="flex flex-col items-center flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 md:py-10 space-y-4 sm:space-y-6">
        <div className="relative group">
          <img
            src={user.image || "/default-avatar.png"}
            alt="Profile"
            onClick={() => user.image && setPreviewImage(user.image)}
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-2xl cursor-pointer transform transition-transform duration-200 hover:scale-105"
          />
        </div>

        <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg bg-white shadow-2xl rounded-3xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-5 text-gray-700 text-sm sm:text-base md:text-lg relative overflow-hidden">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center bg-gray-50 p-3 sm:p-4 rounded-xl shadow-inner hover:shadow-md transition duration-200">
              <span className="font-semibold text-gray-600">Name:</span>
              <span className="text-gray-800 break-words text-right max-w-[60%]">
                {user.name}
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 sm:p-4 rounded-xl shadow-inner hover:shadow-md transition duration-200">
              <span className="font-semibold text-gray-600">About:</span>
              <span className="text-gray-800 break-words text-right max-w-[60%]">
                {user.about || "No about info"}
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 sm:p-4 rounded-xl shadow-inner hover:shadow-md transition duration-200">
              <span className="font-semibold text-gray-600">Joined:</span>
              <span className="text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal - Responsive */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[95%] max-h-[90%] sm:max-w-[90%] sm:max-h-[85%] rounded-2xl shadow-2xl object-contain animate-fadeIn"
          />
          <button
            onClick={() => setPreviewImage("")}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-2xl sm:text-3xl font-bold hover:text-red-400"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
