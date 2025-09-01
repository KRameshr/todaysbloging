import React, { useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const features = [
  {
    icon: assets.star_icon,
    title: "AI-Powered Blogging",
    desc: "Leverage AI to generate content ideas, outlines, and suggestions instantly, saving you hours of planning.",
  },
  {
    icon: assets.dashboard_icon_1,
    title: "Intuitive Dashboard",
    desc: "Manage, edit, and publish blogs effortlessly with a clean and user-friendly interface.",
  },
  {
    icon: assets.dashboard_icon_2,
    title: "Responsive Design",
    desc: "Read and write blogs seamlessly on any device, from mobile to desktop.",
  },
];

const About = () => {
  const [readMore, setReadMore] = useState(false);
  const { token } = useAppContext();
  const navigate = useNavigate();

  const introText = `Today'sblog is the ultimate platform for sharing ideas, insights, and experiences. We empower writers to express themselves freely and connect with a global audience.`;
  const detailedText = ` Explore AI-powered content tools, responsive design, and a clean, user-friendly interface. Join our community, gain exposure, and inspire readers worldwide. At Today'sblog, your voice matters and your story deserves to be shared.`;

  return (
    <div>
      <Navbar />
      <div className="relative px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32  overflow-hidden">
        {/* Background Gradient & Shapes */}
        <motion.div
          className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute top-[-100px] left-[-100px] w-60 h-60 bg-primary/20 rounded-full blur-3xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute bottom-[-100px] right-[-100px] w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-bold text-blue-600 text-center m-8"
        >
          About Today'sblog
        </motion.h1>

        {/* Article */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12 text-gray-700 leading-relaxed text-justify"
        >
          <p>
            {introText}
            {readMore && detailedText}
          </p>
          <button
            onClick={() => setReadMore(!readMore)}
            className="mt-2 text-primary font-semibold hover:underline"
          >
            {readMore ? "Read Less" : "Read More"}
          </button>
        </motion.div>

        {/* Features */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-12 mb-4"
              />
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call-to-Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
            Join Our Community
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Start sharing your stories today. Connect with readers, grow your
            audience, and make an impact.
          </p>

          {/* Center the button */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate(token ? "/admin" : "/login")}
              className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-3 hover:bg-secondary transition-all duration-300 shadow-lg mb-5"
            >
              {token ? "Dashboard" : "Login"}
              <img src={assets.arrow} alt="arrow" className="w-3" />
            </button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
