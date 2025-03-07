import React, { useState, useEffect } from 'react';
import SplitText from "./SplitText";
//import Splineo from './Splineo';
import HomePage from '../HomePage'; 

function Animation() {
  const [showHome, setShowHome] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out effect before switching to Home
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3000); // Start fading at 4s

    // Switch to Home after 5s
    const switchTimer = setTimeout(() => {
      setShowHome(true);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(switchTimer);
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      {!showHome ? (
        <>
          {/* Splineo - 3D Background (Forced Behind)
          <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <Splineo />
          </div> */}

          {/* SplitText - Force on Top */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${
              fadeOut ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              zIndex: 1000, // High value to ensure it's above WebGL
              pointerEvents: "none", // Prevents interaction issues
            }}
          >
            <SplitText
              text="CodeNexus"
              className="text-6xl font-semibold text-center text-white"
              delay={300}
              animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              easing="easeOutCubic"
              threshold={0.2}
              rootMargin="-50px"
            />
          </div>
        </>
      ) : (
        <HomePage /> // Show Home after 5s
      )}
    </div>
  );
}

export default Animation;
