import { useState } from "react";
import "./css/MovieCard.css";
import { fetchMovieTrailer } from "../../services/api";

function MovieCard({ movie, isFavorite, toggleFavorite, animationDelay = 0 }) {
  const [showModal, setShowModal] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [modalType, setModalType] = useState(""); // NEW: track whether it's "overview" or "trailer"

//  Convert TMDB rating (out of 10) to 5-star style
  const ratingOutOf5 = movie.vote_average / 2;
  const fullStars = Math.floor(ratingOutOf5);
  const hasHalfStar = ratingOutOf5 - fullStars >= 0.5;

  //  Create star icons (★ for full, ½ for half, ☆ for empty)
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push(<span key={`full-${i}`}>★</span>);
    if (hasHalfStar) stars.push(<span key="half">½</span>);
    while (stars.length < 5) stars.push(<span key={`empty-${stars.length}`}>☆</span>);
    return stars;
  };

  //  Truncate overview to a fixed word limit
  const truncateByWords = (text, wordLimit = 6) => {
    if (!text) return "No description available.";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  //  Load trailer
  const handleTrailerClick = async () => {
    setLoadingTrailer(true);
    setModalType("trailer");
    const url = await fetchMovieTrailer(movie.id);
    setTrailerUrl(url);
    setShowModal(true);
    setLoadingTrailer(false);
  };

  //  Show full description
  const handleOverviewClick = () => {
    setModalType("overview");
    setShowModal(true);
  };

  //  Close modal
  const closeModal = () => {
    setShowModal(false);
    setTrailerUrl(null);
    setModalType("");
  };

  return (
    <>
      <div
        className="Movie-card fade-in-card"
        style={{
          animation: `fadePopIn 0.4s ease-out forwards`,
          animationDelay: `${animationDelay}ms`,
        }}
      >
        {/* 🎞 Poster */}
        <div className="Movie-Poster">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : "https://via.placeholder.com/150x225?text=No+Image"
            }
            alt="Movie Poster"
          />
          <div className="Movie-Overlay">
            <button
              className="favorite-btn"
              onClick={() => toggleFavorite(movie)}
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        {/*  Info */}
        <div className="Movie-Info">
          <p>{movie.release_date?.split("-")[0]}</p>
          <div className="Movie-Rating">{renderStars()}</div>

          <div
            className="Movie-Overview clickable"
            onClick={handleOverviewClick}
          >
            {truncateByWords(movie.overview)}
            <span className="read-more"> read more</span>
          </div>

          {/* ▶ Watch Trailer */}
          <button
            className="trailer-btn"
            onClick={handleTrailerClick}
            disabled={loadingTrailer}
          >
            {loadingTrailer ? "Loading..." : "▶ Watch Trailer"}
          </button>
        </div>
      </div>

      {/*  Modal: Separate logic for overview vs trailer */}
      {showModal && (
        <div className="Modal-Backdrop" onClick={closeModal}>
          <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "white", marginBottom: "10px" }}>
              {modalType === "trailer" ? "Watch Trailer" : "Overview"}
            </h3>

            {modalType === "trailer" ? (
              trailerUrl ? (
                <iframe
                  width="100%"
                  height="300"
                  src={trailerUrl}
                  title="YouTube Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="no-trailer-msg">
                  <p>❌ Sorry, no trailer is available for this movie.</p>
                </div>
              )
            ) : (
              <p style={{ color: "#ddd" }}>
                {movie.overview || "No description available."}
              </p>
            )}

            <button className="Modal-Close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MovieCard;












