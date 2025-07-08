import { NavLink } from "react-router-dom";
import "./css/Navbar.css";

// Icon imports
import { AiOutlineHome, AiOutlineHeart } from 'react-icons/ai';
import { MdTrendingUp, MdRecommend, MdOutlineMovie } from 'react-icons/md';

function NavBar() {
  return (
    <nav className="navbar">
      {/*  Brand Logo and Name */}
      <div className="navbar-brand">
        <NavLink to="/" className="nav-title" style={{ textDecoration: "none" }}>
  <div style={{
     display: "flex",
    alignItems: "center",
    fontFamily: "'Anton', sans-serif",
    color: "#e50914", // Full red
    fontWeight: "900",
    letterSpacing: "2px", 
    fontSize: "2.8rem",
    textShadow: `
      2px 2px21px #330000,
      3px 2px 6px #1a0000,
      3px 3px 6px rgba(0,0,0,0.9),
      4px 4px 10px rgba(0,0,0,1)
    `,
    transform: "skewX(-1deg)",
    }}>
  <span style={{ fontSize: "3rem" }}>C</span>
  <span style={{ fontSize: "2.5rem" }}>I</span>
  <span style={{ fontSize: "2.2rem" }}>N</span>
  <span style={{ fontSize: "2rem" }}>E</span>
  <span style={{ fontSize: "1.8rem" }}>V</span>
  <span style={{ fontSize: "2rem" }}>E</span>
  <span style={{ fontSize: "2.2rem" }}>R</span>
  <span style={{ fontSize: "2.5rem" }}>S</span>
  <span style={{ fontSize: "3rem" }}>E</span>
   
  </div>
</NavLink>
      </div>

      {/*  Nav Links with Icons and Dividers */}
      <div className="navbar-links">
        {/*  Home */}
        <div className="nav-item">
          <NavLink
            to="/"
            end
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <AiOutlineHome style={{ marginRight: "8px" }} />
            Home
          </NavLink>
          <span className="divider" />
        </div>

        {/*  Favorites */}
        <div className="nav-item">
          <NavLink
            to="/favorites"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <AiOutlineHeart style={{ marginRight: "8px" }} />
            Favorites
          </NavLink>
          <span className="divider" />
        </div>

        {/*  Trending */}
        <div className="nav-item">
          <NavLink
            to="/trending"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <MdTrendingUp style={{ marginRight: "8px" }} />
            Trending
          </NavLink>
          <span className="divider" />
        </div>

        {/*  Recommended */}
        <div className="nav-item">
          <NavLink
            to="/recommended"
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            <MdRecommend style={{ marginRight: "8px" }} />
            Recommended
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
