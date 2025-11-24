import React from "react";
import Sidebar from "../components/Sidebar";
import Messagebar from "../components/Messagebar";
import { useSelector } from "react-redux";
import getMessages from "../customHooks/getMessages";

const Home = () => {
  const { selectedUser } = useSelector((state) => state.user);
   const messages = getMessages(); // ← correct usage
  return (
    <div className="w-full h-[100vh] flex">
      <Sidebar />
      <Messagebar />
    </div>
  );
};

export default Home;
