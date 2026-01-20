import React, { useState, useEffect, useRef } from 'react';

interface StatCounterProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  duration?: number;
  suffix?: string;
}

const StatCounter: React.FC<StatCounterProps> = ({ 
  value, 
  label, 
  icon, 
  duration = 2000,
  suffix = ""
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounter();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounter = () => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Fonction d'easing pour un effet plus naturel
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const newValue = Math.floor(startValue + (value - startValue) * easeOutExpo);
      
      setCurrentValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCurrentValue(value);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  return (
    <div 
      ref={elementRef}
      className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-300 text-center"
    >
      <div className="text-2xl mb-2 text-[#f4a6a9]">{icon}</div>
      <div className="text-2xl font-bold text-[#f4a6a9] mb-1">
        {currentValue}{suffix}{value > 100 && currentValue === value ? '+' : ''}
      </div>
      <div className="text-xs text-[#7a6a67] font-medium leading-tight">
        {label}
      </div>
    </div>
  );
};

export default StatCounter;