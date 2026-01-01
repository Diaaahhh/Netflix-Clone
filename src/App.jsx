import { useEffect, useState } from "react";
import Home from "./pages/Home/Home";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import Profile from "./pages/Profile/profile";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";
import TVShows from "./pages/TVShows/TVShows";
import Movies from "./pages/Movies/Movies";
import MoviePlayer from "./pages/MoviePlayer/MoviePlayer";


import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import { ToastContainer } from "react-toastify";
import TVPlayer from "./pages/TVPlayer/TVPlayer";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged In");
        if (location.pathname === "/login") {
          navigate("/");
        }
      } else {
        console.log("Logged Out");
        navigate("/login");
      }
      setLoading(false); // Auth check complete
    });

    return () => unsubscribe();
  }, [location.pathname, navigate]);

  if (loading) {
    return <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <div>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/tvshows" element={<TVShows />} />
        <Route path="/tv/:id" element={<TVPlayer />} />
        <Route path="/movie/:id" element={<MoviePlayer />} />

<Route path="/movies" element={<Movies />} />


      </Routes>
    </div>
  );
};

export default App;
