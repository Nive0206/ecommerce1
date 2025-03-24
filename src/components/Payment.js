import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const product = location.state?.product; // Get product details

  if (!product) {
    return <h2>No product selected!</h2>;
  }

  return (
    <div>
      <h2>Payment Page</h2>
      <h3>Product: {product.name}</h3>
      <p>Price: ₹{product.price}</p>
      <button>Proceed to Payment</button>
    </div>
  );
};

export default Payment;
