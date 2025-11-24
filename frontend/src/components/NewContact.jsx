import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import axios from "axios";
import { ServerUrl } from "../main";
import { setOtherUser } from "../redux/UserSlice";

const NewContact = ({ onClose, afterAdd }) => {
  const dispatch = useDispatch();
  const { currentUser, otherUsers } = useSelector((state) => state.user);

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [focused, setFocused] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  const handleAddContact = async () => {
    if (!newContact.name.trim()) return alert("Please fill Name");
    if (!newContact.email.trim()) return alert("Please fill Email");
    if (!newContact.password.trim()) return alert("Please fill Password");

    try {
      const res = await axios.post(`${ServerUrl}/api/auth/signup`, {
        userName: newContact.name,
        email: newContact.email,
        password: newContact.password,
      });

      const userData = res.data?.user || res.data;
      if (!userData) throw new Error("Invalid response from server");

      if (userData._id === currentUser?._id) {
        alert("You cannot add yourself as a contact!");
        return;
      }

      const cleanedName = userData.userName
        ? userData.userName.replace(/\s*\(.*?\)\s*$/, "")
        : newContact.name;

      const userToAdd = {
        _id: userData._id,
        userName: cleanedName,
        image: userData.image || "",
      };

      if (otherUsers.some((u) => u._id === userToAdd._id)) {
        alert("This user is already in your contacts!");
        return;
      }

      // ✅ Add new user to Redux at the top of the list
      dispatch(setOtherUser([userToAdd, ...otherUsers]));
      setNewContact({ name: "", email: "", password: "" });
      onClose();
      if (afterAdd) afterAdd();
    } catch (error) {
      console.error("Error while creating contact:", error);
      alert(error.response?.data?.message || "Failed to add contact");
    }
  };

  const inputField = (
    icon,
    value,
    setValue,
    placeholder,
    focusKey,
    type = "text"
  ) => (
    <div className="relative w-full flex items-center">
      <div className="flex-shrink-0 w-10 sm:w-12 flex justify-center text-xl sm:text-2xl">
        {icon}
      </div>

      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused({ ...focused, [focusKey]: true })}
        onBlur={() => setFocused({ ...focused, [focusKey]: false })}
        className="bg-transparent peer flex-1 border border-gray-300 rounded-md pl-2 sm:pl-3 py-2.5 sm:py-3 pr-14 sm:pr-16 text-sm sm:text-base
         focus:outline-none focus:border-[#21C4D3] focus:ring-1 focus:ring-[#21C4D3]"
        ref={placeholder === "Password" ? passwordRef : null}
      />

      <label
        className={`absolute left-12 sm:left-14 bg-[#e8fdff] px-1 transition-all pointer-events-none
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
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 cursor-pointer text-[#21C4D3] font-medium select-none text-xs sm:text-sm"
        >
          {showPassword ? "Hide" : "Show"}
        </span>
      )}
    </div>
  );

  return (
    <div className="absolute inset-0 z-[60] flex flex-col bg-[#e8fdff]">
      <div className="flex items-center justify-between p-3 sm:p-4 bg-[#21C4D3] text-white">
        <h2 className="text-base sm:text-lg font-semibold">
          Create New Contact
        </h2>
        <button
          onClick={onClose}
          className="text-white text-xl sm:text-2xl hover:text-gray-200 transition"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col px-3 sm:px-4 mt-4 sm:mt-6 gap-4 sm:gap-5">
        {inputField(
          <FaRegUserCircle className="text-[rgb(33,196,211)]" />,
          newContact.name,
          (val) => setNewContact({ ...newContact, name: val }),
          "Name",
          "name"
        )}
        {inputField(
          <MdOutlineMail className="text-[rgb(33,196,211)]" />,
          newContact.email,
          (val) => setNewContact({ ...newContact, email: val }),
          "Email",
          "email"
        )}
        {inputField(
          <CiLock className="text-[#21C4D3]" />,
          newContact.password,
          (val) => setNewContact({ ...newContact, password: val }),
          "Password",
          "password",
          showPassword ? "text" : "password"
        )}
      </div>

      <div className="flex flex-col px-3 sm:px-4 mt-auto gap-3 mb-3 sm:mb-4">
        <button
          onClick={handleAddContact}
          className="w-full py-2.5 sm:py-3 rounded-lg bg-[#21C4D3] text-white hover:bg-[#1db8c4] transition text-sm sm:text-base font-medium"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default NewContact;
