import serverless from "serverless-http";
import app from "../app.js";
import connectDB from "../configs/db.js";

// -----------------------------------
// 1️⃣ Connect DB on cold start (non-blocking)
let isConnected = false;
connectDB()
  .then(() => {
    console.log("MongoDB connected ✅");
    isConnected = true;
  })
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
  });

// -----------------------------------
// 2️⃣ Middleware to ensure DB connection
// Place this **before all routes** but **after app creation**
app.use(async (req, res, next) => {
  if (!isConnected) {
    console.warn("⚠️ MongoDB not ready yet, request may fail");
  }
  next();
});

// -----------------------------------
// 3️⃣ Routes
app.get("/", (req, res) => res.send("API is working 🚀"));
import adminRouter from "../routes/adminRoutes.js";
import blogRouter from "../routes/blogRoutes.js";
import newsletterRouter from "../routes/newsletterRoute.js";
import contactRouter from "../routes/contactRoutes.js";

app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/newsletter", newsletterRouter);

// -----------------------------------
// 4️⃣ Export serverless handler
export default serverless(app);
