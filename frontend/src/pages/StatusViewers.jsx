import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import axios from "axios";
import { ServerUrl } from "../main";
import dp from "../assets/dp.webp";

const StatusViewers = () => {
  const { statusId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatusDetails();
  }, [statusId]);

  const fetchStatusDetails = async () => {
    try {
      const res = await axios.get(`${ServerUrl}/api/status/${statusId}`, {
        withCredentials: true,
      });
      setStatus(res.data);
    } catch (error) {
      console.error("Error fetching status details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8fdff] flex items-center justify-center">
        <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-[#e8fdff] flex items-center justify-center">
        <p className="text-gray-600 text-sm sm:text-base">Status not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8fdff]">
      {/* Header */}
      <div className="flex items-center px-3 sm:px-4 py-3 sm:py-4 bg-[#21C4D3] text-white shadow-md">
        <IoIosArrowRoundBack
          size={26}
          className="cursor-pointer flex-shrink-0"
          onClick={() => navigate(-1)}
        />
        <h2 className="flex-1 text-center text-lg sm:text-xl font-semibold pr-6 sm:pr-8">
          Status Info
        </h2>
      </div>

      {/* Status preview */}
      <div className="bg-white mx-3 sm:mx-4 mt-3 sm:mt-4 rounded-xl shadow-md overflow-hidden">
        {status.image && (
          <img
            src={status.image}
            alt="Status"
            className="w-full h-40 sm:h-48 md:h-56 object-cover"
          />
        )}
        {status.caption && (
          <div className="px-3 sm:px-4 py-3">
            <p className="text-gray-800 text-sm sm:text-base">
              {status.caption}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mx-3 sm:mx-4 mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md text-center">
          <FiEye
            size={22}
            className="text-[#21C4D3] mx-auto mb-1.5 sm:w-6 sm:h-6"
          />
          <p className="text-xl sm:text-2xl font-bold text-gray-800">
            {status.views?.length || 0}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Views</p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md text-center">
          <FaHeart
            size={22}
            className="text-red-500 mx-auto mb-1.5 sm:w-6 sm:h-6"
          />
          <p className="text-xl sm:text-2xl font-bold text-gray-800">
            {status.likes?.length || 0}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Likes</p>
        </div>
      </div>

      {/* Viewers list */}
      <div className="mx-3 sm:mx-4 mt-3 sm:mt-4 mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
          Viewed by ({status.views?.length || 0})
        </h3>
        <div className="bg-white rounded-xl shadow-md divide-y divide-gray-100">
          {status.views?.map((viewer) => (
            <div
              key={viewer._id}
              className="flex items-center gap-3 p-3 sm:p-4"
            >
              <img
                src={viewer.image || dp}
                alt={viewer.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                  {viewer.name}
                </h4>
              </div>
              {status.likes?.some((like) => like._id === viewer._id) && (
                <FaHeart
                  size={16}
                  className="text-red-500 flex-shrink-0 sm:w-5 sm:h-5"
                />
              )}
            </div>
          ))}
          {(!status.views || status.views.length === 0) && (
            <p className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
              No views yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusViewers;
