import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { ServerUrl } from "../main";

const UserInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { socket, onlineUsers } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/user/${id}`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        // user not found
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handleProfileUpdated = (updatedUser) => {
      if (updatedUser._id === id) setUser(updatedUser);
    };
    socket.on("profileUpdated", handleProfileUpdated);
    return () => socket.off("profileUpdated", handleProfileUpdated);
  }, [socket, id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-sm sm:text-base px-4">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-500 px-4 gap-3">
        <p className="text-sm sm:text-base">User not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#21C4D3] text-white rounded-lg hover:bg-[#189AA7] transition-colors text-sm sm:text-base"
        >
          Go Back
        </button>
      </div>
    );

  const isOnline = onlineUsers.includes(user._id);

  return (
    <div className="flex flex-col h-screen bg-[#e8fdff] overflow-hidden">
      <div className="px-3 sm:px-4 py-3 sm:py-4 bg-[#21C4D3] text-white shadow-lg flex items-center relative flex-shrink-0">
        <IoIosArrowRoundBack
          size={26}
          className="cursor-pointer hover:text-gray-200 transition-colors flex-shrink-0"
          onClick={() => navigate(-1)}
        />
        <h2 className="flex-1 text-center text-base sm:text-xl md:text-2xl font-semibold pr-6 sm:pr-8">
          Profile Info
        </h2>
      </div>

      <div className="flex-1 flex flex-col items-center overflow-y-auto px-3 sm:px-4 py-5 sm:py-6 md:py-10 gap-4 sm:gap-5">
        <div className="relative">
          <img
            src={user.image || "/default-avatar.png"}
            alt="Profile"
            onClick={() => user.image && setPreviewImage(user.image)}
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
          />
          <span
            className={`absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-md ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg bg-white shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 space-y-2.5 sm:space-y-4">
          {[
            { label: "Name", value: user.name || user.userName },
            {
              label: "Status",
              value: isOnline ? "🟢 Online" : "⚫ Offline",
              valueClass: isOnline
                ? "text-green-500 font-medium"
                : "text-gray-500",
            },
            { label: "About", value: user.about || "No about info" },
            {
              label: "Joined",
              value: new Date(user.createdAt).toLocaleDateString(),
            },
          ].map((row, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:shadow-md transition-shadow duration-200"
            >
              <span className="font-semibold text-gray-600 text-sm sm:text-base flex-shrink-0 mr-3">
                {row.label}:
              </span>
              <span
                className={`text-right break-words text-sm sm:text-base max-w-[60%] ${row.valueClass || "text-gray-800"}`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[95vw] max-h-[88vh] sm:max-w-[90vw] sm:max-h-[90vh] rounded-2xl shadow-2xl object-contain"
          />
          <button
            onClick={() => setPreviewImage("")}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white text-2xl sm:text-3xl font-bold hover:text-red-400 transition-colors"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
