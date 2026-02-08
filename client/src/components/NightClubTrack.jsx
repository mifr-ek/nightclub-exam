import { useEffect, useRef, useState } from "react";
import "../styles/NightClubTrack.css";

import blackBoxFunky from "../assets/media/black-box-funky.mp3";
import euphoria from "../assets/media/euphoria.mp3";
import fashionRedTape from "../assets/media/fashion-red-tape.mp3";

const tracks = [
  {
    id: 1,
    title: "BLACK BOX FUNKY",
    cover: "/assets/track1.jpg",
    thumb: "/assets/track1.jpg",
    audio: blackBoxFunky,
  },
  {
    id: 2,
    title: "EUPHORIA",
    cover: "/assets/track2.jpg",
    thumb: "/assets/track2.jpg",
    audio: euphoria,
  },
  {
    id: 3,
    title: "FASHION RED TAPE",
    cover: "/assets/track_thumb.jpg",
    thumb: "/assets/track_thumb.jpg",
    audio: fashionRedTape,
  },
  {
    id: 4,
    title: "NEON HEART",
    cover: "/assets/track4.jpg",
    thumb: "/assets/track4.jpg",
    audio: euphoria,
  },
  {
    id: 5,
    title: "LAST CALL",
    cover: "/assets/track5.jpg",
    thumb: "/assets/track5.jpg",
    audio: blackBoxFunky,
  },
];

export default function NightClubTrack() {
  const audioRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const [autoPlayOnLoad, setAutoPlayOnLoad] = useState(false);

  const active = tracks[activeIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
    setCurrent(0);
    setDuration(0);

    audio.src = active.audio;
    audio.volume = volume;
    audio.load();

    if (!autoPlayOnLoad) return;

    const onCanPlay = async () => {
      audio.removeEventListener("canplay", onCanPlay);

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      } finally {
        setAutoPlayOnLoad(false);
      }
    };

    audio.addEventListener("canplay", onCanPlay);
    return () => audio.removeEventListener("canplay", onCanPlay);
  }, [active.audio, activeIndex, autoPlayOnLoad, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }

  function onLoadedMeta() {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
  }

  function onTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrent(audio.currentTime || 0);
  }

  function seekTo(val) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = val;
    setCurrent(val);
  }

  function selectTrack(i) {
    setAutoPlayOnLoad(true);
    setActiveIndex(i);
  }

  function prevTrack() {
    setAutoPlayOnLoad(true);
    setActiveIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }

  function nextTrack() {
    setAutoPlayOnLoad(true);
    setActiveIndex((i) => (i + 1) % tracks.length);
  }

  return (
    <section className="trackSection" id="trackSection">
      <h2 className="trackHeadline">NIGHT CLUB TRACK</h2>
      <img
        src="/assets/bottom_line2.png"
        alt=""
        className="nightclubtrackBottomLine"
      />

      <div className="trackWrap">
        <div className="trackPlayer">
          <div className="trackSongTitle">{active.title}</div>

          <input
            className="trackProgress"
            type="range"
            min={0}
            max={duration || 0}
            value={Math.min(current, duration || 0)}
            onChange={(e) => seekTo(Number(e.target.value))}
            aria-label="Track progress"
          />

          <div className="trackTime">
            {formatTime(current)} / {formatTime(duration)}
          </div>

          <div className="trackControls">
            <button
              className="iconBtn"
              type="button"
              onClick={prevTrack}
              aria-label="Previous track"
            >
              <PrevIcon />
            </button>

            <button
              className="playCircleBtn"
              type="button"
              onClick={togglePlay}
              aria-label="Play / Pause"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button
              className="iconBtn"
              type="button"
              onClick={nextTrack}
              aria-label="Next track"
            >
              <NextIcon />
            </button>

            <button className="iconBtn" type="button" aria-label="Shuffle">
              <ShuffleIcon />
            </button>
          </div>

          <div className="trackVolumeRow">
            <VolumeIcon />
            <input
              className="volRange"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
            />
          </div>

          <audio
            ref={audioRef}
            onLoadedMetadata={onLoadedMeta}
            onTimeUpdate={onTimeUpdate}
            onEnded={nextTrack}
          />
        </div>

        <div className="trackCoverCard">
          <div className="trackHero fullBleed">
            <img src={active.cover} alt={active.title} />
            <button
              className="coverPlayBtn"
              type="button"
              onClick={togglePlay}
              aria-label="Play / Pause"
            >
              <PlayOverlayIcon />
            </button>
          </div>

          <div className="trackCoverCaption">YOU BELONG...</div>

          <div className="trackCoverNav">
            <button
              type="button"
              className="squareNavBtn"
              onClick={prevTrack}
              aria-label="Prev"
            >
              <SmallPrev />
            </button>
            <button
              type="button"
              className="squareNavBtn"
              onClick={nextTrack}
              aria-label="Next"
            >
              <SmallNext />
            </button>
          </div>
        </div>
      </div>

      <div className="trackGalleryWrap" aria-label="Track thumbnails">
        <button
          className="trackArrow"
          type="button"
          onClick={prevTrack}
          aria-label="Prev"
        >
          ‹
        </button>

        <div className="trackGallery">
          {tracks.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className={`trackThumb ${i === activeIndex ? "active" : ""}`}
              onClick={() => selectTrack(i)}
              aria-label={`Select ${t.title}`}
            >
              <img src={t.thumb} alt={t.title} />
              {i === activeIndex && <div className="trackThumbPlay">▶</div>}
            </button>
          ))}
        </div>

        <button
          className="trackArrow"
          type="button"
          onClick={nextTrack}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  );
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "00:00";
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function PrevIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M18 6l-8 6 8 6V6z" fill="currentColor" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 6v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M6 6l8 6-8 6V6z" fill="currentColor" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 3h5v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 7h4l8 10h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 21h5v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M9 7l10 5-10 5V7z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 7h3v10H8V7zm5 0h3v10h-3V7z" fill="currentColor" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M11 5L7 9H4v6h3l4 4V5z" fill="currentColor" />
      <path
        d="M15.5 8.5a5 5 0 010 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayOverlayIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M10 8l8 4-8 4V8z" fill="currentColor" />
    </svg>
  );
}

function SmallPrev() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 6v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M18 6l-8 6 8 6V6z" fill="currentColor" />
    </svg>
  );
}

function SmallNext() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17 6v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M6 6l8 6-8 6V6z" fill="currentColor" />
    </svg>
  );
}
