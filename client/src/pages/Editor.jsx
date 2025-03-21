import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import axios from "axios";

const languageExtensions = {
  71: python(),
  63: javascript(),
  62: java(),
  54: cpp(),
};

const languageNames = {
  71: "Python",
  63: "JavaScript",
  62: "Java",
  54: "C++",
};

const Editor = () => {
  const [code, setCode] = useState("print('Hello, World!')");
  const [languageId, setLanguageId] = useState(71);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const executeCode = async () => {
    setLoading(true);
    setOutput("Running...");

    // Scroll to top when executing code
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const response = await axios.post("http://localhost:5000/execute", {
        code,
        languageId,
      });
      setOutput(response.data.stdout || "No output");
    } catch (error) {
      setOutput(`Error executing code: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 w-full max-w-4xl mx-auto p-8 bg-gradient-to-b from-gray-900 to-gray-800 bg-opacity-95 rounded-xl shadow-2xl transition-all duration-300 ease-in-out sm:mb-10 sm:mt-20">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r gradient-text mb-4">
          Code Editor
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-48">
            <label
              htmlFor="language-select"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Language
            </label>
            <select
              id="language-select"
              value={languageId}
              onChange={(e) => setLanguageId(parseInt(e.target.value))}
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            >
              {Object.entries(languageNames).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={executeCode}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            } transition-colors duration-200 flex items-center gap-2`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Running...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-6 border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <CodeMirror
          value={code}
          theme={oneDark}
          extensions={[languageExtensions[languageId]]}
          onChange={(value) => setCode(value)}
          height="300px"
          className="overflow-hidden"
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Output</h3>
        <pre className="bg-gray-800 text-white p-4 rounded-xl overflow-x-auto whitespace-pre-wrap min-h-16 max-h-64 transition-all duration-300">
          {output || "Your code output will appear here"}
        </pre>
      </div>
    </div>
  );
};

export default Editor;
