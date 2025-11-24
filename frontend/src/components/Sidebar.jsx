import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { FiSearch, FiEdit, FiUser, FiLogOut } from "react-icons/fi";
import { IoIosPersonAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../main";
import { setOtherUser, setSelectedUser, setUserData } from "../redux/UserSlice";
import NewContact from "./NewContact";
import { MdDeleteOutline } from "react-icons/md";
import logo from "../assets/logo.png"

const Sidebar = ({ messagebarRef }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    otherUsers = [],
    selectedUser,
    onlineUsers = [],
    socket,
    userData,
  } = useSelector((state) => state.user || {});

  const [search, setSearch] = useState("");
  const [popupSearch, setPopupSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchUsersIfEmpty = async () => {
      // Wait for userData
      if (!userData?._id) {
        console.log("⏳ Sidebar: Waiting for userData");
        return;
      }

      // Fetch if empty
      if (!Array.isArray(otherUsers) || otherUsers.length === 0) {
        console.log("🔄 Sidebar: Fetching users (empty)");
        try {
          const res = await axios.get(`${ServerUrl}/api/user/others`, {
            withCredentials: true,
          });
          console.log("✅ Sidebar: Users loaded:", res.data.length);
          dispatch(setOtherUser(res.data));
        } catch (err) {
          console.error("❌ Sidebar: Failed to fetch", err);
        }
      } else {
        console.log("✅ Sidebar: Users already present:", otherUsers.length);
      }
    };

    fetchUsersIfEmpty();
  }, [userData?._id, otherUsers.length, dispatch]);

  // ✅ Format date/time for display
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();

    const sameDay =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const formatWithAMPM = (d) =>
      d
        .toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace("am", "AM")
        .replace("pm", "PM");

    if (sameDay) return formatWithAMPM(date);
    if (isYesterday) return "Yesterday";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // ✅ Restore popup state
  useEffect(() => {
    try {
      const savedNewChat = JSON.parse(localStorage.getItem("showNewChat"));
      const savedAddContact = JSON.parse(
        localStorage.getItem("showAddContactForm")
      );
      if (savedNewChat) setShowNewChat(true);
      if (savedAddContact) setShowAddContactForm(true);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("showNewChat", JSON.stringify(showNewChat));
  }, [showNewChat]);

  useEffect(() => {
    localStorage.setItem(
      "showAddContactForm",
      JSON.stringify(showAddContactForm)
    );
  }, [showAddContactForm]);

  // ✅ Load conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/conversation`, {
          withCredentials: true,
        });
        if (Array.isArray(res.data)) setConversations(res.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  // ✅ SOCKET.IO — Handle new message + unread count + reorder
  useEffect(() => {
    if (!socket || !userData?._id) return;

    const handleNewMessage = (payload) => {
      const { messageData, conversationData } = payload || {};
      if (!messageData || !conversationData) return;

      const { sender, receiver, message, createdAt } = messageData;
      const targetId = sender === userData._id ? receiver : sender;

      // ⏫ Move chat to top
      setConversations((prev) => {
        let updated = [...prev];
        const index = updated.findIndex((c) =>
          c.participants?.some(
            (p) => p._id?.toString() === targetId?.toString()
          )
        );

        const newEntry = {
          participants: [{ _id: targetId }],
          lastMessage:
            conversationData?.lastMessage || message || "New message",
          updatedAt:
            conversationData?.updatedAt ||
            createdAt ||
            new Date().toISOString(),
        };

        if (index !== -1) {
          updated[index] = { ...updated[index], ...newEntry };
          const [moved] = updated.splice(index, 1);
          updated.unshift(moved);
        } else {
          updated.unshift(newEntry);
        }
        return updated;
      });

      // 🔢 Increase unread count (if this chat isn't open)
      if (selectedUser?._id !== targetId && sender !== userData._id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [targetId]: (prev[targetId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, userData, selectedUser]);

  // ✅ Reset unread when user opens chat
  useEffect(() => {
    if (selectedUser?._id) {
      setUnreadCounts((prev) => ({
        ...prev,
        [selectedUser._id]: 0,
      }));
    }
  }, [selectedUser]);

  // ✅ Merge users with conversations
  const mergedUsers = otherUsers
    .map((user) => {
      const convo = conversations.find((c) =>
        c.participants?.some((p) => p._id?.toString() === user._id?.toString())
      );
      return {
        ...user,
        lastMessage: convo?.lastMessage || "No message yet",
        updatedAt: convo?.updatedAt || "2000-01-01",
        unread: unreadCounts[user._id] || 0,
      };
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .filter((u) => u.userName?.toLowerCase().includes(search.toLowerCase()));

  // ✅ NEW: Filtered users for popup
  const filteredPopupUsers = otherUsers.filter((u) =>
    u.userName?.toLowerCase().includes(popupSearch.toLowerCase())
  );

  // ✅ Logout
  const handleLogout = async () => {
    try {
      if (socket) socket.emit("logout", userData._id);
      await axios.get(`${ServerUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUser([]));
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ✅ Deselect user on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        messagebarRef?.current &&
        !messagebarRef.current.contains(e.target)
      ) {
        dispatch(setSelectedUser(null));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch, messagebarRef]);

  // ✅ User Item with unread badge
  const renderUserItem = (user, onClickHandler, isPopup = false) => {
    const isOnline = onlineUsers.includes(user._id);
    return (
      <div
        key={user._id}
        className="flex items-center p-3 hover:bg-[#d2f3fa] cursor-pointer transition rounded-lg mx-2 my-1 justify-between"
      >
        <div className="flex items-center flex-1" onClick={onClickHandler}>
          <div className="relative">
            <img
              src={user.image || dp}
              alt={user.userName}
              className="w-12 h-12 rounded-full object-cover border-2"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
          </div>

          <div className="ml-3 flex-1 overflow-hidden">
            <h2 className="text-gray-800 font-medium truncate">
              {user.userName}
            </h2>

            {!isPopup && (
              <div className="flex justify-between items-start">
                <p
                  className="text-gray-500 text-sm flex-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-[140px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px]"
                  title={user.lastMessage}
                >
                  {user.lastMessage}
                </p>

                <div className="flex flex-col items-center ml-2">
                  {user.unread > 0 && (
                    <span className="bg-[#21C4D3] text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center mb-1">
                      {user.unread}
                    </span>
                  )}
                  <span className="text-gray-400 text-xs">
                    {user.updatedAt !== "2000-01-01"
                      ? formatTime(user.updatedAt)
                      : ""}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {isPopup && (
          <MdDeleteOutline
            size={22}
            className="text-red-500 hover:text-red-700 cursor-pointer ml-2"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(user);
              setShowDeleteModal(true);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      ref={sidebarRef}
      className={`w-full h-full lg:w-[30%] bg-white border-r border-[#189AA7] flex flex-col ${
        selectedUser ? "hidden lg:flex" : "flex"
      } transition-all duration-300 relative`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-[18px] bg-[#21C4D3] text-white shadow-md">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Talkies Logo"
            className="w-8 h-8 rounded-full"
          />
          <h1 className="text-xl font-bold">Talkies</h1>
        </div>
        <div className="flex items-center space-x-4">
          <FiEdit
            size={20}
            className="cursor-pointer hover:text-[#189AA7]"
            onClick={() => setShowNewChat(true)}
          />
          <button
            onClick={() => navigate("/profile")}
            className="hover:text-[#189AA7]"
          >
            <FiUser size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-4 bg-[#e8fdff]">
        <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-sm">
          <FiSearch className="text-[#21C4D3] text-lg mr-3" />
          <input
            type="text"
            placeholder="Search chats here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm text-gray-700 bg-transparent"
          />
        </div>
      </div>

      {/* CONTACT LIST */}
      <div className="flex-1 overflow-y-auto bg-[#e8fdff] h-full">
        {mergedUsers.length > 0 ? (
          mergedUsers.map((user) =>
            renderUserItem(user, () => dispatch(setSelectedUser(user)))
          )
        ) : (
          <p className="text-gray-500 text-center mt-5">No results found</p>
        )}
      </div>

      {/* NEW CHAT POPUP */}
      {showNewChat && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#e8fdff] shadow-lg rounded-r-xl">
          <div className="flex items-center justify-between p-4 bg-[#21C4D3] text-white shadow-md">
            <h2 className="text-lg font-semibold">Contacts</h2>
            <button
              onClick={() => {
                setShowNewChat(false);
                localStorage.removeItem("showNewChat");
              }}
              className="text-white text-xl hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col p-3 bg-[#e8fdff] gap-3">
            <button
              onClick={() => setShowAddContactForm(true)}
              className="flex items-center gap-2 bg-[#e8fdff] text-black px-4 py-2 rounded-lg mx-2 my-1 hover:bg-[#d2f3fa]"
            >
              <IoIosPersonAdd className="bg-white text-[#21C4D3] p-1.5 rounded-full text-[30px]" />
              Add Contact
            </button>
            <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm">
              <FiSearch className="text-[#21C4D3] text-sm mr-2" />
              <input
                type="text"
                placeholder="Search contacts"
                value={popupSearch}
                onChange={(e) => setPopupSearch(e.target.value)}
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
              />
            </div>
          </div>

          {/* ✅ NEW: Show "No results found" when filtered list is empty */}
          <div className="flex-1 overflow-y-auto bg-[#e8fdff] h-full">
            {filteredPopupUsers.length > 0 ? (
              filteredPopupUsers.map((user) =>
                renderUserItem(
                  user,
                  () => {
                    dispatch(setSelectedUser(user));
                    setShowNewChat(false);
                    localStorage.removeItem("showNewChat");
                  },
                  true
                )
              )
            ) : (
              <p className="text-gray-500 text-center mt-5">No results found</p>
            )}
          </div>
        </div>
      )}

      {showAddContactForm && (
        <NewContact
          onClose={() => setShowAddContactForm(false)}
          afterAdd={() => {
            setShowAddContactForm(false);
            setShowNewChat(false);
          }}
        />
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Delete Contact
            </h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-medium text-black">
                {deleteTarget.userName}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(
                      `${ServerUrl}/api/newcontact/${deleteTarget._id}`,
                      { withCredentials: true }
                    );
                    dispatch(
                      setOtherUser(
                        otherUsers.filter((u) => u._id !== deleteTarget._id)
                      )
                    );
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  } catch (err) {
                    alert(
                      err.response?.data?.message || "Failed to delete contact"
                    );
                  }
                }}
                className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
