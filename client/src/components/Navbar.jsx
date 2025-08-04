import React from "react";
import { assets } from "../assets/assets";

import { useAppContext } from "../context/AppContext";
const Navbar = () => {
  const { navigate, token } = useAppContext();

  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32 ">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="w-16 sm:w-16 cursor-pointer"
      />
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-3 hover:bg-secondary transition-all duratuion-300"
      >
        {token ? "Dashboard" : "Login"}
        <img src={assets.arrow} alt="arrow" className="w-3" />{" "}
      </button>
    </div>
  );
};

export default Navbar;
