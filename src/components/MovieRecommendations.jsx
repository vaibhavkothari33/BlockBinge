import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaEthereum } from 'react-icons/fa';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const MovieRecommendations = ({ movies, onMovieSelect }) => {
    const [userPreference, setUserPreference] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tmdbMovies, setTmdbMovies] = useState([]);

    useEffect(() => {
        const fetchTMDBMovies = async () => {
            try {
                const pages = await Promise.all([1, 2, 3].map(page =>
                    fetch(
                        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
                    ).then(res => res.json())
                ));

                const allMovies = pages.flatMap(data => data.results).map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    description: movie.overview,
                    image: `${IMAGE_BASE_URL}${movie.poster_path}`,
                    genre: movie.genre_ids.join(','),
                    imdb: movie.vote_average.toFixed(1),
                    releaseDate: movie.release_date,
                    popularity: movie.popularity
                }));

                setTmdbMovies(allMovies);
            } catch (error) {
                console.error('Error fetching TMDB movies:', error);
            }
        };

        fetchTMDBMovies();
    }, []);

    const getRecommendations = async () => {
        try {
            setIsLoading(true);
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const moviesData = tmdbMovies.map(m => ({
                title: m.title,
                genre: m.genre,
                description: m.description,
                keywords: `${m.title} ${m.description}`.toLowerCase()
            }));

            const prompt = `You are a movie recommendation expert. Here are the available movies: ${JSON.stringify(moviesData)}

User is looking for: "${userPreference}"

Instructions:
1. The user wants movies similar to or matching their search: "${userPreference}"
2. Select exactly 5 most relevant movies
3. Return ONLY a JSON array of 5 movie titles`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let recommendedTitles = JSON.parse(response.text().trim().replace(/```json\n?/g, '').replace(/```/g, ''));
            
            recommendedTitles = recommendedTitles.slice(0, 5);
            setRecommendations(tmdbMovies.filter(movie => recommendedTitles.includes(movie.title)));
        } catch (error) {
            console.error('Error getting recommendations:', error);
            setRecommendations([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 mb-12">
            <div className="bg-dark-lighter rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Get Personalized Recommendations</h2>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Tell us what kind of movies you like..."
                        value={userPreference}
                        onChange={(e) => setUserPreference(e.target.value)}
                        className="flex-1 bg-dark px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full"
                    />
                    <button
                        onClick={getRecommendations}
                        disabled={!userPreference || isLoading}
                        className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                    >
                        {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
                    </button>
                </div>

                {recommendations.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-center">Recommended for You</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {recommendations.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="group cursor-pointer"
                                    onClick={() => onMovieSelect(movie)}
                                >
                                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3">
                                        <img
                                            src={movie.image}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 p-4">
                                                <div className="flex items-center gap-2 text-sm mb-2">
                                                    <span className="bg-yellow-400 text-black px-2 py-1 rounded font-medium">
                                                        IMDb {movie.imdb}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                                                    {movie.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
                                        {movie.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 text-center">
                                        Released: {new Date(movie.releaseDate).getFullYear()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieRecommendations;
