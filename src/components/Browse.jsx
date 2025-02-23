import React, { useState, useEffect } from 'react';
import { FaEthereum, FaPlay, FaSearch } from 'react-icons/fa';
import MovieSlug from './MovieSlug';
import { useLoader } from '../contexts/LoaderContext';
import { movies } from '../data/movies';
import MovieRecommendations from './MovieRecommendations';

const Browse = () => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get unique genres from movies (flatten and remove duplicates)
  const allGenres = ['all', ...new Set(movies.flatMap(movie => 
    movie.genre.split(',').map(g => g.trim())
  ))].sort();
  
  const [genres] = useState(
    allGenres.map(genre => ({
      id: genre.toLowerCase(),
      name: genre === 'all' ? 'All Movies' : genre,
      count: genre === 'all' 
        ? movies.length 
        : movies.filter(movie => 
            movie.genre.toLowerCase().split(',').map(g => g.trim()).includes(genre.toLowerCase())
          ).length
    }))
  );

  const { setIsLoading } = useLoader();

  // Get the featured movie (Batman)
  const featuredMovie = movies[1]; // Batman is now the first movie

  // Filter movies based on selected genre and search query
  useEffect(() => {
    let filtered = [...movies];
    
    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(movie => 
        movie.genre.toLowerCase().split(',').map(g => g.trim()).includes(selectedGenre.toLowerCase())
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.description.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query)
      );
    }
    
    setFilteredMovies(filtered);
  }, [selectedGenre, searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return (
    <div className="min-h-screen bg-dark pt-16">
      {/* Hero Section */}
      <div className="relative h-[70vh] mb-12">
        <div className="absolute inset-0">
          <img
            src={featuredMovie.image}
            alt="Featured Movie"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="max-w-2xl">
            <span className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              Featured Movie
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {featuredMovie.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
              <span className="bg-dark/50 px-3 py-1 rounded-full">
                {featuredMovie.genre.split(',')[0]}
              </span>
              <span>•</span>
              <span>{featuredMovie.duration}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-yellow-400">
                <span>IMDb</span>
                <span>{featuredMovie.imdb}</span>
              </div>
            </div>
            <p className="text-gray-300 text-lg mb-8 line-clamp-3">
              {featuredMovie.description}
            </p>
            <button 
              onClick={() => setSelectedMovie(featuredMovie)}
              className="flex items-center gap-3 bg-primary hover:bg-primary/90 px-8 py-4 rounded-xl text-lg font-medium transition-colors"
            >
              <FaPlay />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Movie Recommendations */}
      <MovieRecommendations 
        movies={movies} 
        onMovieSelect={setSelectedMovie} 
      />

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Search Bar */}
          <div className="w-full md:w-96">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-lighter pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Genre Filters */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedGenre === genre.id
                      ? 'bg-primary text-white'
                      : 'bg-dark-lighter text-gray-300 hover:bg-dark-light'
                  }`}
                >
                  {genre.name}
                  <span className="ml-2 text-xs opacity-70">({genre.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 text-gray-400">
          Showing {filteredMovies.length} {selectedGenre !== 'all' ? selectedGenre : ''} movies
        </div>
      </div>

      {/* Movie Grid */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group cursor-pointer"
                onClick={() => setSelectedMovie(movie)}
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent transition-opacity duration-300 ${
                    hoveredMovie === movie.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute bottom-0 p-4">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="bg-yellow-400 text-black px-2 py-1 rounded font-medium">
                          IMDb {movie.imdb}
                        </span>
                        <span className="bg-dark-lighter px-2 py-1 rounded">
                          {movie.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                        {movie.description}
                      </p>
                      <button className="flex items-center gap-2 bg-primary/90 hover:bg-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <FaPlay className="text-xs" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{movie.genre.split(',')[0]}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <FaEthereum className="text-primary" />
                    <span>{movie.price} ETH</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No movies found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieSlug
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Browse; 