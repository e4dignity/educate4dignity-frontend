import React, { useState, useEffect } from 'react';

interface TypewriterHeroProps {
  className?: string;
}

const TypewriterHero: React.FC<TypewriterHeroProps> = ({ className = "" }) => {
  const phrase = {
    parts: [
      { text: "Hello, I'm ", highlight: false },
      { text: "Jessica", highlight: true },
      { text: "...", highlight: false }
    ]
  };

  const [displayedText, setDisplayedText] = useState('');
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  const typingSpeed = 80; // ms per character
  const pauseAfterComplete = 1000; // ms to pause after completing

  useEffect(() => {
    if (animationComplete) return;

    const timer = setTimeout(() => {
      // Only typing mode - no deletion or alternation
      if (currentPartIndex < phrase.parts.length) {
        const currentPart = phrase.parts[currentPartIndex];
        
        if (currentCharIndex < currentPart.text.length) {
          // Continue typing current part
          setDisplayedText(prev => prev + currentPart.text[currentCharIndex]);
          setCurrentCharIndex(prev => prev + 1);
        } else {
          // Move to next part
          setCurrentPartIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }
      } else {
        // Finished typing all parts
        setTimeout(() => {
          setAnimationComplete(true);
          setShowCursor(false);
        }, pauseAfterComplete);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentPartIndex, currentCharIndex, displayedText, animationComplete, phrase.parts, typingSpeed, pauseAfterComplete]);

  // Cursor blinking effect
  useEffect(() => {
    if (animationComplete) return;
    
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, [animationComplete]);

  // Render the text with proper highlighting
  const renderText = () => {
    let charCount = 0;
    const parts = [];

    for (let i = 0; i < phrase.parts.length; i++) {
      const part = phrase.parts[i];
      const partLength = part.text.length;
      const visibleLength = Math.max(0, Math.min(partLength, displayedText.length - charCount));
      
      if (visibleLength > 0) {
        const visibleText = part.text.substring(0, visibleLength);
        parts.push(
          <span
            key={i}
            className={part.highlight ? "text-[#f4a6a9]" : ""}
          >
            {visibleText}
          </span>
        );
      }
      
      charCount += partLength;
      if (charCount >= displayedText.length) break;
    }

    return parts;
  };

  return (
    <h1 className={`text-4xl lg:text-6xl font-bold text-[#5a4a47] leading-tight ${className}`}>
      {renderText()}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
    </h1>
  );
};

export default TypewriterHero;