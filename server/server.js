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
const server = express();
const PORT = 3000;

// Middleware
server.use(express.json());
server.use(cors());

// Firebase Admin initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validation regex
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

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

// MongoDB connection with detailed logging
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB successfully');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

try {
  await mongoose.connect(process.env.DB_LOCATION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
  });
} catch (error) {
  console.error("MongoDB connection error:", error);
}

// Enhanced error handling middleware
server.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: "An unexpected error occurred",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Signin endpoint with enhanced logging
server.post("/signin", async (req, res) => {
  try {
    console.log("Received signin request with body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing credentials - Email or password not provided");
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    console.log("Looking up user with email:", email);
    const user = await User.findOne({ "personal_info.email": email });
    
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ error: "Email not found" });
    }

    console.log("User found, verifying password");
    const isPasswordValid = await bcrypt.compare(password, user.personal_info.password);
    
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(403).json({ error: "Invalid password" });
    }

    console.log("Password verified, generating token");
    const response = formatDataSend(user);
    console.log("Sending successful response:", { ...response, access_token: '[REDACTED]' });
    
    return res.status(200).json(response);

  } catch (err) {
    console.error("Error in signin:", err);
    return res.status(500).json({
      error: "An error occurred during signin",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Signup endpoint with enhanced logging
server.post("/signup", async (req, res) => {
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

server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;
      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select("personal_info.fullname personal_info.profile_img google_auth")
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(403).json({ error: err.message });
        });

      if (user) {
        if (!user.google_auth) {
          return res
            .status(403)
            .json({ error: "This user is not Google authenticated" });
        } else {
          return res.status(200).json(formatDataSend(user));
        }
      } else {
        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,

            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: "Server error" });
          });

        return res.status(200).json(formatDataSend(user));
      }
    })
    .catch((err) => {
      console.error("google Auth error :", err);
      return res
        .status(500)
        .json({ error: "Authentication error, try another Google account" });
    });
});

// Start server
server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
