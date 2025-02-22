import React, { useState, useEffect } from 'react';
import { FaEthereum, FaPlay, FaHeart, FaFilter, FaSort } from 'react-icons/fa';
import MovieSlug from './MovieSlug';

const Movies = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'year', 'rating'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const categories = [
    { id: 'all', name: 'All Movies' },
    { id: 'trending', name: 'Trending' },
    { id: 'action', name: 'Action' },
    { id: 'horror', name: 'Horror' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'drama', name: 'Drama' },
    { id: 'scifi', name: 'Sci-Fi' }
  ];

  const movies = [
    {
      id: 1,
      title: "PK",
      image: "https://m.media-amazon.com/images/M/MV5BMTYzOTE2NjkxN15BMl5BanBnXkFtZTgwMDgzMTg0MzE@._V1_.jpg",
      price: 0.01,
      year: 2014,
      duration: "2h 33min",
      genre: "Comedy, Drama",
      rating: "8.1",
      imdbRating: "8.1/10",
      categories: ['trending', 'comedy', 'drama'],
      description: "An alien on Earth loses the only device he can use to communicate with his spaceship."
    },
    // ... your existing movies ...
    {
      id: 9,
      title: "The Shawshank Redemption",
      image: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
      price: 0.01,
      year: 1994,
      duration: "2h 22min",
      genre: "Drama",
      rating: "9.3",
      imdbRating: "9.3/10",
      categories: ['drama'],
      description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
    },
    {
      id: 10,
      title: "The Matrix",
      image: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
      price: 0.01,
      year: 1999,
      duration: "2h 16min",
      genre: "Action, Sci-Fi",
      rating: "8.7",
      imdbRating: "8.7/10",
      categories: ['action', 'scifi'],
      description: "A computer programmer discovers that reality as he knows it is a simulation created by machines."
    }
  ];

  // Sort and filter movies
  useEffect(() => {
    let result = [...movies];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(movie => movie.categories.includes(selectedCategory));
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareA, compareB;
      
      switch (sortBy) {
        case 'year':
          compareA = a.year;
          compareB = b.year;
          break;
        case 'rating':
          compareA = parseFloat(a.rating);
          compareB = parseFloat(b.rating);
          break;
        default: // 'name'
          compareA = a.title.toLowerCase();
          compareB = b.title.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    setFilteredMovies(result);
  }, [selectedCategory, sortBy, sortOrder]);

  return (
    <div className="pt-24 min-h-screen bg-dark">
      {/* Filters and Sorting */}
      <div className="sticky top-16 z-30 bg-dark/95 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">All Movies</h1>
            <div className="flex flex-wrap gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-dark-lighter text-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Sort by Name</option>
                <option value="year">Sort by Year</option>
                <option value="rating">Sort by Rating</option>
              </select>
              <button
                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 bg-dark-lighter px-4 py-2 rounded-lg text-gray-300 hover:bg-dark-light"
              >
                <FaSort />
                <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm
                  ${selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-dark-lighter text-gray-300 hover:bg-dark-light'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredMovies.map((movie) => (
              <div 
                key={movie.id} 
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
                onClick={() => setSelectedMovie(movie)}
              >
                {/* Movie Card - Same as Browse component */}
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
                    IMDb {movie.imdbRating}
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${hoveredMovie === movie.id ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 p-4 w-full">
                      <div className="flex items-center justify-between text-primary mb-3">
                        <div className="flex items-center gap-2">
                          <FaEthereum className="text-lg" />
                          <span className="text-lg font-medium">{movie.price} ETH</span>
                        </div>
                        <button 
                          className="text-white hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <FaHeart className="text-xl" />
                        </button>
                      </div>
                      <button className="w-full bg-primary py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">{movie.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span>{movie.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Movie Slug Modal */}
      {selectedMovie && (
        <MovieSlug 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
};

export default Movies; 