import express from "express";
import "dotenv/config";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();
await connectDB();

//  middlewares

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is Working"));
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

//
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
export default app;
// # "mongodb+srv://admin:fs678dde@cluster0.kfo0kdk.mongodb.net/onlineDB?retryWrites=true&w=majority&appName=Cluster0"
