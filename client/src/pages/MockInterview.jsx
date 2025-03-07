import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import robot3 from "../assets/robot3.gif"

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

    return () => {
      // Cleanup when component unmounts
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [micStream, stream]);

  const setupSpeechRecognition = () => {
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
    const response = await fetch('https://api.gemini.com/evaluate', {
      method: 'POST',
      body: JSON.stringify({ answer }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    console.log(result); // You can show the result to the user
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
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-purple-900 to-black text-white flex items-center justify-center py-10">
      <div className="flex flex-col lg:flex-row items-center w-full max-w-screen-xl px-4 space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Left side - User's Video */}
        <div className="relative w-full max-w-3xl">
          <div className="bg-gradient-to-r from-blue-800 to-purple-800 p-8 rounded-2xl shadow-xl">
            <h1 className="text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 text-center mb-6">
              Mock Interview - Role {id}
            </h1>
            <p className="text-xl text-gray-300 mb-4 text-center">{question}</p>

            {/* User's Video Feed */}
            <div className="relative mb-4 w-full">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-80 rounded-xl border-4 border-gradient-to-r from-blue-500 to-purple-600 shadow-2xl"
              />
              {/* Mic & Webcam Buttons */}
              <div className="absolute bottom-4 left-4 flex space-x-4">
                <button
                  onClick={toggleWebCam}
                  className={`${
                    isWebCamOn ? 'bg-red-500' : 'bg-green-500'
                  } text-white py-2 px-4 rounded-lg shadow-lg transition duration-300`}
                >
                  {isWebCamOn ? 'Turn Off Webcam' : 'Turn On Webcam'}
                </button>

                <button
                  onClick={toggleMic}
                  className={`${
                    isMicOn ? 'bg-red-500' : 'bg-yellow-500'
                  } text-white py-2 px-4 rounded-lg shadow-lg transition duration-300`}
                >
                  {isMicOn ? 'Turn Off Mic' : 'Turn On Mic'}
                </button>
              </div>
            </div>
          </div>

          {/* Recording Button */}
          <button
            onClick={startRecording}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-8 rounded-2xl shadow-lg hover:bg-gradient-to-l hover:from-pink-400 hover:to-purple-400 transition duration-300 w-full mt-6"
          >
            {isRecording ? 'Recording...' : 'Start Speaking'}
          </button>
        </div>

        {/* Right side - Answer Section */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-8 rounded-2xl shadow-xl w-full max-w-3xl mt-6 lg:mt-100">
          <div className="text-2xl font-semibold text-white mb-4">Your Answer:</div>
          <div className="text-lg p-4 border-2 border-gradient-to-r from-blue-500 to-purple-600 rounded-md text-gray-100 mt-2 bg-black bg-opacity-40">
            {answer || "Your speech will appear here..."}
          </div>
        </div>
      </div>

      {/* Right side - 3D Robot */}
      <div className="absolute w-1/4 flex justify-center items-center hidden lg:flex ml-100 mb-40">
        <img
          src= {robot3}
          alt="3D Robot"
          className="w-72 h-72 rounded-lg shadow-xl transform transition-transform duration-500 hover:scale-110"
        />
      </div>
    </div>
  );
};

export default MockInterview;
