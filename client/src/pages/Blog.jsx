import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Moment from "moment";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Blog = () => {
  const { id } = useParams();
  const { axios } = useAppContext();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);

  // Fetch blog data
  const fetchBlogData = async () => {
    try {
      const response = await axios.get(`/api/blog/${id}`);
      if (response.data.success) setData(response.data.blog);
      else toast.error(response.data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await axios.post("/api/blog/comments", { blogId: id });
      if (response.data.success) setComments(response.data.comments);
      else toast.error(response.data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Add comment
  const addComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/blog/add-comment", {
        blog: id,
        name,
        content,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setContent("");
        fetchComments();
      } else toast.error(response.data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch AI-generated resources
  const fetchResources = async (blogData) => {
    setResourcesLoading(true);
    try {
      const { data } = await axios.post("/api/blog/generate-resources", {
        title: blogData.title,
        description: blogData.description,
      });
      if (data.success && data.resources) setResources(data.resources);
      else setResources([]);
    } catch (err) {
      console.error("Error fetching resources:", err.message);
      setResources([]);
    } finally {
      setResourcesLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, []);

  useEffect(() => {
    if (data) fetchResources(data);
  }, [data]);

  if (!data) return <Loader />;

  return (
    <div className="relative">
      <Navbar />

      {/* Blog Header */}
      <div className="mt-16 px-4 sm:px-6 text-center text-gray-700 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mt-2">
          {data.title}
        </h1>
        {data.subTitle && (
          <h2 className="my-2 text-gray-500 text-base sm:text-lg">
            {data.subTitle}
          </h2>
        )}
      </div>

      {/* Blog Content */}
      <div className="mx-4 sm:mx-6 max-w-4xl md:mx-auto my-8">
        {data.image && (
          <img
            src={data.image}
            alt="blog"
            className="rounded-2xl mb-6 w-full max-h-[400px] object-cover"
          />
        )}
        <div
          className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800 leading-relaxed
          prose-headings:!font-bold prose-headings:text-gray-900
          prose-p:text-gray-700 prose-p:text-justify
          prose-li:text-justify prose-blockquote:text-justify
          prose-a:text-primary hover:prose-a:underline
          prose-ul:list-disc prose-ul:pl-6
          prose-ol:list-decimal prose-ol:pl-6
          prose-li:marker:text-gray-600
          prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
        <div className="px-4 sm:px-6 max-w-4xl mx-auto">
          <p className="text-primary py-2 font-medium text-sm sm:text-base text-right">
            Published on {Moment(data.createdAt).format("MMMM Do YYYY")}
          </p>
        </div>
      </div>

      {/* Recommended Resources */}
      <div className="mt-12 mb-16 max-w-4xl mx-auto px-4 sm:px-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          Recommended Resources
        </h3>

        {resourcesLoading ? (
          <p className="text-center text-gray-500 text-base">
            Loading resources...
          </p>
        ) : resources.length > 0 ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {resources.map((res, index) => (
              <motion.a
                key={index}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -2 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white min-h-[160px] flex flex-col rounded-2xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-3 flex justify-center items-center bg-primary">
                  <h3 className="text-white font-semibold text-sm sm:text-base text-center truncate">
                    {res.title}
                  </h3>
                </div>
                <div className="p-3 flex-1 flex items-center justify-center">
                  <p className="text-gray-600 text-sm break-words text-center hover:text-primary underline transition-colors cursor-pointer">
                    {res.url}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 text-base">
            No recommended resources available.
          </p>
        )}
      </div>

      {/* Comments Section */}
      <div className="mt-12 mb-10 max-w-3xl mx-auto px-4 sm:px-6">
        <p className="font-semibold mb-4 text-center text-lg">
          Comments ({comments.length})
        </p>
        <div className="flex flex-col gap-3">
          {comments.map((item, index) => (
            <div
              key={index}
              className="w-full bg-primary/5 border border-primary/10 p-3 sm:p-4 rounded-lg text-gray-700"
            >
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <img
                  src={assets.user_icon}
                  alt=""
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <p className="font-medium text-sm sm:text-base">{item.name}</p>
              </div>
              <p className="text-sm sm:text-base ml-6">{item.content}</p>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 ml-6">
                {Moment(item.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Comment Form */}
      <div className="flex flex-col gap-4 items-center px-4 sm:px-6 mb-12">
        <p className="font-semibold mb-4 text-center text-lg">
          Add your Comment
        </p>
        <form
          onSubmit={addComment}
          className="flex flex-col gap-3 w-full max-w-md"
        >
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your Name"
            required
            className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
          />
          <textarea
            onChange={(e) => setContent(e.target.value)}
            value={content}
            placeholder="Your Comment"
            required
            className="w-full p-3 border border-gray-300 rounded-md outline-none h-28 sm:h-36 resize-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
          />
          <button
            type="submit"
            className="bg-primary text-white rounded-md p-3 sm:px-8 hover:scale-105 transition-transform duration-200 mx-auto text-sm sm:text-base"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Social Media Share */}
      <div className="my-16 max-w-3xl mx-auto px-4 sm:px-6">
        <p className="font-semibold mb-4 text-center text-lg">
          Share this article on Social Media
        </p>
        <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={assets.facebook_icon} alt="Facebook" width={40} />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              window.location.href
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={assets.twitter_icon} alt="Twitter" width={40} />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={assets.googleplus_icon} alt="Instagram" width={40} />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
