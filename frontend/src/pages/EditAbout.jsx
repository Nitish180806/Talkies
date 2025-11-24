import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/UserSlice";
import { ServerUrl } from "../main";
import { IoIosArrowRoundBack } from "react-icons/io";

const EditAbout = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [about, setAbout] = useState(userData?.about || "");
  const [saving, setSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);

    if (!about || about.trim().length < 2) {
      setError("About must be at least 2 characters.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("about", about.trim());

      const result = await axios.put(
        `${ServerUrl}/api/user/profile`,
        formData,
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      localStorage.setItem("userData", JSON.stringify(result.data));

      setSaving(false);
      navigate("/profile");
    } catch (error) {
      console.error("Error updating about:", error);

      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message;

      setError(serverMessage || "Failed to update about. Try again.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8fdff] flex flex-col items-center">
      {/* Top Bar - Responsive */}
      <div className="w-full flex items-center p-3 bg-[#21C4D3] shadow-md">
        <IoIosArrowRoundBack
          size={26}
          className="text-white cursor-pointer sm:w-7 sm:h-7"
          onClick={() => navigate("/profile")}
        />
        <h2 className="flex-1 text-center text-2xl sm:text-3xl font-semibold text-white">
          About
        </h2>
      </div>

      {/* Form Section - Responsive */}
      <form
        onSubmit={handleSave}
        className="w-full max-w-[90%] sm:max-w-md mt-8 sm:mt-16 bg-white rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[500px] sm:h-[600px]"
      >
        {/* About Floating Input */}
        <div className="relative w-full my-4">
          <input
            type="text"
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="About"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="peer w-full border border-gray-300 rounded-md px-3 sm:px-4 pt-4 sm:pt-5 pb-2 text-sm sm:text-base text-gray-900 placeholder-transparent focus:outline-none focus:border-[#21C4D3]"
          />
          <label
            htmlFor="about"
            className={`absolute left-3 sm:left-4 transition-all bg-white px-1 pointer-events-none
              ${
                isFocused || about
                  ? "-top-2.5 text-xs sm:text-sm text-[#21C4D3]"
                  : "top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base"
              }`}
          >
            About
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-xs sm:text-sm mt-1 text-center">
            {error}
          </p>
        )}

        <div className="mt-1 text-gray-500 text-xs sm:text-sm">
          This will be visible on your profile. Keep it short and meaningful!
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 sm:py-3 bg-[#189AA7] text-white font-semibold rounded-full hover:bg-[#21C4D3] transition-colors mt-auto text-sm sm:text-base"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditAbout;
