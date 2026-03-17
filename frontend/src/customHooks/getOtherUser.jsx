// customHooks/getOtherUser.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ServerUrl } from "../main";
import { setOtherUser } from "../redux/UserSlice.js";

const useOtherUser = () => {
  const dispatch = useDispatch();
  const { userData, otherUsers } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      // ✅ Wait for userData to be loaded
      if (!userData?._id) {
        console.log("⏳ Waiting for userData...");
        return;
      }

      // ✅ Skip if already loaded
      if (otherUsers && otherUsers.length > 0) {
        console.log("✅ Users already loaded:", otherUsers.length);
        return;
      }

      try {
        console.log("🔄 Fetching other users...");

        const res = await axios.get(`${ServerUrl}/api/user/others`, {
          withCredentials: true,
        });

        console.log("✅ Users fetched:", res.data.length);
        dispatch(setOtherUser(res.data));
      } catch (err) {
        console.error("❌ Error fetching users:", err);
        dispatch(setOtherUser([]));
      }
    };

    fetchUsers();
  }, [userData?._id, dispatch]); // ✅ Depend on userData._id

  return otherUsers || [];
};

export default useOtherUser;
