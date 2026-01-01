// src/pages/Movies/Movies.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./Movies.css";
import { Link } from "react-router-dom";


const TMDB_API_KEY = "30d4177a69e01ebd0ad4c57f8334bd38";

const Movies = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);

  // Fetch all genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Failed to fetch movie genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Fetch movies by selected genre
  useEffect(() => {
    if (selectedGenre) {
      const fetchMoviesByGenre = async () => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${selectedGenre}&language=en-US`
          );
          setMovies(response.data.results);
        } catch (error) {
          console.error("Failed to fetch movies by genre:", error);
        }
      };

      fetchMoviesByGenre();
    }
  }, [selectedGenre]);

  return (
    <div className="movies-page">
      <h2 className="movies-title">Movie Genres</h2>
      <div className="genres-grid">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className={`genre-card ${
              selectedGenre === genre.id ? "active-genre" : ""
            }`}
            onClick ={() => setSelectedGenre(genre.id)}
          >
            {genre.name}
          </div>
        ))}
      </div>

      {selectedGenre && (
        <>
          <h3 className="genre-movie-heading">Movies in Selected Genre</h3>
          <div className="movie-grid">
  {movies.length > 0 ? (
    movies.map((movie) => (
      <Link to={`/player/${movie.id}`} key={movie.id} className="movie-card">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : "/fallback.jpg"
          }
          alt={movie.title}
          className="movie-poster"
        />
        <p className="movie-name">{movie.title}</p>
      </Link>
    ))
  ) : (
    <p className="no-movie-text">No movies found for this genre.</p>
  )}
</div>

        </>
      )}
    </div>
  );
};

export default Movies;
