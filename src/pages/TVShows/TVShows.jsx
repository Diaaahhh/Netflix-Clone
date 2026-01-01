import { useEffect, useState } from 'react';
import './TVShows.css';
import { Link } from 'react-router-dom';

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGQ0MTc3YTY5ZTAxZWJkMGFkNGM1N2Y4MzM0YmQzOCIsIm5iZiI6MTc0NDU4NzYyNi4yLCJzdWIiOiI2N2ZjNGI2YTMwMTUzNjMyODZkOTFiZjciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.5qMtWxB6tuQe9zqpOS0zfK_93Jm2LfussZJS9N5rJgE'
  }
};

const TVShows = () => {
  const [genres, setGenres] = useState([]);
  const [showsByGenre, setShowsByGenre] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?language=en-US`, API_OPTIONS);
        const data = await res.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Fetch shows by genre
  useEffect(() => {
    const fetchShows = async () => {
      const result = {};
      try {
        for (const genre of genres) {
          const res = await fetch(`https://api.themoviedb.org/3/discover/tv?with_genres=${genre.id}&language=en-US`, API_OPTIONS);
          const data = await res.json();
          result[genre.id] = data.results.slice(0, 6); // limit to 6 shows
        }
        setShowsByGenre(result);
      } catch (err) {
        console.error('Error fetching TV shows by genre:', err);
      } finally {
        setLoading(false);
      }
    };

    if (genres.length > 0) fetchShows();
  }, [genres]);

  if (loading) {
    return <div className="tvshows-container">Loading TV genres and shows...</div>;
  }

  return (
    <div className="tvshows-container">
      <h2>TV Show Genres</h2>
      {genres.map((genre) => (
        <div key={genre.id} className="genre-section">
          <h3 className="genre-title">{genre.name}</h3>
          <div className="shows-grid">
            {showsByGenre[genre.id]?.map((show) => (
              <Link to={`/tv/${show.id}`} key={show.id} className="tv-show-card">
                <img
                  src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                  alt={show.name}
                />
                <p>{show.name}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TVShows;
