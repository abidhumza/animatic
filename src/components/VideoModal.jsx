import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const VideoModal = ({ isOpen, onClose, videoSrc }) => {
  const modalRef = useRef(null);
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0); // Track current time
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Animation for opening the modal
      gsap.fromTo(
        modalRef.current,
        {
          clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
          opacity: 0,
          rotate: -10,
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          opacity: 1,
          rotate: 0,
          duration: 1,
          ease: "power3.out",
        }
      );

      const videoElement = videoRef.current;

      // Check if video is autoplaying and set `isPlaying` accordingly
      if (videoElement && !videoElement.paused) {
        setIsPlaying(true);
      }
    }

    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("play", handlePlayEvent);
      videoElement.addEventListener("pause", handlePauseEvent);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener("play", handlePlayEvent);
        videoElement.removeEventListener("pause", handlePauseEvent);
      }
    };
  }, [isOpen]);

  const handleTimeUpdate = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
    }
  };

  const handlePlayEvent = () => {
    setIsPlaying(true);
  };

  const handlePauseEvent = () => {
    setIsPlaying(false);
  };

  const handleClose = () => {
    const videoElement = videoRef.current;

    // Pause the video when closing the modal
    if (videoElement) {
      videoElement.pause();
      setIsPlaying(false); // Sync the state with the video
    }

    // Animation for closing the modal
    gsap.to(modalRef.current, {
      clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
      opacity: 0,
      rotate: 10,
      duration: 0.8,
      ease: "power3.in",
      onComplete: onClose,
    });
  };

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-90 z-50 flex items-center justify-center"
    >
      <div className="relative w-full h-full">
        <video
          autoPlay
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
        />

        {/* Custom overlay and controls */}
        <div className="absolute inset-0">
          {/* Timer (Bottom-Left) */}
          <div className="absolute bottom-5 left-5 text-yellow-500 font-bold font-zentry text-9xl">
            {formatTime(currentTime)}
          </div>

          {/* Play Button (Bottom-Right) */}
          <button
            onClick={togglePlay}
            className="absolute bottom-5 right-5 text-yellow-500 text-9xl font-bold font-zentry px-4 py-2 hover:text-yellow-300 transition-all"
          >
            {isPlaying ? (
              <>
                || P<b>A</b>USE
              </>
            ) : (
              <>
                &gt; PL<b>A</b>Y
              </>
            )}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-10 w-8 h-8 flex items-center justify-center rounded-full border border-white hover:border-white hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.5)] group transition-all duration-300"
        >
          <span className="relative block w-4 h-4">
            <span className="absolute w-full h-0.5 bg-white rotate-45 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all"></span>
            <span className="absolute w-full h-0.5 bg-white -rotate-45 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all"></span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default VideoModal;
