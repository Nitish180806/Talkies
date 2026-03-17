// pages/ViewStatus.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiHeart, FiTrash2, FiEye } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../main";
import {
  addViewedStatus,
  updateStatusLike,
  deleteStatus,
  updateStatusView,
} from "../redux/StatusSlice";
import dp from "../assets/dp.webp";

const ViewStatus = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData, socket } = useSelector((state) => state.user);
  const { myStatuses, otherStatuses } = useSelector((state) => state.status);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showViewersList, setShowViewersList] = useState(false);

  const isMyStatus = userId === userData?._id;
  const statuses = isMyStatus
    ? myStatuses
    : otherStatuses.find((u) => u.userId._id === userId)?.statuses || [];

  const currentStatus = statuses[currentIndex];
  const statusUser = isMyStatus
    ? userData
    : otherStatuses.find((u) => u.userId._id === userId)?.userId;

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return;
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
    socket.on("statusViewUpdate", handleStatusViewUpdate);
    socket.on("statusLikeUpdate", handleStatusLikeUpdate);
    return () => {
      socket.off("statusViewUpdate", handleStatusViewUpdate);
      socket.off("statusLikeUpdate", handleStatusLikeUpdate);
    };
  }, [socket, dispatch, userData]);

  // Auto-advance timer
  useEffect(() => {
    if (!currentStatus || isPaused || showViewersList) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, currentStatus, showViewersList]);

  // Mark as viewed
  useEffect(() => {
    if (currentStatus && !isMyStatus) markAsViewed(currentStatus._id);
  }, [currentStatus]);

  const markAsViewed = async (statusId) => {
    try {
      await axios.post(
        `${ServerUrl}/api/status/${statusId}/view`,
        {},
        { withCredentials: true },
      );
      dispatch(addViewedStatus(statusId));
      if (socket && statusUser) {
        socket.emit("statusViewed", {
          statusId,
          statusOwnerId: statusUser._id,
          viewerData: {
            _id: userData._id,
            name: userData.name,
            image: userData.image,
          },
        });
      }
    } catch (error) {}
  };

  const handleNext = () => {
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      navigate("/");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleLike = async () => {
    if (isMyStatus) return;
    const isLiked = currentStatus.likes?.some(
      (like) => (typeof like === "string" ? like : like._id) === userData._id,
    );
    try {
      await axios.post(
        `${ServerUrl}/api/status/${currentStatus._id}/like`,
        {},
        { withCredentials: true },
      );
      dispatch(
        updateStatusLike({
          statusId: currentStatus._id,
          likerData: {
            _id: userData._id,
            name: userData.name,
            image: userData.image,
          },
          isLiked: !isLiked,
        }),
      );
      if (socket && statusUser) {
        socket.emit("statusLiked", {
          statusId: currentStatus._id,
          statusOwnerId: statusUser._id,
          likerData: {
            _id: userData._id,
            name: userData.name,
            image: userData.image,
          },
          isLiked: !isLiked,
        });
      }
    } catch (error) {}
  };

  const handleDelete = async () => {
    if (!isMyStatus) return;
    if (window.confirm("Delete this status?")) {
      try {
        await axios.delete(`${ServerUrl}/api/status/${currentStatus._id}`, {
          withCredentials: true,
        });
        dispatch(deleteStatus(currentStatus._id));
        if (socket) {
          socket.emit("statusDeleted", {
            statusId: currentStatus._id,
            userId: userData._id,
          });
        }
        const remainingStatuses = statuses.length - 1;
        if (remainingStatuses === 0) {
          navigate("/");
        } else if (currentIndex === statuses.length - 1) {
          setCurrentIndex((prev) => prev - 1);
        } else {
          setProgress(0);
        }
      } catch (error) {}
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const statusDate = new Date(date);
    const diff = Math.floor((now - statusDate) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return statusDate.toLocaleDateString();
  };

  useEffect(() => {
    if (!currentStatus && isMyStatus && statuses.length === 0) navigate("/");
    else if (!currentStatus && !isMyStatus) navigate("/");
  }, [currentStatus, isMyStatus, navigate, statuses.length]);

  if (!currentStatus) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-white mb-3" />
        <p className="text-xs sm:text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  const isLiked = currentStatus.likes?.some(
    (like) => (typeof like === "string" ? like : like._id) === userData._id,
  );
  const viewsCount = currentStatus.views?.length || 0;
  const likesCount = currentStatus.likes?.length || 0;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative select-none">
      {/* Progress bars */}
      <div className="flex gap-1 px-2 pt-2 sm:px-3 sm:pt-3 relative z-20">
        {statuses.map((_, idx) => (
          <div
            key={idx}
            className="flex-1 h-0.5 sm:h-1 bg-gray-600 rounded-full"
          >
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width:
                  idx < currentIndex
                    ? "100%"
                    : idx === currentIndex
                      ? `${progress}%`
                      : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 relative z-20">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <IoIosArrowRoundBack
            size={26}
            className="cursor-pointer flex-shrink-0"
            onClick={() => navigate("/")}
          />
          <img
            src={statusUser?.image || dp}
            alt={statusUser?.name}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-sm sm:text-base truncate">
              {statusUser?.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-400">
              {formatTime(currentStatus.createdAt)}
            </p>
          </div>
        </div>
        {isMyStatus && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0 ml-2 p-1"
          >
            <FiTrash2 size={20} />
          </button>
        )}
      </div>

      {/* Status content */}
      <div
        className="flex-1 flex items-center justify-center relative"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Navigation tap zones */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
          onClick={handlePrev}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
          onClick={handleNext}
        />

        {currentStatus.image ? (
          <img
            src={currentStatus.image}
            alt="Status"
            className="max-h-[65vh] sm:max-h-[70vh] max-w-full object-contain"
          />
        ) : (
          <div className="text-center px-6 sm:px-8">
            <p className="text-xl sm:text-2xl">{currentStatus.caption}</p>
          </div>
        )}

        {currentStatus.caption && currentStatus.image && (
          <div className="absolute bottom-28 sm:bottom-32 left-0 right-0 text-center px-4 sm:px-6">
            <p className="text-sm sm:text-base lg:text-lg bg-black/60 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg inline-block max-w-[90%] backdrop-blur-sm">
              {currentStatus.caption}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {isMyStatus ? (
        <div className="px-3 sm:px-4 py-3 sm:py-4 relative z-20">
          <div className="flex items-center justify-around bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4">
            <button
              onClick={() => setShowViewersList(!showViewersList)}
              className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center"
            >
              <FiEye size={18} className="sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">
                {viewsCount}
              </span>
              <span className="text-xs sm:text-sm text-gray-300">Views</span>
            </button>
            <div className="w-px h-6 sm:h-8 bg-white/20" />
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center">
              <FaHeart size={16} className="text-red-500 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">
                {likesCount}
              </span>
              <span className="text-xs sm:text-sm text-gray-300">Likes</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between relative z-20">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
          >
            {isLiked ? (
              <FaHeart size={20} className="text-red-500" />
            ) : (
              <FiHeart size={20} />
            )}
            <span className="font-semibold text-sm sm:text-base">
              {likesCount}
            </span>
          </button>
        </div>
      )}

      {/* Viewers list modal (bottom sheet) */}
      {isMyStatus && showViewersList && (
        <div
          className="absolute inset-0 bg-black/90 z-30 flex flex-col justify-end"
          onClick={() => setShowViewersList(false)}
        >
          <div
            className="bg-white/10 backdrop-blur-xl rounded-t-3xl max-h-[75vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet header */}
            <div className="sticky top-0 bg-white/10 backdrop-blur-xl px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-white/20">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-xl font-bold">Status Info</h3>
                <button
                  onClick={() => setShowViewersList(false)}
                  className="text-xl sm:text-2xl text-gray-300 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-white/10 rounded-xl p-2.5 sm:p-3 text-center">
                  <FiEye
                    size={20}
                    className="mx-auto mb-1 text-blue-400 sm:w-6 sm:h-6"
                  />
                  <p className="text-xl sm:text-2xl font-bold">{viewsCount}</p>
                  <p className="text-[10px] sm:text-xs text-gray-300">Views</p>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 sm:p-3 text-center">
                  <FaHeart
                    size={20}
                    className="mx-auto mb-1 text-red-500 sm:w-6 sm:h-6"
                  />
                  <p className="text-xl sm:text-2xl font-bold">{likesCount}</p>
                  <p className="text-[10px] sm:text-xs text-gray-300">Likes</p>
                </div>
              </div>
            </div>

            {/* Viewers list */}
            <div className="overflow-y-auto px-4 sm:px-5 py-3 sm:py-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3">
                Viewed by ({viewsCount})
              </h4>
              {currentStatus.views && currentStatus.views.length > 0 ? (
                currentStatus.views.map((viewer) => {
                  const viewerData =
                    typeof viewer === "string"
                      ? { _id: viewer, name: "User", image: "" }
                      : viewer;
                  const hasLiked = currentStatus.likes?.some(
                    (like) =>
                      (typeof like === "string" ? like : like._id) ===
                      viewerData._id,
                  );
                  return (
                    <div
                      key={viewerData._id}
                      className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <img
                        src={viewerData.image || dp}
                        alt={viewerData.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/20 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base truncate">
                          {viewerData.name}
                        </h4>
                      </div>
                      {hasLiked && (
                        <FaHeart
                          size={16}
                          className="text-red-500 flex-shrink-0 sm:w-5 sm:h-5"
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-400 py-6 sm:py-8 text-sm sm:text-base">
                  No views yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStatus;
