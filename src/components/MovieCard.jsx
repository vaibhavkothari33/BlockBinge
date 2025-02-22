import React from 'react';
import { FaEthereum, FaHeart, FaPlay } from 'react-icons/fa';
import { useMyList } from '../hooks/useMyList';

const MovieCard = ({ movie, onSelect }) => {
  const { addToList, removeFromList, isInList } = useMyList();
  const inList = isInList(movie.id);

  const handleListClick = (e) => {
    e.stopPropagation();
    if (inList) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  };

  return (
    <div 
      className="group relative bg-dark-lighter rounded-xl overflow-hidden cursor-pointer"
      onClick={() => onSelect(movie)}
    >
      <div className="relative aspect-[2/3]">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handleListClick}
            className={`bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors ${
              inList ? 'text-red-500' : 'text-white'
            }`}
          >
            <FaHeart className="text-lg" />
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 p-4 w-full">
            <div className="flex items-center justify-between text-primary mb-3">
              <div className="flex items-center gap-2">
                <FaEthereum className="text-lg" />
                <span className="text-lg font-medium">{movie.price} ETH</span>
              </div>
            </div>
            <button 
              onClick={() => onSelect(movie)}
              className="w-full bg-primary py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <FaPlay className="inline mr-2" /> Watch Now
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">{movie.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{movie.year}</span>
          <span>•</span>
          <span>{movie.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 