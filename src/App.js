import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Men from "./components/Men";
import Women from "./components/Women";  // New import
import Kids from "./Kids";    // New import
import Cart from "./components/Cart";
import Login from "./components/Login";
import Auth from "./components/Signup";    // For Sign Up
import Account from "./components/Account";
import OrderPage from "./components/OrderPage";   // Account page
import Contact from "./components/Contact";
import ImageCarousel from "./components/ImageCarousel";
import ProductPage from "./components/ProductPage";
import Payment from "./components/Payment";
const App = () => {
  const [user, setUser] = useState(null);

  // Check if a user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<div>Search Page</div>} /> {/* Add a Search page component here */}
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/account" element={<Account />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/orders" element={<OrderPage />} /> 
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/imagecarousel" element={<ImageCarousel />} /> 
        <Route path="/payment/:id" element={<Payment />} />
   

{/* Account page route */}
      </Routes>
    </>
  );
};

export default App;
