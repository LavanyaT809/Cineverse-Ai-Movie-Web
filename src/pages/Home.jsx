import { useState, useEffect } from "react";
import MovieCard from "../assets/components/MovieCard";
import "../assets/components/css/Home.css";
import {
  fetchBollywoodMovies,
  searchMovies,
  fetchMoviesByGenre,
} from "../services/api";
import { FiSearch, FiMic } from "react-icons/fi";

//  Speak text using browser's text-to-speech
const speakText = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.volume = 1;
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};

function Home({ favorites, toggleFavorite, filterCriteria }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [fadeKey, setFadeKey] = useState(0); // Used to re-trigger animation
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [listening, setListening] = useState(false); // Voice recognition state

  //  Genre name to TMDB ID mapping
  const genreMap = {
    All: 0,
    Action: 28,
    Comedy: 35,
    Drama: 18,
    Thriller: 53,
    Romance: 10749,
    Horror: 27,
  };

  //  Get TMDB genre ID from genre name
  const getGenreIdByName = (name) => {
    const lower = name?.toLowerCase();
    const entry = Object.entries(genreMap).find(
      ([gName]) => gName.toLowerCase() === lower
    );
    return entry ? entry[1] : 0;
  };

  //  Fetch movies on page load / genre / sort change
  useEffect(() => {
    if (searchQuery.trim() !== "" || filterCriteria) return;

    setLoading(true);
    const fetchFn =
      selectedGenre === 0
        ? fetchBollywoodMovies(page, sortBy)
        : fetchMoviesByGenre(selectedGenre, page, sortBy);

    fetchFn
      .then((data) => {
        setMovies([]);
        setTimeout(() => {
          setMovies(data);
          setFadeKey((prev) => prev + 1); // trigger fade animation
          setLoading(false);
        }, 100);
      })
      .catch(() => setLoading(false));
  }, [page, selectedGenre, sortBy, searchQuery, filterCriteria]);

  //Handle structured chatbot filters (actor, genre, year, rating)
  useEffect(() => {
    if (!filterCriteria) return;

    setLoading(true);
    const structuredFilter = {
      actor: filterCriteria.actor || undefined,
      genre: filterCriteria.genre
        ? getGenreIdByName(filterCriteria.genre)
        : undefined,
      year: filterCriteria.year || undefined,
      rating: filterCriteria.rating || undefined,
    };

    searchMovies("", structuredFilter)
      .then((results) => {
         //  Optional fallback: manually filter by release year
        let filtered = results;
        if (structuredFilter.year) {
          filtered = results.filter((movie) =>
            movie.release_date?.startsWith(structuredFilter.year)
          );
        }

        setMovies([]);
        setTimeout(() => {
          setMovies(filtered);
          setFadeKey((prev) => prev + 1);
          setPage(1);
          setLoading(false);
        }, 100);
      })
      .catch(() => setLoading(false));
  }, [filterCriteria]);

  // 🔍 Text search handler/manual
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;

    speakText(`Showing results for ${searchQuery}`); // 🔊 Speak input
    setLoading(true);
    const results = await searchMovies(searchQuery);
    setMovies([]);
    setTimeout(() => {
      setMovies(results);
      setFadeKey((prev) => prev + 1);
      setPage(1);
      setLoading(false);
    }, 100);
  };

  // 🎤 Voice recognition handler
  const startVoiceSearch = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Your browser does not support voice recognition.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setListening(true);

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        speakText(`Searching for ${transcript}`);

        setLoading(true);
        const results = await searchMovies(transcript);
        setMovies([]);
        setTimeout(() => {
          setMovies(results);
          setFadeKey((prev) => prev + 1);
          setPage(1);
          setLoading(false);
        }, 100);
      };

      recognition.onend = () => setListening(false);
      recognition.onerror = () => {
        setListening(false);
        alert("Voice recognition failed. Try again.");
      };

      recognition.start();
    } catch (error) {
      alert("Mic error: " + error.message);
    }
  };

  // 🎛 Genre & Sort dropdown handlers
  const handleGenreChange = (e) => {
    setSelectedGenre(Number(e.target.value));
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  // ❤️ Check if movie is favorited
  const isFavorite = (movie) =>
    favorites.some((fav) => fav.id === movie.id);

  // ⏩ Pagination
  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="home">
      {/* 🔍 Search Bar & 🎙️ Voice Mic */}
      <div className="search-controls">
        <form onSubmit={handleSearch} className="search-wrapper">
          {/* Left-side search icon */}
          <span className="search-icon-inside"><FiSearch /></span>

          {/* Input box */}
          <input
            type="text"
            placeholder="Search here..."
            className="search-input-with-icon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Right-side mic icon and voice bars when listening */}
          <span className="mic-icon-inside" onClick={startVoiceSearch} title="Click to speak">
            <FiMic style={{ color: listening ? "red" : "#ccc" }} />
            {listening && (
              <div className="voice-bars">
                <span className="bar bar1"></span>
                <span className="bar bar2"></span>
                <span className="bar bar3"></span>
                <span className="bar bar4"></span>
              </div>
            )}
          </span>
        </form>

        {/* 🎛 Genre and Sort filters */}
        <div className="genre-sort">
          <label htmlFor="genre-select">Filter by Genre:</label>
          <select
            id="genre-select"
            onChange={handleGenreChange}
            value={selectedGenre}
          >
            {Object.entries(genreMap).map(([name, id]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          <label htmlFor="sort-select">Sort by:</label>
          <select id="sort-select" onChange={handleSortChange} value={sortBy}>
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="release_date.desc">Latest Releases</option>
          </select>
        </div>
      </div>

      {/* 🎬 Movie Cards Grid */}
      <div className="movies-grid">
        {loading ? (
          // Skeleton cards while loading
          [...Array(6)].map((_, idx) => (
            <div key={idx} className="skeleton-card"></div>
          ))
        ) : Array.isArray(movies) && movies.length > 0 ? (
          // Actual movie cards
          movies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${fadeKey}`}
              movie={movie}
              isFavorite={isFavorite(movie)}
              toggleFavorite={toggleFavorite}
              animationDelay={index * 80}
            />
          ))
        ) : (
          <p style={{ color: "white", textAlign: "center" }}>
            No movies found.
          </p>
        )}
      </div>

      {/* ⏩ Pagination (only when no search/filter applied) */}
      {searchQuery.trim() === "" && !filterCriteria && (
        <div className="pagination-buttons">
          <button onClick={handlePrev} disabled={page === 1}>Previous</button>
          <span>Page {page}</span>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
}

export default Home;






