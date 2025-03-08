import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import robot3 from "../assets/robot3.gif";

const MockInterview = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isWebCamOn, setIsWebCamOn] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [micStream, setMicStream] = useState(null);

  const questions = [
    "Tell me about yourself.",
    "Why do you want to work with us?",
    "What are your strengths and weaknesses?",
  ];

  useEffect(() => {
    // Load the first question
    setQuestion(questions[0]);

    // Cleanup on component unmount
    return () => {
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [micStream, stream]);

  const setupSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API is not supported in this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started.');
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      console.log('Speech recognized:', speechResult);
      setAnswer(speechResult);
    };

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended.');
      setIsRecording(false);
      evaluateAnswer(answer);
    };

    return recognition;
  };

  const startRecording = () => {
    setIsRecording(true);
    const recognition = setupSpeechRecognition();
    if (recognition) {
      recognition.start();
    }
  };

  const evaluateAnswer = async (answer) => {
    try {
      const response = await fetch('https://api.gemini.com/evaluate', {
        method: 'POST',
        body: JSON.stringify({ answer }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log(result);
      // Display or process the evaluation result as needed
    } catch (error) {
      console.error('Error evaluating answer:', error);
    }
  };

  const toggleMic = async () => {
    if (isMicOn) {
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
      setIsMicOn(false);
    } else {
      try {
        const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicStream(mic);
        setIsMicOn(true);
      } catch (error) {
        console.error('Error accessing microphone: ', error);
      }
    }
  };

  const toggleWebCam = async () => {
    if (isWebCamOn) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);
      setIsWebCamOn(false);
    } else {
      try {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = cam;
        setStream(cam);
        setIsWebCamOn(true);
      } catch (error) {
        console.error('Error accessing webcam: ', error);
      }
    }
  };

  return (
    <div className="min-h-screen  text-white py-10 sm:my-20">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold mb-8">
          Mock Interview - Role {id}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Interview Question and Video Feed */}
          <div className="flex flex-col space-y-6">
            <div className="bg-gradient-to-r from-blue-800 to-purple-800 p-6 rounded-2xl shadow-xl">
              <p className="text-xl text-gray-300 text-center">{question}</p>
              <div className="relative mt-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-80 object-cover rounded-xl border-4 border-transparent shadow-2xl"
                />
                <div className="absolute bottom-4 left-4 flex space-x-4">
                  <button
                    onClick={toggleWebCam}
                    className={`${
                      isWebCamOn ? 'bg-red-500' : 'bg-green-500'
                    } text-white py-2 px-4 rounded-lg shadow transition duration-300 hover:opacity-80`}
                  >
                    {isWebCamOn ? 'Turn Off Webcam' : 'Turn On Webcam'}
                  </button>
                  <button
                    onClick={toggleMic}
                    className={`${
                      isMicOn ? 'bg-red-500' : 'bg-yellow-500'
                    } text-white py-2 px-4 rounded-lg shadow transition duration-300 hover:opacity-80`}
                  >
                    {isMicOn ? 'Turn Off Mic' : 'Turn On Mic'}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={startRecording}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-8 rounded-2xl shadow-lg hover:from-pink-400 hover:to-purple-400 transition duration-300"
            >
              {isRecording ? 'Recording...' : 'Start Speaking'}
            </button>
          </div>

          {/* Right Side - Answer and Robot */}
          <div className="flex flex-col space-y-6">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold text-center mb-4">Your Answer</h2>
              <div className="text-lg p-4 border-2 border-transparent rounded-md text-gray-100 bg-black bg-opacity-40">
                {answer || "Your speech will appear here..."}
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={robot3}
                alt="3D Robot"
                className="w-64 h-64 rounded-lg shadow-xl transform transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
