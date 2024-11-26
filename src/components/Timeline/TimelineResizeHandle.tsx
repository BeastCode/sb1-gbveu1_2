import React from 'react';

interface TimelineResizeHandleProps {
  direction: 'left' | 'right';
  onMouseDown: (e: React.MouseEvent, direction: 'left' | 'right') => void;
}

export const TimelineResizeHandle: React.FC<TimelineResizeHandleProps> = ({ direction, onMouseDown }) => (
  <div
    className={`absolute ${direction}-0 top-0 bottom-0 w-2 cursor-${direction === 'left' ? 'w' : 'e'}-resize hover:bg-white/20`}
    onMouseDown={(e) => onMouseDown(e, direction)}
  />
);