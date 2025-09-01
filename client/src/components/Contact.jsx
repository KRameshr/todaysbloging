import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import Footer from "./Footer";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/contact`,
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      // Access the message from response.data
      alert(`✅ ${response.data.message}`);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      // If server returns a JSON error
      const errMsg =
        error.response?.data?.error ||
        "Failed to send message. Please try again.";
      alert(`❌ ${errMsg}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-6 py-20 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
          Contact Information
        </h1>
        <p className="max-w-2xl text-gray-600 text-left mb-12 text-lg">
          We’d love to hear from you. Whether you have questions, feedback, or
          need support, our team is here to help.
        </p>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mb-16">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <Mail className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <a
              href="mailto:krameshr348@gmail.com"
              className="hover:text-blue-600 transition-colors"
            >
              krameshr348@gmail.com
            </a>
            <p className="text-sm text-gray-500">
              We’ll respond within 24 hours
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <Phone className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Phone</h3>
            <a
              href="tel:+918919003200"
              className="text-gray-600 mb-2 hover:text-green-600 transition-colors"
            >
              +91 8919-00-3200
            </a>
            <p className="text-sm text-gray-500">Mon–Fri, 9AM–6PM (IST)</p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <MapPin className="w-10 h-10 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Office</h3>
            <p className="text-gray-600 text-sm">
              Fully Online Platform – Accessible Globally (Mon–Fri)
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Send Us a Message
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                rows="5"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
