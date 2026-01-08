import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
  } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Convert cart object → array (VERY IMPORTANT)
  const cartItemsArray = food_list
    .filter((item) => cartItems[item._id] > 0)
    .map((item) => ({
      name: item.name,
      price: item.price,
      quantity: cartItems[item._id],
    }));

  const placeOrder = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        url + "/api/order/place",
        {
          items: cartItemsArray,
          amount: getTotalCartAmount() + 2,
          address: data,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        // ✅ REQUIRED for Stripe Checkout
        window.location.href = response.data.session_url;
      } else {
        toast.error("Unable to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Please add items to cart");
      navigate("/cart");
    }
  }, [token]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input required name="firstName" value={data.firstName} onChange={onChangeHandler} placeholder="First name" />
          <input required name="lastName" value={data.lastName} onChange={onChangeHandler} placeholder="Last name" />
        </div>

        <input required name="email" value={data.email} onChange={onChangeHandler} placeholder="Email Address" />
        <input required name="street" value={data.street} onChange={onChangeHandler} placeholder="Street" />

        <div className="multi-fields">
          <input required name="city" value={data.city} onChange={onChangeHandler} placeholder="City" />
          <input required name="state" value={data.state} onChange={onChangeHandler} placeholder="State" />
        </div>

        <div className="multi-fields">
          <input required name="zipcode" value={data.zipcode} onChange={onChangeHandler} placeholder="Zip Code" />
          <input required name="country" value={data.country} onChange={onChangeHandler} placeholder="Country" />
        </div>

        <input required name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>
          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
