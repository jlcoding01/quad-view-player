import Hls from "hls.js";
// import WebTorrent from "webtorrent";
// import WebTorrent from "webtorrent/webtorrent.min.js";

export type VideoType =
  | "mp4"
  | "hls"
  | "youtube"
  | "vimeo"
  | "dailymotion"
  | "magnet"
  | "unknown";

const client = new window.WebTorrent();

export const getVideoType = (url: string): VideoType => {
  if (!url) return "unknown";

  // Magnet URL
  if (url.startsWith("magnet:")) {
    return "magnet";
  }

  // YouTube
  if (
    url.includes("youtube.com/watch") ||
    url.includes("youtu.be/") ||
    url.includes("youtube.com/embed")
  ) {
    return "youtube";
  }

  // Vimeo
  if (url.includes("vimeo.com/") || url.includes("player.vimeo.com/video/")) {
    return "vimeo";
  }

  // Dailymotion
  if (url.includes("dailymotion.com/video/") || url.includes("dai.ly/")) {
    return "dailymotion";
  }

  // HLS streams
  if (
    url.endsWith(".m3u8") ||
    url.includes("streaming-url") // Add common streaming URL patterns
  ) {
    return "hls";
  }

  // MP4 files
  if (url.endsWith(".mp4") || url.endsWith(".m4v") || url.endsWith(".mov")) {
    return "mp4";
  }

  return "unknown";
};

export const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;

  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[7].length === 11 ? match[7] : null;
};

export const extractVimeoId = (url: string): string | null => {
  if (!url) return null;

  const regExp =
    /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_-]+)?/i;
  const match = url.match(regExp);

  return match ? match[1] : null;
};

export const extractDailymotionId = (url: string): string | null => {
  if (!url) return null;

  const regExp =
    /^.+dailymotion.com\/(?:video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
  const match = url.match(regExp);

  return match ? match[1] : null;
};

export const isValidVideoUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const isHlsSupported = (): boolean => {
  return Hls.isSupported();
};

export const setupTorrent = (magnetUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.add(magnetUrl, (torrent) => {
      // Find the largest video file
      const file = torrent.files.reduce((largest, file) => {
        const isVideo = /\.(mp4|mkv|webm)$/i.test(file.name);
        return isVideo && (!largest || file.length > largest.length)
          ? file
          : largest;
      }, null);

      if (!file) {
        reject(new Error("No video file found in torrent"));
        return;
      }

      // Create stream URL
      file.streamURL = URL.createObjectURL(new Blob([], { type: "video/mp4" }));

      // Stream the file
      const stream = file.createReadStream();
      const mediaSource = new MediaSource();
      const buffer: Uint8Array[] = [];

      mediaSource.addEventListener("sourceopen", () => {
        const sourceBuffer = mediaSource.addSourceBuffer(
          'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
        );

        stream.on("data", (chunk) => {
          buffer.push(new Uint8Array(chunk));
          if (!sourceBuffer.updating) {
            sourceBuffer.appendBuffer(buffer.shift()!);
          }
        });

        sourceBuffer.addEventListener("updateend", () => {
          if (buffer.length > 0 && !sourceBuffer.updating) {
            sourceBuffer.appendBuffer(buffer.shift()!);
          }
        });
      });

      resolve(file.streamURL);
    });
  });
};
