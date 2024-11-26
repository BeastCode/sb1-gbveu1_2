import { create } from 'zustand';
import { Timeline, Media, LyricLine, ProjectSettings } from '../types/editor';

interface EditorState {
  timeline: Timeline;
  mediaLibrary: Media[];
  selectedItemId: string | null;
  isPlaying: boolean;
  projectSettings: ProjectSettings;
  timelineScale: number;
  setProjectSettings: (settings: ProjectSettings) => void;
  setTimeline: (timeline: Timeline) => void;
  addMedia: (media: Media) => void;
  removeMedia: (id: string) => void;
  addToTimeline: (media: Media, trackId?: string, startTime?: number) => void;
  addLyricLine: (line: LyricLine) => void;
  setCurrentTime: (time: number) => void;
  togglePlayback: () => void;
  selectItem: (id: string | null) => void;
  setItemTime: (id: string, startTime: number, duration: number) => void;
  setTimelineScale: (scale: number) => void;
}

const DEFAULT_SETTINGS: ProjectSettings = {
  format: 'landscape',
  width: 1920,
  height: 1080,
};

export const useEditorStore = create<EditorState>((set) => ({
  timeline: {
    id: 'main-timeline',
    tracks: [
      { id: 'media-track-1', type: 'media', items: [], duration: 0 },
      { id: 'media-track-2', type: 'media', items: [], duration: 0 },
      { id: 'lyrics-track', type: 'lyrics', items: [], duration: 0 },
    ],
    duration: 0,
    currentTime: 0,
  },
  mediaLibrary: [],
  selectedItemId: null,
  isPlaying: false,
  projectSettings: DEFAULT_SETTINGS,
  timelineScale: 100, // pixels per second

  setProjectSettings: (settings) => set({ projectSettings: settings }),
  
  setTimeline: (timeline) => set({ timeline }),
  
  addMedia: (media) => set((state) => ({ 
    mediaLibrary: [...state.mediaLibrary, media] 
  })),
  
  removeMedia: (id) => set((state) => ({
    mediaLibrary: state.mediaLibrary.filter((media) => media.id !== id),
    timeline: {
      ...state.timeline,
      tracks: state.timeline.tracks.map((track) => ({
        ...track,
        items: track.items.filter((item) => item.id !== id),
      })),
    },
  })),

  addToTimeline: (media, trackId, startTime = 0) => set((state) => {
    const tracks = state.timeline.tracks.map((track) => {
      if (track.type !== 'media' || (trackId && track.id !== trackId)) {
        return track;
      }

      const mediaWithPosition = {
        ...media,
        startTime,
      };

      return {
        ...track,
        items: [...track.items, mediaWithPosition],
        duration: Math.max(track.duration, startTime + (media.duration || 0)),
      };
    });

    const maxDuration = Math.max(...tracks.map((t) => t.duration));

    return {
      timeline: {
        ...state.timeline,
        tracks,
        duration: maxDuration,
      },
    };
  }),

  addLyricLine: (line) => set((state) => {
    const tracks = state.timeline.tracks.map((track) =>
      track.type === 'lyrics'
        ? {
            ...track,
            items: [...track.items, line],
            duration: Math.max(track.duration, line.endTime),
          }
        : track
    );

    return {
      timeline: {
        ...state.timeline,
        tracks,
        duration: Math.max(...tracks.map((t) => t.duration)),
      },
    };
  }),

  setCurrentTime: (time) => set((state) => ({
    timeline: { ...state.timeline, currentTime: time }
  })),

  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  selectItem: (id) => set({ selectedItemId: id }),

  setItemTime: (id, startTime, duration) => set((state) => ({
    timeline: {
      ...state.timeline,
      tracks: state.timeline.tracks.map((track) => ({
        ...track,
        items: track.items.map((item) => {
          if (item.id !== id) return item;
          if ('duration' in item) {
            return { ...item, startTime, duration };
          }
          return {
            ...item,
            startTime,
            endTime: startTime + duration,
          };
        }),
      })),
    },
  })),

  setTimelineScale: (scale) => set({ timelineScale: scale }),
}));