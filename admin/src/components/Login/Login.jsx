import React, { useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/api/admin/login",
        data
      );

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        toast.success("Admin Login Successful");
        navigate("/add");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/add");
    }
  }, []);

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Admin Login</h2>
        </div>

        <div className="login-popup-inputs">
          <input
            name="username"
            onChange={onChangeHandler}
            value={data.username}
            type="text"
            placeholder="Admin username"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Admin password"
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
