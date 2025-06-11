import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin";
import serviceAccountKey from "./mern-blog-60048-firebase-adminsdk-wet16-cda67f7484.json" with { type: "json" };
import { getAuth } from "firebase-admin/auth";
import path from "path";
import { fileURLToPath } from "url";

// Schema import
import User from "./Schema/User.js";

// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://drunkdragon.vercel.app', 'https://www.drunkdragon.vercel.app'] 
    : 'http://localhost:5173',
  credentials: true
}));

// Firebase Admin initialization (only initialize if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.DB_LOCATION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Ensure DB connection
connectDB();

// Helper Functions
const formatDataSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// API Routes
app.post("/api/signin", async (req, res) => {
  try {
    console.log("Received signin request:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.personal_info.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid password" });
    }

    return res.status(200).json(formatDataSend(user));
  } catch (err) {
    console.error("Error in signin:", err);
    return res.status(500).json({ error: "An error occurred during signin" });
  }
});

// Signup endpoint with enhanced logging
app.post("/api/signup", async (req, res) => {
  try {
    console.log("Received signup request:", req.body);
    const { fullname, email, password } = req.body;

    // Validate required fields
    if (!fullname || !email || !password) {
      console.log("Missing required fields:", { fullname: !!fullname, email: !!email, password: !!password });
      return res.status(400).json({
        error: "All fields are required",
        received: { fullname: !!fullname, email: !!email, password: !!password }
      });
    }

    // Validate fullname
    if (fullname.length < 3 || fullname.length > 20) {
      console.log("Invalid fullname length:", fullname.length);
      return res.status(400).json({
        error: "Fullname must be between 3 and 20 characters"
      });
    }

    // Validate email
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      console.log("Invalid password format");
      return res.status(400).json({
        error: "Password must be 6-20 characters with at least one uppercase letter, one lowercase letter, and one number"
      });
    }

    // Check for existing user
    console.log("Checking for existing user with email:", email);
    const existingUser = await User.findOne({ "personal_info.email": email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash password
    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate username
    console.log("Generating unique username from email");
    let username = email.split("@")[0];
    let usernameExists = await User.findOne({ "personal_info.username": username });
    let counter = 1;
    
    while (usernameExists) {
      username = `${email.split("@")[0]}${counter}`;
      usernameExists = await User.findOne({ "personal_info.username": username });
      counter++;
    }

    // Create new user
    console.log("Creating new user with username:", username);
    const user = new User({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username
      }
    });

    // Save user
    console.log("Saving user to database");
    await user.save();

    // Generate response
    console.log("Generating auth token and sending response");
    const response = formatDataSend(user);
    return res.status(200).json(response);

  } catch (err) {
    console.error("Error in signup:", err);
    return res.status(500).json({
      error: "An error occurred during signup",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.post("/api/google-auth", async (req, res) => {
  try {
    const { access_token } = req.body;
    const decodedUser = await getAuth().verifyIdToken(access_token);
    const { email, name, picture } = decodedUser;
    
    let user = await User.findOne({ "personal_info.email": email });
    
    if (!user) {
      const username = await generateUsername(email);
      user = new User({
        personal_info: {
          fullname: name,
          email,
          profile_img: picture,
          username
        },
        google_auth: true
      });
      await user.save();
    }

    return res.status(200).json(formatDataSend(user));
  } catch (err) {
    console.error("Error in Google auth:", err);
    return res.status(500).json({
      error: "An error occurred during Google authentication",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Export the Express API
export default app;
