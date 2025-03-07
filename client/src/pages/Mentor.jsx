import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {io} from "socket.io-client";
import { PhoneOutgoing, PhoneIncoming, PhoneOff } from "lucide-react";

const Mentor = () => {
  const { getRootProps, getInputProps } = useDropzone();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const chatContainerRef = useRef(null);
  const [tole,setRole]=useState("Mentor")
  

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const chatElement = document.getElementById("chat");
      const mssg=document.createElement("div");
      mssg.innerHTML=`<div class="flex items-center space-x-4 mt-4">
        <div class="flex-1 space-y-1">
          <div class="text-sm font-medium text-blue-900">Mentor</div>
          <p class="text-sm text-blue-500">${message}</p>
        </div>
      </div>`;
      chatElement.appendChild(mssg);
      chatElement.scrollTop = chatElement.scrollHeight;
    }
  };

  const handleSentMessage = (message) => {
    const chatElement = document.getElementById("chat");
    const mssg=document.createElement("div");
    mssg.innerHTML=`<div class="flex items-center space-x-4 mt-4">
      <div class="flex-1 space-y-1">
        <div class="text-sm font-medium text-green-900">Mentee</div>
        <p class="text-sm text-green-500">${message}</p>
      </div>
    </div>`;
    chatElement.appendChild(mssg);
    chatElement.scrollTop = chatElement.scrollHeight;
  };

  const handleDropFiles = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const socket = io("http://localhost:5100");
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("offer", async (offer) => {
      console.log("Received offer");
      createAnsElems(offer);
    });

    socket.on("answer", async (answer) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("ice-candidate", async (candidate) => {
      if (!peerConnection.current) {
        console.warn("PeerConnection is not initialized. Storing candidate...");
        return;
      }

      if (!peerConnection.current.remoteDescription) {
        console.warn("Remote description not set yet. Retrying in 500ms...");
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("ICE Candidate added successfully");
      } catch (error) {
        console.error("Error adding ICE Candidate:", error);
      }
    });

    socket.on("hangup", () => {
      if (peerConnection.current) {
        endCall();
      }
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("hangup");
    };
  }, []);


  const answerCall = async (offer) => {
    await createPeerConnection(offer);
    await getUserMedia();

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));
    socket.emit("answer", answer);
    setConnected(true);

    const element = document.getElementById("control");
    if (element) element.classList.add("hidden");
  };

  const createPeerConnection = async (offer) => {
    if (peerConnection.current) {
      console.warn("PeerConnection already exists.");
      return;
    }

    console.log("Creating PeerConnection...");
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "turn:your-turn-server.com", username: "user", credential: "pass" },
      ],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log("Remote track received");
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    if (offer) {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    }
  };

  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      } else {
        console.error("localVideoRef is not available yet.");
      }
  
      stream.getTracks().forEach((track) => peerConnection.current?.addTrack(track, stream));
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };
  

  const startCall = async () => {
    await createPeerConnection();
    await getUserMedia();

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(new RTCSessionDescription(offer));
    socket.emit("offer", offer);
    setConnected(true);
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject = null;
    }
    setConnected(false);
    socket.emit("hangup");

    const element = document.getElementById("control");
    if (element) element.classList.add("hidden");
  };

  const createAnsElems = (offer) => {
    const element = document.getElementById("control");
    if (element) {
      element.classList.remove("hidden");
      element.onclick = () => answerCall(offer);
    }
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
            <div id="chat" className="flex-1 overflow-auto">  
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
          <div className="flex space-x-4">
            <video ref={remoteVideoRef} className="w-1/2 h-64 bg-black rounded-xl" autoPlay muted />
            <video ref={localVideoRef} className="w-1/2 h-64 bg-black rounded-xl" autoPlay muted />
          </div>
          <button id="control" className="hidden cursor-pointer p-3 rounded-full bg-green-500 hover:bg-green-600 transition-all flex items-center">
          <PhoneIncoming size={24} />
          <span className="ml-2">Answer Call</span>
        </button>

          <button onClick={startCall} className="cursor-pointer p-3 rounded-full bg-green-500 hover:bg-green-600 transition-all flex items-center">
          <PhoneOutgoing size={24} />
        </button>

        <button onClick={endCall} className="cursor-pointer p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all">
          <PhoneOff size={24} />
        </button>
        </section>
        
      </main>

      <footer className="text-center py-6 bg-gray-800 mt-12 rounded-t-xl shadow-xl">
        <p className="text-sm text-blue-300">Mentorship System © 2025</p>
      </footer>
    </div>
  );
};

export default Mentor;
