// pages/Trending.jsx
import "../assets/components/css/Home.css"; //  Ensure this is in Favorites.jsx, Recommended.jsx, etc.

import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "../services/api";
import MovieCard from "../assets/components/MovieCard";
import "../assets/components/css/trending.css"; //  Use consistent style

function Trending({ favorites, toggleFavorite }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadTrending = async () => {
      const results = await fetchTrendingMovies();
      setMovies(results);
    };
    loadTrending();
  }, []);

  const isFavorite = (movie) =>
    favorites.some((fav) => fav.id === movie.id);

  return (
    <div className="trending">
      <h2 className="trending-title">Trending Movies</h2>

      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={isFavorite(movie)}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <p style={{ color: "#aaa", textAlign: "center" }}>
            No trending movies found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Trending;
