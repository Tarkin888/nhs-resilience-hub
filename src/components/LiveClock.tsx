import { memo, useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const LiveClock = memo(() => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const dateString = currentTime.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div 
      className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg shadow-sm border"
      role="timer"
      aria-label={`Current time: ${timeString}, ${dateString}`}
    >
      <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground font-mono tracking-wider">
          {timeString}
        </span>
        <span className="text-[10px] text-muted-foreground hidden sm:block">
          {dateString}
        </span>
      </div>
    </div>
  );
});

LiveClock.displayName = 'LiveClock';

export default LiveClock;
