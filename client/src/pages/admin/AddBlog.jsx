import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import { parse } from "marked";
import toast from "react-hot-toast";
import { assets, blogCategories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const AddBlog = () => {
  const { axios } = useAppContext();

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [subtitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loding, setLoding] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // 🔹 Quill editor init
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  // 🔹 Generate blog content with AI
  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title first.");
    try {
      setLoding(true);
      const { data } = await axios.post("/api/blog/generate", {
        prompt: title,
      });

      if (data.success && !data.content.includes("AI generation failed")) {
        const parsedHtml = parse(data.content.trim())
          .replace(/<p><br><\/p>/g, "")
          .replace(/\n/g, "");

        quillRef.current.root.innerHTML = parsedHtml;
      } else {
        toast.error(data.message || "AI failed to generate content.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoding(false);
    }
  };

  // 🔹 Submit blog to server
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsAdding(true);
      const blog = {
        title,
        subtitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };
      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData);
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setTitle("");
        setSubTitle("");
        setCategory("");
        setIsPublished(false);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Error adding blog");
    } finally {
      setIsAdding(false);
    }
  };

  // 🔹 Fetch AI title suggestions
  const fetchTitleSuggestions = async (input) => {
    if (!input.trim()) {
      setTitleSuggestions([]);
      return;
    }
    try {
      const { data } = await axios.post("/api/blog/suggest", { prompt: input });
      if (data.success) {
        setTitleSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error("Suggestion error:", error.message);
    }
  };

  // 🔹 On typing title
  const handleTitleChange = (e) => {
    const input = e.target.value;
    setTitle(input);
    fetchTitleSuggestions(input);
  };

  // 🔹 On selecting suggestion
  const handleSuggestionClick = (suggestion) => {
    setTitle(suggestion);
    setTitleSuggestions([]);
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        {/* 🔸 Upload image */}
        <label htmlFor="image">
          <p>Upload thumbnail</p>
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt="Thumbnail"
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        {/* 🔸 Blog Title with Suggestions */}
        <label htmlFor="title" className="mt-4 block">
          Blog Title
        </label>
        <div className="relative">
          <input
            id="title"
            type="text"
            placeholder="Type here"
            required
            className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
            onChange={handleTitleChange}
            value={title}
          />
          {titleSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow mt-1 w-full max-w-lg">
              {titleSuggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔸 Sub Title */}
        <label htmlFor="subtitle" className="mt-4 block">
          Sub title
        </label>
        <input
          id="subtitle"
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subtitle}
        />

        {/* 🔸 Blog Description */}
        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          {loding && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}
          <button
            disabled={loding}
            type="button"
            onClick={generateContent}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
          >
            Generate with AI
          </button>
        </div>

        {/* 🔸 Category */}
        <p className="mt-4">Blog Category</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
          required
        >
          <option value="">Select category</option>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* 🔸 Publish Now */}
        <div className="flex gap-2 mt-4 items-center">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            className="scale-125 cursor-pointer"
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        {/* 🔸 Submit */}
        <button
          disabled={isAdding}
          className="mt-6 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-50"
          type="submit"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
