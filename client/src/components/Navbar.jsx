import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { navigate, token } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  return (
    <div className="flex justify-between items-center h-20 px-4 sm:px-20 xl:px-32 bg-white shadow-sm relative">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="w-36 sm:w-40 cursor-pointer"
      />

      {/* Desktop Links */}
      <div className="hidden sm:flex gap-6 text-gray-700 font-medium items-center">
        {navLinks.map((link, i) => (
          <p
            key={i}
            onClick={() => navigate(link.path)}
            className="hover:text-primary transition cursor-pointer"
          >
            {link.name}
          </p>
        ))}
      </div>

      {/* Desktop Button */}
      <div className="hidden sm:flex">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-6 py-2 hover:bg-secondary transition-all duration-300"
        >
          {token ? "Dashboard" : "Login"}
          <img src={assets.arrow} alt="arrow" className="w-3" />
        </button>
      </div>

      {/* Mobile Hamburger */}
      <div className="sm:hidden flex items-center">
        {" "}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1 w-6 h-6 justify-center cursor-pointer"
        >
          {!menuOpen ? (
            // Hamburger icon (default initial)
            <>
              <span className="block h-0.5 bg-gray-700 rounded w-full"></span>
              <span className="block h-0.5 bg-gray-700 rounded w-full"></span>
              <span className="block h-0.5 bg-gray-700 rounded w-full"></span>
            </>
          ) : (
            // Close (X) icon
            <span className="text-2xl font-bold text-gray-700">✕</span>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center text-center gap-4 p-4 sm:hidden z-50">
          {navLinks.map((link, i) => (
            <p
              key={i}
              onClick={() => {
                navigate(link.path);
                setMenuOpen(false);
              }}
              className="hover:text-primary transition cursor-pointer w-full"
            >
              {link.name}
            </p>
          ))}
          <button
            onClick={() => {
              navigate("/admin");
              setMenuOpen(false);
            }}
            className="flex justify-center items-center gap-2 rounded-full text-xs sm:text-sm cursor-pointer bg-primary text-white px-3 py-3 hover:bg-secondary transition-all duration-300 w-full max-w-[120px]"
          >
            {token ? "Dashboard" : "Login"}
            <img src={assets.arrow} alt="arrow" className="w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
