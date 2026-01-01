import { useEffect, useRef, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';
import { db } from '../../Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const [ratings, setRatings] = useState({});
  const cardsRef = useRef();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGQ0MTc3YTY5ZTAxZWJkMGFkNGM1N2Y4MzM0YmQzOCIsIm5iZiI6MTc0NDU4NzYyNi4yLCJzdWIiOiI2N2ZjNGI2YTMwMTUzNjMyODZkOTFiZjciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.5qMtWxB6tuQe9zqpOS0zfK_93Jm2LfussZJS9N5rJgE'
    }
  };

 const handleWheel = (event) => {
  event.preventDefault();
  cardsRef.current.scrollBy({
    left: event.deltaY < 0 ? -200 : 200,
    behavior: 'smooth',
  });
};


  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`,options)
      .then(res => res.json())
      .then(res => {
           const movies = res.results || [];
           setApiData(movies);
           fetchAverageRatings(movies); // ← add this line
})

      .catch(err => console.error(err));
  }, [category]); 

  const fetchAverageRatings = async (movies) => {
  const newRatings = {};

  for (const movie of movies) {
    const q = query(collection(db, "ratings"), where("movieId", "==", movie.id.toString()));
    const snapshot = await getDocs(q);

    let total = 0;
    snapshot.forEach(doc => {
      total += doc.data().rating;
    });

    const avg = snapshot.size ? (total / snapshot.size).toFixed(1) : null;
    newRatings[movie.id] = avg;
  }

  setRatings(newRatings);
};

  useEffect(() => {
    const ref = cardsRef.current;
    if (ref) {
      ref.addEventListener('wheel', handleWheel);
      return () => ref.removeEventListener('wheel', handleWheel); 
    }
  }, []);

  return (
    <div className='title_cards'>
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card_list" ref={cardsRef}>
             {apiData.length > 0 && apiData.map((card, index) => {
               return (
                   <Link to={`/player/${card.id}`} className="card" key={index}>
                  <img src={card.backdrop_path ? `https://image.tmdb.org/t/p/w500${card.backdrop_path}` : '/fallback.jpg'}
     alt={card.original_title} />

                   <div className="card-info">
                       <p className="movie-title">{card.original_title}</p>
                       {ratings[card.id] && (
                       <p className="movie-rating">⭐ {ratings[card.id]} / 5</p>
                        )}
                   </div>
                   </Link>
                );
              })}

      </div>
    </div>
  );
};
export default TitleCards;
