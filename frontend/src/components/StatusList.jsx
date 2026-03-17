// components/StatusList.jsx - Fixed Version
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../main";
import {
  setMyStatuses,
  setOtherStatuses,
  addNewStatusFromOther,
  removeStatus,
  updateStatusView,
  updateStatusLike,
} from "../redux/StatusSlice";
import { FiPlus, FiEdit3 } from "react-icons/fi";
import dp from "../assets/dp.webp";

const StatusList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, socket } = useSelector((state) => state.user);
  const { myStatuses, otherStatuses, viewedStatuses } = useSelector(
    (state) => state.status,
  );

  useEffect(() => {
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewStatus = (statusData) => {
      if (statusData.userId._id !== userData._id) {
        dispatch(addNewStatusFromOther(statusData));
      }
    };

    const handleStatusRemoved = ({ statusId, userId }) => {
      dispatch(removeStatus({ statusId, userId }));
    };

    const handleStatusViewUpdate = ({
      statusId,
      statusOwnerId,
      viewerData,
    }) => {
      if (statusOwnerId === userData._id) {
        dispatch(updateStatusView({ statusId, viewerData }));
      }
    };

    const handleStatusLikeUpdate = ({
      statusId,
      statusOwnerId,
      likerData,
      isLiked,
    }) => {
      if (statusOwnerId === userData._id) {
        dispatch(updateStatusLike({ statusId, likerData, isLiked }));
      }
    };

    socket.on("newStatus", handleNewStatus);
    socket.on("statusRemoved", handleStatusRemoved);
    socket.on("statusViewUpdate", handleStatusViewUpdate);
    socket.on("statusLikeUpdate", handleStatusLikeUpdate);

    return () => {
      socket.off("newStatus", handleNewStatus);
      socket.off("statusRemoved", handleStatusRemoved);
      socket.off("statusViewUpdate", handleStatusViewUpdate);
      socket.off("statusLikeUpdate", handleStatusLikeUpdate);
    };
  }, [socket, dispatch, userData]);

  const fetchStatuses = async () => {
    try {
      const [myRes, othersRes] = await Promise.all([
        axios.get(`${ServerUrl}/api/status/my`, { withCredentials: true }),
        axios.get(`${ServerUrl}/api/status/all`, { withCredentials: true }),
      ]);

      dispatch(setMyStatuses(myRes.data));
      dispatch(setOtherStatuses(othersRes.data));
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const activeStatuses = otherStatuses.filter(
    (user) => user.statuses && user.statuses.length > 0,
  );

  const hasUnviewedStatus = (userStatuses) => {
    return userStatuses.some((status) => !viewedStatuses.includes(status._id));
  };

  const handleMyStatusClick = (e) => {
    if (e.target.closest(".add-status-btn")) {
      navigate("/status/add");
    } else {
      if (myStatuses.length === 0) {
        navigate("/status/add");
      } else {
        navigate(`/status/view/${userData._id}`);
      }
    }
  };

  return (
    <div className="bg-[#e8fdff] border-b border-gray-300">
      <div className="overflow-x-auto pb-3 px-3 pt-3 scrollbar-hide">
        <div className="flex items-center gap-3">
          {/* My Status */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group relative">
            <div onClick={handleMyStatusClick} className="relative">
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  myStatuses.length > 0
                    ? "bg-gradient-to-tr from-[#21C4D3] via-[#189AA7] to-[#0d6873] p-[2.5px]"
                    : "bg-gradient-to-tr from-gray-300 to-gray-400 p-[2px]"
                }`}
              >
                <div className="w-full h-full rounded-full bg-white"></div>
              </div>

              <img
                src={userData?.image || dp}
                alt="My Status"
                className="relative w-14 h-14 rounded-full object-cover border-2 border-white"
              />

              <div
                className="add-status-btn absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#21C4D3] rounded-full flex items-center justify-center shadow-md hover:bg-[#189AA7] transition-all duration-200 hover:scale-110 cursor-pointer z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/status/add");
                }}
              >
                {myStatuses.length > 0 ? (
                  <FiEdit3 size={11} className="text-white" />
                ) : (
                  <FiPlus size={12} className="text-white font-bold" />
                )}
              </div>
            </div>

            <span className="text-[11px] font-medium text-gray-700">
              My Status
            </span>
          </div>

          {activeStatuses.length > 0 && (
            <div className="flex-shrink-0 w-px h-10 bg-gray-200"></div>
          )}

          {activeStatuses.length > 0 && (
            <div className="flex-shrink-0">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                Recent Updates
              </p>
            </div>
          )}

          {/* Other Users' Statuses */}
          {activeStatuses.map((userStatus) => {
            const hasUnviewed = hasUnviewedStatus(userStatus.statuses);
            return (
              <div
                key={userStatus.userId._id}
                onClick={() =>
                  navigate(`/status/view/${userStatus.userId._id}`)
                }
                className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      hasUnviewed
                        ? "bg-gradient-to-tr from-[#21C4D3] via-[#189AA7] to-[#0d6873] p-[2.5px]"
                        : "bg-gray-300 p-[2px]"
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-white"></div>
                  </div>

                  <img
                    src={userStatus.userId.image || dp}
                    alt={userStatus.userId.userName || userStatus.userId.name}
                    className="relative w-14 h-14 rounded-full object-cover border-2 border-white"
                  />
                </div>

                {/* ✅ FIX: userName OR name use karo */}
                <span className="text-[11px] font-medium text-gray-700 truncate max-w-[56px]">
                  {userStatus.userId.userName ||
                    userStatus.userId.name ||
                    "User"}
                </span>
              </div>
            );
          })}

          {activeStatuses.length === 0 && (
            <div className="flex-1 py-2 pl-3">
              <p className="text-xs text-gray-400">No updates available</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .overflow-x-auto { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default StatusList;
