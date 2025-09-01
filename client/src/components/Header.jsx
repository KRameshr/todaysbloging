import React, { useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const { setInput, input, blogs } = useAppContext();
  const inputRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setInput(searchTerm);
    setShowSuggestions(false);
  };

  const onClear = () => {
    setInput("");
    setSearchTerm("");
    inputRef.current.value = "";
    setShowSuggestions(false);
  };

  // ✅ Filtered suggestions (max 10)
  const suggestions = blogs
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10);

  const onSuggestionClick = (title) => {
    setSearchTerm(title);
    setInput(title);
    setShowSuggestions(false);
  };

  // ✅ Highlight match inside suggestion
  const highlightMatch = (title) => {
    if (!searchTerm) return title;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return title.split(regex).map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="font-semibold text-primary">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative mx-4 sm:mx-16 xl:mx-24">
      <div className="text-center mt-16 mb-8">
        {/* Feature Badge */}
        <div className="inline-flex items-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary">
          <p>New: AI feature integrated</p>
          <img src={assets.star_icon} alt="New Feature" className="w-2.5" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-[4rem] text-gray-700">
          Your own <span className="text-primary">blogging</span>
          <br /> platform
        </h1>

        {/* Subtext */}
        <p className="my-6 sm:my-8 max-w-2xl mx-auto text-gray-600 max-sm:text-xs">
          🚀 Your custom text goes here...
        </p>

        {/* Search Form */}
        <form
          onSubmit={onSubmitHandler}
          className="relative max-w-lg mx-auto w-full"
        >
          <div className="flex justify-between border border-gray-300 bg-white rounded overflow-hidden max-sm:scale-90">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full pl-4 outline-none text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 sm:px-8 py-2 m-1.5 rounded hover:scale-105 transition-transform cursor-pointer text-sm sm:text-base"
            >
              Search
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && searchTerm && suggestions.length > 0 && (
            <ul
              className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto 
                 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              {suggestions.map((blog) => (
                <li
                  key={blog._id}
                  onClick={() => onSuggestionClick(blog.title)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm sm:text-base truncate"
                >
                  {highlightMatch(blog.title)}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      {/* Clear Button */}
      {input && (
        <div className="text-center mt-4">
          <button
            onClick={onClear}
            className="border text-xs sm:text-sm font-light py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer hover:bg-gray-50"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Background Gradient */}
      <img
        src={assets.gradientBackground}
        alt="Background Gradient"
        className="absolute -top-50 -z-10 opacity-50"
      />
    </div>
  );
};

export default Header;
