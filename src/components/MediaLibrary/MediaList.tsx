import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Media } from '../../types/editor';
import { MediaListItem } from './MediaListItem';

export const MediaList: React.FC = () => {
  const { mediaLibrary, removeMedia } = useEditorStore();

  const handleDragStart = (e: React.DragEvent, media: Media) => {
    e.dataTransfer.setData('application/json', JSON.stringify(media));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="mt-4 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
      {mediaLibrary.map((media) => (
        <MediaListItem
          key={media.id}
          media={media}
          onRemove={removeMedia}
          onDragStart={handleDragStart}
        />
      ))}
      {mediaLibrary.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No media files added yet
        </div>
      )}
    </div>
  );
};