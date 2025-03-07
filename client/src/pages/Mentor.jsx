import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const Mentor = () => {
  const { getRootProps, getInputProps } = useDropzone();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "Mentor", time: new Date().toLocaleTimeString() },
      ]);
      setMessage("");
    }
  };

  const handleDropFiles = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white flex flex-col mt-20">
      <header className="flex justify-between items-center p-6 bg-transparent rounded-b-xl shadow-xl">
        <h1 className="text-4xl font-bold text-glow hover:text-blue-400 transition duration-300">One-on-One Mentorship</h1>
        <button className="bg-blue-600 px-6 py-3 rounded-full text-white hover:bg-blue-500 hover:scale-105 transition duration-300">
          Start Mentoring
        </button>
      </header>

      <main className="flex flex-col lg:flex-row container mx-auto p-8 space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Left Section (1/3) - Chat and File Sharing */}
        <section className="lg:w-1/3 w-full p-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Chat with Mentee</h2>

          {/* File upload area */}
          <div
            {...getRootProps()}
            className="border-4 border-dashed border-blue-400 p-8 rounded-xl hover:bg-blue-400/10 transition cursor-pointer mb-4 shadow-lg"
          >
            <input {...getInputProps()} onDrop={handleDropFiles} />
            <p className="text-center text-lg text-blue-300">Drag & drop files here, or click to upload</p>
          </div>

          {/* File list display */}
          {files.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg text-blue-500 mb-2">Uploaded Files:</h3>
              <ul className="list-disc pl-5">
                {files.map((file, index) => (
                  <li key={index} className="text-sm text-white">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex flex-col space-y-4 h-96 overflow-auto p-4 bg-gray-900 border-2 border-blue-400 rounded-xl shadow-xl">
            <div className="flex-1 overflow-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === "Mentor" ? "text-right" : "text-left"}`}>
                  <div className={`inline-block ${msg.sender === "Mentor" ? "bg-blue-500 text-white" : "bg-gray-600 text-white"} px-4 py-2 rounded-lg shadow-md`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs block text-gray-400">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-blue-400 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 px-6 py-2 rounded-full text-white hover:bg-blue-400 hover:scale-105 transition duration-300"
              >
                Send
              </button>
            </div>
          </div>
        </section>

        {/* Right Section (2/3) - Video Call */}
        <section className="lg:w-2/3 w-full p-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Live Video Call</h2>
          <div className="flex justify-center items-center h-72 rounded-xl shadow-2xl transition-transform transform hover:scale-105">
            {/* Placeholder for video call */}
            <p className="text-lg text-white">Live Video Call will appear here</p>
          </div>
        </section>
      </main>

      <footer className="text-center py-6 bg-gray-800 mt-12 rounded-t-xl shadow-xl">
        <p className="text-sm text-blue-300">Mentorship System © 2025</p>
      </footer>
    </div>
  );
};

export default Mentor;
