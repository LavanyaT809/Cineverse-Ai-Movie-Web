import MovieCard from "../assets/components/MovieCard";
import "../assets/components/css/Home.css";
import "../assets/components/css/Favorites.css";

function Favorites({ favorites, toggleFavorite, clearAllFavorites }) {
  return (
    <div className="favorites">
      {/*  Title and Clear Button in a flex row */}
      <div className="favorites-header">
        <h2 className="favorites-title">Your Favorite Movies</h2>

        {/*  Only show clear button if there are favorites */}
        {favorites.length > 0 && (
          <button className="clear-button" onClick={clearAllFavorites}>
            Clear All
          </button>
        )}
      </div>

      {/*  Show grid or empty message */}
      <div className="movies-grid">
        {favorites.length === 0 ? (
          <div className="favorites-empty">
            <h2>No favorite movies yet</h2>
            <p>Start adding movies to your favorites!</p>
          </div>
        ) : (
          favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={true}
              toggleFavorite={toggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Favorites;
