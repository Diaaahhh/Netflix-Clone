// import React from 'react'
import "./Navbar.css";
import logo from "../../assets/logo.png";
// import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import cart_icon from "../../assets/cart_icon.svg";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { logout } from "../../Firebase";
import SearchBar from "../SearchBar/SearchBar";


const Navbar = () => {
  const navRef = useRef();
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add("nav_dark");
      } else {
        navRef.current.classList.remove("nav_dark");
      }
    });
  }, []);
  return (
    <div ref={navRef} className="navbar">
      <div className="nav_left">
        <img src={logo} alt="Netflix logo" />
        <ul>
          <li>Home</li>
          <li>
            <Link
              to="/tvshows"
              className="text-white px-4 hover:text-red-500 transition duration-300"
            >
              TV Shows
            </Link>
          </li>
          <li>
  <Link
    to="/movies"
    className="text-white px-4 hover:text-red-500 transition duration-300"
  >
    Movies
  </Link>
</li>


          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Language</li>
        </ul>
      </div>
      <div className="nav_right">
              <SearchBar />
             <p>Children</p>
             <img src={bell_icon} alt="search" className="icons" />
             <div className="navbar-profile">
               <Link to="/profile">
                 <button className="profile-btn">
                   <i className="fa-solid fa-user"></i>
                 </button>
               </Link>
     
               <img src={cart_icon} alt="search" />
               <div className="dropdown">
                 <p
                   onClick={() => {
                     logout();
                   }}
                 >
                   Sign Out of Netflix
                 </p>
               </div>
             </div>
           </div>
         </div>
       );
     };
     
     export default Navbar;
     