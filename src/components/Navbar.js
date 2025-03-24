import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { FaUserCircle, FaSearch } from "react-icons/fa"; // Import icons
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Store search input
  const navigate = useNavigate();

  // Track authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // Handle search action
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${searchQuery}`); // Redirect to search results
    }
  };

  return (
    <div className="navbar">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/cart">Cart</Link></li>

       

        <li><Link to="/men">Men</Link></li>
        <li><Link to="/women">Women</Link></li>
        <li><Link to="/kids">Kids</Link></li>
        <li className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
           
          </form>
        </li>

        {user ? (
          <>
            <li>
              <Link to="/account" className="profile-container">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="profile-img" />
                ) : (
                  <FaUserCircle className="profile-icon" size={30} />
                )}
              </Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <button className="login-signup-btn" onClick={() => navigate("/signup")}>
              Login / Sign Up
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
