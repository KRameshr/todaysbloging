import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("⚠️ Please enter your email!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("❌ Invalid email address!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/newsletter/subscribe`,
        { email }
      );

      if (data.success) {
        toast.success("✅ Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center space-y-4 my-20 px-4 sm:px-6 md:px-16"
      whileHover={{ scale: 1.03, boxShadow: "0px 8px 24px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
        Never Miss a Blog!
      </h1>
      <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-xl">
        Subscribe to get the latest blogs, tech updates, and exclusive news.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 mt-4 px-2"
      >
        <motion.input
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full sm:flex-1 h-12 sm:h-14 md:h-16 
               px-4 text-base md:text-lg 
               border border-gray-300 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="h-12 sm:h-14 md:h-16 w-full sm:w-auto 
               px-6 sm:px-8 md:px-10 
               text-base md:text-lg font-medium text-white 
               bg-primary hover:bg-primary/90 rounded-md 
               transition-all disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Newsletter;
