import React, { useState, memo } from "react";
import { PanelState } from "../types";
import VideoPlayer from "./VideoPlayer";
import { getVideoType, isValidVideoUrl } from "../utils/videoUtils";
import { Video } from "lucide-react";

interface VideoPanelProps {
  panelState: PanelState;
  onPanelUpdate: (updatedPanel: PanelState) => void;
}

const VideoPanel: React.FC<VideoPanelProps> = memo(
  ({ panelState, onPanelUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onPanelUpdate({
        ...panelState,
        inputValue: e.target.value,
      });
    };

    const handleLoadVideo = () => {
      setError(null);

      if (!panelState.inputValue.trim()) {
        setError("Please enter a video URL");
        return;
      }

      if (!isValidVideoUrl(panelState.inputValue)) {
        setError("Please enter a valid URL");
        return;
      }

      setIsLoading(true);

      const videoType = getVideoType(panelState.inputValue);

      setTimeout(() => {
        onPanelUpdate({
          ...panelState,
          videoSource: {
            url: panelState.inputValue,
            type: videoType,
            isLoaded: true,
          },
        });
        setIsLoading(false);
      }, 500);
    };

    const handleVideoError = () => {
      setError("Failed to load video. Please check the URL and try again.");
      onPanelUpdate({
        ...panelState,
        videoSource: {
          ...panelState.videoSource,
          isLoaded: false,
        },
      });
    };

    return (
      <div className="flex flex-col h-full bg-slate-900 border-[0.5px] border-slate-800">
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <input
              id={`video-url-${panelState.id}`}
              type="text"
              value={panelState.inputValue}
              onChange={handleInputChange}
              placeholder="Paste MP4, HLS, or YouTube URL"
              className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleLoadVideo}
              disabled={isLoading}
              className={`px-2 py-1 rounded text-sm font-medium transition-all ${
                isLoading
                  ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
              }`}
            >
              {isLoading ? "Loading..." : "Load"}
            </button>
          </div>

          {error && (
            <div className="mt-1 px-2 py-1 bg-red-900/50 border border-red-800 rounded">
              <p className="text-red-200 text-xs">{error}</p>
            </div>
          )}
        </div>

        <div className="flex-1 bg-black">
          {panelState.videoSource.isLoaded ? (
            <VideoPlayer
              source={panelState.videoSource}
              onError={handleVideoError}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Video size={48} strokeWidth={1} className="mb-2 opacity-20" />
              <p className="text-sm">No video loaded</p>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.panelState.id === nextProps.panelState.id &&
      prevProps.panelState.inputValue === nextProps.panelState.inputValue &&
      prevProps.panelState.videoSource.url ===
        nextProps.panelState.videoSource.url &&
      prevProps.panelState.videoSource.type ===
        nextProps.panelState.videoSource.type &&
      prevProps.panelState.videoSource.isLoaded ===
        nextProps.panelState.videoSource.isLoaded
    );
  }
);

export default VideoPanel;
