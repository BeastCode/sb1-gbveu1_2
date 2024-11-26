import React from 'react';

interface TimelineTrackHeaderProps {
  type: 'media' | 'lyrics';
}

export const TimelineTrackHeader: React.FC<TimelineTrackHeaderProps> = ({ type }) => (
  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-900 border-r border-gray-700 flex items-center justify-center z-10">
    <span className="text-xs text-gray-400 font-medium">
      {type === 'media' ? 'Media' : 'Lyrics'}
    </span>
  </div>
);