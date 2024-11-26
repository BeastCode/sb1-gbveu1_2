import React, { useState } from 'react';
import { Music, Video, Image, Type } from 'lucide-react';
import { Media, LyricLine } from '../../types/editor';

interface TimelineItemProps {
  item: Media | LyricLine;
  scale: number;
  isSelected: boolean;
  onResize: (id: string, startTime: number, duration: number) => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  scale,
  isSelected,
  onResize,
}) => {
  const isMedia = 'type' in item;
  const [isDragging, setIsDragging] = useState(false);
  const startTime = isMedia ? (item as Media).startTime || 0 : item.startTime;
  const duration = isMedia ? (item.duration || 0) : (item.endTime - item.startTime);
  
  const getIcon = () => {
    if (!isMedia) return <Type className="w-4 h-4" />;
    switch (item.type) {
      case 'audio':
        return <Music className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
    }
  };

  const handleResizeStart = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.stopPropagation();
    const startX = e.clientX;
    const initialStartTime = startTime;
    const initialDuration = duration;
    
    const handleMouseMove = (e: MouseEvent) => {
      const delta = (e.clientX - startX) / scale;
      
      if (direction === 'right') {
        // Right resize: adjust duration
        const newDuration = Math.max(0.1, initialDuration + delta);
        onResize(item.id, initialStartTime, newDuration);
      } else {
        // Left resize: adjust start time and duration
        const maxStartDelta = initialStartTime + initialDuration - 0.1;
        const newStartTime = Math.max(0, Math.min(maxStartDelta, initialStartTime + delta));
        const newDuration = initialDuration - (newStartTime - initialStartTime);
        onResize(item.id, newStartTime, newDuration);
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const initialStartTime = startTime;
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const delta = (e.clientX - startX) / scale;
      const newStartTime = Math.max(0, initialStartTime + delta);
      onResize(item.id, newStartTime, duration);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`absolute top-6 h-[calc(100%-24px)] select-none
        ${isSelected ? 'z-10 ring-2 ring-blue-500' : ''}
        ${isMedia ? 'bg-blue-600' : 'bg-green-600'}
        ${isDragging ? 'opacity-75' : 'opacity-90'}
        rounded-md hover:opacity-100 transition-opacity`}
      style={{
        left: `${startTime * scale}px`,
        width: `${duration * scale}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleDragStart}
    >
      <div className="flex items-center h-full px-2 space-x-2 overflow-hidden">
        {getIcon()}
        <span className="text-xs text-white truncate">
          {isMedia ? item.name : item.text}
        </span>
      </div>
      
      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize hover:bg-white/20"
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      />
      
      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-white/20"
        onMouseDown={(e) => handleResizeStart(e, 'right')}
      />
    </div>
  );
};