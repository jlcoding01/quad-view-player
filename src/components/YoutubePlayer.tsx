import React, { useEffect, useRef } from 'react';
import { extractYoutubeId } from '../utils/videoUtils';

interface YoutubePlayerProps {
  url: string;
  onError?: () => void;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ url, onError }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoId = extractYoutubeId(url);
  
  useEffect(() => {
    if (!videoId && onError) {
      onError();
    }
  }, [videoId, onError]);
  
  if (!videoId) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        Invalid YouTube URL
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full overflow-hidden rounded-md">
      <iframe
        ref={iframeRef}
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&modestbranding=1&rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YoutubePlayer;