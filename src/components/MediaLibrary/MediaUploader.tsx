import React, { useCallback, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const ACCEPTED_TYPES = {
  audio: ['audio/mpeg', 'audio/wav'],
  video: ['video/mp4', 'video/webm'],
  image: ['image/jpeg', 'image/png', 'image/gif'],
};

export const MediaUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addMedia } = useEditorStore();

  const validateFile = (file: File) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 100MB limit');
    }

    const type = Object.entries(ACCEPTED_TYPES).find(([_, types]) =>
      types.includes(file.type)
    )?.[0] as 'audio' | 'video' | 'image' | undefined;

    if (!type) {
      throw new Error(`Unsupported file type: ${file.type}. Please use MP3 or WAV for audio, MP4 or WebM for video, and JPG, PNG, or GIF for images.`);
    }

    return type;
  };

  const validateAudioFile = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          await audioContext.decodeAudioData(arrayBuffer);
          resolve();
        } catch (error) {
          reject(new Error('Invalid audio file. Please use MP3 or WAV format.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read audio file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async (file: File) => {
    try {
      const type = validateFile(file);
      
      // Additional validation for audio files
      if (type === 'audio') {
        await validateAudioFile(file);
      }

      const url = URL.createObjectURL(file);
      let duration;
      let thumbnail;

      if (type === 'audio' || type === 'video') {
        const media = document.createElement(type);
        media.src = url;
        duration = await new Promise((resolve) => {
          media.onloadedmetadata = () => resolve(media.duration);
        });

        if (type === 'video') {
          thumbnail = await generateVideoThumbnail(file);
        }
      }

      addMedia({
        id: crypto.randomUUID(),
        type,
        url,
        name: file.name,
        duration,
        thumbnail,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      alert(error instanceof Error ? error.message : 'Error processing file');
    }
  };

  const generateVideoThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      video.currentTime = 1;

      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      files.forEach(processFile);
    },
    [addMedia]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="p-8 border-2 border-dashed border-gray-600 rounded-lg text-center cursor-pointer hover:border-gray-500 transition-colors"
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-400">
        Drag and drop media files here, or click to select files
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Supports MP3, WAV, MP4, WEBM, JPG, PNG, GIF (max 100MB)
      </p>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={Object.values(ACCEPTED_TYPES).flat().join(',')}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          files.forEach(processFile);
          e.target.value = '';
        }}
        multiple
      />
    </div>
  );
};