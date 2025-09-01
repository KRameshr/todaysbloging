// server.js
import "dotenv/config";
import connectDB from "./configs/db.js";
import app from "./app.js";

// ✅ Connect to MongoDB before starting the server
await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
