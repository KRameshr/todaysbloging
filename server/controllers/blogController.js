// import fs from "fs/promises";
// import imagekit from "../configs/imageKit.js";
// import Blog from "../models/Blog.js";
// import Comment from "../models/Comment.js";
// import fetch from "node-fetch";

// import main from "../configs/gemini.js";

// export const addBlog = async (req, res) => {
//   try {
//     const { title, subTitle, description, category, isPublished } = JSON.parse(
//       req.body.blog
//     );
//     const imageFile = req.file;

//     if (!title || !description || !category || !imageFile) {
//       return res.json({ success: false, message: "Missing required fields" });
//     }

//     // ✅ async file read
//     const fileBuffer = await fs.readFile(imageFile.path);

//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: imageFile.originalname,
//       folder: "/blogs",
//     });

//     const optimizedImageUrl = imagekit.url({
//       path: response.filePath,
//       transformation: [
//         { quality: "auto" },
//         { format: "webp" },
//         { width: "1280" },
//       ],
//     });

//     const image = optimizedImageUrl;

//     await Blog.create({
//       title,
//       subTitle,
//       description,
//       category,
//       image,
//       isPublished,
//     });

//     res.json({ success: true, message: "Blog added successfully" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find({ isPublished: true });
//     res.json({ success: true, blogs });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
// export const getBlogById = async (req, res) => {
//   try {
//     const { blogId } = req.params;

//     const blog = await Blog.findById(blogId); // ✅ correct spelling

//     if (!blog) {
//       return res.json({ success: false, message: "blog not found " });
//     }
//     res.json({ success: true, blog });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const deleteBlogById = async (req, res) => {
//   try {
//     const { id } = req.body;

//     const blog = await Blog.findById(id);
//     if (!blog) {
//       return res.json({ success: false, message: "Blog not found" });
//     }

//     await blog.deleteOne(); // ✅ safer deletion
//     await Comment.deleteMany({ blog: id }); // ✅ deletes only related comments

//     res.json({ success: true, message: "Blog deleted successfully" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const togglePublish = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const blog = await Blog.findById(id);
//     blog.isPublished = !blog.isPublished;
//     await blog.save();
//     res.json({ success: true, message: "Blog status updated" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const addComment = async (req, res) => {
//   try {
//     const { blog, name, content } = req.body;
//     await Comment.create({ blog, name, content });
//     res.json({ success: true, message: "Comment added for review" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const getBlogComment = async (req, res) => {
//   try {
//     const { blogId } = req.body;
//     const comments = await Comment.find({
//       blog: blogId,
//       isApproved: true,
//     }).sort({ createdAt: -1 });
//     res.json({ success: true, comments });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const generateContent = async (req, res) => {
//   const { prompt } = req.body;
//   if (!prompt) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Prompt is required" });
//   }

//   try {
//     const content = await main(prompt);
//     if (content.includes("AI generation failed")) {
//       return res.status(500).json({ success: false, message: content });
//     }
//     res.status(200).json({ success: true, content });
//   } catch (err) {
//     console.error("❌ AI Generate Error:", err.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// // Get latest 5 published blogs (for footer/articles section)
// export const getLatestArticles = async (req, res) => {
//   try {
//     const blogs = await Blog.find({ isPublished: true })
//       .sort({ createdAt: -1 }) // newest first
//       .limit(5) // only 5 articles
//       .select("title category createdAt"); // send only needed fields

//     res.json({ success: true, blogs });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const generateResources = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     if (!title || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "Blog title and description are required",
//       });
//     }

//     const prompt = `
//       Based on the following blog content, suggest 5 high-quality external resources
//       (websites, documentation, tutorials, or research articles) relevant for readers.
//       Provide the output strictly in JSON array format like:
//       [
//         { "title": "Resource 1", "url": "https://..." },
//         { "title": "Resource 2", "url": "https://..." }
//       ]

//       Blog Title: "${title}"
//       Blog Content: "${description}"
//     `;

//     // 🔹 Call Hugging Face Inference API
//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ inputs: prompt }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(
//         `HF API error: ${response.status} ${response.statusText}`
//       );
//     }

//     const data = await response.json();
//     console.log("HF raw response:", data);

//     // Hugging Face returns text differently depending on model
//     const aiResponse =
//       data[0]?.generated_text || data.generated_text || JSON.stringify(data);

//     console.log("AI Response (parsed text):", aiResponse);

//     let resources = [];
//     try {
//       const jsonMatch = aiResponse.match(/\[.*\]/s);
//       if (jsonMatch) {
//         resources = JSON.parse(jsonMatch[0]);
//       } else {
//         console.warn(
//           "⚠️ No JSON array found in AI response, fallback to empty list."
//         );
//       }
//     } catch (err) {
//       console.warn("⚠️ Failed to parse AI JSON:", err.message);
//     }

//     // ✅ Ensure frontend always gets something
//     if (!resources.length) {
//       resources = [
//         { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
//         { title: "W3Schools", url: "https://www.w3schools.com/" },
//       ];
//     }

//     res.status(200).json({ success: true, resources });
//   } catch (error) {
//     console.error("❌ Error in generateResources:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // blogController.js
// import fs from "fs/promises";
// import imagekit from "../configs/imageKit.js";
// import Blog from "../models/Blog.js";
// import Comment from "../models/Comment.js";
// import fetch from "node-fetch";
// import main from "../configs/gemini.js";

// // -----------------------------
// // 1️⃣ Add Blog
// export const addBlog = async (req, res) => {
//   try {
//     const { title, subTitle, description, category, isPublished } = JSON.parse(
//       req.body.blog
//     );
//     const imageFile = req.file;

//     if (!title || !description || !category || !imageFile) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     const fileBuffer = await fs.readFile(imageFile.path);

//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: imageFile.originalname,
//       folder: "/blogs",
//     });

//     const optimizedImageUrl = imagekit.url({
//       path: response.filePath,
//       transformation: [
//         { quality: "auto" },
//         { format: "webp" },
//         { width: "1280" },
//       ],
//     });

//     const blog = await Blog.create({
//       title,
//       subTitle,
//       description,
//       category,
//       image: optimizedImageUrl,
//       isPublished,
//     });

//     res
//       .status(201)
//       .json({ success: true, message: "Blog added successfully", blog });
//   } catch (error) {
//     console.error("❌ addBlog error:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // -----------------------------
// // 2️⃣ Get All Published Blogs
// export const getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find({ isPublished: true }).sort({
//       createdAt: -1,
//     });
//     res.json({ success: true, blogs });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // -----------------------------
// // 3️⃣ Get Blog by ID
// export const getBlogById = async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     const blog = await Blog.findById(blogId);
//     if (!blog)
//       return res
//         .status(404)
//         .json({ success: false, message: "Blog not found" });

//     res.json({ success: true, blog });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // -----------------------------
// // 4️⃣ Delete Blog
// export const deleteBlogById = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const blog = await Blog.findById(id);
//     if (!blog)
//       return res
//         .status(404)
//         .json({ success: false, message: "Blog not found" });

//     await blog.deleteOne();
//     await Comment.deleteMany({ blog: id });

//     res.json({ success: true, message: "Blog deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // -----------------------------
// // 5️⃣ Toggle Publish Status
// export const togglePublish = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const blog = await Blog.findById(id);
//     if (!blog)
//       return res
//         .status(404)
//         .json({ success: false, message: "Blog not found" });

//     blog.isPublished = !blog.isPublished;
//     await blog.save();

//     res.json({
//       success: true,
//       message: "Blog status updated",
//       isPublished: blog.isPublished,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // -----------------------------
// // 6️⃣ Add Comment
// export const addComment = async (req, res) => {
//   try {
//     const { blog, name, content } = req.body;
//     if (!blog || !name || !content)
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields required" });

//     const comment = await Comment.create({ blog, name, content });
//     res
//       .status(201)
//       .json({ success: true, message: "Comment added for review", comment });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // -----------------------------
// // 7️⃣ Get Approved Comments
// export const getBlogComment = async (req, res) => {
//   try {
//     const { blogId } = req.body;
//     const comments = await Comment.find({
//       blog: blogId,
//       isApproved: true,
//     }).sort({ createdAt: -1 });
//     res.json({ success: true, comments });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // -----------------------------
// // 8️⃣ AI Content Generation (Non-blocking)
// export const generateContent = async (req, res) => {
//   const { prompt } = req.body;
//   if (!prompt)
//     return res
//       .status(400)
//       .json({ success: false, message: "Prompt is required" });

//   // Immediately acknowledge request
//   res.status(202).json({
//     success: true,
//     message: "AI generation started. Check back later.",
//   });

//   // Background processing
//   try {
//     const content = await main(prompt);
//     // Optionally, save content to DB for later retrieval
//     await Blog.create({
//       title: prompt.slice(0, 50),
//       description: content,
//       category: "AI",
//       isPublished: false,
//     });
//   } catch (err) {
//     console.error("❌ AI Generate Error:", err.message);
//   }
// };

// // -----------------------------
// // 9️⃣ Latest Articles
// export const getLatestArticles = async (req, res) => {
//   try {
//     const blogs = await Blog.find({ isPublished: true })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .select("title category createdAt");
//     res.json({ success: true, blogs });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // -----------------------------
// // 10️⃣ AI Resources Generation (Non-blocking)
// export const generateResources = async (req, res) => {
//   const { title, description } = req.body;
//   if (!title || !description)
//     return res
//       .status(400)
//       .json({ success: false, message: "Title & description required" });

//   res.status(202).json({
//     success: true,
//     message: "Resource generation started. Check back later.",
//   });

//   // Background processing
//   (async () => {
//     try {
//       const prompt = `
//         Suggest 5 high-quality external resources for the blog content:
//         Blog Title: "${title}"
//         Blog Content: "${description}"
//         Return strictly in JSON array format.
//       `;
//       const response = await fetch(
//         "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${process.env.HF_API_KEY}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ inputs: prompt }),
//         }
//       );

//       if (!response.ok) throw new Error(`HF API error: ${response.status}`);

//       const data = await response.json();
//       const aiResponse = data[0]?.generated_text || data.generated_text || "[]";
//       let resources = [];
//       const jsonMatch = aiResponse.match(/\[.*\]/s);
//       if (jsonMatch) resources = JSON.parse(jsonMatch[0]);

//       // Fallback resources
//       if (!resources.length) {
//         resources = [
//           { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
//           { title: "W3Schools", url: "https://www.w3schools.com/" },
//         ];
//       }

//       // Optionally, save resources to DB
//       await Blog.create({
//         title: `${title} Resources`,
//         description: JSON.stringify(resources),
//         category: "Resources",
//         isPublished: false,
//       });
//     } catch (err) {
//       console.error("❌ generateResources Error:", err.message);
//     }
//   })();
// };

import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import imagekit from "../configs/imageKit.js";
import fetch from "node-fetch";
import main from "../configs/gemini.js";

// Add a new blog
export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Upload image to ImageKit
    let uploadResponse;
    try {
      uploadResponse = await imagekit.upload({
        file: imageFile.buffer,
        fileName: imageFile.originalname,
        folder: "/blogs",
      });
    } catch (err) {
      console.error("❌ ImageKit upload failed:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed" });
    }

    const optimizedImageUrl = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    const blog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      image: optimizedImageUrl,
      isPublished,
    });

    res
      .status(201)
      .json({ success: true, message: "Blog added successfully", blog });
  } catch (error) {
    console.error("❌ addBlog error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all published blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({
      createdAt: -1,
    });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete blog
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    await blog.deleteOne();
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle blog publish status
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({ success: true, message: "Blog status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });
    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get comments for a blog
export const getBlogComment = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate AI blog content
export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt)
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });

    const content = await main(prompt);
    if (content.includes("AI generation failed")) {
      return res.status(500).json({ success: false, message: content });
    }

    res.status(200).json({ success: true, content });
  } catch (error) {
    console.error("❌ generateContent error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get latest 5 published blogs
export const getLatestArticles = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title category createdAt");
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate external resources (Hugging Face)
export const generateResources = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Blog title and description required",
        });
    }

    const prompt = `
      Suggest 5 high-quality external resources (JSON array) for this blog:
      Title: "${title}"
      Content: "${description}"
    `;

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

    if (!response.ok) throw new Error(`HF API error: ${response.statusText}`);
    const data = await response.json();

    let resources = [];
    try {
      const text =
        data[0]?.generated_text || data.generated_text || JSON.stringify(data);
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) resources = JSON.parse(jsonMatch[0]);
    } catch {
      resources = [
        { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
        { title: "W3Schools", url: "https://www.w3schools.com/" },
      ];
    }

    res.status(200).json({ success: true, resources });
  } catch (error) {
    console.error("❌ generateResources error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
