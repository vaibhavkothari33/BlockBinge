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
import { debugContract, billSession, checkPendingPayments, handlePendingPayment } from '../../utils/contracts';
import { ethers } from 'ethers';
// import StreamingPlatform from '../../artifacts/contracts/StreamingPlatform.sol/StreamingPlatform.json';
import { CreateContract } from '../../utils/contracts';
import PaymentDialog from '../PaymentDialog';

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

  const [hasPendingPayment, setHasPendingPayment] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentTime, setPaymentTime] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    type: 'payment',
    title: '',
    message: '',
    amount: 0,
    timeInMinutes: 0
  });

  const watchTimeIntervalRef = useRef(null);

  const startWatchTimeTracking = () => {
    try {
      // Only track time locally, no contract calls
      watchTimeRef.current = 0;
      setIsWatchTimeTracking(true);
      watchTimeIntervalRef.current = setInterval(() => {
        watchTimeRef.current += 1;
        setTotalWatchTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting watch time tracking:', error);
      showDialog({
        type: 'error',
        title: 'Error',
        message: 'Failed to start streaming. Please try again.'
      });
    }
  };

  const stopWatchTimeTracking = () => {
    try {
      if (isWatchTimeTracking) {
        clearInterval(watchTimeIntervalRef.current);
        setIsWatchTimeTracking(false);
      }
    } catch (error) {
      console.error('Error stopping watch time tracking:', error);
      showDialog({
        type: 'error',
        title: 'Error',
        message: 'Failed to stop streaming. Your session may not be recorded correctly.'
      });
    }
  };

  // Helper function to show dialog
  const showDialog = (config) => {
    setDialogConfig({
      isOpen: true,
      ...config
    });
  };

  const handleClose = async () => {
    try {
      setIsClosing(true);

      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }

      if (isWatchTimeTracking) {
        stopWatchTimeTracking();
      }

      // If watch time is 0 or less than minimum billable time, just redirect
      if (totalWatchTime <= 0 || (Math.ceil(totalWatchTime / 60) * 0.001) === 0) {
        navigate('/browse', { replace: true });
        return;
      }

      try {
        const result = await billSession(movie.id - 1, totalWatchTime);
        if (result.cost === '0.0000' || result.cost === 0) {
          navigate('/browse', { replace: true });
          return;
        }

        if (result.success && result.paid) {
          console.log(`Payment processed: ${result.cost} ETH for ${result.timeInMinutes} minutes`);
          navigate('/browse', { replace: true });
        } else {
          showDialog({
            type: 'payment',
            title: 'Payment Required',
            amount: result.cost,
            timeInMinutes: result.timeInMinutes
          });
        }
      } catch (error) {
        console.error('Payment error:', error);
        showDialog({
          type: 'error',
          title: 'Payment Error',
          message: error.message || 'Failed to process payment. Please try again.'
        });
        setTimeout(() => navigate('/browse', { replace: true }), 3000);
      }
    } catch (error) {
      console.error('Error during close:', error);
      showDialog({
        type: 'error',
        title: 'Error',
        message: 'Failed to close video. Please try again.'
      });
    } finally {
      setIsClosing(false);
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
  const togglePlay = () => {
    if (hasPendingPayment) {
      showDialog({
        type: 'warning',
        title: 'Pending Payment',
        message: `You have a pending payment of ${pendingAmount} ETH. Please settle this payment before watching more content.`,
        amount: pendingAmount
      });
      return;
    }
    
    if (videoRef.current) {
      try {
        if (!isPlaying) {
          videoRef.current.play();
          startWatchTimeTracking(); // Only local tracking
        } else {
          videoRef.current.pause();
          stopWatchTimeTracking(); // Only local tracking
          // Show current bill calculation
          const bill = calculateCurrentBill(totalWatchTime);
          showDialog({
            type: 'info',
            title: 'Current Session',
            message: `Watch Time: ${bill.formattedTime}\nEstimated Cost: ${bill.cost} ETH`,
          });
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error toggling play:", error);
        showDialog({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to start video'
        });
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

  // Add a confirmation dialog before closing
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Add this useEffect to check for pending payments
  useEffect(() => {
    const checkPayments = async () => {
      try {
        const { hasPendingPayment, amount } = await checkPendingPayments();
        if (hasPendingPayment) {
          showDialog({
            type: 'warning',
            title: 'Pending Payment',
            message: `You have a pending payment of ${amount} ETH. Please settle this payment before watching more content.`,
            amount,
            onPay: handlePayment // Pass the payment handler
          });
          handleClose();
        }
      } catch (error) {
        console.error("Error checking payments:", error);
        showDialog({
          type: 'error',
          title: 'Error',
          message: 'Failed to check payment status. Please try again.'
        });
      }
    };
    
    checkPayments();
  }, []);

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const paid = await handlePendingPayment();
      if (paid) {
        setDialogConfig(prev => ({ ...prev, isOpen: false }));
        navigate('/browse', { replace: true });
        window.location.reload();
      } else {
        showDialog({
          type: 'error',
          title: 'Payment Failed',
          message: 'Unable to process payment. Please try again.'
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      showDialog({
        type: 'error',
        title: 'Payment Error',
        message: error.message || 'Failed to process payment. Please try again.'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
        onClick={() => setShowConfirmDialog(true)}
        className="absolute top-5 right-4 z-50 w-15 h-15 flex items-center justify-center 
  bg-black/50 hover:bg-black/80 bg-black rounded-full text-white transition-colors"
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

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-dark-lighter p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Confirm Exit</h3>
            <p className="text-gray-300 mb-6">
              You watched for {formatTime(totalWatchTime)}. 
              Estimated cost: {(Math.ceil(totalWatchTime / 60) * 0.001).toFixed(4)} ETH
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 rounded-lg bg-dark hover:bg-dark-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  handleClose();
                }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-colors"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      <PaymentDialog
        {...dialogConfig}
        onClose={() => {
          setDialogConfig(prev => ({ ...prev, isOpen: false }));
          navigate('/browse', { replace: true });
          window.location.reload();
        }}
        onPay={handlePayment}
        isProcessing={isProcessingPayment}
      />

    </div >
  );
};

export default VideoPlayer; 