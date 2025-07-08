import './assets/components/css/App.css';

import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import NavBar from './assets/components/NavBar';
import PageWrapper from './assets/components/PageWrapper';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Bollywood from './pages/Bollywood';
import Trending from './pages/Trending';
import Recommended from './pages/Recommended';
import MovieChatBot from './assets/components/MovieChatBot'; //  Chatbot

function App() {
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState(null); //  Holds extracted chatbot filters

  const location = useLocation(); //  For page animation

  //  Load favorites on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
    setFavoritesLoaded(true);
  }, []);

  //  Save favorites when changed
  useEffect(() => {
    if (favoritesLoaded) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, favoritesLoaded]);

  //  Add/remove favorite
  const toggleFavorite = (movie) => {
    const exists = favorites.some((fav) => fav.id === movie.id);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  //  Clear favorites
  const clearAllFavorites = () => {
    setFavorites([]);
  };

  //  Get extracted filters from chatbot (actor, year, genre, etc.)
  const handleExtractedQuery = (queryObject) => {
    console.log('🎯 Extracted Filters:', queryObject);
    setFilterCriteria(queryObject); // You can pass this to Home to filter movies
  };

  return (
    <div>
      {/*  Navbar */}
      <NavBar />

      {/*  AI Movie ChatBot floating */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <MovieChatBot onExtractedQuery={handleExtractedQuery} />
      </div>

      {/*  Animated routes */}
      <main
        className="main-content"
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        {favoritesLoaded ? (
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/*  Home Page (pass filter criteria) */}
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <Home
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      filterCriteria={filterCriteria} //  Pass filters to Home.jsx
                    />
                  </PageWrapper>
                }
              />

              {/*  Favorites */}
              <Route
                path="/Favorites"
                element={
                  <PageWrapper>
                    <Favorites
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      clearAllFavorites={clearAllFavorites}
                    />
                  </PageWrapper>
                }
              />

              {/*  Bollywood */}
              <Route
                path="/Bollywood"
                element={
                  <PageWrapper>
                    <Bollywood />
                  </PageWrapper>
                }
              />

              {/*  Trending */}
              <Route
                path="/Trending"
                element={
                  <PageWrapper>
                    <Trending
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                    />
                  </PageWrapper>
                }
              />

              {/*  Recommended */}
              <Route
                path="/recommended"
                element={
                  <PageWrapper>
                    <Recommended
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                    />
                  </PageWrapper>
                }
              />
            </Routes>
          </AnimatePresence>
        ) : (
          <p style={{ color: "white", textAlign: "center" }}>Loading favorites...</p>
        )}
      </main>
    </div>
  );
}

export default App;

