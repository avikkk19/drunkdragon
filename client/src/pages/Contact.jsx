import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Mail, User, Phone, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    message: "",
    isError: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ message: "", isError: false });

    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "Not provided",
      message: formData.message,
    };

    try {
      // Send the email to your team
      await emailjs.send(
        "service_8x08u2r", // Your EmailJS Service ID
        "template_4ss5kos", // Your EmailJS Template ID for team
        templateParams,
        "vMyMpzPERljGlEY8p" // Your EmailJS Public Key
      );

      // Send an auto-reply to the user
      await emailjs.send(
        "service_8x08u2r", // Same Service ID
        "template_6vqktlp", // Separate Template ID for auto-reply
        { name: formData.name, email: formData.email },
        "vMyMpzPERljGlEY8p" // Your Public Key
      );

      setSubmitStatus({
        message:
          "Message sent successfully! Check your email for confirmation.",
        isError: false,
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus({
        message: "Failed to send message. Please try again later.",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 mt-24">
      <Card className="max-w-md mx-auto bg-black text-white">
        <CardHeader>
          <CardTitle className="text-center text-white">Contact Us</CardTitle>
          <p className="text-center text-sm text-gray-400 mt-2">
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="pl-10 w-full px-3 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your Name"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10 w-full px-3 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Email Address"
              />
            </div>

            {/* Phone Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Phone Number (Optional)"
              />
            </div>

            {/* Message Field */}
            <div className="relative">
              <div className="absolute left-3 top-3">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="pl-10 w-full px-3 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="How can we help you?"
              />
            </div>

            {submitStatus.message && (
              <div
                className={`p-4 rounded-md ${
                  submitStatus.isError
                    ? "bg-red-900 text-red-200"
                    : "bg-green-900 text-green-200"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
