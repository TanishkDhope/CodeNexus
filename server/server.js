import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { users } from "./firebaseClient.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();  // Move this line up
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors(
  {
    origin: "http://localhost:5174",
  }
))

const genAI = new GoogleGenerativeAI(process.env.GEN_AI_SECRET);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "Generate a professional resume using the following details:\n\n**Full Name:** [Your Name]  \n**Contact:** [Your Email] | [Your Phone] | LinkedIn: [Your LinkedIn] | Portfolio: [Your Portfolio]  \n\n**Summary:**  \n[Provide a brief summary about yourself, e.g., experienced software engineer with expertise in frontend and backend development.]  \n\n**Skills:**  \n- [Skill 1]  \n- [Skill 2]  \n- [Skill 3]  \n\n**Education:**  \n**[Degree]**, [University Name] – [Year of Graduation]  \n\n**Work Experience:**  \n**[Job Title]**, [Company Name] – [Start Date] to [End Date]  \n- [Responsibility or Achievement 1]  \n- [Responsibility or Achievement 2]  \n\n**Projects:**  \n**[Project Name]**  \n[Brief project description, technologies used, and key contributions.]  \n\n**Certifications:**  \n- [Certification Name] – [Issuing Organization]  \n\n**Languages:**  \n- [Language 1]  \n- [Language 2]  \n\n**Format:**  \n- Use `**Bold**` for section titles.  \n- Ensure proper spacing and line breaks for readability.  \n- Keep responses concise and professional.  \n- Don't give acknowledgement to my question only give resume\n",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.use(
  cors({
    origin: "http://localhost:5180",
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

app.post("/generate-resume", async (req, res) => {
  try {
    const userData = req.body;
    console.log(req.body)
    const generatedResume = await run(
      `Generate a professional resume for the following details: ${JSON.stringify(
        userData
      )}`
    );
    console.log("Generated Resume:", generatedResume);

    // Send response as plain text
    res.type("text/plain").send(generatedResume);

  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({ error: "Error generating resume" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function run(input) {
  try {
    const chatSession = model.startChat({ generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "{\n  name: 'Tanishk Dhope',\n  email: 'tanishkdhope@gmail.com',\n  phone: '1234567890',\n  linkedin: 'fweagfesaf',\n  portfolio: 'uiionp;n',\n  experience: 'kmqwwlfqe',\n  skills: 'java,c++,js',\n  education: 'qfqqqfl',\n  projects: '',\n  certifications: '',\n  languages: ''\n}\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "**Tanishk Dhope**\ntanishkdhope@gmail.com | 1234567890 | LinkedIn: fweagfesaf | Portfolio: uiionp;n\n\n**Summary:**\nHighly motivated and skilled professional with experience in kmqwwlfqe. Proficient in Java, C++, and JavaScript. Eager to contribute to innovative projects and drive impactful results.\n\n**Skills:**\n- Java\n- C++\n- JavaScript\n\n**Education:**\n**qfqqqfl**\n\n**Work Experience:**\n**kmqwwlfqe**\n\n**Projects:**\n(No projects provided)\n\n**Certifications:**\n(No certifications provided)\n\n**Languages:**\n(No languages provided)\n"},
          ],
        },
      ],
     });
    
    const result = await chatSession.sendMessage([input]);
    const resText = result.response.text(); // Expecting raw text
    console.log("Raw AI Response:", resText); 

    const responseText = result.response.text();
    return responseText; // Convert to JSON and return
  } catch (err) {
    console.error("Gemini AI processing failed:", err);
    throw err;
  }
}
