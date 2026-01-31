import { useState, useEffect, useRef } from 'react';

export const useAnimatedValue = (targetValue: number, duration = 300): number => {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (displayValue === targetValue) return;

    const startValue = displayValue;
    const startTime = Date.now();
    const endTime = startTime + duration;

    const animate = () => {
      const now = Date.now();
      if (now >= endTime) {
        setDisplayValue(targetValue);
        return;
      }

      const progress = (now - startTime) / duration;
      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetValue - startValue) * easeOut;
      setDisplayValue(Math.round(currentValue));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  // Handle initial value
  useEffect(() => {
    setDisplayValue(targetValue);
  }, []);

  return displayValue;
};

export default useAnimatedValue;
