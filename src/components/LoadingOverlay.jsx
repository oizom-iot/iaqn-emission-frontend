import React, { useState, useEffect } from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ isVisible }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  
  // Cooking-themed recipe messages that will appear one by one with a natural progression
  const loadingMessages = [
    "Gathering fresh ingredients from emission sources...",
    "Mixing in local environmental factors...",
    "Simmering the data to extract key pollutants...",
    "Folding in health impact assessments...",
    "Sprinkling in weather patterns and conditions...",
    "Garnishing with geographical context..."
  ];
  
  // Final message that continues the cooking theme and maintains the same style
  const fallbackMessage = "Plating up your recipe for cleaner air...";


  useEffect(() => {
    if (!isVisible) {
      // Reset state when overlay is hidden
      setCurrentMessageIndex(0);
      setShowMessage(false);
      setShowFallbackMessage(false);
      return;
    }

    // Show first message immediately
    setShowMessage(true);
    
    // Set up message rotation with smooth transitions
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => {
        // If we've reached the last message, show fallback message
        if (prevIndex >= loadingMessages.length - 1) {
          setShowFallbackMessage(true);
          clearInterval(messageInterval);
          return prevIndex;
        }
        return prevIndex + 1;
      });
      
      // Trigger fade-out/fade-in animation for each new message
      setShowMessage(false);
      setTimeout(() => setShowMessage(true), 400); // Slightly longer transition for smoother effect
    }, 3000); // Show a new message every 3 seconds to give users time to read

    return () => clearInterval(messageInterval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-message-container">
          {showFallbackMessage ? (
            <div className="loading-message message-visible cooking-message">
              {fallbackMessage}
            </div>
          ) : (
            <div className={`loading-message cooking-message ${showMessage ? 'message-visible' : ''}`}>
              {loadingMessages[currentMessageIndex]}
            </div>
          )}
          <div className="loading-progress">
            <div 
              className="loading-progress-bar" 
              style={{ width: `${((currentMessageIndex + 1) / loadingMessages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;