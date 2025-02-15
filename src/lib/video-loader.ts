export const preloadVideo = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";

    video.onloadeddata = () => resolve();
    video.onerror = () => reject();

    video.src = url;
  });
};

export const getOptimizedVideoUrl = (
  url: string,
  options: { quality?: "low" | "medium" | "high" } = {},
) => {
  // If it's a Vimeo URL, add quality parameters
  if (url.includes("vimeo.com")) {
    const quality = options.quality || "medium";
    const qualityMap = {
      low: "360p",
      medium: "720p",
      high: "1080p",
    };

    // Add quality parameter to Vimeo URL
    return `${url}#quality=${qualityMap[quality]}`;
  }

  return url;
};
