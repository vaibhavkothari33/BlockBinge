import React, { useEffect } from 'react';
import { FaHeart, FaPlay, FaEthereum } from 'react-icons/fa';
import { useMyList } from '../hooks/useMyList';
import MovieSlug from './MovieSlug';
import { useLoader } from '../contexts/LoaderContext';

const MyList = () => {
  const { myList, removeFromList } = useMyList();
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const { setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  if (myList.length === 0) {
    return (
      <div className="min-h-screen bg-dark pt-20 px-4">
        <div className="max-w-7xl mx-auto py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">My List</h1>
          <p className="text-gray-400 mb-8">Your list is empty. Add some movies to watch later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-20 px-4">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">My List</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {myList.map((movie) => (
            <div 
              key={movie.id}
              className="group relative bg-dark-lighter rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedMovie(movie)}
            >
              <div className="relative aspect-[2/3]">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromList(movie.id);
                    }}
                    className="bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors text-red-500"
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
          ))}
        </div>
      </div>

      {selectedMovie && (
        <MovieSlug
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default MyList; 