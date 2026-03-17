// customHooks/getCurrentUser.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ServerUrl } from "../main";
import { setUserData } from "../redux/UserSlice.js";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      // ✅ Skip if already loaded
      if (userData?._id) {
        console.log("✅ User data already exists");
        return;
      }

      try {
        console.log("🔄 Fetching current user...");

        const res = await axios.get(`${ServerUrl}/api/user/current`, {
          withCredentials: true,
        });

        // ✅ FIX: Backend returns user directly (not wrapped)
        console.log("📦 API Response:", res.data);

        if (!res.data || !res.data._id) {
          console.error("❌ Invalid user data:", res.data);
          return;
        }

        console.log("✅ Current user fetched:", res.data);
        dispatch(setUserData(res.data)); // ✅ Use res.data directly
      } catch (error) {
        console.error(
          "❌ Fetch User Error:",
          error.response?.data || error.message
        );
      }
    };

    fetchUser();
  }, [dispatch]); // ✅ Run only once
};

export default useCurrentUser;
