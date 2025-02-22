import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import VideoPlayer from './VideoPlayer';
import screenfull from 'screenfull';

const VideoSlug = ({ movie, videoSource, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(screenfull.isFullscreen);
    };

    if (screenfull.isEnabled) {
      screenfull.on('change', handleFullscreenChange);
    }

    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', handleFullscreenChange);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="flex flex-col h-screen">
        {/* Header - Hide in fullscreen */}
        {!isFullscreen && (
          <div className="flex items-center justify-between px-4 py-3 bg-dark-lighter/80 backdrop-blur-sm">
            <div>
              <h2 className="text-lg font-semibold">{movie.title}</h2>
              <p className="text-xs text-gray-400">{movie.duration}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        )}

        {/* Video Container */}
        <div className={`flex-1 bg-black flex items-center ${isFullscreen ? 'h-screen' : ''}`}>
          <div className={`w-full relative ${isFullscreen ? 'h-full' : 'h-0 pb-[56.25%]'}`}>
            <div className="absolute inset-0">
              <VideoPlayer
                src={videoSource}
                poster={movie.image}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="p-4 bg-dark-lighter/80 backdrop-blur-sm">
          <div className="max-w-[1920px] mx-auto">
            <h3 className="font-medium mb-2">About this movie</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{movie.description}</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default VideoSlug; 