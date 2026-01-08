import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!adminToken) {
      navigate("/login", { replace: true });
    } else {
      fetchOrders();
    }
  }, [adminToken, navigate]);

  const fetchOrders = async () => {
    const res = await axios.get(`${url}/api/order/list`, {
      headers: { token: adminToken },
    });
    if (res.data.success) setOrders(res.data.data);
  };

  const statusHandler = async (e, orderId) => {
    const res = await axios.post(
      `${url}/api/order/status`,
      { orderId, status: e.target.value },
      { headers: { token: adminToken } }
    );
    if (res.data.success) {
      toast.success(res.data.message);
      fetchOrders();
    }
  };

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map(i => `${i.name} x ${i.quantity}`).join(", ")}
              </p>
              <p>{order.address.firstName} {order.address.lastName}</p>
              <p>{order.address.city}, {order.address.country}</p>
              <p>{order.address.phone}</p>
            </div>
            <p>${order.amount}</p>
            <select
              value={order.status}
              onChange={(e) => statusHandler(e, order._id)}
            >
              <option>Food Processing</option>
              <option>Out for delivery</option>
              <option>Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
