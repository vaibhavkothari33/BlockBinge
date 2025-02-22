import React, { useState, useEffect, useRef } from 'react';
import {
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaExpand,
  FaCompress,
  FaCog,
  FaForward,
  FaBackward,
  FaClock
} from 'react-icons/fa';
import screenfull from 'screenfull';
import { startStream } from '../../utils/contract1';

const updateWatchTime = async (movieId, duration) => {
  try {
    const contract = await getContract(); // Get your contract instance
    const tx = await contract.updateWatchTime(movieId, Math.floor(duration));
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error updating watch time:', error);
    return false;
  }
};


const VideoPlayer = ({ movie }) => {

  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const [lastBillingTime, setLastBillingTime] = useState(0);
  const [isWatchTimeTracking, setIsWatchTimeTracking] = useState(false);
  const watchTimeRef = useRef(0);
  const billingIntervalRef = useRef(null);
  const BILLING_INTERVAL = 10; // Bill every 60 seconds
  const RATE_PER_MINUTE = 0.001;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const startWatchTimeTracking = () => {
    if (!isWatchTimeTracking) {
      setIsWatchTimeTracking(true);
      watchTimeRef.current = Date.now();
      billingIntervalRef.current = setInterval(async () => {
        const currentTime = Date.now();
        const watchDuration = (currentTime - watchTimeRef.current) / 1000; // Convert to seconds

        if (watchDuration >= BILLING_INTERVAL) {
          // Update blockchain with watch time
          const success = await updateWatchTime(movie.id - 1, watchDuration);

          if (success) {
            setTotalWatchTime(prev => prev + watchDuration);
            setLastBillingTime(currentTime);
            watchTimeRef.current = currentTime;
          }
        }
      }, BILLING_INTERVAL * 1000);
    }
  };
  const stopWatchTimeTracking = async () => {
    if (isWatchTimeTracking) {
      setIsWatchTimeTracking(false);
      clearInterval(billingIntervalRef.current);

      // Final billing for remaining time
      const currentTime = Date.now();
      const finalWatchDuration = (currentTime - watchTimeRef.current) / 1000;

      if (finalWatchDuration > 0) {
        await updateWatchTime(movie.id - 1, finalWatchDuration);
        setTotalWatchTime(prev => prev + finalWatchDuration);
      }
    }
  };
  // Direct video URLs array
  const videoUrls = {

    1: "https://bafybeihuh7hm2v4osxrhb4yoign5umkmhgfnlp4i37qmjqrjx2jxv3g4yi.ipfs.w3s.link/PK%20Official%20Teaser%20Trailer%201%20(2014)%20-%20Comedy%20Movie%20HD.mp4",

    2: "https://bafybeiajhp6f5rpiu4wvazgzq3scxilkeevdvngkrhny42x3oo7hrs6hbq.ipfs.w3s.link/VID-20250221-WA0059.mp4",

    3: "https://bafybeihl77x3drk2snn5m2x22knbvuob7v3p4o6licv2njbyaj26dzhb6a.ipfs.w3s.link/Marvel%20Studios'%20Avengers%EF%BC%9A%20Infinity%20War%20Official%20Trailer%20(1).mp4",

    4: "https://bafybeihbf2lbp6l6j2uqbxxlsbj3k737jcfnqy7fzj7aexanhltcgg3dlm.ipfs.w3s.link/VID-20250221-WA0061.mp4",

    5: "https://bafybeihuh7hm2v4osxrhb4yoign5umkmhgfnlp4i37qmjqrjx2jxv3g4yi.ipfs.w3s.link/The%20Conjuring%20-%20Official%20Trailer.mp4",

    6: "https://bafybeihuh7hm2v4osxrhb4yoign5umkmhgfnlp4i37qmjqrjx2jxv3g4yi.ipfs.w3s.link/Interstellar%20-%20Official%20Trailer.mp4",

    7: "https://bafybeihuh7hm2v4osxrhb4yoign5umkmhgfnlp4i37qmjqrjx2jxv3g4yi.ipfs.w3s.link/Get%20Out%20-%20Official%20Trailer.mp4",

    8: "https://bafybeihuh7hm2v4osxrhb4yoign5umkmhgfnlp4i37qmjqrjx2jxv3g4yi.ipfs.w3s.link/The%20Grand%20Budapest%20Hotel%20-%20Official%20Trailer.mp4",

    9: "https://bafybeihuh7hm2v4osxrhb4yoign5umkmhgfnlp4i37qmjqrjx2jxv3g4yi.ipfs.w3s.link/Parasite%20-%20Official%20Trailer.mp4"
  };

  // Get video URL based on movie ID
  const getVideoUrl = () => {
    return videoUrls[movie.id] || videoUrls[1]; // Fallback to first video if ID not found
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (!isPlaying) {
          const contractMovieId = movie.id - 1;
          await startStream(contractMovieId);
          await videoRef.current.play();
          startWatchTimeTracking();
        } else {
          videoRef.current.pause();
          await stopWatchTimeTracking();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error toggling play:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (billingIntervalRef.current) {
        clearInterval(billingIntervalRef.current);
      }
      stopWatchTimeTracking();
    };
  }, []);
  const formatBilling = (watchTimeInSeconds) => {
    const minutes = Math.ceil(watchTimeInSeconds / 60);
    const cost = (minutes * RATE_PER_MINUTE).toFixed(4);
    return `${cost} ETH`;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
      } else {
        videoRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  const handleProgress = (e) => {
    const progress = parseFloat(e.target.value);
    const time = (progress / 100) * duration;
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleSpeedChange = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        setIsLoading(false);
        setDuration(videoRef.current.duration);
      });

      videoRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(videoRef.current.currentTime);
      });

      videoRef.current.addEventListener('error', (e) => {
        console.error('Error loading video:', e);
        setIsLoading(false);
      });
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', () => { });
        videoRef.current.removeEventListener('timeupdate', () => { });
        videoRef.current.removeEventListener('error', () => { });
      }
    };
  }, [movie]);

  if (!movie) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-white">
        <p>No video source available</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black group">
      <div
        ref={containerRef}
        className="relative w-full h-full bg-black group"
        onMouseMove={() => {
          setShowControls(true);
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
          controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
          }, 3000);
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        <video
          ref={videoRef}
          src={getVideoUrl()}
          poster={movie.image}
          className="w-full h-full"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Custom Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent 
        transition-opacity duration-300 p-4 ${showControls ? 'opacity-100' : 'opacity-0'}`}>

          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleProgress}
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00E5FF ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%)`
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center bg-primary/90 rounded-full 
                hover:bg-primary transition-colors"
              >
                {isPlaying ? (
                  <FaPause className="w-4 h-4 text-white" />
                ) : (
                  <FaPlay className="w-4 h-4 text-white transform translate-x-0.5" />
                )}
              </button>
              <div className="flex items-center gap-2 text-sm text-white">
                <FaClock className="w-4 h-4 text-primary" />
                <span>Watch Time: {formatTime(totalWatchTime)}</span>
                <span className="text-primary ml-2">
                  Cost: {formatBilling(totalWatchTime)}
                </span>
              </div>
            </div>
            {/* Skip Backward/Forward */}
            <button
              onClick={() => skipTime(-10)}
              className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
            >
              <FaBackward className="w-4 h-4" />
            </button>
            <button
              onClick={() => skipTime(10)}
              className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
            >
              <FaForward className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
              >
                {isMuted ? (
                  <FaVolumeMute className="w-5 h-5" />
                ) : (
                  <FaVolumeUp className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Time Display */}
            <div className="text-sm text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Playback Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
              >
                <FaCog className="w-5 h-5" />
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2">
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 rounded
                        ${playbackSpeed === speed ? 'text-primary' : 'text-white'}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
            >
              {isFullscreen ? (
                <FaCompress className="w-5 h-5" />
              ) : (
                <FaExpand className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default VideoPlayer; 