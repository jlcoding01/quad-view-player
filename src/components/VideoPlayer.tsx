import React from "react";
import Plyr from "plyr-react";
import "plyr/dist/plyr.css";
import Hls from "hls.js";
import {
  extractYoutubeId,
  extractVimeoId,
  extractDailymotionId,
  isHlsSupported,
  setupTorrent,
} from "../utils/videoUtils";
import { VideoSource } from "../types";

interface VideoPlayerProps {
  source: VideoSource;
  onError?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source, onError }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [streamUrl, setStreamUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let hls: Hls | null = null;

    const setup = async () => {
      if (!videoRef.current) return;

      if (source.type === "magnet") {
        try {
          const url = await setupTorrent(source.url);
          setStreamUrl(url);
        } catch (e) {
          console.error("Magnet error", e);
          onError?.();
        }
      }

      if (source.type === "hls" && isHlsSupported()) {
        hls = new Hls();
        hls.loadSource(source.url);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.error("HLS fatal error", data);
            onError?.();
          }
        });
      } else if (
        source.type === "hls" &&
        videoRef.current?.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = source.url;
      }
    };

    setup();

    return () => {
      if (hls) hls.destroy();
      if (streamUrl) URL.revokeObjectURL(streamUrl);
    };
  }, [source]);

  if (!source.isLoaded) return null;

  const renderNativePlayer = (src: string, type: string) => (
    <video
      ref={videoRef}
      src={src}
      controls
      className="w-full h-full"
      autoPlay
      playsInline
    >
      <source src={src} type={type} />
      Your browser does not support the video tag.
    </video>
  );

  // Native video types
  if (source.type === "mp4") {
    return renderNativePlayer(source.url, "video/mp4");
  }

  if (source.type === "hls" || source.type === "magnet") {
    const urlToPlay = source.type === "magnet" ? streamUrl : source.url;
    if (!urlToPlay) return <div className="text-white">Loading...</div>;
    return renderNativePlayer(urlToPlay, "video/mp4");
  }

  // Plyr-supported types
  const getPlyrSource = () => {
    switch (source.type) {
      case "youtube":
        return {
          type: "video",
          sources: [
            { src: extractYoutubeId(source.url) || "", provider: "youtube" },
          ],
        };
      case "vimeo":
        return {
          type: "video",
          sources: [
            { src: extractVimeoId(source.url) || "", provider: "vimeo" },
          ],
        };
      case "dailymotion":
        return {
          type: "video",
          sources: [
            {
              src: extractDailymotionId(source.url) || "",
              provider: "dailymotion",
            },
          ],
        };
      default:
        return null;
    }
  };

  const plyrSource = getPlyrSource();
  if (!plyrSource) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-800 text-white">
        Unsupported or unrecognized format.
      </div>
    );
  }

  return (
    <div className="h-full">
      <Plyr
        source={plyrSource}
        options={{
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "captions",
            "settings",
            "pip",
            "airplay",
            "fullscreen",
          ],
          ratio: "16:9",
          seekTime: 10,
        }}
      />
    </div>
  );
};

export default VideoPlayer;
