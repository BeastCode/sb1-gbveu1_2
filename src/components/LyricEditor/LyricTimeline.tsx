import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useEditorStore } from '../../store/editorStore';
import { Media } from '../../types/editor';

export const LyricTimeline: React.FC = () => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeline = useEditorStore((state) => state.timeline);
  const isPlaying = useEditorStore((state) => state.isPlaying);

  useEffect(() => {
    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4B5563',
        progressColor: '#3B82F6',
        cursorColor: '#EF4444',
        barWidth: 2,
        barGap: 1,
        responsive: true,
        height: 60,
        normalize: true,
        backend: 'WebAudio',
      });

      wavesurfer.current.on('ready', () => {
        setIsReady(true);
        setError(null);
      });

      wavesurfer.current.on('error', (err) => {
        console.error('WaveSurfer error:', err);
        setError('Failed to load audio. Please check the file format.');
        setIsReady(false);
      });

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
          wavesurfer.current = null;
        }
      };
    }
  }, []);

  const loadAudio = async (media: Media) => {
    if (!wavesurfer.current) return;

    try {
      setIsReady(false);
      setError(null);
      
      // Create an audio context to check if the file can be decoded
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const response = await fetch(media.url);
      const arrayBuffer = await response.arrayBuffer();
      
      // Try to decode the audio data first
      await audioContext.decodeAudioData(arrayBuffer);
      
      // If decoding succeeds, load it into wavesurfer
      wavesurfer.current.load(media.url);
    } catch (err) {
      console.error('Audio loading error:', err);
      setError('This audio format is not supported. Please use MP3 or WAV files.');
      setIsReady(false);
    }
  };

  useEffect(() => {
    const audioTrack = timeline.tracks
      .find(t => t.type === 'media')
      ?.items
      .find(item => 'type' in item && item.type === 'audio') as Media | undefined;

    if (audioTrack) {
      loadAudio(audioTrack);
    }
  }, [timeline]);

  useEffect(() => {
    if (!isReady || !wavesurfer.current) return;

    try {
      if (isPlaying) {
        wavesurfer.current.play();
      } else {
        wavesurfer.current.pause();
      }
    } catch (error) {
      console.error('Playback error:', error);
      setError('Playback failed. Please try reloading the page.');
    }
  }, [isPlaying, isReady]);

  return (
    <div className="w-full bg-gray-900 p-4 rounded-lg">
      <div ref={waveformRef} className="w-full" />
      {error && (
        <div className="mt-2 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
      {!error && !isReady && (
        <div className="mt-2 text-gray-400 text-sm text-center">
          Loading waveform...
        </div>
      )}
    </div>
  );
};