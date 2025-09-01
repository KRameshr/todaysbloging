import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        "Personal details like name and email (via authentication).",
        "User-generated content: articles, blogs, images, resumes.",
        "Usage data such as likes, interactions, and feature access.",
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "Deliver and improve AI-driven content generation.",
        "Personalize user experience and recommend features.",
        "Ensure platform security and prevent misuse.",
      ],
    },
    {
      title: "3. Data Storage & Security",
      content:
        "We use secure cloud services like NeonDB and Cloudinary. All communication is encrypted (HTTPS). Access is strictly restricted and regularly monitored.",
    },
    {
      title: "4. Sharing of Information",
      content:
        "We never sell your data. Limited sharing with trusted AI partners (e.g., Gemini, ClipDrop) occurs only to power specific platform features.",
    },
    {
      title: "5. Your Rights",
      content: [
        "Access, update, or delete your data.",
        "Opt out of non-essential communications.",
        "Request full clarification on our data handling.",
      ],
    },
    {
      title: "6. Policy Updates",
      content:
        "This Privacy Policy may change to reflect legal, technical, or business updates. The latest version will always be available on this page.",
    },
    {
      title: "7. Contact Us",
      content: (
        <>
          For questions or concerns, please reach out at{" "}
          <Link
            to="/contact"
            className="text-blue-600 font-medium hover:text-blue-500 transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Contact Us
          </Link>
          .
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col space-y-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-600 mb-4">
            Privacy Policy Today'sblog
          </h1>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            Effective Date: <span className="font-medium">{today}</span>
            <br />
            We value your trust. This Privacy Policy explains how we handle your
            information when you use our AI-powered creative platform.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6 sm:space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-3">
                {section.title}
              </h2>
              {Array.isArray(section.content) ? (
                <ul className="list-disc ml-5 text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base md:text-base">
                  {section.content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 text-sm sm:text-base md:text-base leading-relaxed">
                  {section.content}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
