import React from 'react';
import { Music, Image, Video } from 'lucide-react';
import { Media } from '../../types/editor';

interface MediaPreviewProps {
  media: Media;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ media }) => {
  if (media.type === 'audio') {
    return (
      <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center">
        <Music className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  if (media.type === 'video' && media.thumbnail) {
    return (
      <div className="relative w-16 h-16">
        <img src={media.thumbnail} alt={media.name} className="w-full h-full object-cover rounded" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <Video className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  if (media.type === 'image') {
    return <img src={media.url} alt={media.name} className="w-16 h-16 object-cover rounded" />;
  }

  return null;
};