import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import RatingComponent from "../../components/RatingComponent/RatingComponent";
import axios from 'axios';

const TMDB_API_KEY = "30d4177a69e01ebd0ad4c57f8334bd38";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);
  const [genreId, setGenreId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const videoRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const trailer = videoRes.data.results.find((video) => video.site === "YouTube" && video.type === "Trailer");

        const detailRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const genres = detailRes.data.genres;
        setGenreId(genres?.[0]?.id || null);

        setApiData(trailer ? trailer : { name: detailRes.data.title, key: null, published_at: "", type: "No trailer" });
      } catch (err) {
        console.error("Error fetching movie data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!genreId) return;
      try {
        const recRes = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&language=en-US`
        );
        setRecommendations(recRes.data.results.filter((movie) => movie.id != id).slice(0, 6));
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    fetchRecommendations();
  }, [genreId, id]);

  return (
    <div className='player'>
      <img src={back_arrow_icon} alt="Back" onClick={() => navigate(-1)} />

      {loading ? (
        <p style={{ color: "white" }}>Loading...</p>
      ) : apiData?.key ? (
        <iframe
          width="90%"
          src={`https://www.youtube.com/embed/${apiData.key}`}
          title={apiData.name}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <div style={{ color: "white", marginTop: "2rem" }}>
          <p>No trailer available.</p>
        </div>
      )}

      {apiData && (
        <div className="player_info">
          <p>{apiData.published_at?.slice(0, 10)}</p>
          <p>{apiData.name}</p>
          <p>{apiData.type}</p>
        </div>
      )}

      <RatingComponent movieId={id} />

      {recommendations.length > 0 && (
        <div className="recommendation-section">
          <h3>For You</h3>
          <div className="recommendation-grid">
            {recommendations.map((movie) => (
              <Link to={`/player/${movie.id}`} key={movie.id} className="recommended-card">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "/fallback.jpg"
                  }
                  alt={movie.title}
                />
                <p>{movie.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
