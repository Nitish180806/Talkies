import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ServerUrl } from "../main";
import { setMessages } from "../redux/MessageSlice.js";

const useMessages = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);
  const { userData, selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    // ✅ Don’t run unless both userData and selectedUser exist
    if (!userData || !selectedUser || !selectedUser._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${ServerUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );
        dispatch(setMessages(res.data || []));
      } catch (err) {
        console.error("Error fetching messages:", err);
        dispatch(setMessages([])); // fallback empty
      }
    };

    fetchMessages();
  }, [userData, selectedUser?._id, dispatch]); // ✅ Safer dependency

  return messages;
};

export default useMessages;
