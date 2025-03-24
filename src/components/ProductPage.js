import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productRef = doc(db, "products", id);  // Assuming 'products' collection
        const productDoc = await getDoc(productRef);
  
        if (productDoc.exists()) {
          console.log("Product fetched: ", productDoc.data()); // Log product data
          setProduct(productDoc.data());
        } else {
          console.log("No product found with that ID.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);  // Set loading to false after the data is fetched
      }
    };
  
    fetchProductDetails();
  }, [id]);
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {product ? (
        <div>
          <h1>{product.name}</h1>
          <img src={product.img} alt={product.name} />
          <p>{product.description}</p>
          <p>Price: ₹{product.price}</p>
          <p>Rating: {product.rating}⭐</p>
          <button>Add to Cart</button>
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
};

export default ProductPage;
