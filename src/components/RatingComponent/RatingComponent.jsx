import { useState, useEffect } from "react";
import { auth, db } from "../../Firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const RatingComponent = ({ movieId }) => {
  const [userRating, setUserRating] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [allRatings, setAllRatings] = useState([]);

  const fetchRatings = async () => {
    const q = query(collection(db, "ratings"), where("movieId", "==", movieId));
    const querySnapshot = await getDocs(q);
    let total = 0;
    const ratings = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      ratings.push(data);
      total += data.rating;
    });

    setAllRatings(ratings);
    setAvgRating(ratings.length ? (total / ratings.length).toFixed(1) : 0);

    // Set user's rating if already exists
    const user = auth.currentUser;
    if (user) {
      const found = ratings.find(r => r.userId === user.uid);
      if (found) setUserRating(found.rating);
    }
  };

  const submitRating = async (newRating) => {
    const userId = auth.currentUser.uid;
    const existing = allRatings.find((r) => r.userId === userId);

    if (existing) {
      const q = query(collection(db, "ratings"), where("movieId", "==", movieId), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnap) => {
        await updateDoc(doc(db, "ratings", docSnap.id), { rating: newRating });
      });
    } else {
      await addDoc(collection(db, "ratings"), {
        movieId,
        userId,
        rating: newRating,
        timestamp: new Date().toISOString(),
      });
    }

    setUserRating(newRating);
    fetchRatings();
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
  <div style={{ marginTop: "20px" }}>
    <p>Average Rating: ⭐ {avgRating} / 5</p>
    <p>Your Rating:</p>

     {/* Wrap stars in a div for styling */}
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: "25px",
            cursor: "pointer",
            color: userRating >= star ? "gold" : "gray",
          }}
          onClick={() => submitRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  </div>
);
};


export default RatingComponent;