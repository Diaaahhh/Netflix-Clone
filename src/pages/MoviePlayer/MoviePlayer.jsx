// src/pages/MoviePlayer/MoviePlayer.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./MoviePlayer.css";

const TMDB_API_KEY = "30d4177a69e01ebd0ad4c57f8334bd38";

const MoviePlayer = () => {
  const { id } = useParams();
  const [trailerKey, setTrailerKey] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [genreId, setGenreId] = useState(null);

  // Fetch trailer
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const trailerRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const trailers = trailerRes.data.results;
        const official = trailers.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailerKey(official?.key || null);
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchTrailer();
  }, [id]);

  // Fetch genre of current movie
  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (res.data.genres.length > 0) {
          setGenreId(res.data.genres[0].id); // take first genre
        }
      } catch (err) {
        console.error("Failed to fetch movie genre:", err);
      }
    };

    fetchGenre();
  }, [id]);

  // Fetch recommended movies
  useEffect(() => {
    if (genreId) {
      const fetchRecommendations = async () => {
        try {
          const res = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&language=en-US`
          );
          setRecommendedMovies(res.data.results.filter(movie => movie.id.toString() !== id)); // remove current movie
        } catch (error) {
          console.error("Failed to fetch recommended movies:", error);
        }
      };

      fetchRecommendations();
    }
  }, [genreId, id]);

  return (
    <div className="movie-player-container">
      {trailerKey ? (
        <iframe
          className="movie-video-frame"
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title="Movie Trailer"
          allowFullScreen
        ></iframe>
      ) : (
        <p className="movie-no-trailer">Trailer not available.</p>
      )}

      {/* Recommendation Section */}
      <div className="recommendation-section">
        <h3 className="recommendation-title">For You</h3>
        <div className="recommendation-grid">
          {recommendedMovies.map((movie) => (
            <Link
              to={`/movieplayer/${movie.id}`}
              key={movie.id}
              className="recommended-card"
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : "/fallback.jpg"
                }
                alt={movie.title}
                className="recommended-poster"
              />
              <p className="recommended-title">{movie.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviePlayer;
