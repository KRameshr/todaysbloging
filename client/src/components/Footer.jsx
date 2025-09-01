import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import axios from "axios";

const handleInactive = (platform) => {
  alert(`⚠️ ${platform} account is not active yet!`);
};

const Footer = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/blog/latest/articles"
        );
        if (res.data.success) {
          setArticles(res.data.articles.slice(0, 5)); // only 5 latest
        }
      } catch (error) {
        console.error("❌ Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  const fallbackArticles = [
    { path: "/articles/all", title: "All" },
    { path: "/articles/technology", title: "Technology" },
    { path: "/articles/startup", title: "Startup" },
    { path: "/articles/lifestyle", title: "Lifestyle" },
    { path: "/articles/finance", title: "Finance" },
  ];

  return (
    <footer className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 pt-6 w-full bg-black text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-500/30 pb-6">
        {/* LEFT SIDE (Logo + Desc + Socials) */}
        <div className="flex flex-col gap-4 md:justify-between md:h-full">
          <img
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            src={assets.logo}
            alt="logo"
            className="h-8 sm:h-8 md:h-8 lg:h-8 cursor-pointer w-auto max-w-xs"
          />
          <p className="text-sm leading-relaxed text-white max-w-full md:max-w-sm">
            is a platform where you can find the latest news and articles on
            various topics. Stay updated with us!
          </p>

          {/* Social Icons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleInactive("Facebook")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-blue-600 transition"
            >
              <FaFacebookF size={12} />
            </button>
            <button
              onClick={() => handleInactive("Twitter")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-sky-500 transition"
            >
              <FaTwitter size={12} />
            </button>
            <button
              onClick={() => handleInactive("Instagram")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-pink-500 transition"
            >
              <FaInstagram size={12} />
            </button>
            <a
              href="https://www.linkedin.com/in/kurubaramesh/?trk=contact-info"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-blue-500 transition"
            >
              <FaLinkedinIn size={12} />
            </a>
            <a
              href="https://github.com/kRameshr/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-900 transition"
            >
              <FaGithub size={12} />
            </a>
          </div>
        </div>

        {/* RIGHT SIDE (Links + Articles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
          {/* Company Links */}
          <div>
            <h2 className="font-semibold mb-2 text-white">Company</h2>
            <ul className="text-sm space-y-1">
              <li>
                <Link
                  to="/"
                  className="hover:underline"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:underline"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:underline"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:underline"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Articles */}
          <div>
            {" "}
            <h2 className="font-semibold mb-4 text-white">Articles</h2>{" "}
            <ul
              className="text-sm space-y-2 flex-1"
              onClick={() => {
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {" "}
              {(articles.length > 0 ? articles : fallbackArticles).map(
                (article, idx) => (
                  <li key={idx}>
                    {" "}
                    <Link
                      to={article.path || "#"}
                      className="hover:underline"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      {" "}
                      {article.title}{" "}
                    </Link>{" "}
                  </li>
                )
              )}{" "}
            </ul>{" "}
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <p className="pt-4 text-center text-xs sm:text-sm pb-3 text-gray-400">
        &copy; {new Date().getFullYear()}{" "}
        <Link
          to="/"
          className="hover:underline text-blue-400"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Todaysblog.com
        </Link>{" "}
        All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
