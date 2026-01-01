import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './SearchBar.css';

const API_KEY = '30d4177a69e01ebd0ad4c57f8334bd38';

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => setSuggestions(data.results || []));
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce for 300ms

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (movieId) => {
  navigate(`/player/${movieId}`);
  setQuery("");
  setSuggestions([]);
};


  return (
    <div className="searchbar-wrapper">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          placeholder="Search movies..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.slice(0, 6).map((movie) => (
            <li key={movie.id} onClick={() => handleSuggestionClick(movie.id)}>
              {movie.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
