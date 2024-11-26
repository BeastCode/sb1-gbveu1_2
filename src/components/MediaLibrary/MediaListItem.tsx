import React from 'react';
import { Trash2 } from 'lucide-react';
import { Media } from '../../types/editor';
import { MediaPreview } from './MediaPreview';

interface MediaListItemProps {
  media: Media;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent, media: Media) => void;
}

export const MediaListItem: React.FC<MediaListItemProps> = ({ media, onRemove, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, media)}
    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-move group"
  >
    <div className="flex items-center space-x-3">
      <MediaPreview media={media} />
      <div className="flex flex-col">
        <span className="text-sm font-medium truncate max-w-[150px]">
          {media.name}
        </span>
        <span className="text-xs text-gray-400">
          {media.type}
          {media.duration && ` • ${Math.round(media.duration)}s`}
        </span>
      </div>
    </div>
    <button
      onClick={() => onRemove(media.id)}
      className="p-1 hover:bg-gray-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Trash2 className="w-4 h-4 text-red-400" />
    </button>
  </div>
);