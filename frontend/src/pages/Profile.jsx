import React, { useState, useRef, useEffect } from "react";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/UserSlice";
import { ServerUrl } from "../main";

const Profile = () => {
  const { userData, socket } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [about, setAbout] = useState(userData?.about || "");
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [prevImg, setPrevImg] = useState(false);
  const image = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/user/current`, {
          withCredentials: true,
        });
        if (res.data) {
          localStorage.setItem("userData", JSON.stringify(res.data));
          dispatch(setUserData(res.data));
          setName(res.data.name);
          setAbout(res.data.about);
          setFrontendImage(res.data.image || dp);
        } else {
          localStorage.removeItem("userData");
          dispatch(setUserData(null));
          navigate("/login");
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 404) {
          localStorage.removeItem("userData");
          dispatch(setUserData(null));
          navigate("/login");
        }
      }
    };
    fetchUserData();
  }, [dispatch, navigate]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("about", about);
      if (backendImage) formData.append("image", backendImage);
      const res = await axios.put(`${ServerUrl}/api/user/profile`, formData, {
        withCredentials: true,
      });
      dispatch(setUserData(res.data));
      localStorage.setItem("userData", JSON.stringify(res.data));
      if (socket) socket.emit("profileUpdated", res.data);
      setSaving(false);
      navigate("/");
    } catch (error) {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#e8fdff] flex flex-col overflow-hidden">
      <div className="flex items-center px-3 sm:px-4 py-3 sm:py-4 bg-[#21C4D3] shadow-md flex-shrink-0">
        <IoIosArrowRoundBack
          size={26}
          className="text-white cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        />
        <h2 className="flex-1 text-center text-xl sm:text-2xl md:text-3xl font-bold text-white pr-6 sm:pr-8">
          Profile
        </h2>
      </div>

      <div className="flex-1 flex flex-col items-center overflow-y-auto py-5 sm:py-8 px-4">
        <div className="flex flex-col items-center mb-5 sm:mb-6">
          <img
            src={frontendImage}
            alt="Profile"
            className="cursor-pointer w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#21C4D3] shadow-lg hover:opacity-90 transition-opacity"
            onClick={() => setPrevImg(true)}
          />
          <button
            type="button"
            onClick={() => image.current.click()}
            className="mt-3 text-[#21C4D3] text-sm sm:text-base font-medium cursor-pointer hover:underline transition-colors"
          >
            Edit Image
          </button>
          <input
            type="file"
            ref={image}
            hidden
            accept="image/*"
            onChange={handleImage}
          />
        </div>

        <form
          onSubmit={handleProfile}
          className="w-full max-w-[95%] sm:max-w-md md:max-w-lg bg-white rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 mb-4"
        >
          <div
            className="flex flex-col bg-gray-50 rounded-xl p-3 sm:p-4 cursor-pointer hover:bg-[#f0f8ff] transition-colors"
            onClick={() => navigate("/editName")}
          >
            <label className="text-gray-400 text-xs sm:text-sm">Name</label>
            <span className="text-gray-900 text-sm sm:text-base mt-1 break-words">
              {name || "—"}
            </span>
          </div>

          <div
            className="flex flex-col bg-gray-50 rounded-xl p-3 sm:p-4 cursor-pointer hover:bg-[#f0f8ff] transition-colors"
            onClick={() => navigate("/editAbout")}
          >
            <label className="text-gray-400 text-xs sm:text-sm">About</label>
            <span className="text-gray-900 text-sm sm:text-base mt-1 break-words">
              {about || "—"}
            </span>
          </div>

          <div className="flex flex-col px-3 sm:px-4 py-2">
            <label className="text-gray-400 text-xs sm:text-sm mb-1">
              Phone
            </label>
            <div className="text-gray-900 text-sm sm:text-base">
              +91 XXXXX-XXXXX
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 sm:py-3 bg-[#189AA7] text-white font-semibold rounded-full hover:bg-[#21C4D3] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {prevImg && (
        <div
          onClick={() => setPrevImg(false)}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <img
            src={frontendImage}
            alt="Preview"
            className="max-h-[85vh] max-w-[95vw] sm:max-h-[90vh] sm:max-w-[90vw] rounded-lg shadow-lg object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
