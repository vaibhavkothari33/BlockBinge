// import React, { useState, useEffect } from 'react';
// import { FaEthereum, FaPlay, FaInfoCircle, FaHeart, FaFilter, FaSearch, FaChevronDown, FaStar, FaRegClock } from 'react-icons/fa';
// import MovieSlug from './MovieSlug';
// import { useLoader } from '../contexts/LoaderContext';
// import { motion } from 'framer-motion';

// const Browse = () => {
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [hoveredMovie, setHoveredMovie] = useState(null);
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [filteredMovies, setFilteredMovies] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [featuredMovie, setFeaturedMovie] = useState(null);
//   const { setIsLoading } = useLoader();
  
//   // Fixed: Added the missing categories state
//   const [categories, setCategories] = useState([
//     { id: 'all', name: 'All', count: 0, icon: <FaSearch className="text-lg" /> },
//     { id: 'trending', name: 'Trending', count: 0, icon: <FaStar className="text-yellow-400 text-lg" /> },
//     { id: 'action', name: 'Action', count: 0 },
//     { id: 'horror', name: 'Horror', count: 0 },
//     { id: 'comedy', name: 'Comedy', count: 0 },
//     { id: 'drama', name: 'Drama', count: 0 },
//     { id: 'scifi', name: 'Sci-Fi', count: 0 }
//   ]);

//   // Extended movie data with categories
//   const movies = [
//     {
//       id: 1,
//       title: "PK",
//       image: "https://m.media-amazon.com/images/M/MV5BMTYzOTE2NjkxN15BMl5BanBnXkFtZTgwMDgzMTg0MzE@._V1_.jpg",
//       price: 0.0001,
//       year: 2014,
//       duration: "2h 33min",
//       genre: "Comedy, Drama",
//       rating: "8.1",
//       imdbRating: "8.1/10",
//       categories: ['trending', 'comedy', 'drama'],
//       description: "An alien on Earth loses the only device he can use to communicate with his spaceship."
//     },
//     {
//       id: 2,
//       title: "The Dark Knight",
//       image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
//       price: 0.0001,
//       year: 2008,
//       duration: "2h 32min",
//       genre: "Action, Crime, Drama",
//       rating: "9.0",
//       imdbRating: "9.0/10",
//       categories: ['trending', 'action'],
//       description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham."
//     },
//     {
//       id: 3,
//       title: "Inception",
//       image: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
//       price: 0.0001,
//       year: 2010,
//       duration: "2h 28min",
//       genre: "Action, Sci-Fi",
//       rating: "8.8",
//       imdbRating: "8.8/10",
//       categories: ['trending', 'action', 'scifi'],
//       description: "A thief who steals corporate secrets through dream-sharing technology."
//     },
//     {
//       id: 4,
//       title: "The Conjuring",
//       image: "https://m.media-amazon.com/images/M/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ@@._V1_.jpg",
//       price: 0.0001,
//       year: 2013,
//       duration: "1h 52min",
//       genre: "Horror, Mystery, Thriller",
//       rating: "7.5",
//       imdbRating: "7.5/10",
//       categories: ['horror'],
//       description: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence."
//     },
//     {
//       id: 5,
//       title: "Interstellar",
//       image: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
//       price: 0.0001,
//       year: 2014,
//       duration: "2h 49min",
//       genre: "Adventure, Drama, Sci-Fi",
//       rating: "8.6",
//       imdbRating: "8.6/10",
//       categories: ['scifi', 'drama'],
//       description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
//     },
//     {
//       id: 6,
//       title: "Get Out",
//       image: "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_.jpg",
//       price: 0.0001,
//       year: 2017,
//       duration: "1h 44min",
//       genre: "Horror, Mystery, Thriller",
//       rating: "7.7",
//       imdbRating: "7.7/10",
//       categories: ['horror', 'trending'],
//       description: "A young African-American visits his white girlfriend's parents for the weekend."
//     },
//     {
//       id: 7,
//       title: "The Grand Budapest Hotel",
//       image: "https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_.jpg",
//       price: 0.0001,
//       year: 2014,
//       duration: "1h 39min",
//       genre: "Adventure, Comedy, Crime",
//       rating: "8.1",
//       imdbRating: "8.1/10",
//       categories: ['comedy'],
//       description: "A writer encounters the owner of an aging high-class hotel."
//     },
//     {
//       id: 8,
//       title: "Parasite",
//       image: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
//       price: 0.0001,
//       year: 2019,
//       duration: "2h 12min",
//       genre: "Drama, Thriller",
//       rating: "8.5",
//       imdbRating: "8.5/10",
//       categories: ['trending', 'drama'],
//       description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan."
//     }
//   ];

//   // Update category counts
//   useEffect(() => {
//     const updatedCategories = categories.map(category => ({
//       ...category,
//       count: category.id === 'all' 
//         ? movies.length 
//         : movies.filter(movie => movie.categories.includes(category.id)).length
//     }));
    
//     setCategories(updatedCategories);
//   }, []);

//   // Select a random trending movie for the hero section
//   useEffect(() => {
//     const trendingMovies = movies.filter(movie => movie.categories.includes('trending'));
//     const randomIndex = Math.floor(Math.random() * trendingMovies.length);
//     setFeaturedMovie(trendingMovies[randomIndex] || movies[1]); // Fallback to Dark Knight if no trending
//   }, []);

//   // Filter movies based on selected category and search term
//   useEffect(() => {
//     let filtered = selectedCategory === 'all'
//       ? movies
//       : movies.filter(movie => movie.categories.includes(selectedCategory));
    
//     if (searchTerm) {
//       filtered = filtered.filter(movie => 
//         movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         movie.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     setFilteredMovies(filtered);
//   }, [selectedCategory, searchTerm]);

//   // Simulate loading
//   useEffect(() => {
//     setIsLoading(true);
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1500);
//     return () => clearTimeout(timer);
//   }, [setIsLoading]);

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };
  
//   const movieVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { type: "spring", stiffness: 150, damping: 20 }
//     }
//   };

//   return (
//     <div className="pt-16 min-h-screen bg-gradient-to-b from-dark to-dark-lighter">
//       {/* Hero Section - Dynamic featured movie */}
//       {featuredMovie && (
//         <div className="relative h-[60vh] md:h-[85vh] mb-8 md:mb-12 overflow-hidden">
//           <div className="absolute inset-0">
//             <img
//               src={featuredMovie.image}
//               alt={featuredMovie.title}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent" />
//           </div>
//           <motion.div 
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7 }}
//             className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16 md:pb-24"
//           >
//             <div className="max-w-2xl">
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="bg-yellow-400 text-black px-2 py-1 rounded-md text-sm font-medium">
//                   IMDb {featuredMovie.imdbRating}
//                 </span>
//                 <span className="bg-primary/80 px-2 py-1 rounded-md text-sm font-medium">
//                   {featuredMovie.year}
//                 </span>
//                 <span className="flex items-center gap-1 text-gray-300 text-sm">
//                   <FaRegClock /> {featuredMovie.duration}
//                 </span>
//               </div>
              
//               <h1 className="text-4xl md:text-6xl font-bold mb-3 md:mb-5 text-white drop-shadow-lg">
//                 {featuredMovie.title}
//               </h1>
              
//               <p className="text-base md:text-xl text-gray-200 mb-6 md:mb-10 line-clamp-3 md:line-clamp-4 max-w-xl drop-shadow-md">
//                 {featuredMovie.description}
//               </p>
              
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <motion.button 
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="flex items-center justify-center gap-2 bg-primary px-8 py-4 rounded-lg text-white font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
//                 >
//                   <FaPlay className="text-sm" />
//                   <span>Watch Now</span>
//                 </motion.button>
                
//                 <motion.button 
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="flex items-center justify-center gap-2 bg-dark-light/80 backdrop-blur-sm px-8 py-4 rounded-lg text-white hover:bg-dark-light transition-all"
//                 >
//                   <FaInfoCircle />
//                   <span>More Info</span>
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>

//           {/* Decorative gradient overlay at bottom */}
//           <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent pointer-events-none" />
//         </div>
//       )}

//       {/* Search & Filters Section */}
//       <div className="sticky top-16 z-30 bg-dark-lighter/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-5 mb-10 shadow-md">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
//             <h2 className="text-2xl font-semibold text-white">Discover Movies</h2>
            
//             <div className="flex items-center w-full md:w-auto">
//               <div className="relative flex-1 md:w-64">
//                 <input
//                   type="text"
//                   placeholder="Search movies..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full bg-dark pl-4 pr-10 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
//                 />
//                 <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
              
//               <button 
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="md:hidden ml-3 flex items-center gap-2 bg-dark-light px-4 py-3 rounded-lg text-white hover:bg-primary transition-colors"
//               >
//                 <FaFilter />
//                 <span>Filters</span>
//               </button>
//             </div>
//           </div>
          
//           <div className={`${showFilters ? 'flex' : 'hidden md:flex'} gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide`}>
//             {categories.map((category) => (
//               <motion.button
//                 key={category.id}
//                 onClick={() => setSelectedCategory(category.id)}
//                 whileHover={{ y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap text-sm font-medium
//                   ${selectedCategory === category.id
//                     ? 'bg-primary text-white shadow-lg shadow-primary/30'
//                     : 'bg-dark text-gray-300 hover:bg-dark-light hover:text-white'
//                   }`}
//               >
//                 {category.icon && <span>{category.icon}</span>}
//                 <span>{category.name}</span>
//                 <span className={`px-2 py-0.5 rounded-full text-xs 
//                   ${selectedCategory === category.id
//                     ? 'bg-white/20'
//                     : 'bg-dark-lighter'
//                   }`}
//                 >
//                   {category.count}
//                 </span>
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Results Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Results Summary */}
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg text-gray-300 flex items-center gap-2">
//             <span className="w-2 h-6 bg-primary rounded-sm inline-block"></span>
//             Showing <span className="font-medium text-white">{filteredMovies.length}</span> 
//             {selectedCategory !== 'all' ? 
//               <span> {categories.find(c => c.id === selectedCategory)?.name} Movies</span> : 
//               <span> Movies</span>
//             }
//           </h3>
//           <div className="flex items-center gap-4 text-sm">
//             <select className="bg-dark-light text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
//               <option>Sort By: Popular</option>
//               <option>Price: Low to High</option>
//               <option>Price: High to Low</option>
//               <option>Rating: High to Low</option>
//               <option>Year: Newest</option>
//             </select>
//           </div>
//         </div>

//         {/* Movie Grid - Enhanced with animations */}
//         {filteredMovies.length > 0 ? (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6 mb-12"
//           >
//             {filteredMovies.map((movie) => (
//               <motion.div 
//                 key={movie.id}
//                 variants={movieVariants}
//                 className="group cursor-pointer rounded-xl bg-gradient-to-b from-transparent to-dark-light/30 p-3 hover:shadow-xl hover:shadow-dark-light/20 transition-all duration-300"
//                 onMouseEnter={() => setHoveredMovie(movie.id)}
//                 onMouseLeave={() => setHoveredMovie(null)}
//                 onClick={() => setSelectedMovie(movie)}
//                 whileHover={{ y: -5 }}
//               >
//                 <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-4 shadow-lg">
//                   <img
//                     src={movie.image}
//                     alt={movie.title}
//                     className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
//                   />
//                   <div className="absolute top-2 right-2 z-10 flex gap-2">
//                     <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
//                       <FaStar className="text-black" />
//                       {movie.imdbRating}
//                     </div>
//                     <div className="bg-primary/90 px-2 py-1 rounded text-xs font-bold">
//                       {movie.year}
//                     </div>
//                   </div>
                  
//                   {/* Hover overlay */}
//                   <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent 
//                     transition-all duration-300 ${hoveredMovie === movie.id ? 'opacity-100' : 'opacity-0'}`}>
//                     <div className="absolute bottom-0 p-4 w-full">
//                       <div className="flex items-center justify-between text-white mb-3">
//                         <div className="flex items-center gap-1">
//                           <FaEthereum className="text-primary text-lg" />
//                           <span className="text-lg font-medium">{movie.price} ETH</span>
//                         </div>
//                         <span className="text-xs bg-dark-lighter px-2 py-1 rounded flex items-center gap-1">
//                           <FaRegClock className="text-xs" /> {movie.duration}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-300 mb-4 line-clamp-2">
//                         {movie.description}
//                       </p>
//                       <div className="flex gap-2">
//                         <button className="flex-1 bg-primary py-2.5 rounded-lg hover:bg-primary/90 
//                           transition-colors font-medium text-sm flex items-center justify-center gap-2">
//                           <FaPlay className="text-xs" />
//                           Watch Now
//                         </button>
//                         <button className="bg-dark-lighter p-2.5 rounded-lg hover:bg-dark-light 
//                           transition-colors group-hover:animate-pulse" onClick={(e) => e.stopPropagation()}>
//                           <FaHeart className="text-lg hover:text-red-500 transition-colors" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <h3 className="font-medium text-base md:text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
//                   {movie.title}
//                 </h3>
//                 <div className="flex items-center gap-2 text-xs text-gray-400">
//                   <span className="bg-dark px-2 py-0.5 rounded">
//                     {movie.genre.split(',')[0]}
//                   </span>
//                   <span>•</span>
//                   <span>{movie.duration}</span>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-20">
//             <img 
//               src="/no-results.svg" 
//               alt="No results found" 
//               className="w-32 h-32 mb-6 opacity-70" 
//             />
//             <h3 className="text-xl font-medium text-gray-300 mb-2">No movies found</h3>
//             <p className="text-gray-400 text-center mb-6">Try adjusting your search or filter criteria</p>
//             <button 
//               onClick={() => {setSelectedCategory('all'); setSearchTerm('');}}
//               className="bg-primary px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
//             >
//               Clear All Filters
//             </button>
//           </div>
//         )}
        
//         {/* Load More Button */}
//         {filteredMovies.length > 15 && (
//           <div className="flex justify-center my-10">
//             <button className="group flex items-center gap-2 border border-gray-600 px-8 py-3 rounded-lg hover:border-primary text-gray-300 hover:text-primary transition-all">
//               <span>Load More</span>
//               <FaChevronDown className="group-hover:translate-y-1 transition-transform" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Movie Slug Modal */}
//       {selectedMovie && (
//         <MovieSlug 
//           movie={selectedMovie} 
//           onClose={() => setSelectedMovie(null)} 
//         />
//       )}
//     </div>
//   );
// };

// export default Browse;
import React, { useState, useEffect } from 'react';
import { FaEthereum, FaPlay, FaSearch } from 'react-icons/fa';
import MovieSlug from './MovieSlug';
import { useLoader } from '../contexts/LoaderContext';
import { movies } from '../data/movies';

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