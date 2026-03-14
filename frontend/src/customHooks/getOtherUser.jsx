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
      if (!userData?._id) return;
      if (otherUsers && otherUsers.length > 0) return;

      try {
        const res = await axios.get(`${ServerUrl}/api/user/others`, {
          withCredentials: true,
        });
        dispatch(setOtherUser(res.data));
      } catch (err) {
        dispatch(setOtherUser([]));
      }
    };

    fetchUsers();
  }, [userData?._id, dispatch]);

  return otherUsers || [];
};

export default useOtherUser;
