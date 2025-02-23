const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const fetchMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    
    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      image: `${IMAGE_BASE_URL}${movie.poster_path}`,
      backdrop: `${IMAGE_BASE_URL}${movie.backdrop_path}`,
      genre: movie.genre_ids.join(','), // We'll update this with genre names
      imdb: movie.vote_average.toFixed(1),
      duration: '2h 30m', // Default duration as TMDB doesn't provide this in basic fetch
      price: (Math.random() * (0.1 - 0.01) + 0.01).toFixed(3), // Random ETH price
      releaseDate: movie.release_date
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchGenres = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    return {
      ...data,
      image: `${IMAGE_BASE_URL}${data.poster_path}`,
      backdrop: `${IMAGE_BASE_URL}${data.backdrop_path}`,
      imdb: data.vote_average.toFixed(1),
      price: (Math.random() * (0.1 - 0.01) + 0.01).toFixed(3)
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}; 