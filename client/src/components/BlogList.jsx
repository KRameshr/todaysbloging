import React, { useState } from "react";
import { blogCategories } from "../assets/assets";
import { motion } from "motion/react";
import BlogCard from "./BlogCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const { blogs, input } = useAppContext();

  const filteredBlogs = () => {
    if (input === "") return blogs;
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  const visibleBlogs = filteredBlogs()
    .filter((blog) => (menu === "All" ? true : blog.category === menu))
    .slice(0, showAll ? filteredBlogs().length : 12);

  return (
    <div className="px-4 sm:px-8 xl:px-40">
      {/* Mobile Dropdown for Categories */}
      <div className="sm:hidden my-6">
        <select
          value={menu}
          onChange={(e) => {
            setMenu(e.target.value);
            setShowAll(false);
          }}
          className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
        >
          {blogCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs for Categories */}
      <div className="hidden sm:flex justify-center gap-6 my-10 relative">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => {
                setMenu(item);
                setShowAll(false);
              }}
              className={`cursor-pointer text-gray-500 text-base relative z-10 px-3 py-1 ${
                menu === item && "text-white"
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layout="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-8 -z-10 bg-primary rounded-full"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8 mb-10">
        {visibleBlogs.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full py-10">
            No blogs found 🚀
          </p>
        ) : (
          visibleBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>

      {/* Show More / Show Less Button */}
      {filteredBlogs().length > 12 && visibleBlogs.length > 0 && (
        <div className="flex justify-center mb-16">
          <button
            onClick={() => setShowAll(!showAll)}
            className="p-2 sm:p-3 rounded-full bg-primary text-white hover:bg-primary/80 transition flex items-center justify-center"
          >
            {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
