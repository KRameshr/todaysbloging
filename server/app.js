// app.js
import express from "express";
import cors from "cors";
import "dotenv/config";

// Routers
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import newsletterRouter from "./routes/newsletterRoute.js";
import contactRouter from "./routes/contactRoutes.js";

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => {
  res.send("API is Working 🚀");
});
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/newsletter", newsletterRouter);

export default app;
