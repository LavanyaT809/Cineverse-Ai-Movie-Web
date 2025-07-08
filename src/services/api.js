// TMDB API Config

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Fetch Bollywood (Hindi) movies
export async function fetchBollywoodMovies(page = 1, sortBy = "popularity.desc") {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi&page=${page}&sort_by=${sortBy}`
  );
  const data = await res.json();
  return data.results;
}

//  Main movie search function (chatbot or manual)
// Structured chatbot search
export async function searchMovies(queryOrString, filterCriteria = null) {
  let url = "";
  const isStructured = typeof filterCriteria === "object" && filterCriteria !== null;

  if (isStructured) {
    const { actor, genre, year, rating } = filterCriteria;
    const params = [`api_key=${API_KEY}`, `with_original_language=hi`];

    //  Actor filter
    if (actor) params.push(`with_cast=${actor}`);

    //  Genre filter — Convert name to ID if needed
    if (genre) {
      let genreId = genre;
      if (typeof genre === "string") {
        genreId = await getGenreIdByName(genre);
      }
      if (genreId) params.push(`with_genres=${genreId}`);
    }

    //  Year filter (release date range instead of year only)
    if (year) {
      params.push(`release_date.gte=${year}-01-01`);
      params.push(`release_date.lte=${year}-12-31`);
      
    }

    //  Rating filter
    if (rating) {
      params.push(`vote_average.gte=${rating}`);
    }

    //  Construct main URL
    url = `${BASE_URL}/discover/movie?${params.join("&")}`;
  } else {
    // 🔍 Manual search query
    const encoded = encodeURIComponent(queryOrString);
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encoded}&with_original_language=hi`;
  }

  try {
    console.log("🔍 Fetching from URL:", url); // 🐛 For debugging
    const res = await fetch(url);
    const data = await res.json();

    //  Fallback: if 0 results and structured, try without actor filter
    if (isStructured && (!data.results || data.results.length === 0)) {
      console.warn("⚠️ No results. Trying fallback without actor filter...");

      const fallbackParams = url
        .split("?")[1]
        .split("&")
        .filter(param => !param.startsWith("with_cast="));

      const fallbackUrl = `${BASE_URL}/discover/movie?${fallbackParams.join("&")}`;
      const fallbackRes = await fetch(fallbackUrl);
      const fallbackData = await fallbackRes.json();

      return fallbackData.results || [];
    }

    return data.results || [];
  } catch (err) {
    console.error("🔴 TMDB fetch failed:", err);
    return [];
  }
}

//  Convert genre name (e.g., "Action") to TMDB ID
async function getGenreIdByName(name) {
  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await res.json();
    const match = data.genres.find(
      (g) => g.name.toLowerCase() === name.toLowerCase()
    );
    return match?.id || null;
  } catch (err) {
    console.error("🔴 Genre lookup failed:", err);
    return null;
  }
}

//  Fetch genres (for dropdowns, etc.)
export async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await res.json();
  return data.genres;
}

//  Fetch movies by genre ID
export async function fetchMoviesByGenre(genreId, page = 1, sortBy = "popularity.desc") {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&with_original_language=hi&page=${page}&sort_by=${sortBy}`
  );
  const data = await res.json();
  return data.results;
}

//  Fetch trending Bollywood movies
export async function fetchTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

//  Fetch by multiple genres
export async function fetchMoviesByGenres(genresArray, page = 1) {
  const genreString = genresArray.join(",");
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreString}&with_original_language=hi&page=${page}`
  );
  const data = await res.json();
  return data.results;
}

//  Fetch YouTube trailer
export async function fetchMovieTrailer(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await res.json();
  const trailer = data.results.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}



