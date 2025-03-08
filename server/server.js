import express from "express";
import cors from "cors";
import axios from "axios";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "./firebaseAdmin.js";
import { users } from "./firebaseClient.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chatbotRoutes from "./chatbot.js";

dotenv.config();

const app = express();  // Move this line up
const port = process.env.PORT || 8000;
const genAI = new GoogleGenerativeAI(process.env.GEN_AI_SECRET);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "give only response field no need for greeting and all",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

app.use(
  cors({
    origin: "http://localhost:5180",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", chatbotRoutes); // Move this line below the app initialization

const generateToken = (role) => {
  return jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

app.post("/login", (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const token = generateToken(user.role);

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: "Lax",
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

// **Chatbot Route**
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "hi"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "{\n\"response\": \"Okay\"\n}"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "how are you"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "{\n\"response\": \"I am doing well, thank you for asking.\"\n}"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage(message);
    const botResponse = result.response.text();
try {
  const parsedResponse = JSON.parse(botResponse); // Try parsing the JSON
  res.json(parsedResponse); // Send parsed JSON
} catch (error) {
  res.json({ response: botResponse }); // If parsing fails, return as plain text
}
console.log(botResponse);

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
