import fs from "fs/promises";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import fetch from "node-fetch";

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

    // ✅ async file read
    const fileBuffer = await fs.readFile(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
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

// Get latest 5 published blogs (for footer/articles section)
export const getLatestArticles = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 }) // newest first
      .limit(5) // only 5 articles
      .select("title category createdAt"); // send only needed fields

    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateResources = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Blog title and description are required",
      });
    }

    const prompt = `
      Based on the following blog content, suggest 5 high-quality external resources
      (websites, documentation, tutorials, or research articles) relevant for readers.
      Provide the output strictly in JSON array format like:
      [
        { "title": "Resource 1", "url": "https://..." },
        { "title": "Resource 2", "url": "https://..." }
      ]

      Blog Title: "${title}"
      Blog Content: "${description}"
    `;

    // 🔹 Call Hugging Face Inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `HF API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("HF raw response:", data);

    // Hugging Face returns text differently depending on model
    const aiResponse =
      data[0]?.generated_text || data.generated_text || JSON.stringify(data);

    console.log("AI Response (parsed text):", aiResponse);

    let resources = [];
    try {
      const jsonMatch = aiResponse.match(/\[.*\]/s);
      if (jsonMatch) {
        resources = JSON.parse(jsonMatch[0]);
      } else {
        console.warn(
          "⚠️ No JSON array found in AI response, fallback to empty list."
        );
      }
    } catch (err) {
      console.warn("⚠️ Failed to parse AI JSON:", err.message);
    }

    // ✅ Ensure frontend always gets something
    if (!resources.length) {
      resources = [
        { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
        { title: "W3Schools", url: "https://www.w3schools.com/" },
      ];
    }

    res.status(200).json({ success: true, resources });
  } catch (error) {
    console.error("❌ Error in generateResources:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
