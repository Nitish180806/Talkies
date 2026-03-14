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
      if (userData?._id) return;

      try {
        const res = await axios.get(`${ServerUrl}/api/user/current`, {
          withCredentials: true,
        });
        if (!res.data || !res.data._id) return;
        dispatch(setUserData(res.data));
      } catch (error) {
        // silently fail — user not logged in
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useCurrentUser;
