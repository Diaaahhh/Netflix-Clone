// src/pages/TVPlayer/TVPlayer.jsx
import './TVPlayer.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import back_arrow_icon from '../../assets/back_arrow_icon.png';

const TVPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);
  const [genreId, setGenreId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "30d4177a69e01ebd0ad4c57f8334bd38";

  useEffect(() => {
    const fetchTVData = async () => {
      setLoading(true);
      try {
        // Get video trailers
        const videoRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`);
        const videoData = await videoRes.json();
        console.log("Video results:", videoData.results); // Debug

        // Try to find an official trailer
        let selectedVideo = videoData.results.find(
          v => v.type === "Trailer" && v.site === "YouTube"
        );

        // Fallback: YouTube video with "trailer" in name
        if (!selectedVideo) {
          selectedVideo = videoData.results.find(
            v => v.site === "YouTube" && v.name.toLowerCase().includes("trailer")
          );
        }

        // Fallback: any YouTube video
        if (!selectedVideo) {
          selectedVideo = videoData.results.find(v => v.site === "YouTube");
        }

        // Get TV show details
        const detailsRes = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`);
        const details = await detailsRes.json();

        setGenreId(details?.genres?.[0]?.id || null);
        setApiData(selectedVideo ? selectedVideo : {
          name: details.name,
          key: null,
          published_at: "",
          type: "No trailer"
        });

        // Optional: Fetch recommendations (TV shows from same genre)
        if (details?.genres?.length > 0) {
  const genreIds = details.genres.map(g => g.id).join(',');
  const recRes = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreIds}&language=en-US`);
  const recData = await recRes.json();

  // Filter to shows that have most genres matching
  const filtered = recData.results.filter(show => show.id !== parseInt(id));
  const sorted = filtered.sort((a, b) => {
    const matchCount = (targetGenres, compareGenres) =>
      compareGenres.filter(id => targetGenres.includes(id)).length;

    const aMatch = matchCount(details.genres.map(g => g.id), a.genre_ids);
    const bMatch = matchCount(details.genres.map(g => g.id), b.genre_ids);
    return bMatch - aMatch;
  });

  setRecommendations(sorted.slice(0, 6));
}


      } catch (err) {
        console.error("Error fetching TV data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTVData();
  }, [id]);

  return (
    <div className='tvplayer'>
      <img src={back_arrow_icon} alt="Back" onClick={() => navigate(-1)} className="back-button" />

      {loading ? (
        <p style={{ color: "white" }}>Loading...</p>
      ) : apiData?.key ? (
        <iframe
          width="90%"
          height="500"
          src={`https://www.youtube.com/embed/${apiData.key}`}
          title={apiData.name}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <p className="not-found">No trailer found.</p>
      )}

      {apiData && (
        <div className="tvplayer_info">
          <p>{apiData.published_at?.slice(0, 10)}</p>
          <p>{apiData.name}</p>
          <p>{apiData.type}</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="recommendation-section">
          <h3>For You</h3>
          <div className="recommendation-grid">
            {recommendations.map((show) => (
              <Link to={`/tv/${show.id}`} key={show.id} className="recommended-card">
                <img
                  src={
                    show.poster_path
                      ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
                      : "/fallback.jpg"
                  }
                  alt={show.name}
                />
                <p>{show.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TVPlayer;
