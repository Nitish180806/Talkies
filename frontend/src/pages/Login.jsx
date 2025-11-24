import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../main";
import { useDispatch } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/UserSlice";
import { IoIosArrowRoundBack } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [focused, setFocused] = useState({
    email: false,
    password: false,
  });

  const passwordRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${ServerUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      dispatch(setSelectedUser(null));
      setEmail("");
      setPassword("");
      setLoading(false);
      setError("");
      navigate("/");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  const inputWithIcon = (
    Icon,
    value,
    setValue,
    placeholder,
    focusKey,
    type = "text"
  ) => (
    <div className="flex items-center w-full my-4">
      {/* Icon on the left */}
      <div className="mr-3 text-[#21C4D3] text-xl sm:text-2xl">
        <Icon />
      </div>

      {/* Input field */}
      <div className="relative flex-1">
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused({ ...focused, [focusKey]: true })}
          onBlur={() => setFocused({ ...focused, [focusKey]: false })}
          ref={placeholder === "Password" ? passwordRef : null}
          className="peer w-full border border-gray-300 rounded-md px-4 pt-5 pb-2 text-gray-900 placeholder-transparent focus:outline-none focus:border-[#21C4D3] text-sm sm:text-base"
        />
        <label
          className={`absolute left-4 transition-all bg-white px-1
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
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#21C4D3] font-medium select-none text-sm sm:text-base"
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
      <div className="flex items-center p-3 sm:p-4 bg-[#21C4D3] shadow-md flex-shrink-0">
        <h2 className="flex-1 text-center text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Login
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-[#21C4D3]">
            Login to <span className="text-[#189AA7]">Talkies</span>
          </h1>

          {error && (
            <div className="flex items-center justify-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md mb-4 shadow-md animate-fadeIn text-sm sm:text-base">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {inputWithIcon(MdOutlineMail, email, setEmail, "Email", "email")}
            {inputWithIcon(
              CiLock,
              password,
              setPassword,
              "Password",
              "password",
              showPassword ? "text" : "password"
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-[#189AA7] text-white font-semibold rounded-full hover:bg-[#21C4D3] transition-colors text-sm sm:text-base"
            >
              {loading ? "Loading..." : "Login"}
            </button>

            <p className="text-center text-gray-600 text-sm sm:text-base mt-3">
              Create new account!{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-[#21C4D3] font-medium cursor-pointer hover:underline"
              >
                Signup
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
