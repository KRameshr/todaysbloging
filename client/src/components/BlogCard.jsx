import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full rounded-lg overflow-hidden shadow hover:scale-[1.02] hover:shadow-primary/25 duration-300 cursor-pointer bg-white"
    >
      {/* Blog Image */}
      <img
        src={image}
        alt={title}
        className="w-full aspect-video object-cover"
      />

      {/* Category */}
      <span className="ml-4 mt-3 px-2 sm:px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-[10px] sm:text-xs">
        {category}
      </span>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h5 className="mb-1 font-semibold text-gray-900 text-sm sm:text-base md:text-lg">
          {title}
        </h5>
        <p
          className="mb-2 text-xs sm:text-sm text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 80) }}
        ></p>
      </div>
    </div>
  );
};

export default BlogCard;
