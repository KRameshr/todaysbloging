import serverless from "serverless-http";
import app from "../app.js";
import mongoose from "mongoose";

// Cached MongoDB connection
let isConnected = false;

async function connectDBOnce() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGOOB_URI, {
      dbName: "todaysblog",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}

// Ensure DB connection
app.use(async (req, res, next) => {
  if (!isConnected) {
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

export default serverless(app);
