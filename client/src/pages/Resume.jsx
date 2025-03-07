import React, { useState, useRef, useEffect } from "react";
import { FileText, Save } from "lucide-react";
import { jsPDF } from "jspdf";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

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
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
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

  // When mode changes, fill with demo data in auto mode or reset in interactive mode
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
      // Reset data for interactive mode
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

  // Inline style objects for layout
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    gap: "20px",
  };

  const columnStyle = {
    flex: "1 1 400px",
    minWidth: "300px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.3s",
    marginTop: "10px",
  };

  const inputStyle = {
    background: "#0b2827",
    color: "#a3d9a5",
    border: "1px solid #28a745",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      ref={containerRef}
      style={{
        background: "#0b0f0f",
        color: "#a3d9a5",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        transition: "background 0.3s",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        AI Resume Builder
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setMode("interactive")}
          style={{
            background: mode === "interactive" ? "#28a745" : "#1a3c34",
            color: "#a3d9a5",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          Interactive Mode
        </button>
        <button
          onClick={() => setMode("auto")}
          style={{
            background: mode === "auto" ? "#28a745" : "#1a3c34",
            color: "#a3d9a5",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          Auto Mode
        </button>
      </div>

      {mode === "interactive" && (
        <div style={containerStyle}>
          <div style={columnStyle}>
            <div
              style={{
                background: "#0b1e1d",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 0 15px rgba(0, 255, 128, 0.3)",
              }}
            >
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
                  placeholder={
                    field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  onChange={handleChange}
                  value={formData[field]}
                  style={inputStyle}
                />
              ))}

              <button
                onClick={handleGenerate}
                style={{
                  ...buttonStyle,
                  background: "#28a745",
                  color: "white",
                }}
              >
                <FileText size={18} style={{ marginRight: "5px" }} />
                Generate Resume
              </button>
              <button
                onClick={resetForm}
                style={{
                  ...buttonStyle,
                  background: "#dc3545",
                  color: "white",
                }}
              >
                Reset
              </button>
            </div>
          </div>
          {generatedResume && (
            <div
              ref={previewRef}
              style={{
                ...columnStyle,
                background: "#0b2827",
                borderRadius: "10px",
                padding: "20px",
                boxSizing: "border-box",
                whiteSpace: "pre-wrap",
                boxShadow: "0 0 15px rgba(0, 255, 128, 0.3)",
              }}
            >
              <pre style={{ margin: 0 }}>{generatedResume}</pre>
              <button
                onClick={downloadPDF}
                style={{
                  ...buttonStyle,
                  background: "#28a745",
                  color: "white",
                }}
              >
                <Save size={18} style={{ marginRight: "5px" }} />
                Download PDF
              </button>
              <button
                onClick={copyToClipboard}
                style={{
                  ...buttonStyle,
                  background: "#17a2b8",
                  color: "white",
                }}
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      )}

      {mode === "auto" && generatedResume && (
        <div
          ref={previewRef}
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "#0b2827",
            borderRadius: "10px",
            padding: "20px",
            whiteSpace: "pre-wrap",
            boxShadow: "0 0 15px rgba(0, 255, 128, 0.3)",
          }}
        >
          <pre style={{ margin: 0 }}>{generatedResume}</pre>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              onClick={downloadPDF}
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                padding: "12px 20px",
                cursor: "pointer",
                borderRadius: "5px",
                fontSize: "16px",
                marginRight: "10px",
                transition: "background 0.3s",
              }}
            >
              <Save size={18} style={{ marginRight: "5px" }} />
              Download PDF
            </button>
            <button
              onClick={copyToClipboard}
              style={{
                background: "#17a2b8",
                color: "white",
                border: "none",
                padding: "12px 20px",
                cursor: "pointer",
                borderRadius: "5px",
                fontSize: "16px",
                transition: "background 0.3s",
              }}
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
