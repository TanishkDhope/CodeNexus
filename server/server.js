import express from "express";
import cors from "cors";
import axios from "axios";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {db} from "./firebaseAdmin.js";
import {users} from "./firebaseClient.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());



const generateToken = (role) => {
  return jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

app.post("/login", (req, res) => {
  const { email } = req.body;
  // 🔹 Find user by email
  const user = users.find((u) => u.email === email);
    
  if (!user) {
      return res.status(401).json({ message: "User not found" });
  }

  const token = generateToken(user.role);
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: "Lax", // Important for cross-origin cookies
  });
  res.json({ message: "Login successful" });
});

// **Role Check Route**
app.get("/check-role", (req, res) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.json({ role: decoded.role });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port}`);
});
