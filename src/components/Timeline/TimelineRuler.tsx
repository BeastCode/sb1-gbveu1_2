import React from 'react';

interface TimelineRulerProps {
  duration: number;
  scale: number;
}

export const TimelineRuler: React.FC<TimelineRulerProps> = ({ duration, scale }) => (
  <div className="absolute top-0 left-0 right-0 h-6 border-b border-gray-700">
    {Array.from({ length: Math.ceil(duration / 5) }).map((_, i) => (
      <div
        key={i}
        className="absolute top-0 bottom-0 border-l border-gray-700"
        style={{ left: `${(i * 5 * scale)}px` }}
      >
        <span className="absolute -left-3 top-1 text-xs text-gray-500">
          {i * 5}s
        </span>
      </div>
    ))}
  </div>
);