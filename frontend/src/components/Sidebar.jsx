import React, { useState, useRef, useEffect, forwardRef } from "react";
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
import { BsPinAngleFill, BsPinAngle } from "react-icons/bs";
import logo from "../assets/logo.png";
import StatusList from "./StatusList";

const Sidebar = forwardRef(({ messagebarRef }, ref) => {
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
  const [pinnedChats, setPinnedChats] = useState([]);
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    userId: null,
  });

  const sidebarRef = ref || useRef(null);
  const contextMenuRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pinnedChats") || "[]");
      setPinnedChats(saved);
    } catch (e) {
      setPinnedChats([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pinnedChats", JSON.stringify(pinnedChats));
  }, [pinnedChats]);

  const togglePin = (userId) => {
    setPinnedChats((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
    setContextMenu({ show: false, x: 0, y: 0, userId: null });
  };

  const handleContextMenu = (e, userId) => {
    e.preventDefault();
    const rect = sidebarRef.current.getBoundingClientRect();
    // Clamp so menu doesn't go off-screen
    const menuWidth = 160;
    const menuHeight = 56;
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (x + menuWidth > rect.width) x = rect.width - menuWidth - 4;
    if (y + menuHeight > rect.height) y = rect.height - menuHeight - 4;
    setContextMenu({ show: true, x, y, userId });
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target)
      ) {
        setContextMenu({ show: false, x: 0, y: 0, userId: null });
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const fetchUsersIfEmpty = async () => {
      if (!userData?._id) return;
      if (!Array.isArray(otherUsers) || otherUsers.length === 0) {
        try {
          const res = await axios.get(`${ServerUrl}/api/user/others`, {
            withCredentials: true,
          });
          dispatch(setOtherUser(res.data));
        } catch (err) {}
      }
    };
    fetchUsersIfEmpty();
  }, [userData?._id, otherUsers.length, dispatch]);

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

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/conversation`, {
          withCredentials: true,
        });
        if (Array.isArray(res.data)) setConversations(res.data);
      } catch (error) {}
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket || !userData?._id) return;
    const handleNewMessage = (payload) => {
      const { messageData, conversationData } = payload || {};
      if (!messageData || !conversationData) return;
      const { sender, receiver, message, createdAt } = messageData;
      const targetId = sender === userData._id ? receiver : sender;
      setConversations((prev) => {
        let updated = [...prev];
        const index = updated.findIndex((c) =>
          c.participants?.some(
            (p) => p._id?.toString() === targetId?.toString(),
          ),
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

  useEffect(() => {
    if (selectedUser?._id) {
      setUnreadCounts((prev) => ({ ...prev, [selectedUser._id]: 0 }));
    }
  }, [selectedUser]);

  const mergedUsers = otherUsers
    .map((user) => {
      const convo = conversations.find((c) =>
        c.participants?.some((p) => p._id?.toString() === user._id?.toString()),
      );
      return {
        ...user,
        lastMessage: convo?.lastMessage || "No message yet",
        updatedAt: convo?.updatedAt || "2000-01-01",
        unread: unreadCounts[user._id] || 0,
        isPinned: pinnedChats.includes(user._id),
      };
    })
    .filter((u) => u.userName?.toLowerCase().includes(search.toLowerCase()));

  const pinnedUsers = mergedUsers
    .filter((u) => u.isPinned)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const unpinnedUsers = mergedUsers
    .filter((u) => !u.isPinned)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const sortedUsers = [...pinnedUsers, ...unpinnedUsers];

  const filteredPopupUsers = otherUsers.filter((u) =>
    u.userName?.toLowerCase().includes(popupSearch.toLowerCase()),
  );

  const handleLogout = async () => {
    try {
      if (socket) socket.emit("logout", userData._id);
      await axios.get(`${ServerUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUser([]));
      navigate("/login");
    } catch (error) {}
  };

  const renderUserItem = (user, onClickHandler, isPopup = false) => {
    const isOnline = onlineUsers.includes(user._id);
    return (
      <div
        key={user._id}
        className="flex items-center px-2 sm:px-3 py-2 sm:py-2.5 hover:bg-[#d2f3fa] cursor-pointer transition rounded-lg mx-1.5 sm:mx-2 my-0.5 sm:my-1 justify-between relative"
        onContextMenu={(e) => !isPopup && handleContextMenu(e, user._id)}
      >
        <div
          className="flex items-center flex-1 min-w-0"
          onClick={onClickHandler}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={user.image || dp}
              alt={user.userName}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-100"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>

          {/* Info */}
          <div className="ml-2 sm:ml-3 flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h2 className="text-gray-800 font-medium text-sm sm:text-base truncate">
                {user.userName}
              </h2>
              {!isPopup && user.isPinned && (
                <BsPinAngleFill className="text-[#21C4D3] text-xs flex-shrink-0" />
              )}
            </div>

            {!isPopup && (
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-gray-500 text-xs sm:text-sm truncate flex-1 mr-2 max-w-[120px] sm:max-w-[160px] md:max-w-[180px]">
                  {user.lastMessage}
                </p>
                <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                  {user.unread > 0 && (
                    <span className="bg-[#21C4D3] text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                      {user.unread}
                    </span>
                  )}
                  <span className="text-gray-400 text-[10px] sm:text-xs whitespace-nowrap">
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
            size={20}
            className="text-red-500 hover:text-red-700 cursor-pointer ml-2 flex-shrink-0"
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
      } transition-all duration-300 relative overflow-hidden`}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-[18px] bg-[#21C4D3] text-white shadow-md flex-shrink-0">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Talkies Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
          />
          <h1 className="text-lg sm:text-xl font-bold">Talkies</h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <FiEdit
            size={18}
            className="cursor-pointer hover:text-[#d4f7fb] transition-colors"
            onClick={() => setShowNewChat(true)}
          />
          <button
            onClick={() => navigate("/profile")}
            className="hover:text-[#d4f7fb] transition-colors"
          >
            <FiUser size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="text-red-300 hover:text-red-200 transition-colors"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-4 bg-[#e8fdff] flex-shrink-0">
        <div className="flex items-center bg-white border border-[#21C4D3] rounded-full px-3 sm:px-4 py-2 sm:py-3 gap-2">
          <FiSearch className="text-[#21C4D3] text-base sm:text-lg flex-shrink-0" />
          <input
            type="text"
            placeholder="Search chats here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-xs sm:text-sm text-gray-500 bg-transparent"
          />
        </div>
      </div>

      {/* ── Contact list ── */}
      <div className="flex-1 overflow-y-auto bg-[#e8fdff]">
        <StatusList />
        {sortedUsers.length > 0 ? (
          sortedUsers.map((user) =>
            renderUserItem(user, () => dispatch(setSelectedUser(user))),
          )
        ) : (
          <p className="text-gray-400 text-sm text-center mt-6">
            No results found
          </p>
        )}
      </div>

      {/* ── Context menu ── */}
      {contextMenu.show && (
        <div
          ref={contextMenuRef}
          className="absolute bg-white shadow-lg rounded-lg py-1.5 z-50 min-w-[150px] border border-gray-200"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => togglePin(contextMenu.userId)}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 text-sm"
          >
            {pinnedChats.includes(contextMenu.userId) ? (
              <>
                <BsPinAngle className="text-[#21C4D3]" />
                Unpin Chat
              </>
            ) : (
              <>
                <BsPinAngleFill className="text-[#21C4D3]" />
                Pin Chat
              </>
            )}
          </button>
        </div>
      )}

      {/* ── New chat popup ── */}
      {showNewChat && (
        <div className="absolute inset-0 z-50 flex flex-col bg-[#e8fdff]">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-[#21C4D3] text-white shadow-md flex-shrink-0">
            <h2 className="text-base sm:text-lg font-semibold">Contacts</h2>
            <button
              onClick={() => setShowNewChat(false)}
              className="text-white text-xl hover:text-gray-200 transition-colors p-1"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col px-2 sm:px-3 pt-2 sm:pt-3 bg-[#e8fdff] gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setShowAddContactForm(true)}
              className="flex items-center gap-2 bg-[#e8fdff] text-black px-3 sm:px-4 py-2 rounded-lg mx-1 hover:bg-[#d2f3fa] transition-colors text-sm sm:text-base"
            >
              <IoIosPersonAdd className="bg-white text-[#21C4D3] p-1.5 rounded-full text-[26px] sm:text-[30px]" />
              Add Contact
            </button>
            <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm mx-1">
              <FiSearch className="text-[#21C4D3] text-sm mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search contacts"
                value={popupSearch}
                onChange={(e) => setPopupSearch(e.target.value)}
                className="w-full outline-none text-xs sm:text-sm text-gray-700 bg-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#e8fdff]">
            {filteredPopupUsers.length > 0 ? (
              filteredPopupUsers.map((user) =>
                renderUserItem(
                  user,
                  () => {
                    dispatch(setSelectedUser(user));
                    setShowNewChat(false);
                  },
                  true,
                ),
              )
            ) : (
              <p className="text-gray-400 text-sm text-center mt-6">
                No results found
              </p>
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

      {/* ── Delete modal ── */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-[320px] sm:max-w-sm text-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Delete Contact
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Are you sure you want to delete{" "}
              <span className="font-medium text-black">
                {deleteTarget.userName}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="px-4 sm:px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-sm sm:text-base transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(
                      `${ServerUrl}/api/newcontact/${deleteTarget._id}`,
                      { withCredentials: true },
                    );
                    dispatch(
                      setOtherUser(
                        otherUsers.filter((u) => u._id !== deleteTarget._id),
                      ),
                    );
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  } catch (err) {
                    alert(
                      err.response?.data?.message || "Failed to delete contact",
                    );
                  }
                }}
                className="px-4 sm:px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm sm:text-base transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
