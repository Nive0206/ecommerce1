import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import "./Men.css";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const saveUserData = async (user) => {
  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: user.displayName,
        email: user.email,
      },
      { merge: true }
    );
    console.log("User data saved!");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

const Men = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);  // 🌟 Added state for ratings filter

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        saveUserData(user);
        const userDocRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (!docSnap.exists()) {
            await setDoc(userDocRef, { cart: [] });
          } else {
            setCart(docSnap.data().cart || []);
          }
        } catch (error) {
          console.error("Firestore error:", error);
        }
      } else {
        setIsLoggedIn(false);
        setCart([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const menProducts = [
      { id: 1, name: "Men's Casual Shirt", price: 899, discount: "60% off", img: `${process.env.PUBLIC_URL}/images/m1.jpg`, rating: 4, brand: "Levi's" },
      { id: 2, name: "Men's Sports Shoes", price: 1499, discount: "50% off", img: `${process.env.PUBLIC_URL}/images/m2.jpg`, rating: 4.5, brand: "Nike" },
      { id: 3, name: "Leather Wallet", price: 499, discount: "40% off", img: `${process.env.PUBLIC_URL}/images/m3.jpg`, rating: 4.2, brand: "Fastrack" },
      { id: 4, name: "Men's Joggers", price: 1299, discount: "55% off", img: `${process.env.PUBLIC_URL}/images/m4.jpg`, rating: 4, brand: "Adidas" },
    ];
    setProducts(menProducts);
    setFilteredProducts(menProducts);
  }, []);

  useEffect(() => {
    const filtered = products
      .filter(
        (product) =>
          product.price <= maxPrice &&
          (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) &&
          product.rating >= minRating // 🌟 Filtering by minimum rating
      )
      .sort((a, b) => a.price - b.price);
    setFilteredProducts(filtered);
  }, [maxPrice, selectedBrands, minRating, products]);

  const viewProductDetails = (id) => {
    navigate(`/product/${id}`);
  };

  const addToCart = async (product) => {
    if (!isLoggedIn) {
      alert("Please log in to add items to the cart.");
      return;
    }
    try {
      const user = auth.currentUser;
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      let updatedCart = [];
      if (docSnap.exists()) {
        updatedCart = docSnap.data().cart || [];
        const existingItem = updatedCart.find((item) => item.id === product.id);
        existingItem ? existingItem.quantity += 1 : updatedCart.push({ ...product, quantity: 1 });
      } else {
        updatedCart = [{ ...product, quantity: 1 }];
      }
      await setDoc(userDocRef, { cart: updatedCart }, { merge: true });
      setCart([...updatedCart]);
      alert("Item added to cart!");
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleBuyNow = () => {
    navigate("/payment");
  };

  return (
    <div className="men-container">
      <div className="sidebar">
        <h3>Filters</h3>
        
        {/* Price Filter */}
        <div>
          <h4>Price: ₹{maxPrice}</h4>
          <input type="range" min="100" max="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
        </div>

        {/* Brand Filter */}
        <h4>Brands</h4>
        {["Levi's", "Nike", "Fastrack", "Adidas"].map((brand) => (
          <label key={brand}>
            <input type="checkbox" value={brand} checked={selectedBrands.includes(brand)} onChange={(e) => setSelectedBrands(e.target.checked ? [...selectedBrands, brand] : selectedBrands.filter((b) => b !== brand))} />
            {brand}
          </label>
        ))}

        {/* ⭐ Ratings Filter */}
        <h4>Ratings</h4>
        {[5, 4, 3, 2, 1].map((rating) => (
          <label key={rating}>
            <input type="radio" name="rating" value={rating} checked={minRating === rating} onChange={() => setMinRating(rating)} />
            {"⭐".repeat(rating)}
          </label>
        ))}
      </div>

      {/* Products Grid */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card" onClick={() => viewProductDetails(product.id)}>
              <img src={product.img} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{"⭐".repeat(product.rating)} ({product.rating})</p>
              <p><strong>₹{product.price}</strong> <span className="discount">{product.discount}</span></p>
              <button className="cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
              <button className="buy-btn" onClick={(e) => { e.stopPropagation(); handleBuyNow(); }}>Buy Now</button>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Men;
