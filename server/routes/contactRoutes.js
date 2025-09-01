import express from "express";
import Contact from "../models/contact.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("📩 Incoming contact data:", req.body);

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    return res.status(201).json({
      success: true,
      message: "Message stored successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("❌ Error saving contact:", error.message);
    return res.status(500).json({
      success: false,
      error: "Server error while saving contact",
      details: error.message, // helpful for debugging
    });
  }
});

export default router;
