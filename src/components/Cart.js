import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

import './Cart.css';

const Cart = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  // Fetch cart from Firestore
  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setCart(docSnap.data().cart || []);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchCart();
  }, [isLoggedIn]);

  // Update cart in Firestore
  const updateCartInFirestore = async (updatedCart) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { cart: updatedCart });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Increase quantity of an item
  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    updateCartInFirestore(updatedCart);
  };

  // Decrease quantity of an item
  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0); // Remove if quantity is 0

    setCart(updatedCart);
    updateCartInFirestore(updatedCart);
  };

  // Remove item completely
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    updateCartInFirestore(updatedCart);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cart.length > 0 ? (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.img} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <h3>Subtotal: ₹{totalAmount}</h3>
          <button onClick={() => alert("Proceeding to Buy...")}>
            Proceed to Buy
          </button>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
