import { useEffect, useState } from "react";
import MovieCard from "../assets/components/MovieCard";
import { fetchMoviesByGenres } from "../services/api";
import "../assets/components/css/Recommended.css"; //  Import consistent styling
import "../assets/components/css/Home.css"; //  Ensure this is in Favorites.jsx, Recommended.jsx, etc.



function Recommended({ favorites, toggleFavorite }) {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!favorites || favorites.length === 0) return;

    //  Count genre occurrences from favorites
    const genreCounts = {};
    favorites.forEach((movie) => {
      movie.genre_ids.forEach((id) => {
        genreCounts[id] = (genreCounts[id] || 0) + 1;
      });
    });

    //  Get top 2 genres by frequency
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([genreId]) => genreId);

    //  Fetch recommended movies based on top genres
    setLoading(true);
    fetchMoviesByGenres(topGenres)
      .then((data) => {
        setRecommendedMovies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [favorites]);

  const isFavorite = (movie) =>
    favorites.some((fav) => fav.id === movie.id);

  return (
    <div className="recommended">
      <h2 className="recommended-title"> Recommended for You</h2>

      {loading ? (
        <p style={{ color: "#ddd", textAlign: "center" }}>Loading...</p>
      ) : recommendedMovies.length > 0 ? (
        <div className="movies-grid">
          {recommendedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={isFavorite(movie)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <p style={{ color: "#aaa", textAlign: "center" }}>
          No recommendations yet. Start by adding some favorites!
        </p>
      )}
    </div>
  );
}

export default Recommended;
