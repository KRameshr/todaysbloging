// server/controllers/newsletterController.js
import Newsletter from "../models/newsletter.js";

// subscribe a new email
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already subscribed" });
    }

    // save new subscriber
    const newSub = new Newsletter({ email });
    await newSub.save();

    res.status(201).json({
      success: true,
      message: "Subscription successful",
      subscriber: newSub,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get all subscribers
export const getSubscribers = async (req, res) => {
  try {
    const subs = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, subscribers: subs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
