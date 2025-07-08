import React, { useEffect, useState } from 'react';
import { fetchBollywoodMovies } from '../services/api'; 
function Bollywood() {
   //  State to store fetched movies
  const [movies, setMovies] = useState([]);

   //  State to keep track of the current page number
  const [page, setPage] = useState(1);

   //  Fetch movies whenever the `page` changes
  useEffect(() => {
    fetchBollywoodMovies().then(data => {
      setMovies(data);
    });
  }, [page]);

  // Handler to go to the next page
    const handleNext = () => setPage((prev) => prev + 1);
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));


   return (
    <div>
      {/*  Title */}
      <h2>Bollywood Movies - Page {page}</h2>
      
      {/* 🎬 If movies are available, display them; otherwise show loading text */}
      {movies.length > 0 ? (
        <ul>
          {movies.map(movie => (
            <li key={movie.id}>
              {movie.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading movies...</p>
      )}

      {/* Pagination buttons */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePrev} disabled={page === 1}>⬅️ Previous</button>
        <button onClick={handleNext}>Next ➡️</button>
      </div>
    </div>
  );
}

export default Bollywood;