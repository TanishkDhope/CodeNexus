import React, { useState, useRef, useEffect } from "react";
import { FileText, Save } from "lucide-react";
import { jsPDF } from "jspdf";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ResumeBuilder = () => {
  const [mode, setMode] = useState("interactive");
  const [formData, setFormData] = useState({
    name: "",
    email: "",  
    phone: "",
    linkedin: "",
    portfolio: "",
    experience: "",
    skills: "",
    education: "",
    projects: "",
    certifications: "",
    languages: "",
  });
  const [generatedResume, setGeneratedResume] = useState(null);
  const containerRef = useRef(null);
  const previewRef = useRef(null);

  // Animate overall container on mount
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, []);

  // Animate resume preview when it appears
  useEffect(() => {
    if (generatedResume && previewRef.current) {
      gsap.fromTo(
        previewRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [generatedResume]);

  // Fill demo data in auto mode or reset in interactive mode
  useEffect(() => {
    if (mode === "auto") {
      const demoData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        linkedin: "linkedin.com/in/johndoe",
        portfolio: "johndoe.com",
        experience: "5 years in software development with a focus on full-stack technologies.",
        skills: "JavaScript, React, Node.js, Express",
        education: "Bachelor's in Computer Science",
        projects: "E-commerce Platform, Chat App, Portfolio Website",
        certifications: "Certified JavaScript Developer",
        languages: "English, Spanish",
      };
      setFormData(demoData);
      setGeneratedResume(generateResumeTemplate(demoData));
    } else {
      // Reset for interactive mode
      setFormData({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        portfolio: "",
        experience: "",
        skills: "",
        education: "",
        projects: "",
        certifications: "",
        languages: "",
      });
      setGeneratedResume(null);
    }
  }, [mode]);

  // Helper: Generate resume text from provided data
  const generateResumeTemplate = (data) => {
    return `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
LinkedIn: ${data.linkedin}
Portfolio: ${data.portfolio}

Experience:
${data.experience}

Skills:
${data.skills}

Education:
${data.education}

Projects:
${data.projects}

Certifications:
${data.certifications}

Languages:
${data.languages}
    `;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    setGeneratedResume(generateResumeTemplate(formData));
  };

  const downloadPDF = () => {
    if (!generatedResume) return;
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Resume", 20, 20);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(generatedResume, 180);
    pdf.text(lines, 20, 30);
    pdf.save("resume.pdf");
  };

  const copyToClipboard = () => {
    if (generatedResume) {
      navigator.clipboard.writeText(generatedResume);
      alert("Resume copied to clipboard!");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      portfolio: "",
      experience: "",
      skills: "",
      education: "",
      projects: "",
      certifications: "",
      languages: "",
    });
    setGeneratedResume(null);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-green-200 p-10 transition-all duration-300"
    >
      <h1 className="text-center text-4xl md:text-5xl font-extrabold text-white mb-8">
        AI Resume Builder
      </h1>
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setMode("interactive")}
          className={`px-6 py-2 rounded-md font-medium transition-colors duration-300 ${
            mode === "interactive" ? "bg-green-500 text-gray-900" : "bg-gray-700 text-green-200"
          }`}
        >
          Interactive Mode
        </button>
        <button
          onClick={() => setMode("auto")}
          className={`px-6 py-2 rounded-md font-medium transition-colors duration-300 ${
            mode === "auto" ? "bg-green-500 text-gray-900" : "bg-gray-700 text-green-200"
          }`}
        >
          Auto Mode
        </button>
      </div>

      {mode === "interactive" && (
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="w-full md:w-1/2">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
              {[
                "name",
                "email",
                "phone",
                "linkedin",
                "portfolio",
                "experience",
                "skills",
                "education",
                "projects",
                "certifications",
                "languages",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  onChange={handleChange}
                  value={formData[field]}
                  className="w-full p-3 bg-gray-700 text-green-200 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                />
              ))}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGenerate}
                  className="w-full px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors flex items-center justify-center"
                >
                  <FileText size={18} className="mr-2" />
                  Generate Resume
                </button>
                <button
                  onClick={resetForm}
                  className="w-full px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center justify-center"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {generatedResume && (
            <div
              ref={previewRef}
              className="w-full md:w-1/2 bg-gray-800 p-6 rounded-xl shadow-xl whitespace-pre-wrap transition-all duration-300"
            >
              <pre className="mb-4">{generatedResume}</pre>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={downloadPDF}
                  className="w-full px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors flex items-center justify-center"
                >
                  <Save size={18} className="mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={copyToClipboard}
                  className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "auto" && generatedResume && (
        <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-xl whitespace-pre-wrap transition-all duration-300">
          <pre className="mb-4">{generatedResume}</pre>
          <div className="text-center mt-4">
            <button
              onClick={downloadPDF}
              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors inline-flex items-center mr-4"
            >
              <Save size={18} className="mr-2" />
              Download PDF
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors inline-flex items-center"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;