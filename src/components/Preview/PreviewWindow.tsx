import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';

export const PreviewWindow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { timeline, isPlaying, projectSettings } = useEditorStore();
  const mediaRefs = useRef<Map<string, HTMLMediaElement>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get current media items that should be visible
      const currentTime = timeline.currentTime;
      const visibleMedia = timeline.tracks
        .flatMap(track => track.items)
        .filter(item => 
          'type' in item && 
          (item.type === 'image' || item.type === 'video') &&
          item.startTime <= currentTime &&
          (item.startTime + (item.duration || 0)) > currentTime
        );

      // Render each visible item
      visibleMedia.forEach(media => {
        if ('type' in media) {
          const element = mediaRefs.current.get(media.id);
          if (element) {
            ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
          }
        }
      });

      if (isPlaying) {
        requestAnimationFrame(render);
      }
    };

    render();
  }, [timeline, isPlaying, projectSettings]);

  // Load and manage media elements
  useEffect(() => {
    const mediaItems = timeline.tracks
      .flatMap(track => track.items)
      .filter(item => 'type' in item && (item.type === 'image' || item.type === 'video'));

    mediaItems.forEach(media => {
      if ('type' in media && !mediaRefs.current.has(media.id)) {
        const element = media.type === 'video' 
          ? document.createElement('video')
          : document.createElement('img');
        
        element.src = media.url;
        if (element instanceof HTMLVideoElement) {
          element.muted = true;
          element.loop = true;
        }
        
        mediaRefs.current.set(media.id, element);
      }
    });

    // Cleanup unused media elements
    mediaRefs.current.forEach((_, id) => {
      if (!mediaItems.find(item => item.id === id)) {
        mediaRefs.current.delete(id);
      }
    });
  }, [timeline.tracks]);

  return (
    <canvas
      ref={canvasRef}
      width={projectSettings.width}
      height={projectSettings.height}
      className="w-full h-full object-contain bg-black rounded-lg"
    />
  );
};