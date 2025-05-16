export type VideoType =
  | "mp4"
  | "hls"
  | "youtube"
  | "vimeo"
  | "dailymotion"
  | "magnet"
  | "unknown";

export interface VideoSource {
  url: string;
  type: VideoType;
  isLoaded: boolean;
}

export interface PanelState {
  id: number;
  videoSource: VideoSource;
  inputValue: string;
}
