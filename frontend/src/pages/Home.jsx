import React, { useRef } from "react";
import Sidebar from "../components/Sidebar";
import Messagebar from "../components/Messagebar";

const Home = () => {
  const sidebarRef = useRef(null);
  const messagebarRef = useRef(null);

  return (
    <div className="w-full h-[100vh] flex">
      <Sidebar ref={sidebarRef} messagebarRef={messagebarRef} />
      <Messagebar ref={messagebarRef} sidebarRef={sidebarRef} />
    </div>
  );
};

export default Home;
