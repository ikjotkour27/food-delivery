import React, { useEffect, useState } from "react";
import "./List.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Add = ({ url }) => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  // ✅ SINGLE AUTH GUARD
  useEffect(() => {
    if (!adminToken) {
      toast.error("Please login as admin");
      navigate("/login", { replace: true });
    }
  }, [adminToken, navigate]);

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    const response = await axios.post(
      `${url}/api/food/add`,
      formData,
      { headers: { token: adminToken } }
    );

    if (response.data.success) {
      toast.success(response.data.message);
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
      });
      setImage(false);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            required
          />
        </div>

        <div className="add-category-price">
          <select
            name="category"
            onChange={onChangeHandler}
            value={data.category}
          >
            <option>Salad</option>
            <option>Rolls</option>
            <option>Deserts</option>
            <option>Sandwich</option>
            <option>Cake</option>
            <option>Pure Veg</option>
            <option>Pasta</option>
            <option>Noodles</option>
          </select>

          <input
            onChange={onChangeHandler}
            value={data.price}
            type="number"
            name="price"
            required
          />
        </div>

        <button type="submit" className="add-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;
