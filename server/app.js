import express from "express";
import cors from "cors";
import "dotenv/config";

import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import newsletterRouter from "./routes/newsletterRoute.js";
import contactRouter from "./routes/contactRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is working 🚀"));

// Routes
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/newsletter", newsletterRouter);

export default app;
