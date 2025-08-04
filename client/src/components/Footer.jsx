import React from "react";
import { assets, footer_data } from "../assets/assets";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
        <div>
          <img
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            src={assets.logo}
            alt="logo"
            className="w-16 sm:w-16 cursor-pointer"
          />

          <p className="max-w-[410px] mt-6">
            Today'sblog is a platform where you can find the latest news and
            articles on various topics. Stay updated with us!
          </p>
        </div>
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a className="hover:underline transition" href="">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        {" "}
        Copyright {year} &copy; Today'sblog - All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
