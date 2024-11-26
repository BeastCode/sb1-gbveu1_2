export interface Media {
  id: string;
  type: 'audio' | 'image' | 'video';
  url: string;
  name: string;
  duration?: number;
  thumbnail?: string;
}

export interface ProjectSettings {
  format: 'landscape' | 'portrait' | 'square';
  width: number;
  height: number;
}

export interface LyricLine {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  style: TextStyle;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  animation: string;
}

export interface Timeline {
  id: string;
  tracks: Track[];
  duration: number;
  currentTime: number;
}

export interface Track {
  id: string;
  type: 'media' | 'lyrics';
  items: (Media | LyricLine)[];
}