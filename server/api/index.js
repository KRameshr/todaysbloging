// api/index.js
import serverless from "serverless-http";
import app from "../app.js";
import mongoose from "mongoose";

// -----------------------------------
// 1️⃣ Cached MongoDB connection (cold start)
let isConnected = false;

async function connectDBOnce() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGOOB_URI, {
      dbName: "todaysblog", // optional, specify your DB
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err; // propagate error
  }
}

// -----------------------------------
// 2️⃣ Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  if (!isConnected) {
    console.log("🌐 Connecting to MongoDB...");
    try {
      await connectDBOnce();
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "DB connection failed" });
    }
  }
  next();
});

// -----------------------------------
// 3️⃣ Routes
import adminRouter from "../routes/adminRoutes.js";
import blogRouter from "../routes/blogRoutes.js";
import newsletterRouter from "../routes/newsletterRoute.js";
import contactRouter from "../routes/contactRoutes.js";

app.get("/", (req, res) => res.send("API is working 🚀"));

app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/newsletter", newsletterRouter);

// -----------------------------------
// 4️⃣ Export serverless handler
export default serverless(app);
