import serverless from "serverless-http";
import connectDB from "../configs/db.js";
import app from "../app.js";

// ✅ Initialize MongoDB once per cold start
let isConnected = false;
connectDB()
  .then(() => {
    console.log("MongoDB connected (cold start)");
    isConnected = true;
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Optional middleware to warn if DB not ready yet
app.use((req, res, next) => {
  if (!isConnected) {
    console.warn("MongoDB not ready yet");
  }
  next();
});

export default serverless(app);
