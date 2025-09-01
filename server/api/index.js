// api/index.js
import serverless from "serverless-http";
import connectDB from "../configs/db.js";
import app from "../app.js";

// ✅ Ensure MongoDB connection (once per cold start)
let isConnected = false;
async function initDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}
app.use(async (req, res, next) => {
  await initDB();
  next();
});

export default serverless(app);
