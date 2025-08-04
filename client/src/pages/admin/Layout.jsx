import React, { use } from "react";
import { assets } from "../../assets/assets";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { axios, setToken, navigate } = useAppContext();
  const logout = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
    navigate("/");
  };
  return (
    <>
      <div className="flex justify-between items-center py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="logo"
          className="w-16 sm:w-16 cursor-pointer"
        />
        <button
          onClick={logout}
          className="text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer"
        >
          LogOut
        </button>
      </div>
      <div className="flex h-[calc(100vh-70px)]">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
