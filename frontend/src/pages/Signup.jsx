import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../main";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/UserSlice";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [focused, setFocused] = useState({
    userName: false,
    email: false,
    password: false,
  });

  const passwordRef = useRef(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${ServerUrl}/api/auth/signup`,
        { userName, email, password },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      setUserName("");
      setEmail("");
      setPassword("");
      setLoading(false);
      setError("");
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || "Signup failed");
    }
  };

  const inputWithIcon = (
    Icon,
    value,
    setValue,
    placeholder,
    focusKey,
    type = "text",
  ) => (
    <div className="flex items-center w-full my-3 sm:my-4">
      <div className="mr-2 sm:mr-3 text-[#21C4D3] text-lg sm:text-xl flex-shrink-0">
        <Icon />
      </div>
      <div className="relative flex-1">
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused({ ...focused, [focusKey]: true })}
          onBlur={() => setFocused({ ...focused, [focusKey]: false })}
          ref={placeholder === "Password" ? passwordRef : null}
          className="peer w-full border border-gray-300 rounded-md px-3 sm:px-4 pt-4 sm:pt-5 pb-2 text-sm sm:text-base text-gray-900 placeholder-transparent focus:outline-none focus:border-[#21C4D3] focus:ring-1 focus:ring-[#21C4D3]/30"
        />
        <label
          className={`absolute left-3 sm:left-4 transition-all bg-white px-1 pointer-events-none
            ${
              focused[focusKey] || value
                ? "-top-2.5 text-xs sm:text-sm text-[#21C4D3]"
                : "top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base"
            }`}
        >
          {placeholder}
        </label>
        {placeholder === "Password" && (
          <span
            onClick={() => {
              setShowPassword((prev) => !prev);
              passwordRef.current.focus();
              setFocused({ ...focused, password: true });
            }}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#21C4D3] font-medium select-none text-xs sm:text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#e8fdff]">
      {/* Top Bar */}
      <div className="flex items-center px-4 py-3 sm:py-4 bg-[#21C4D3] shadow-md flex-shrink-0">
        <h2 className="flex-1 text-center text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Signup
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl p-5 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-5 sm:mb-6 text-[#21C4D3]">
            Welcome to <span className="text-[#189AA7]">Talkies</span>
          </h1>

          {error && (
            <div className="flex items-center justify-center bg-red-100 border border-red-300 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md mb-4 shadow-sm text-sm sm:text-base">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup}>
            {inputWithIcon(
              FaRegUserCircle,
              userName,
              setUserName,
              "Username",
              "userName",
            )}
            {inputWithIcon(MdOutlineMail, email, setEmail, "Email", "email")}
            {inputWithIcon(
              CiLock,
              password,
              setPassword,
              "Password",
              "password",
              showPassword ? "text" : "password",
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 sm:py-3 bg-[#189AA7] text-white font-semibold rounded-full hover:bg-[#21C4D3] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              {loading ? "Loading..." : "Signup"}
            </button>

            <p className="text-center text-gray-600 text-sm sm:text-base mt-3 sm:mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#21C4D3] font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
