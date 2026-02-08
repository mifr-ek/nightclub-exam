import { useEffect, useRef, useState } from "react";
import "../styles/LatestVideo.css";

import video1 from "../assets/media/video-crowd.mp4";
import video2 from "../assets/media/video-dj-crowd1.mp4";
import video3 from "../assets/media/video-dj-crowd-2.mp4";

const videos = [
  { id: "crowd", src: video1 },
  { id: "dj1", src: video2 },
  { id: "dj2", src: video3 },
];

export default function LatestVideo() {
  const [index, setIndex] = useState(0);
  const videoRef = useRef(null);

  function prevVideo() {
    setIndex((i) => (i - 1 + videos.length) % videos.length);
  }

  function nextVideo() {
    setIndex((i) => (i + 1) % videos.length);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    video.load();

    const playPromise = video.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  }, [index]);

  return (
    <section className="latestVideoSection">
      <h2 className="latestVideoHeadline">LATEST VIDEO</h2>

      <img
        src="/assets/bottom_line2.png"
        alt=""
        className="latestvideoBottomLine"
      />

      <div className="latestVideoFrame fullBleed">
        <video
          ref={videoRef}
          className="latestVideo"
          muted
          playsInline
          controls
        >
          <source src={videos[index].src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <span className="latestVideoCorner latestVideoCorner--tl" />
        <span className="latestVideoCorner latestVideoCorner--br" />
      </div>

      <div className="latestVideoControls">
        <button
          className="latestVideoArrow"
          onClick={prevVideo}
          type="button"
          aria-label="Previous video"
        >
          ◀
        </button>

        <button
          className="latestVideoArrow"
          onClick={nextVideo}
          type="button"
          aria-label="Next video"
        >
          ▶
        </button>
      </div>
    </section>
  );
}
