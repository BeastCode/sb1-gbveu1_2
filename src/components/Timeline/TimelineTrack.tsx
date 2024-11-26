import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Track, Media } from '../../types/editor';
import { TimelineItem } from './TimelineItem';
import { useEditorStore } from '../../store/editorStore';

interface TimelineTrackProps {
  track: Track;
  onItemClick: (id: string | null) => void;
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({ track, onItemClick }) => {
  const { timelineScale: scale, setItemTime, selectedItemId, addToTimeline } = useEditorStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleItemResize = (itemId: string, startTime: number, duration: number) => {
    setItemTime(itemId, startTime, duration);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const jsonData = e.dataTransfer.getData('application/json');
    
    if (!jsonData) {
      console.warn('No data received during drop');
      return;
    }

    try {
      const mediaData = JSON.parse(jsonData) as Media;
      
      // Validate the parsed data has required Media properties
      if (!mediaData.id || !mediaData.type || !mediaData.url || !mediaData.name) {
        throw new Error('Invalid media data structure');
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - 64; // 64px is the width of the track header
      const dropTime = Math.max(0, offsetX / scale);
      
      addToTimeline(mediaData, track.id, dropTime);
    } catch (error) {
      console.error('Failed to parse dropped media:', error);
      // We could show a user-friendly error message here if needed
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative h-24 bg-gray-800 border-b border-gray-700 group"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      {...attributes}
      {...listeners}
    >
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-900 border-r border-gray-700 flex items-center justify-center z-10">
        <span className="text-xs text-gray-400 font-medium">
          {track.type === 'media' ? 'Media' : 'Lyrics'}
        </span>
      </div>
      
      <div className="absolute left-16 right-0 top-0 bottom-0">
        <div className="relative h-full">
          {track.items.map((item) => (
            <TimelineItem
              key={item.id}
              item={item}
              scale={scale}
              isSelected={item.id === selectedItemId}
              onResize={handleItemResize}
              onClick={() => onItemClick(item.id)}
            />
          ))}
        </div>
        
        <div className="absolute top-0 left-0 right-0 h-6 border-b border-gray-700">
          {Array.from({ length: Math.ceil(track.duration / 5) }).map((_, i) => (
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
      </div>
    </div>
  );
};