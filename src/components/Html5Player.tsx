import React, { useRef, useEffect } from 'react';

interface Html5PlayerProps {
  url: string;
  type: 'mp4' | 'hls';
  onError?: () => void;
}

const Html5Player: React.FC<Html5PlayerProps> = ({ url, type, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;
    
    const handleError = () => {
      if (onError) onError();
    };
    
    videoElement.addEventListener('error', handleError);
    
    return () => {
      videoElement.removeEventListener('error', handleError);
    };
  }, [onError]);
  
  // For HLS support, we would need to add hls.js implementation here
  // For this MVP, we're assuming native browser support for HLS
  
  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full rounded-md"
        controls
        playsInline
        src={url}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Html5Player;