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
import { useNavigate } from 'react-router-dom';
import { startStream } from '../../utils/contract1';
import { ethers } from 'ethers';
// import StreamingPlatform from '../../artifacts/contracts/StreamingPlatform.sol/StreamingPlatform.json';
import { CreateContract } from '../../utils/contract1';

// Remove the existing getContract function and use this instead
const getContract = async () => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const contract = await CreateContract();

    // Debug log to check available contract methods
    console.log('Contract methods:', Object.keys(contract.functions));

    return contract;
  } catch (error) {
    console.error('Error getting contract:', error);
    throw error;
  }
};

const updateWatchTime = async (movieId, duration) => {
  try {
    const contract = await getContract();
    const tx = await contract.updateWatchTime(movieId, Math.floor(duration));
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Error updating watch time:', error);
    return false;
  }
};


const VideoPlayer = ({ movie }) => {
  const navigate = useNavigate(); // Add this line

  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const [lastBillingTime, setLastBillingTime] = useState(0);
  const [isWatchTimeTracking, setIsWatchTimeTracking] = useState(false);
  const watchTimeRef = useRef(0);
  const billingIntervalRef = useRef(null);
  const BILLING_INTERVAL = 10; // Bill every 60 seconds
  const RATE_PER_MINUTE = 0.001;
  const [isClosing, setIsClosing] = useState(false);

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
  const getContract = async () => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const contract = await CreateContract();

      // Debug log to check available contract methods
      console.log('Contract methods:', Object.keys(contract.functions));

      return contract;
    } catch (error) {
      console.error('Error getting contract:', error);
      throw error;
    }
  };

  const handleClose = async () => {
    try {
      setIsClosing(true);

      // Pause the video first
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }

      // Stop tracking and get final watch time
      if (isWatchTimeTracking) {
        await stopWatchTimeTracking();
      }

      // Process final payment
      if (totalWatchTime > 0) {
        await processFinalPayment(totalWatchTime);
      }

      // Navigate back to browser route and refresh
      navigate('/browse', { replace: true }); // Use replace to replace current history entry
      window.location.reload(); // Force refresh the page

    } catch (error) {
      console.error('Error during close:', error);
    } finally {
      setIsClosing(false);
    }
  };
  const stopWatchTimeTracking = async () => {
    if (isWatchTimeTracking) {
      try {
        setIsWatchTimeTracking(false);
        clearInterval(billingIntervalRef.current);

        const currentTime = Date.now();
        const finalWatchDuration = (currentTime - watchTimeRef.current) / 1000;

        if (finalWatchDuration > 0) {
          await updateWatchTime(movie.id - 1, finalWatchDuration);
          const newTotalWatchTime = totalWatchTime + finalWatchDuration;
          setTotalWatchTime(newTotalWatchTime);
        }
      } catch (error) {
        console.error('Error in stopWatchTimeTracking:', error);
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

  // Update togglePlay to only stop tracking
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
          await stopWatchTimeTracking(); // This will now only stop tracking, not process payment
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error toggling play:", error);
      }
    }
  };

  useEffect(() => {
    const handleUnmount = async () => {
      if (isWatchTimeTracking) {
        await stopWatchTimeTracking();
        if (totalWatchTime > 0) {
          await processFinalPayment(totalWatchTime);
        }
      }
    };

    return () => {
      if (billingIntervalRef.current) {
        clearInterval(billingIntervalRef.current);
      }
      handleUnmount();
    };
  }, [isWatchTimeTracking, totalWatchTime]);


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
  const processFinalPayment = async (watchTimeInSeconds) => {
    try {
      const minutes = Math.ceil(watchTimeInSeconds / 60);
      const costInETH = minutes * RATE_PER_MINUTE;
      const costInWei = ethers.utils.parseEther(costInETH.toString());

      const contract = await getContract();

      // Use addPendingPayment instead of processPayment
      const tx = await contract.addPendingPayment(
        window.ethereum.selectedAddress, // user address
        costInWei // amount in Wei
      );

      await tx.wait();

      console.log(`Final payment processed: ${costInETH} ETH`);
      return true;
    } catch (error) {
      console.error('Error processing final payment:', error);
      return false;
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
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center 
  bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
      >
        <svg
          className="w-8 h-8" // Increased from w-4 h-4
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5} // Increased stroke width for better visibility
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Loading spinner when closing */}

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
      {isClosing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      )}

    </div >
  );
};

export default VideoPlayer; 