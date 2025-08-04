import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;
    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }
    const fileBuffer = fs.readFileSync(imageFile.path);
    //
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });
    // optimization through imagakit URL transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" }, //
        { format: "webp" },
        { width: "1280" },
      ],
    });

    const image = optimizedImageUrl;
    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });
    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId); // ✅ correct spelling

    if (!blog) {
      return res.json({ success: false, message: "blog not found " });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    await blog.deleteOne(); // ✅ safer deletion
    await Comment.deleteMany({ blog: id }); // ✅ deletes only related comments

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });
    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogComment = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res
      .status(400)
      .json({ success: false, message: "Prompt is required" });
  }

  try {
    const content = await main(prompt);
    if (content.includes("AI generation failed")) {
      return res.status(500).json({ success: false, message: content });
    }
    res.status(200).json({ success: true, content });
  } catch (err) {
    console.error("❌ AI Generate Error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
